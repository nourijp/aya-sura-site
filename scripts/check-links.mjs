#!/usr/bin/env node
// Lightweight link-check for the built site (run after `npm run build`).
// Scans dist/**/*.html for href="#" / empty href / javascript:void, and
// verifies every internal href resolves to a real page in dist/.
// This is intentionally simple — a full Playwright/CI suite is a
// nice-to-have follow-up, not required for this pass.

import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

function walk(dir) {
  let files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(full));
    else if (extname(entry.name) === '.html') files.push(full);
  }
  return files;
}

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

// v12: required routes that must exist in the built site.
const REQUIRED_ROUTES = ['/privacy/', '/terms/', '/faq/', '/contact/'];
for (const route of REQUIRED_ROUTES) {
  const p = join(DIST, route, 'index.html');
  if (!existsSync(p)) {
    console.error(`Required route missing from build: ${route}`);
    process.exit(1);
  }
}

// v12: fake-content markers that must never render on the live site.
const FAKE_CONTENT_MARKERS = [
  'TODO',
  'Sample vocabulary word',
  'audio coming soon',
  'Audio coming soon',
  'STAGING DRAFT',
  'CHECK BACK SOON'
];

const htmlFiles = walk(DIST);
// Only <a href="..."> — not <link>/<script> asset references.
const hrefPattern = /<a\s[^>]*href="([^"]*)"/g;
let failures = [];

function internalPathExists(path) {
  const clean = path.split('#')[0].split('?')[0];
  if (clean === '') return true;
  const candidate = join(DIST, clean, clean.endsWith('/') || clean === '' ? 'index.html' : '');
  const direct = join(DIST, clean.endsWith('.html') ? clean : join(clean, 'index.html'));
  return existsSync(direct);
}

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');

  for (const marker of FAKE_CONTENT_MARKERS) {
    if (html.includes(marker)) {
      failures.push(`${file}: rendered text contains fake/internal marker "${marker}"`);
    }
  }

  let match;
  while ((match = hrefPattern.exec(html))) {
    const href = match[1];
    if (href === '#' || href === '') {
      failures.push(`${file}: dead href "${href}"`);
      continue;
    }
    if (href.startsWith('javascript:')) {
      failures.push(`${file}: javascript: href "${href}"`);
      continue;
    }
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) {
      continue; // external / non-navigable — not fetched here to avoid flakiness
    }
    if (href.startsWith('/') && !internalPathExists(href)) {
      failures.push(`${file}: internal link "${href}" has no matching page in dist/`);
    }
  }
}

if (failures.length) {
  console.error(`Link check failed with ${failures.length} issue(s):\n`);
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}

console.log(`Link check passed — ${htmlFiles.length} pages scanned, no dead/empty hrefs, no unresolved internal links.`);
