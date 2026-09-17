import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://as.nur.city',
  trailingSlash: 'always',
  // v10: /club/ and /parents/ were renamed to /adventure-club/ and
  // /for-parents/ per the internal route map (src/config/routes.ts).
  redirects: {
    '/club/': '/adventure-club/',
    '/parents/': '/for-parents/'
  }
});
