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

- [x] Owner approved adding Isa and Nao to the "Friends & Family" section
      (September 2026). Real art cropped from existing flashcard
      illustrations (`they believe.psd`). Only name + art + one neutral,
      non-invented line each ("One of the familiar faces from the wider
      Aya & Sura cast.") — no personality/backstory copy has been approved,
      so none was added. If real bios are approved later, update
      `src/pages/characters/index.astro` accordingly.
- [ ] Other Muslim Manga Club adaptations per
      `33_Cards_Series_Characters_and_Page_Expansion.md` are still
      unapproved — do not add further characters without the owner
      explicitly naming them.

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

## Launch-readiness checklist (v13 pass, against pasted external audit)

Checked current repo state item-by-item before changing anything; only
fixed what was actually still broken as of the v12 commit.

1. Naming ("Founding Adventure Club" → "Aya & Sura Adventure Club" /
   "Founding Season"): PASS — no stragglers in visible copy; fixed one
   stray code comment in `src/config/commerce.ts`.
2. Homepage hero "Open Card Audio & Resources" link: PASS — already
   moved to the Cards section, not in the hero.
3. Adventure Club overcommitment on printable cards: FIXED — reworded
   "Printable collectible cards" to "Bonus printable extras... vary by
   issue, not guaranteed every month" in `adventure-club.astro`,
   homepage feature card, and `checkout-preview.astro`.
4. Adventure Club ~16-page / 4-8 story-page description: PASS — present
   and concrete in the "What's included each month" section.
5. Card Audio & Resources fake content: PASS — `AudioResourceList.astro`
   shows an honest "Audio coming soon for this card" state, not
   fabricated sample entries.
6. App page PLANNED badges / false Stories-in-app implication: PASS —
   honest "The app is in development" section fully replaces any
   roadmap-card treatment; no PLANNED badges found.
7. Characters page Poji grid bug / future-cast placeholder: PASS — Poji
   renders in a normal card, not oversized; no future-cast block exists
   (explicit code comment documents why).
8. Character-model consistency claim (hijab/hair-color): NOT ACTIONED
   per instructions — this claim is unverified and appears to conflict
   with the owner's own source art (green hijab on Aya, brown hair on
   Sura, consistent across all "Aya & Sura Brand Resources" and
   flashcard illustration assets, including the approved logo). Needs
   owner confirmation before any character redesign is considered.
9. Aya's page gradient "expression crop" placeholders: PASS — already
   removed with an explanatory code comment; page reads as complete as
   Sura's.
10. About page startup-y tone: FIXED — closing CTA "Come see what we
    build next" reworded to "Join a world that keeps growing" with body
    copy reframed around existing products; H1 and "Explore Aya & Sura
    today" section were already fixed in v12.
11. For Parents H1 + consecutive text-only sections: FIXED — H1 changed
    to "What Aya & Sura is designed to give your child"; added a
    MediaPlaceholder to break up a run of 5 consecutive text-only
    sections.
12. Free Starter Pack polish: PASS — corner-mascot removal and dark
    `.free-pack.card` background fix (this session, earlier) both still
    in place; top padding on the hero already clears the sticky header.
    FIXED — added a MediaPlaceholder showing pack contents (previously
    text-only with no visual).
13. FAQ architecture: PASS — `/faq/` is the global FAQ; Adventure Club
    page kept too many (9) club FAQ entries — FIXED, trimmed to 6
    club-specific questions plus "See all FAQs" link.
14. Privacy/Terms real content: PASS — both pages render substantive,
    staging-appropriate content (72/89 lines respectively).
15. Contact page: PASS — `/contact/` exists, covers the expected
    categories, has a working preview-mode confirmation flow.
16. Forms behavior (Free Starter Pack, Contact, feedback): PASS — all
    three show a real submit → visible confirmation flow wired to
    `FORM_MODE`/`EMAIL_MODE`.
17. Adventure Club purchase path + Month 1 timing: PASS — routes
    resolve correctly (Home → Adventure Club → Join anchor → Checkout
    Preview), "about 14 days after enrollment" language present.
18. Digital fulfillment plain-language description: FIXED — added a
    "What happens after you purchase" block to `checkout-preview.astro`
    describing entitlement email → Month 1 delivery in plain language.
19. Cards & Games pages (`/cards/`, quran-edition, surah-edition): PASS
    — each has pricing, working Buy CTA to WooCommerce via
    `src/config/commerce.ts`, how-to-use content, QR/audio explanation,
    and a link to the matching resources/audio page.
20. Checkout-preview naming/plan summary: PASS — uses "Aya & Sura
    Adventure Club — Founding Season," $24.99 total, one-time payment,
    no auto-renewal, ~14-day Month 1 timing, "Payment disabled in local
    staging" button.

### Technical checklist spot-check
- Mobile/tablet layout spot-check (homepage, Adventure Club, For
  Parents, Characters): no obvious breakage observed in markup/grid
  classes used (existing responsive grid utilities); a full device-lab
  pass is DEFERRED (visual-only tool checks were not run this session).
- Custom `404.astro`: PASS — exists, builds correctly.
- FAQ `<details>/<summary>` keyboard operability: PASS — native
  elements, nothing intercepts focus/click.
- Meaningful `alt` text on real images added this session: PASS —
  spot-checked (`aya-meet-scene.jpg`, `sura-solo.png`, `aya-sura-prayer.png`,
  `aya-quran.png`) — all descriptive, not filenames.
- Unique `<title>`/meta description per page: PASS — spot-checked
  `Layout.astro` usage across a sample of pages.
- Site-wide `noindex,nofollow`: PASS — present in `Layout.astro`.
- OUT OF SCOPE / DEFERRED as instructed: full Lighthouse/performance
  audits, real checkout/tax/shipping testing, real QR scans, OG/share-
  image work.

`npm run build` succeeds (31 pages) and `scripts/check-links.mjs`
postbuild check passes with no dead/empty/unresolved links.

## Launch-hardening pass (v14, September 2026) — against a real external audit

Copy tightening + fixing a couple of broken/misleading destinations. Not a
redesign. Two decisions were treated as final and not relitigated: Founding
Season stays $24.99 everywhere, and App/`/start/` are hidden per below.

### Fixed this pass
- **Owner decision — App hidden from top nav / `/start/` hidden behind a
  flag**: `business.adultStartEnabled = false` added to
  `src/config/business.ts`. `src/pages/start.astro` now 302-redirects to `/`
  when the flag is off (confirmed in `dist/start/index.html` — a real
  redirect page, not the adult-learning content). `Footer.astro` only
  renders the "New to Islam? Start Here" link when the flag is true. `App`
  removed from `Header.astro` top nav (desktop + mobile); it remains a
  footer-only link and its own `/app/` page is untouched.
- Homepage nav reordered (Stories | Cards & Games | Adventure Club |
  Characters | For Parents); header CTA now shows a ghost "Shop" link next
  to a primary "Join Adventure Club" button instead of Shop being the sole/
  primary CTA.
- Homepage hero: added the "Founding Season · 3 monthly digital Adventures
  · $24.99 total" line under the primary CTA; button copy aligned to
  "Explore the Adventure Club" / "Meet the Characters".
- Adventure Club page + homepage feature card + Poji page + Books page:
  removed remaining "collectibles" wording, standardized on "bonus
  printable extras that can vary by issue"; H1 changed to lead with the
  customer benefit ("Give them a new Aya & Sura adventure..."); "story or
  comic" → "illustrated story (picture-book style, 4–8 pages)"; timeline
  copy now says exact dates aren't set yet and will be in the enrollment
  email, instead of implying a calendar exists.
- Free Starter Pack renamed to "Free Aya & Sura Adventure Sampler"
  throughout (`FreeStarterPack.astro`, `/free/`, `/free/check-your-email/`,
  `/free/confirmed-preview/`, `/free/starter-pack-preview/`, Footer) —
  route paths unchanged. Removed "sample printable cards" wording (implied
  card production); component now describes a story preview + one coloring
  page + one story-connected activity. Deduplicated `/free/` — the hero
  section repeated the same heading/paragraph the `FreeStarterPack`
  component renders right below it; the hero now just shows the composite
  image.
- `FreeStarterPack.astro` generalized with `eyebrow`/`heading`/`body`/
  `successHref`/`successMessage` props so other pages can reuse the same
  Brevo-preview flow instead of building new mailing UI.
- Giving Thanks to Allah book page: replaced the generic mock `UpdateForm`
  interest CTA with `FreeStarterPack` (`formId="book-updates-form"`,
  "Tell Me When the Book Is Ready" button, inline success message instead
  of redirecting to the Adventure Sampler confirmation page).
- Stories/Books page: removed "being built" / "not planned as a one-book
  company" hedges in favor of direct statements; removed the remaining
  "collectibles" mention in the monthly-story blurb.
- Cards & Games page: added price (from `commerce.quranDeckPrice` /
  `surahDeckPrice`) and a "Buy" CTA (linking to `commerce.quranDeck` /
  `surahDeck`) next to the existing "See What's Inside" link on each
  product card; heading changed to "Two decks. Lots of ways to play."
- Internal-planning language sweep: reworded hedges around already-decided
  facts in `faq.astro` ("It is planned as a one-time payment... should not
  automatically renew" → "It is a one-time payment... does not
  automatically renew"), `terms.astro` ("Current staging offer" →
  "The Founding Season is..."), `app.astro`, and `for-parents.astro`'s
  "can be tested later" Adventure Club FAQ answer (now states the digital
  reality plainly: "The Adventure Club is a digital print-at-home
  experience today. There is no physical/mail edition yet."). Did not
  touch genuinely-undecided items (exact launch dates, physical Club
  option).
- Characters page: reworded "As new friends, family members and guest
  characters are approved..." (read as an internal approval-queue
  description) to customer-facing "More friends and familiar faces join
  the Aya & Sura world as their stories are ready to share..." No new
  character bios added.
- Poji: softened "one of the most recognizable companions" to a modest
  description; Poji's own page was already a complete, non-placeholder
  page (personality, art placeholder, cross-link to Adventure Club), so it
  was kept as its own page rather than folded back into the cast page.
- `shop.astro` (an internal `/shop/` listing page — "Available Now",
  Adventure Club, Giving Thanks to Allah, each linking to its marketing
  page with only real "Buy" buttons going external to WooCommerce) already
  existed from an earlier pass; `routes.shop` was still pointing directly
  at the external WooCommerce domain. Changed `routes.shop` to `/shop/` so
  the header/footer "Shop" link goes to the internal bridge page instead.
- `scripts/check-links.mjs`: added `WORKING` (case-sensitive) to the
  fake-content-marker scan; `STAGING DRAFT` and `CHECK BACK SOON` were
  already covered from the v13 pass. Confirmed the postbuild check still
  fails on `href="#"`/empty hrefs and on a missing `/privacy/`, `/terms/`,
  `/faq/`, `/contact/` route. Confirmed `noindex,nofollow` is still present
  site-wide in `Layout.astro`.

### Already correct / not touched
- Privacy/Terms no longer contained visible "staging draft" disclaimer
  copy by the time this pass started (only the internal review-status note
  in this file, which is where it belongs).
- Refund & Returns: `terms.astro`'s "Refunds and replacements" section
  already has a conservative digital-goods policy (no refund once
  delivered, case-by-case for billing errors) consistent with the
  one-time/no-auto-renew model, plus a note that it hasn't had formal legal
  review. No changes made; still needs real counsel review before launch.
- `business.socialProofEnabled` confirmed `false`; no testimonial content
  found anywhere on the Adventure Club page or site.

### Deferred / explicitly out of scope this pass
- Analytics/CTA naming convention: no existing convention found in `docs/`.
  Out of scope per instructions — flagged here as a future to-do: define a
  consistent event/CTA naming scheme before wiring real analytics.
- Real checkout/Stripe/QR/Playwright/axe/sitemap/robots/OG image work —
  unchanged from prior passes, still open (see existing sections above).
- Image mapping: when new art assets are supplied, follow an
  asset-inventory-first workflow (read what's already referenced in
  `src/pages`/`public/images` before touching `MediaPlaceholder` labels,
  rather than relabeling the whole template at once) — not acted on this
  pass, no new assets were supplied.
- `/start/` (still gated off): the audit found "Everyday Words" links to
  the general Card Audio & Resources page instead of dedicated adult
  content, and "Quran Vocabulary" links to the Quran Edition sales page
  instead of dedicated adult-learning content. Both must be fixed with
  real adult-appropriate destinations before `business.adultStartEnabled`
  is ever flipped back to `true`.
- Shop bridge page and refund policy: both already existed/were adequate
  from earlier passes, so no additional scope was spent here beyond
  pointing `routes.shop` at the internal page.

`npm run build` succeeds and `scripts/check-links.mjs` passes after this
pass.

## v14 pass (September 2026) — external launch-readiness audit

Checked every item against current repo state before changing anything.
Several items were already completed by a concurrent/earlier session; only
genuinely-outstanding items were fixed here.

- `/start/` gating: VERIFIED — `business.adultStartEnabled = false` already
  existed in `src/config/business.ts`; the only `/start/` link site-wide is
  in `Footer.astro`, already wrapped in `{business.adultStartEnabled && ...}`.
  No nav/homepage links to `/start/` exist. This was flagged as likely
  incomplete but was in fact already done. Note: the "Everyday Words" and
  "Quran Vocabulary" CTAs on `/start/` were reported by the audit as
  pointing to the wrong destinations — must be fixed before re-enabling.
- Nav order / App hidden from nav: PASS — App only in footer, not in
  Header.astro (desktop or mobile).
- Homepage hero pricing line under CTA: PASS — already present.
- Adventure Club "collectibles" language: PASS — already reworded to
  "bonus printable extras that can vary by issue" everywhere checked,
  including the hero intro paragraph. No "comic" wording found.
- Free Starter Pack → "Free Aya & Sura Adventure Sampler" rename: PASS —
  fully renamed across `FreeStarterPack.astro` and all `/free/*` pages;
  body copy already describes "a short story preview, one coloring page
  and one story-connected activity"; no duplicate hero content found.
- Books index tentative phrasing / collectibles: PASS — already tightened
  to confident copy with "bonus printable extras" wording.
- Giving Thanks to Allah CTA: PASS — already has an `UpdateForm`-based
  interest-capture CTA ("Get Book Updates") for the coming-soon state.
- Cards & Games price + Buy CTA: FIXED — added `commerce.quranDeckPrice`/
  `commerce.surahDeckPrice` display plus a "Buy" link (to
  `commerce.quranDeck`/`commerce.surahDeck`) alongside the existing
  "See What's Inside" link on both cards in `src/pages/cards/index.astro`.
- FAQ internal-planning language sweep: FIXED — "the current working offer
  is $24.99..." and "the working plan is that one family membership..."
  rewritten as direct statements; "That is the goal" (QR permanence)
  rewritten as a direct statement. All in `src/pages/faq.astro`.
- Privacy/Terms "staging draft" customer-visible disclaimers: FIXED —
  removed the visible disclaimer paragraphs from both `privacy.astro` and
  `terms.astro`, and dropped "staging draft" from their meta descriptions.
  Internal staging-draft/legal-review status stays tracked in this file.
- Refund & Returns: FIXED — replaced the "should be published" placeholder
  in `terms.astro`'s "Refunds and replacements" section with a real,
  conservative digital/physical refund policy (no refunds on delivered
  digital content except missing/defective files or billing errors;
  case-by-case Founding Season cancellation before next release;
  physical/POD replacement or refund for damaged/lost items). Updated the
  matching FAQ answer. **Not lawyer-reviewed — needs real legal review
  before production**, same as the rest of Privacy/Terms.
- Characters page approval-process language: PASS — "approved" language
  only exists in source code comments, not rendered customer copy.
- Poji copy: PASS — current blurb does not overreach.
- For Parents physical-Club FAQ hedge: PASS — already updated (by a
  concurrent session during this pass) to state the digital reality
  directly without a "can be tested later" hedge.
- App page roadmap framing: FIXED — softened "Planned direction: ..." to
  "We're working on ..." in `src/pages/app.astro`; no PLANNED badges or
  false Adventure Club-in-app claims found.
- About page tone: PASS — already reads with brand history/credibility
  framing from prior passes.
- Shop bridge page: PASS — already lists Cards & Games, Adventure Club,
  and the book with internal links; only "Buy" buttons go external.
- `scripts/check-links.mjs` markers: FIXED — added "STAGING DRAFT" and
  "CHECK BACK SOON" to `FAKE_CONTENT_MARKERS`.
- `noindex,nofollow` in `Layout.astro`: VERIFIED still present — matters
  since the site is live at a real public URL (as.nur.city).
- Deferred per instructions: real checkout/Stripe/QR flows, Playwright/
  axe testing, sitemap/robots.txt, OG/share-image work — unchanged.

`npm run build` succeeds (31 pages) and `scripts/check-links.mjs`
postbuild check passes after this pass's changes.
