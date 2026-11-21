# Brief for an AI agent with Cloudflare access: ayasura.com

You are helping split ayasura.com. The zone `ayasura.com` is on the owner's Cloudflare account. Today
`ayasura.com` and `www` point to a DreamHost WordPress/WooCommerce site. The goal is:

- `ayasura.com` + `www.ayasura.com` -> static Astro site on Cloudflare Pages (cutover day only)
- `store.ayasura.com` -> the existing DreamHost WordPress/WooCommerce shop
- `scan.ayasura.com` -> same Pages site, short links for future QR codes

Printed QR codes point at ayasura.com/about/ and ayasura.com/qr/cards/se1/, so they must never break.
**Do not change the `ayasura.com` apex or `www` records until the owner says "cutover".**

## Rules
- Never print, log or commit tokens. Do not use any Cloudflare token that belongs to another project.
- Before changing anything, export the current state (Part 0). Show the owner what you changed.
- Do not touch any other zone or any other DreamHost site. Do not enable telemetry or analytics.
- Do not use DreamHost DNS. Cloudflare stays the DNS provider.

## Part 0: Read-only snapshot (do first)
1. Export the full DNS zone for ayasura.com (BIND export or API `GET /zones/:id/dns_records/export`)
   and save it as `ayasura-dns-before-cutover.txt`. Give it to the owner.
2. List and report: Page Rules, Redirect Rules, Transform Rules, Cache Rules, Workers routes, WAF/custom
   rules, SSL/TLS mode, "Always Use HTTPS", Email Routing records. Do not edit them yet.

## Part 1: Safe now (new names only)
1. Find the current target of the `www` record (A/CNAME to DreamHost, shared IP 173.236.255.109).
2. Create DNS record `store`: same target as `www`, **proxied (orange cloud)**.
   Another agent or the owner adds the matching `store.ayasura.com` subdomain in the DreamHost panel.
3. Pages project `aya-sura-preview` already exists (https://aya-sura-preview.pages.dev).
   Add custom domain `scan.ayasura.com` to it (Cloudflare creates the DNS record).
4. SSL/TLS: if mode is "Flexible" tell the owner; the shop needs Full (strict) or an Origin certificate
   on DreamHost, otherwise it will redirect-loop. Do not change the mode for the whole zone without
   confirming that the existing www site keeps working.
5. Verify from outside:
   - `curl -sI https://scan.ayasura.com/s/qe1` -> 302 to `/qr/cards/qe1/`
   - `curl -sI https://scan.ayasura.com/qr/cards/se1/` -> 200
6. From the repo (`nourijp/aya-sura-site`), run
   `node scripts/verify-legacy-urls.mjs https://scan.ayasura.com`. Report the pass/fail count.
   (Baseline on the preview is 237 passed, 0 failed.)

## Part 2: Production Pages project (can be done now, no traffic impact)
Create a Git-connected Pages project (Direct Upload projects cannot be converted later):
- Repo `nourijp/aya-sura-site`, production branch `main`
- Build command `npm run build`, output directory `dist`
- Env vars (production and preview): `NODE_VERSION=20`, `ASTRO_TELEMETRY_DISABLED=1`, `DO_NOT_TRACK=1`
- Do NOT set `PRODUCTION_CUTOVER` yet. Until cutover the build must stay in non-production mode
  (`src/config/domains.json` has `storeLive:false, production:false`).
- Do not attach `ayasura.com` or `www` yet.

## Part 3: Cutover (ONLY when the owner explicitly says go; quiet hour)
Order matters. Prerequisites: DreamHost `store.ayasura.com` works over HTTPS and a test order passes
(the other agent changes WordPress home/siteurl to store.ayasura.com using WP-CLI and the backup).
1. Add custom domains `ayasura.com` and `www.ayasura.com` to the production Pages project.
   Cloudflare will replace the apex/www records with Pages. Keep the exported old records for rollback.
2. Make sure no Redirect/Page Rule sends `ayasura.com/qr/*`, `/about/`, `/support/` or
   `/wp-content/uploads/*` anywhere else. Pages `_redirects` and Functions handle everything.
3. Purge the cache for the zone.
4. Run `node scripts/verify-legacy-urls.mjs https://ayasura.com` (expect 0 failures) and spot check:
   `https://ayasura.com/about/`, `/qr/cards/se1/`, `/qr/audio/` and one MP3 under `/wp-content/uploads/`,
   `https://www.ayasura.com/qr/` -> 301 to the apex, `https://ayasura.com/shop/` -> store.
5. Rollback if anything critical fails: remove the two custom domains from Pages and restore the
   exported DNS records for `ayasura.com` and `www`.

## Report back to the owner
- The saved DNS export and the list of existing rules you found.
- Exactly which records and domains you created, plus the output of each verification command.
- Anything unexpected (SSL mode, rules that touch /qr, /wp-content, /about).
- Items only the owner can do: Stripe webhook (`https://store.ayasura.com/?wc-api=wc_stripe`),
  Meta domain verification, Apple Pay domain registration for store.ayasura.com.

Reference: `migration/CUTOVER_RUNBOOK.md`, `scripts/verify-legacy-urls.mjs`,
`migration/legacy-url-inventory.csv`.
