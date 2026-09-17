# Aya & Sura — Staging Marketing Site

A local staging build of the next AyaSura.com: a character-led Muslim
children's brand site (Aya, Sura, Poji). Built with **Astro + TypeScript +
plain CSS variables**. No database, no cart/checkout, no live email sending.
All commerce buttons link out to the existing WooCommerce store.

This is **staging/mockup only**. Every page carries
`<meta name="robots" content="noindex,nofollow">`. No production DNS,
WordPress, or WooCommerce infrastructure was touched.

## Run locally

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

Build has been verified to complete successfully (`npm run build` → 23 pages,
exit code 0, `dist/` produced).

## Route list implemented

```
/
/club/
/cards/
/cards/quran-edition/
/cards/surah-edition/
/books/
/books/giving-thanks-to-allah/
/app/
/characters/
/characters/aya/
/characters/sura/
/characters/poji/
/parents/
/about/
/shop/
/resources/
/resources/cards/
/resources/cards/quran-edition/
/resources/cards/surah-edition/
/feedback/
/start/            (secondary adult/new-Muslim landing page, footer-linked only)
/privacy/
/terms/
```

## Key config files

- `src/config/commerce.ts` — WooCommerce link targets, prices, Founding Club
  offer flag, book launch state (`coming-soon` / `pod-live` / `crowdfunding`),
  app status.
- `src/config/audience.ts` — Adventure Club working age label (`Ages 6–10`,
  **not yet owner-approved**), per `18_AGE_AUDIENCE_AND_PROGRAM_ARCHITECTURE.md`.
- `src/components/MediaPlaceholder.astro` — gradient placeholder component
  (props: `label`, `ratio`, `variant`, `note`) used everywhere a real image
  is required but not supplied.

## Media placeholders still needing final assets

| Label | Page |
|---|---|
| HERO: Aya + Sura + Poji together, active everyday/adventure scene | Home |
| BOOK/STORY open illustrated spread | Home |
| CARDS — deck and cards in play | Home |
| CLUB — monthly digital pack composite | Home |
| APP — phone/tablet showing real app screen | Home |
| CHARACTER — Aya / Sura / Poji full-body approved art (x3) | Home, Characters hub, Aya, Sura, Poji |
| CLUB COMPOSITE — story + coloring + activity + cards + parent page + app screen | Home, Club |
| PRODUCT PHOTO — Quran Edition deck + cards spread | Home, Cards hub, Quran product page |
| PRODUCT PHOTO — Surah Edition deck + cards spread | Home, Cards hub, Surah product page |
| BOOK COVER — Giving Thanks to Allah | Home, Books hub, Book page |
| LIFESTYLE ART — family using Aya & Sura content | Home |
| EXTENDED WORLD — Aya & Sura + guest-character silhouettes | Home |
| CARDS HERO — both deck boxes + sample cards | Cards hub |
| Aya expression crops (x3) + sibling scene | Aya page |
| Sura sibling scene | Sura page |
| FUTURE CAST | Characters hub |
| STORY SPREAD / COLORING PAGE / ACTIVITY PAGE / COLLECTIBLE / PARENT PAGE (Month 1 preview, x5) | Club |
| BOOKS HERO — reading / story-world illustration | Books hub |
| INTERIOR SPREAD 1–3 | Book page |
| APP HERO — actual current app home screen in device frame | App |
| ABOUT TIMELINE — early art + current art + cards + book + app | About |
| PARENT PAGE — product/story/activity layout | Parents |
| ADULT START PAGE — calm visual with cards/audio/guide | /start/ |

Every placeholder is a labeled gradient component (`MediaPlaceholder.astro`) —
swap `null` asset paths for real files without redesigning the page.

## TODOs requiring the site owner's input

1. **Legacy QR/audio inventory** — `migration/legacy-url-inventory.csv` and
   `public/_redirects` are empty templates. Real printed QR destinations must
   be inventoried from the live WordPress site and scanned from physical
   decks before any production cutover (`12_QR_RESOURCE_COMPATIBILITY.md`).
   `migration/qr-test-results.md` is likewise an empty template.
2. **WooCommerce product URLs/prices** — `src/config/commerce.ts` uses the
   example URLs and $19.99 prices given in the source brief; confirm these
   are still correct before cutover.
3. **Book launch method** — `src/config/commerce.ts` `book.status` is set to
   `'coming-soon'`. POD vs. preorder/crowdfunding is undecided; the book page
   supports all three states via config.
4. **Founding Adventure Club** — `foundingClub.live` is `false` (pre-launch
   copy shown). Post-founding subscription price is intentionally undecided
   and not shown anywhere. Flip `live: true` only once the owner activates
   the paid pilot; the $24.99/3-month price is already wired in per the
   locked brief.
5. **Adventure Club age range** — `src/config/audience.ts` `clubAgeLabel:
   'Ages 6–10'` is a working hypothesis only (`clubAgeApproved: false`). Do
   not treat as final brand-wide age guidance.
6. **App status** — `src/config/commerce.ts` `app.status` is `'coming-soon'`;
   update once the app is live/beta and a real store URL exists.
7. **Parent testimonials** — no testimonials are included anywhere (per
   `13_PARENT_PROOF_IMPLEMENTATION.md`, none may be invented). The homepage
   and Parents page instead show an honest feedback-collection CTA
   (`/feedback/`, a non-sending mockup form).
8. **Outreach copy** — `content/outreach/past-customer-feedback.md` is a
   placeholder; the referenced source report
   (`18_Parent_Proof_Reviews_and_Research_Plan.md`) was not present alongside
   the other instruction files at build time.
9. **Privacy / Terms** — `/privacy/` and `/terms/` are placeholder pages
   pending real legal copy from the owner.
10. **Product detail TODOs** — exact card counts, dimensions, materials,
    vocabulary scope, recommended age and manufacturing origin for both
    decks are flagged inline on the product pages, not invented.

## What was not touched

No production DNS, WordPress installation, WooCommerce store, or any other
live infrastructure was accessed or modified while building this project.
Everything above is local scaffolding under this project folder only,
runnable with `npm run dev` / `npm run build`.
