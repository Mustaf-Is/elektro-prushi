import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
// Keep HTML metadata and Netlify response headers on the same build-time mode.
const fileEnv = {};
for (const path of [
  '.env',
  '.env.local',
  '.env.production',
  '.env.production.local',
]) {
  if (existsSync(path))
    Object.assign(fileEnv, parseEnv(readFileSync(path, 'utf8')));
}
const env = { ...fileEnv, ...process.env };
export const mode = env.SITE_MODE || 'preview';
export const production = mode === 'production';
export const site = env.SITE_URL;
if (!['preview', 'production'].includes(mode))
  throw new Error('Invalid SITE_MODE');
if (
  production &&
  (!site?.startsWith('https://') || env.CONTENT_APPROVED !== 'true')
) {
  throw new Error(
    'Production requires an HTTPS SITE_URL and CONTENT_APPROVED=true.',
  );
}
