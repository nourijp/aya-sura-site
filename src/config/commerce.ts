// Centralized commerce config.
// STAGING / PLACEHOLDER — replace destinations at production cutover.
// The Astro site does not implement its own cart/checkout; "Buy" buttons
// link out to the existing WooCommerce store.

export const commerce = {
  // TODO(owner): confirm final shop base at cutover (may become shop.ayasura.com)
  shopBase: 'https://www.ayasura.com',
  quranDeck: 'https://www.ayasura.com/product/aya-sura-quran-deck-1/',
  surahDeck: 'https://www.ayasura.com/product/sura-edition-deck-1/',
  // Prices below are staging values taken from source docs; keep centralized
  // so they can be corrected without touching page copy.
  quranDeckPrice: '$19.99',
  surahDeckPrice: '$19.99'
};

// Founding Adventure Club offer — LOCKED per brief: $24.99 / 3 months.
export const foundingClub = {
  live: false, // set true when the paid pilot is activated
  price: '$24.99',
  term: '3 months',
  renews: false
};

// Book launch state: 'coming-soon' | 'pod-live' | 'crowdfunding'
export const book = {
  status: 'coming-soon' as 'coming-soon' | 'pod-live' | 'crowdfunding',
  title: 'Giving Thanks to Allah',
  // TODO(owner): fill in when POD or crowdfunding launch is confirmed
  price: null as string | null,
  orderUrl: null as string | null
};

// App status: 'live' | 'beta' | 'coming-soon'
export const app = {
  status: 'coming-soon' as 'live' | 'beta' | 'coming-soon',
  storeUrl: null as string | null
};
