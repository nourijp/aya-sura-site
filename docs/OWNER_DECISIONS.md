# Owner Decisions — Internal Notes

This file holds unresolved/internal decisions and working hypotheses that
must NOT appear in customer-facing copy. Per the v10 owner audit
(`26_FIX_STAGING_MOCKUP_AFTER_OWNER_AUDIT.md`, section 1), the default
rendered site must feel like a real customer-facing brand — no visible
TODO(owner), working-hypothesis labels, or internal notes.

This is a living document. Update it whenever an internal note is removed
from the UI, and check items off as the owner resolves them.

## Commerce / checkout

- [ ] Real WooCommerce product created for the Founding Adventure Club
      ($24.99, simple/virtual, e.g. SKU `AS-FOUNDING-3M-DIGITAL`). Once
      created, set `PUBLIC_FOUNDING_CHECKOUT_URL` (env) or
      `business.foundingCheckoutUrl` and `business.checkoutMode = 'woocommerce'`
      in `src/config/business.ts`.
- [ ] Confirm final shop base domain at cutover (`www.ayasura.com` vs.
      `shop.ayasura.com`) — see `src/config/commerce.ts`.
- [ ] Real founding-cohort launch calendar (exact Month 1/2/3 dates). The
      site currently only says "about 14 days later / one month later /
      one month later" per the Founding Delivery Model — do not add exact
      dates until this is approved.
- [ ] Woo → Brevo integration level (manual CSV vs. webhook vs. full
      entitlement service) — see `31_Commerce_Checkout_and_Payment_Flow.md`.
- [ ] `docs/WOOCOMMERCE_CHECKOUT_BRANDING.md` — not yet created; needed
      before a real WooCommerce checkout goes live (branding/UX spec).

## Email / Brevo

- [ ] Real `BREVO_API_KEY`, `BREVO_FREE_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`,
      `BREVO_CONFIRM_REDIRECT_URL` — set as Cloudflare Pages environment
      variables (never committed, never `PUBLIC_`-prefixed). Then set
      `EMAIL_MODE=brevo`. See `functions/api/free-starter.ts`.
- [ ] Confirm the Brevo `doubleOptinConfirmation` request shape still
      matches Brevo's current API before go-live.

## Age / audience

- [ ] Public Adventure Club age range. Internal working hypothesis was
      "ages 6–10" (see `18_AGE_AUDIENCE_AND_PROGRAM_ARCHITECTURE.md`), but
      per the audit this must NOT be shown to customers until pilot
      testing confirms it. Current public copy uses:
      "Made for growing readers, creators and curious kids." — no number.
      Once approved, set `business.publicAdventureAge` in
      `src/config/business.ts` and update the Adventure Club page.

## Physical / printed Club option

- [ ] `business.physicalClubEnabled` is `false`. Do not enable until there
      is a real product spec, Lulu quote, price, and shipping rules. Per
      the audit, no "printed option being explored" copy should ever be
      shown — either it's fully live with real details, or it's absent.
- [ ] Reserved art for a future "how your monthly package arrives" /
      unboxing page: `public/images/reserved/physical-club-delivery-scene.jpg`
      (Sura handing Aya a delivered box, sourced from `for.psd`). Not
      wired into any page yet — build that page only once
      `physicalClubEnabled` is true and real shipping/delivery details
      are confirmed, per the no-"coming soon" rule above.

## Book

- [ ] `business.bookStatus` is `'development'`. Update to `'pod-live'` or
      `'crowdfunding'` plus a real price/order URL once fulfillment for
      *Giving Thanks to Allah* is actually configured.

## Characters

- [ ] Candidate "Friends & Family" characters awaiting approved art/bio
      (e.g. Isa, Nao, other Muslim Manga Club adaptations per
      `33_Cards_Series_Characters_and_Page_Expansion.md`). Do not add them
      to `src/pages/characters/index.astro` until approved — no invented
      biographies.

## Testimonials / parent proof

- [ ] `business.socialProofEnabled` is `false`. Flip to `true` and add real,
      approved parent quotes once they exist. Never render placeholder
      testimonials as if real.

## Legal

- [x] `src/pages/privacy.astro` and `src/pages/terms.astro` now render the
      real v12 staging drafts (`37_Privacy_Policy_Draft_for_Staging.md`,
      `38_Terms_and_Sales_Draft_for_Staging.md`) instead of empty
      placeholders.
- [ ] Both are still staging drafts, not lawyer-reviewed text. Have counsel
      review before production launch, and publish a dedicated Refund /
      Returns policy (see the Terms page's "Refunds and replacements"
      section).

## QR / legacy resource migration

- [ ] Full legacy QR/audio URL inventory from the live WordPress site
      (`migration/legacy-url-inventory.csv`, `public/_redirects`, and
      `migration/qr-test-results.md` are still empty templates). Do not cut
      over production DNS until every printed QR destination has been
      tested per `12_QR_RESOURCE_COMPATIBILITY.md`.
- [ ] Real audio/card data for `/resources/cards/quran-edition/` and
      `/resources/cards/surah-edition/`. Per the v12 audit, these pages no
      longer show fabricated "Sample vocabulary word" / "audio coming soon"
      sample entries — they now show an honest "resources are being
      migrated" state with a Contact link until the real inventory lands.

## v12 pass (September 2026) — see `aya_sura_strategy_audit_v12/`

- [x] Renamed the intro offer "Founding Club" → "Founding Season" site-wide
      (homepage, header, Adventure Club page, checkout preview, FAQ,
      footer, Free Starter Pack flow, shop page). Product name is now
      consistently "Aya & Sura Adventure Club".
- [x] New global pages: `/faq/` (from `39_Global_FAQ_Content.md`),
      `/contact/` (from `40_Contact_and_Form_Flow_Instructions.md`).
      Adventure Club and For Parents keep short subsets + a "See all
      FAQs →" link instead of duplicating the full FAQ.
- [x] Footer now links Contact and the global FAQ directly instead of an
      anchor into the Adventure Club page.
- [x] Free Starter Pack preview flow extended:
      `/free/` → `/free/check-your-email/` → `/free/confirmed-preview/` →
      `/free/starter-pack-preview/`. The check-your-email page no longer
      claims a real email was sent while `business.emailMode === 'preview'`.
- [x] Parent feedback form (`/feedback/`) restructured: no child-name field,
      separate "contact me" and "may quote me" checkboxes, product/age-range
      selects, Privacy link.
- [x] Characters page: the single "Always nearby" (Poji) card no longer
      stretches full-width (was using a 3-column auto-fit grid with one
      item — visually "giant"); "Friends & Family" no longer shows a giant
      speculative placeholder block since no approved Isa/Nao (or other)
      entries exist yet.
- [x] Aya page: removed the three generic "expression crop" gradient
      placeholders (no real approved crops exist in
      `public/images/characters/`) rather than leave fake-looking filler.
- [x] App page: removed customer-facing "Planned" feature cards; replaced
      with an honest "The app is in development" section.
- [x] Added `business.formMode` (`FormMode` = `'preview' | 'live'`)
      alongside the existing `emailMode`, documenting that Contact and
      Parent feedback are preview-only until real backends exist.
- [x] `scripts/check-links.mjs` now also fails the build if `/privacy/`,
      `/terms/`, `/faq/`, or `/contact/` is missing from `dist/`, or if any
      rendered page contains `TODO`, `Sample vocabulary word`, or
      `audio coming soon`.
- [ ] Deferred/scoped down from the v12 instruction set (see PR/commit
      notes for reasoning):
  - Characters page was not converted to a fully data-driven character
    list — the existing hand-written structure already satisfies the
    "hide unknown entries" requirement and a data-driven refactor was
    judged not worth the risk in this pass.
  - Sura's copy was reviewed and already reads with his own identity
    (playful, capable of mistakes, not merely "the cautious one") from
    the v10 pass, so no further rewrite was made.
  - Image mapping against `Image Suggestions/00_SITE_IMAGE_SUGGESTIONS.md`
    was not done placeholder-by-placeholder; existing MediaPlaceholder
    labels were kept/extended in place rather than relabeled to specific
    stable IDs from that brief. Do this as a follow-up pass.
  - No Brevo/Contact-form backend was implemented — Contact and Parent
    feedback remain client-side-only preview forms (per `FORM_MODE`).
  - Free Starter Pack header-overlap fix was verified structurally
    (section top padding) rather than pixel-measured against the real
    sticky header height; re-check visually once real hero art is in
    place.
- [ ] Real Founding Season launch dates, real Brevo/contact-form provider
      keys, and final owner sign-off on all v12 copy (About H1, Adventure
      Club "beginning—not the end" block, FAQ wording) are still open.

## Testing (nice-to-have, not blocking this pass)

- [ ] Playwright smoke tests for the four customer journeys in
      `27_IMPLEMENT_COMMERCE_EMAIL_AND_LINKS.md` Part G.
  - [ ] Automated link-check script (see `README.md` for a manual
      alternative already run for this pass).
  - [ ] CI wiring for the "no debug text in rendered HTML" scan.
