# Cutover runbook — split WordPress (shop) from the new marketing site

**Goal.** `ayasura.com` becomes the fast, cheap static Astro site on Cloudflare Pages.
WordPress/WooCommerce moves to `store.ayasura.com`. Every printed QR code keeps working.

```
ayasura.com / www      → Cloudflare Pages (Astro)   marketing + all /qr/* card support + /support/
scan.ayasura.com       → same Pages project          short links for FUTURE QR codes
store.ayasura.com      → DreamHost (WordPress/Woo)   cart, checkout, account, products
as.nur.city            → GitHub Pages                audit copy (stays noindex)
```

## Decision: where do the QR pages live?

**At the root, at their original paths** (`ayasura.com/qr/…`, `ayasura.com/about/`) — already built.
No redirect is involved for printed codes, so there is nothing to break. `scan.ayasura.com/<key>`
is added only for codes printed *in the future* (destination can change without reprinting).

### What is actually printed (decoded from the photos on the old site)

| Product | Printed URL | Behaviour on the old site | On the new site |
|---|---|---|---|
| Quran Edition box | `https://ayasura.com/about/` | 301 → `www` → page with an "About Cards" button → `/qr/cards/` | `/about/` is a real page with a "Card audio & games" shortcut at the very top |
| Surah Edition box | `https://ayasura.com/qr/cards/se1/` | page | real page |
| Guide cards / promo cards / card backs | **not yet verified** | — | all 14 `/qr/*` URLs exist, so any of them works |

> Scan one guide card and one promo card from each deck on a phone and add what you find to
> `migration/qr-test-results.md`. If you photograph them and send me the photos I can decode them.

---

## What is already built and tested (no credentials needed)

* 14 legacy `/qr/*`, `/support/`, `/about/` URLs rebuilt as static pages — 102 MP3s preserved at their **original** `/wp-content/uploads/…` paths (+ downloadable ZIP packs).
* `public/_redirects` (generated), `functions/_middleware.ts`, `functions/wp-content/[[path]].ts`.
* `node scripts/verify-legacy-urls.mjs <base-url>` — 166 checks. **166/166 pass** against the real Cloudflare Pages runtime (`wrangler pages dev`).
* Three one-line switches in `src/config/domains.json`: `storeLive`, `production` (and the `PRODUCTION_CUTOVER=1` env var, which makes a mis-configured production build **fail** instead of looping or shipping `noindex`).

## What needs credentials / hands

Cloudflare: **API token** (below). DreamHost + WordPress: **someone with SSH/WP-admin** (the owner, or a token/SSH key you choose to share).

Token → Cloudflare dashboard → My Profile → API Tokens → *Create Custom Token*:
`Account · Cloudflare Pages · Edit`, `Zone · DNS · Edit`, `Zone · Zone · Read`, zones `ayasura.com` and `nur.city`.
Save it in a file only you and I can read (never paste it into chat):
`mkdir -p ~/.cloudflare && umask 077 && cat > ~/.cloudflare/aya.env` containing
`CLOUDFLARE_API_TOKEN=…` and `CLOUDFLARE_ACCOUNT_ID=…` (Account ID is on any zone's Overview page).

---

## Phase 0 — Safety net (do first, ~20 min)

1. **Export the Cloudflare DNS zone** for `ayasura.com` (DNS → Records → Export). This is the rollback.
2. **Full WordPress backup**: database (`wp db export`) + `wp-content/`. Download a copy off DreamHost.
3. Add to `wp-config.php` now (makes URL changes and rollbacks instant, no DB edit needed):
   ```php
   // define('WP_HOME',    'https://store.ayasura.com');   // uncomment on cutover day
   // define('WP_SITEURL', 'https://store.ayasura.com');
   ```
4. **List everything tied to the site URL** and note where each is configured:
   Stripe webhook endpoint(s); WooPayments + Jetpack (site-URL change can trigger a reconnect prompt); Facebook for WooCommerce (catalog feed, pixel, *domain verification* for `store.ayasura.com`); Apple Pay domain verification file; Google Search Console / Merchant Center; any shipping/tax plugin licence keyed to the domain.
5. **Confirm the mobile app doesn't call WordPress.** The public REST API shows only WooCommerce/Jetpack (no membership/app-auth plugin), so it very likely doesn't — but ask whoever built the app. In App Store Connect / Play Console confirm the **support URL** is `https://ayasura.com/support/` (preserved) and check the privacy-policy URL (`/privacy/` exists).
6. `/subscribe/` is a stale "Aya & Sura Monthly" pitch whose plugin is dead; it redirects to `/adventure-club/`. Confirm there are **no live subscribers** to it in Stripe/WooCommerce.

## Phase 1 — Stand up `store.ayasura.com` (customers unaffected)

1. Cloudflare DNS: add `store` → **same target as the current `www` record**, proxied.
2. DreamHost panel → Domains → add `store.ayasura.com` as a subdomain whose **web directory is the existing WordPress folder** (same files, same DB).
3. TLS: the old `qr.ayasura.com` returns **HTTP 526** because its origin has no valid certificate — don't repeat that. Issue a Let's Encrypt cert for `store.ayasura.com` in DreamHost (or use a Cloudflare Origin CA cert) and keep Cloudflare SSL mode on **Full (strict)**.
4. Rehearse on a *copy* if you can (staging DB + `store-test` host): `wp search-replace 'https://www.ayasura.com' 'https://store.ayasura.com' --all-tables --dry-run` and review counts (page-builder/theme options are serialized; WP-CLI handles that).

## Phase 2 — Deploy the new site to Cloudflare Pages (no DNS change yet)

1. Pages → Create project → connect `nourijp/aya-sura-site` → build `npm run build`, output `dist`, env `NODE_VERSION=20`, `ASTRO_TELEMETRY_DISABLED=1`. *(Do not set `PRODUCTION_CUTOVER` yet.)*
2. Test on the `*.pages.dev` URL: `node scripts/verify-legacy-urls.mjs https://<project>.pages.dev` (the host-based www/scan tests only apply on real domains — expect those to be the only differences).
3. Add custom domain **`scan.ayasura.com`** (new hostname, zero risk) → verify `https://scan.ayasura.com/qe1` → `/qr/cards/qe1/`.

## Phase 3 — Sign-off (owner, 10 min)

On a phone, using the **new** site's `pages.dev` URL, walk both decks: box QR path → audio → play a word → games → pronunciation. Record in `migration/qr-test-results.md`.

## Phase 4 — Cutover window (30–60 min, quiet hour)

Do 1 and 3 back-to-back; the shop is briefly redirecting between steps.

1. **WordPress → store.** Uncomment `WP_HOME`/`WP_SITEURL` in `wp-config.php`, then `wp search-replace 'https://www.ayasura.com' 'https://store.ayasura.com' --all-tables` (and the apex form), `wp cache flush`, `wp rewrite flush`. Log in at `store.ayasura.com/wp-admin/`, place a **test order** (Stripe test mode or a 100% coupon).
2. **Update integrations:** Stripe webhook URL → `https://store.ayasura.com/?wc-api=wc_stripe` (and any others from Phase 0.4); reconnect Jetpack/WooPayments if prompted; verify `store.ayasura.com` in Meta; add the Apple Pay verification file.
3. **Flip the repo.** In `src/config/domains.json` set `"storeLive": true` **and** `"production": true`; in the Pages project add env `PRODUCTION_CUTOVER=1`; merge/deploy. (The build fails on purpose if either flag is wrong.) This also removes `noindex`, publishes `sitemap-index.xml`, and points Buy buttons at `store.ayasura.com`.
4. **Point the domain.** Pages → Custom domains → add `ayasura.com` and `www.ayasura.com`; accept Cloudflare's offer to replace the existing DNS records. Traffic flips here (records are already proxied). Also add `qr.ayasura.com` as an alias, or delete the broken 526 record.
5. Cloudflare → Caching → **Purge Everything**.
6. **Verify.** `node scripts/verify-legacy-urls.mjs https://ayasura.com` (all 166 must pass) and re-scan both boxes.

### Rollback (≤ 5 min)
Re-import/restore the exported DNS records so apex/`www` point at DreamHost again, and re-comment `WP_HOME`/`WP_SITEURL`. Nothing in WordPress was deleted, so the old site comes straight back.

## Phase 5 — After launch

* Search Console: add the `ayasura.com` domain property and `store.ayasura.com`; submit `sitemap-index.xml`; keep `store.` **noindex** for cart/checkout/account (WooCommerce does this by default).
* Cloudflare Web Analytics → watch hits on `/about/` and `/qr/*` for a few weeks: it reveals which printed codes customers actually scan.
* New print runs: print `https://scan.ayasura.com/<key>` (keys in `src/data/scan-routes.json`). Point a key at a companion app or the audio-pack page later by editing one line.
* Move the GitHub repo to **private** once Cloudflare Pages is the live host (Pages builds private repos fine; it is public today).
* **Never remove** `/about/`, `/qr/*`, `/support/` or the `/wp-content/uploads/` audio — they are printed or registered externally.

## Open questions for the owner

1. Do guide cards / promo cards carry their own QR codes? (Which URLs?)
2. Surah Edition cards are labelled `SE01–SE40` but have 52 recordings — the legacy site never mapped numbers to words, so the new SE1 page lists by word. If you have the card numbering, send it and I'll add number search like the Quran Edition.
3. Where is the app's privacy-policy URL registered, and does the app contact `ayasura.com` for anything?
4. Any live "Monthly" subscribers (see Phase 0.6)?
