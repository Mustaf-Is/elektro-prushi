# Elektro Prushi

Albanian landing page with a separate projects gallery, built with Astro, TypeScript, scoped CSS and small browser scripts. Navigation links scroll to homepage sections; the full gallery remains at `/projektet/`. Netlify redirects the old service and contact URLs to their sections. Static output, local responsive images, self-hosted Manrope, no analytics or external widgets.

## Local development

Use Node **24 LTS** (`.nvmrc`) and npm. Run `npm ci`, then `npm run dev`. `npm run check` checks types; `npm run build` checks and generates `dist`; `npm run preview` serves the built site. Set `ASTRO_TELEMETRY_DISABLED=1` if telemetry configuration cannot be written on your machine.

The default `SITE_MODE=preview` disables call/Messenger actions and opens an accessible demo notice. Without JavaScript those links lead to the demo explanation in the homepage contact section. The gallery links open the actual photo without JavaScript. Preview output includes HTML robots metadata and a Netlify `_headers` rule with `X-Robots-Tag: noindex, nofollow`. This discourages indexing; it is **not access control**. Anyone with the URL can visit.

## Content and artwork

Edit `src/data/site.ts` for business details, draft services and project descriptions. Page introduction copy lives in the corresponding Astro pages. All service claims and photo usage need owner approval before launch. The three original photos were downloaded from the business Facebook gallery; source URLs are recorded in the content file. Do not add unsupported guarantees, ratings or statistics.

`src/assets/hero.png` is the supplied banner with its embedded logo/text removed using the built-in image generation tool. Prompt: “Remove only the big EP lightning logo and all embedded company text; reconstruct the night sky, diagonal silver light trails, pylons and landscape seamlessly; preserve the composition and dark monochrome palette.” Review this edited artwork with the owner. The shared header/footer mark is cropped from the supplied logo, then edited with the built-in image generation tool to remove the black background. The approved cutout is `src/assets/brand-mark-transparent-source.png`, optimized to `src/assets/brand-mark-transparent.png`. Cutout prompt: “Remove only the black background and black negative spaces; preserve the white EP monogram and golden yellow lightning bolt, shapes and proportions; output true transparent RGBA with no added strokes, shadow or glow.” `scripts/prepare-assets.mjs` regenerates the optimized transparent logo and social image. Astro generates AVIF/WebP variants at build time. Replacing assets should retain meaningful alt text.

## Netlify showcase

Import this Git repository into your Netlify account. The committed `netlify.toml` selects Node 24, `npm run build`, and `dist`. Keep `SITE_MODE=preview`. Alternatively, after `npm run build`, upload **the entire dist folder** to Netlify Drop. No deployment credentials are stored here.

After publishing, check the homepage and projects page URLs and a missing URL, images and font loading, the contact notice, gallery keyboard behavior, and the actual `X-Robots-Tag` response header. Netlify applies the CSP and security headers generated in `dist/_headers` by `scripts/headers.mjs`; test that no resources are blocked. Netlify preserves previous deploys: use its deploy list to restore the last working version if needed. Do not delete earlier successful deployments.

## Verification

`npm test` runs Playwright using an installed Microsoft Edge, starts the built preview when needed, checks five viewport widths, all pages, WCAG A/AA automated findings, keyboard interactions, focus restoration, reduced motion and no-JavaScript fallbacks. Install Edge or adjust the Playwright browser channel for your environment. Screenshots are written to ignored `test-results/`.

With the built preview running, `node scripts/lighthouse.mjs` runs three mobile Lighthouse audits per content page. Optional `AUDIT_URL=https://your-site.netlify.app` tests the deployment instead of localhost; `CHROME_PATH` can select a Chromium executable. Results are in ignored `.lighthouse/`. Target performance ≥95, LCP ≤2.5s, CLS ≤0.1. Real-user INP ≤200ms cannot be established by Lighthouse. Recheck deployed pages and actual mobile Safari/Android Chrome before calling production acceptance complete.

## Local verification — 18 October 2026

The production build and Astro type checks passed using Node 24. The Edge browser suite checks all routes and five viewport widths, automated WCAG A/AA findings, modal focus, keyboard controls, no-JavaScript behavior, reduced motion, custom 404 status and the production Content Security Policy. A separate build verified production metadata, live contact destinations and the content-approval guard.

The original multi-page baseline measured, across three mobile Lighthouse runs per content page, **99–100 performance**, **100 accessibility**, LCP **1.36–1.82 seconds**, and CLS **0.004–0.032**. Historical generated audit files were removed during cleanup; new runs write reports to ignored `.lighthouse/`. Rerun audits for the revised landing page before deployment. These are laboratory results, not deployed or real-user measurements. Preview SEO auditing intentionally reports that indexing is disabled.

Netlify publication and deployed response-header verification remain pending account sign-in. Firefox, Safari, Chrome and physical mobile-device checks remain outstanding; the available browser was Microsoft Edge. Owner content approval remains a production launch requirement.

## Production launch checklist

1. Obtain the owner's approval for services, coverage, business introduction, artwork/photo rights, phone and Messenger destination. Confirm the country code. Replace provisional copy and remove any remaining draft notices. Contact details are currently sourced from Facebook.
2. Configure the business owner's domain in Netlify, HTTPS, and ownership/billing. Set `SITE_URL=https://approved-domain`, `CONTENT_APPROVED=true`, and change `SITE_MODE` in Netlify configuration from `preview` to `production`. Do not change showcase settings until this launch is authorized.
3. Production builds require an HTTPS site URL and explicit content approval. They generate canonical links, business structured data and a populated sitemap, and enable call/Messenger links. Preview restrictions disappear on that new build. Confirm real destinations manually without sending unsolicited enquiries.
4. Verify deployed canonical URLs, sitemap, robots metadata and HTTP headers. Ensure no `noindex` remains, confirm true 404 status on missing URLs, and audit performance/accessibility again. There is no SPA catch-all redirect.
5. Test current Chrome, Firefox, Edge, Safari, mobile Safari and Android Chrome. Keyboard-test menus and both dialogs, check text zoom and reduced motion. Automated checks do not replace this review.
6. Keep the previous working Netlify deploy available for rollback. Decide production analytics separately with the owner; none are included in the showcase.
