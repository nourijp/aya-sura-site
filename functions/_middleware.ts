// Cloudflare Pages middleware — runs in front of every request.
// (Only active on Cloudflare Pages; static hosts such as GitHub Pages ignore it.)
//
// 1. www.ayasura.com -> ayasura.com   (printed QR codes use the apex; keep one canonical host)
// 2. scan.ayasura.com/<key>           (short links for FUTURE QR codes; destinations in
//                                      src/data/scan-routes.json can change without reprinting)
// 3. WooCommerce / WordPress query links that used to hit the site root,
//    e.g. /?add-to-cart=123, /?wc-api=..., /?p=45 , /?s=moon&post_type=product
//    are forwarded to the shop with the query string intact.
import domains from '../src/config/domains.json';
import scan from '../src/data/scan-routes.json';

const WP_QUERY_KEYS = ['wc-api', 'add-to-cart', 'p', 'page_id', 'post_type', 'product', 's', 'product_cat', 'product_tag', 'wc-ajax'];

export const onRequest = async (ctx: { request: Request; next: () => Promise<Response> }): Promise<Response> => {
  const url = new URL(ctx.request.url);
  const apexHost = new URL(domains.apex).host;
  const scanHost = new URL(domains.scan).host;
  const shop = domains.storeLive ? domains.store : domains.legacyOrigin;

  if (url.hostname === `www.${apexHost}`) {
    url.hostname = apexHost;
    return Response.redirect(url.toString(), 301);
  }

  if (url.hostname === scanHost) {
    const key = url.pathname.replace(/^\/+|\/+$/g, '');
    if (key === '') return Response.redirect(new URL('/qr/', url).toString(), 302);
    const dest = (scan as Record<string, string>)[key];
    if (dest) return Response.redirect(new URL(dest, url).toString(), 302);
    // anything else on scan.* (e.g. /qr/cards/se1/, /wp-content/...) is served normally
  }

  if (url.pathname === '/' && [...url.searchParams.keys()].some((k) => WP_QUERY_KEYS.includes(k))) {
    const target = new URL('/', shop);
    target.search = url.search;
    return Response.redirect(target.toString(), 307); // 307 keeps the method (webhooks/POST)
  }

  return ctx.next();
};
