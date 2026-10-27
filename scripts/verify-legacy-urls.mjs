#!/usr/bin/env node
// Verifies legacy URLs against a running site (local wrangler, preview, or production).
//   node scripts/verify-legacy-urls.mjs http://localhost:8788
//   node scripts/verify-legacy-urls.mjs https://ayasura.com
// Reads migration/legacy-url-inventory.csv (expected status / redirect target) and also
// checks every preserved audio file + download pack, plus host-based behaviours.
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

const base = new URL(process.argv[2] || 'http://localhost:8788');
const domains = JSON.parse(fs.readFileSync('src/config/domains.json', 'utf8'));
const audio = JSON.parse(fs.readFileSync('src/data/legacy-audio.json', 'utf8'));
const STORE = domains.storeLive ? domains.store : domains.legacyOrigin;

function get(path, { host, method = 'GET' } = {}) {
  return new Promise((resolve, reject) => {
    const lib = base.protocol === 'https:' ? https : http;
    const req = lib.request({ hostname: base.hostname, port: base.port || undefined, path, method,
      headers: { host: host || base.host, 'user-agent': 'verify-legacy-urls' }, rejectUnauthorized: !host }, (res) => {
      res.destroy();   // headers are all we need
      resolve({ status: res.statusCode, location: res.headers.location || '', type: res.headers['content-type'] || '' });
    });
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end();
  });
}

const csv = fs.readFileSync('migration/legacy-url-inventory.csv', 'utf8').trim().split('\n').slice(1)
  .map((l) => { const m = l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((c) => c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"')); return m; });

let pass = 0; const fail = [];
const check = (label, ok, detail) => { ok ? pass++ : fail.push(`${label} — ${detail}`); };

for (const [path, , , status, loc] of csv) {
  const r = await get(path);
  const want = Number(status);
  const wantLoc = loc.replace('{STORE}', STORE);
  check(path, r.status === want && (!wantLoc || r.location.includes(wantLoc)),
    `expected ${want}${wantLoc ? ' → ' + wantLoc : ''}, got ${r.status}${r.location ? ' → ' + r.location : ''}`);
}

for (const c of [...audio.qe1, ...audio.se1]) {
  const p = c.path.split('/').map(encodeURIComponent).join('/');
  const r = await get(p);
  check(c.path, r.status === 200 && /audio/.test(r.type), `audio expected 200 audio/*, got ${r.status} ${r.type}`);
}
for (const z of ['Aya-and-Sura-Quran-Edition-Vol1-Audio.zip', 'Aya-and-Sura-Surah-Edition-Vol1-Audio.zip']) {
  const r = await get('/downloads/' + z); check('/downloads/' + z, r.status === 200, `got ${r.status}`);
}

// Fallback for old WordPress uploads that we did not preserve (must forward, never 404)
let r = await get('/wp-content/uploads/2020/12/not-a-real-file.jpg');
check('/wp-content fallback', r.status === 302 && r.location.startsWith(STORE), `got ${r.status} ${r.location}`);

// Host-based behaviours (only meaningful on Cloudflare Pages / wrangler)
const apexHost = new URL(domains.apex).host, scanHost = new URL(domains.scan).host;
r = await get('/about/', { host: `www.${apexHost}` });
const wl = r.location ? new URL(r.location) : null;   // scheme follows the request (http locally, https on the edge)
check('www → apex', r.status === 301 && wl && wl.host === apexHost && wl.pathname === '/about/', `got ${r.status} ${r.location}`);
r = await get('/qe1', { host: scanHost });
check('scan short link /qe1', r.status === 302 && r.location.endsWith('/qr/cards/qe1/'), `got ${r.status} ${r.location}`);
r = await get('/', { host: scanHost });
check('scan root', r.status === 302 && r.location.endsWith('/qr/'), `got ${r.status} ${r.location}`);
r = await get('/?add-to-cart=123');
check('?add-to-cart forward', r.status === 307 && r.location.includes('add-to-cart=123') && r.location.startsWith(STORE), `got ${r.status} ${r.location}`);

console.log(`\n${pass} passed, ${fail.length} failed (target ${base.origin}, store=${STORE})`);
if (fail.length) { console.log(fail.map((f) => ' ✖ ' + f).join('\n')); process.exit(1); }
