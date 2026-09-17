// Single source of truth for internal route paths.
// Nav, footer and CTAs should reference these rather than hardcoded strings
// so a route rename only needs to happen in one place (see astro.config.mjs
// `redirects` for aliasing old paths like /club/ -> /adventure-club/).

export const routes = {
  home: '/',
  stories: '/books/',
  book: '/books/giving-thanks-to-allah/',
  cards: '/cards/',
  quranEdition: '/cards/quran-edition/',
  surahEdition: '/cards/surah-edition/',
  club: '/adventure-club/',
  checkoutPreview: '/checkout-preview/',
  characters: '/characters/',
  characterAya: '/characters/aya/',
  characterSura: '/characters/sura/',
  characterPoji: '/characters/poji/',
  parents: '/for-parents/',
  about: '/about/',
  app: '/app/',
  free: '/free/',
  freeConfirm: '/free/check-your-email/',
  cardResources: '/resources/cards/',
  qrResources: '/resources/cards/',
  shop: 'https://www.ayasura.com',
  feedback: '/feedback/',
  contact: '/contact/',
  faq: '/faq/',
  privacy: '/privacy/',
  terms: '/terms/',
  start: '/start/'
};
