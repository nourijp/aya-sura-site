// Centralized commerce config.
// STAGING / PLACEHOLDER — replace destinations at production cutover.
// The Astro site does not implement its own cart/checkout; "Buy" buttons
// link out to the existing WooCommerce store.

import domains from './domains.json';

// Where WooCommerce currently lives. Flips from the legacy WordPress origin to
// store.ayasura.com when domains.json -> storeLive is set at cutover.
export const shopOrigin: string = domains.storeLive ? domains.store : domains.legacyOrigin;

export const commerce = {
  shopBase: shopOrigin,
  quranDeck: `${shopOrigin}/product/aya-sura-quran-deck-1/`,
  surahDeck: `${shopOrigin}/product/sura-edition-deck-1/`,
  // Prices below are staging values taken from source docs; keep centralized
  // so they can be corrected without touching page copy.
  quranDeckPrice: '$19.99',
  surahDeckPrice: '$19.99'
};

// Aya & Sura Adventure Club — Founding Season offer — see src/config/business.ts for the
// authoritative launch-state/price/checkout config (v10). This flag now
// simply mirrors that state for older call sites.
import { business } from './business.ts';

export const foundingClub = {
  live: business.launchState === 'founding_open',
  price: `$${business.foundingPrice.toFixed(2)}`,
  term: `${business.foundingMonths} months`,
  renews: business.foundingRecurring
};

// Book launch state: 'development' | 'pod-live' | 'crowdfunding'
export const book = {
  status: business.bookStatus,
  title: 'Giving Thanks to Allah',
  // Owner TODO: fill in when POD or crowdfunding launch is confirmed — see docs/OWNER_DECISIONS.md
  price: null as string | null,
  orderUrl: null as string | null
};

// App status: 'live' | 'beta' | 'coming-soon'
export const app = {
  status: 'coming-soon' as 'live' | 'beta' | 'coming-soon',
  storeUrl: null as string | null
};
