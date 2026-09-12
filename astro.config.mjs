// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// Static site: every public page is prerendered at build time.
// The Keystatic admin (/keystatic) and its API (/api/keystatic) are the only
// on-demand routes; the Cloudflare adapter serves them as a Pages Function.
export default defineConfig({
  site: 'https://oikos-solar.com',
  output: 'static',
  adapter: cloudflare(),
  integrations: [react(), keystatic()],
  redirects: {
    '/join': '/about#join',
    '/careers': '/about#join',
    '/contact-us': '/contact',
    '/home': '/',
  },
});
