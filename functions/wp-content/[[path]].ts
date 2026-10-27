// Old WordPress upload URLs (/wp-content/uploads/...).
// The audio + images used by the card-support pages are preserved at their
// ORIGINAL paths as static files, so they are served first. Anything else
// (product photos, etc.) is forwarded to wherever WordPress now lives, so
// links in old emails, social posts and catalog feeds keep working.
import domains from '../../src/config/domains.json';

export const onRequest = async (ctx: { request: Request; env: { ASSETS: { fetch: (r: Request) => Promise<Response> } } }): Promise<Response> => {
  const res = await ctx.env.ASSETS.fetch(ctx.request);
  if (res.status !== 404) return res;
  const url = new URL(ctx.request.url);
  const shop = domains.storeLive ? domains.store : domains.legacyOrigin;
  return Response.redirect(`${shop}${url.pathname}${url.search}`, 302);
};
