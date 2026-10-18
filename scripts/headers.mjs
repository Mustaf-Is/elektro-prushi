import { writeFile } from 'node:fs/promises';
import { production } from './site-settings.mjs';
const preview = !production;
await writeFile(
  'dist/_headers',
  `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'
${preview ? '  X-Robots-Tag: noindex, nofollow\n' : ''}
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`,
);
