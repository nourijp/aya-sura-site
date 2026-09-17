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

- [ ] Real Privacy Policy and Terms of Service text (`src/pages/privacy.astro`,
      `src/pages/terms.astro` are staging placeholders).

## QR / legacy resource migration

- [ ] Full legacy QR/audio URL inventory from the live WordPress site
      (`migration/legacy-url-inventory.csv`, `public/_redirects`, and
      `migration/qr-test-results.md` are still empty templates). Do not cut
      over production DNS until every printed QR destination has been
      tested per `12_QR_RESOURCE_COMPATIBILITY.md`.
- [ ] Real audio files for `/resources/cards/quran-edition/` and
      `/resources/cards/surah-edition/` (currently "audio coming soon"
      placeholders in `src/components/AudioResourceList.astro` usage).

## Testing (nice-to-have, not blocking this pass)

- [ ] Playwright smoke tests for the four customer journeys in
      `27_IMPLEMENT_COMMERCE_EMAIL_AND_LINKS.md` Part G.
  - [ ] Automated link-check script (see `README.md` for a manual
      alternative already run for this pass).
  - [ ] CI wiring for the "no debug text in rendered HTML" scan.
