import { defineConfig } from 'astro/config';
import { mode, production, site } from './scripts/site-settings.mjs';
export default defineConfig({
  site: production ? site : undefined,
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
  vite: { define: { 'import.meta.env.SITE_MODE': JSON.stringify(mode) } },
});
