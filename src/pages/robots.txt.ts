import type { APIRoute } from 'astro';
import { isPreview } from '../data/site';
export const GET: APIRoute = ({ site }) =>
  new Response(
    isPreview
      ? 'User-agent: *\nDisallow:\n'
      : 'User-agent: *\nAllow: /\nSitemap: ' +
          new URL('/sitemap.xml', site).href +
          '\n',
  );
