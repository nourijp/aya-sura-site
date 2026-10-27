# QR / legacy URL test results

Automated: `node scripts/verify-legacy-urls.mjs <base-url>` (166 checks: 57 inventory URLs from
`legacy-url-inventory.csv`, 102 audio files, 2 ZIP packs, host-based behaviour).
Last run: **166/166 pass** against the Cloudflare Pages runtime (`wrangler pages dev dist`), 2026-10-27.

## Printed QR codes — evidence

Decoded with OpenCV from photographs in the old site's WordPress media library
(`/wp-json/wp/v2/media`). 52 images were scanned; 3 contained a decodable code:

| Photo | Decoded URL | Product |
|---|---|---|
| `box-top-bottom-scaled.jpg` (media #3977) | `https://ayasura.com/about/` | Quran Edition box (back) |
| `S__3194893.jpg` (#4221) | `https://ayasura.com/about/` | Quran Edition box (back) |
| `se1-1-back-box-scaled.jpg` (#4503) | `https://ayasura.com/qr/cards/se1/` | Surah Edition box (back) |

The Quran Edition box states: *"Includes: 50 vocab cards, 3 guide cards, 2 promotions."* The guide/promo cards
were **not** photographed — their QR codes (if any) are unverified. 36 of the 88 library images are not exposed by
the public API and could not be scanned.

Old behaviour for the Quran box: `ayasura.com/about/` → 301 → `www.ayasura.com/about/` → page with buttons
"About Cards" (`/qr/cards/`) and "Order Cards". New behaviour: `/about/` is served directly with a
"Card audio & games" button at the very top.

## Manual checklist (owner, on a phone) — fill in

| # | Scan this | Expected | Result | Date |
|---|---|---|---|---|
| 1 | Quran Edition box back | lands on About, one tap to card audio | | |
| 2 | Surah Edition box back | lands on Surah Edition menu | | |
| 3 | Quran guide card #1 | ? (record URL) | | |
| 4 | Quran guide card #2 | ? | | |
| 5 | Quran guide card #3 | ? | | |
| 6 | Quran promo card #1 | ? | | |
| 7 | Quran promo card #2 | ? | | |
| 8 | Any Surah guide/promo card | ? | | |
| 9 | Play a word on `/qr/audio/` | plays | | |
| 10 | Play a word on `/qr/audio/se1/` | plays | | |
| 11 | Download both audio packs | ZIPs open, files play | | |
