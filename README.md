# Aya & Sura — Staging Marketing Site

A local staging build of the next AyaSura.com: a character-led Muslim
children's brand site (Aya, Sura, Poji). Built with **Astro + TypeScript +
plain CSS variables**. No database. Commerce buttons link to a staging
`/checkout-preview/` page (or a real WooCommerce checkout URL once
configured); the Free Starter Pack email form posts to a Cloudflare Pages
Function that is safe-by-default (no real email is sent in staging).

This is **staging/mockup only**. Every page carries
`<meta name="robots" content="noindex,nofollow">`. No production DNS,
WordPress, or WooCommerce infrastructure was touched.

**v10 update (September 2026):** this build applies the owner's post-review
corrections on top of the original v8 mockup — see "What changed in v10"
below. The numbered pages/copy files 01–19 in the instruction set are
unchanged; files 24/26/27 (plus top-level 30–33) are what drove this pass.

## Run locally

```bash
npm install
npm run dev            # http://localhost:4321
npm run build           # outputs to dist/, then runs the link check (postbuild)
npm run preview          # serve the production build locally
npm run check-links     # run the link check manually against an existing dist/
```

Build verified to complete successfully (`npm run build` → 26 pages + 2
redirect pages, exit code 0, `dist/` produced, link check passes with 0
dead/empty hrefs and 0 unresolved internal links).

## What changed in v10

- **No visible internal notes.** All `TODO(owner)`, "working hypothesis" and
  similar labels were removed from rendered pages and moved to
  `docs/OWNER_DECISIONS.md`.
- **New `src/config/business.ts`** — single source of truth for launch
  state (`founding_open`), founding price/term/delivery delay, checkout
  mode, book status, and the `socialProofEnabled` flag.
- **New `src/config/routes.ts`** — single source of truth for internal
  paths; nav, footer and CTAs reference it instead of scattered hardcoded
  strings.
- **Renamed routes:** `/club/` → `/adventure-club/`, `/parents/` →
  `/for-parents/`. Old paths 301-redirect via `astro.config.mjs`
  `redirects` (and are still built as static redirect pages).
- **Homepage rebuilt** with the section order from the audit: Hero →
  Founding Club feature → Explore the World bento → Character world →
  Available Now (two card editions) → Giving Thanks to Allah spotlight →
  Muslim childhood worldview → parent proof (hidden, flag-gated) → Free
  Starter Pack → Footer.
- **Adventure Club rebuilt as a real sales page** (`/adventure-club/`):
  price, what's-included grid, cohort timeline ("about 14 days later / one
  month later / one month later" — no invented calendar dates, no "instant
  Month 1 access"), rewritten FAQ, no physical-club copy of any kind
  (`business.physicalClubEnabled === false`).
- **New `/checkout-preview/`** — staging order summary + "Staging checkout —
  payment disabled" state per the audit, so the purchase flow is reviewable
  without a real payment integration.
- **New `/free/` + `/free/check-your-email/`** — the Free Starter Pack
  replaces the old generic "Get Club Updates" / "Keep Me Updated" pattern.
  Client-side form posts to `/api/free-starter`.
- **New `functions/api/free-starter.ts`** — a Cloudflare Pages Function
  (lives outside `src/`, no SSR adapter needed for the rest of the static
  site). `EMAIL_MODE=preview` (default) validates syntax only and never
  sends email; `EMAIL_MODE=brevo` calls the real Brevo double opt-in
  endpoint once server-side env vars are set. No API keys are committed.
- **Islamic FAQ rewritten** per `32_Islamic_Positioning_and_FAQ_Rewrite.md`:
  "Is this an Islamic curriculum?" removed; replaced with the fuller
  question set (How is Islam part of Aya & Sura? / Will every Adventure be
  a lesson? / How do you review Islamic content? / etc).
- **Age section** no longer shows a public number — replaced with "Made for
  growing readers, creators and curious kids."
- **Cards page** uses full "Quran Edition — Volume 1" / "Surah Edition —
  Volume 1" naming, frames both as a growing series, and links to Card
  Audio & Resources.
- **Characters page** relabeled "Characters" (nav) / "Meet the Aya & Sura
  World" (page), with a "Friends & Family" section that shows only
  approved names/art — no invented biographies.
- **Testimonials** are gated behind `business.socialProofEnabled` (currently
  `false`) instead of rendering fake placeholder quotes.
- **New `scripts/check-links.mjs`** — a lightweight Node link-check (no
  Playwright) run automatically after every build via the `postbuild` npm
  script; fails on dead/empty/`javascript:` hrefs or unresolved internal
  links.

## Route list implemented

```
/
/adventure-club/         (was /club/ — old path 301s here)
/checkout-preview/
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
/for-parents/            (was /parents/ — old path 301s here)
/free/
/free/check-your-email/
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

- `src/config/business.ts` — launch state, Founding Club price/term/delivery
  delay, checkout mode (`preview`/`woocommerce`) + `getFoundingCheckoutUrl()`,
  book status, `physicalClubEnabled`, `socialProofEnabled`, email mode.
- `src/config/routes.ts` — single source of truth for internal paths.
- `src/config/commerce.ts` — WooCommerce link targets/prices for the two
  card decks; re-exports `foundingClub`/`book` derived from `business.ts`
  for older call sites.
- `src/config/audience.ts` — public-safe audience copy (no numeric age).
- `src/components/MediaPlaceholder.astro` — gradient placeholder component
  (props: `label`, `ratio`, `variant`, `note`) used everywhere a real image
  is required but not supplied.
- `src/components/FreeStarterPack.astro` — the Free Starter Pack email
  capture block, used on the homepage, `/free/`, and `/adventure-club/`.
- `functions/api/free-starter.ts` — Cloudflare Pages Function backing the
  Free Starter Pack form.

## Media placeholders still needing final assets

Every placeholder is a labeled gradient component (`MediaPlaceholder.astro`)
— swap `null`/asset paths for real files without redesigning the page. See
the `label` prop on each `<MediaPlaceholder>` usage across `src/pages/` for
the full current list (hero art, character art, product photography, club
composite, book cover/interiors, app screen, lifestyle art, etc).

## Owner TODOs

See `docs/OWNER_DECISIONS.md` for the full, current list (real WooCommerce
checkout URL, Brevo credentials, founding cohort launch calendar, age-range
approval, testimonial approval, legal copy, QR/audio migration inventory,
and the nice-to-have Playwright/CI follow-up work).

## What was not touched

No production DNS, WordPress installation, WooCommerce store, or any other
live infrastructure was accessed or modified while building this project.
Everything above is local scaffolding under this project folder only,
runnable with `npm run dev` / `npm run build`. This remains 100% local
staging.
