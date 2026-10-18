import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('section links scroll on the landing page and return from the gallery', async ({
  page,
}) => {
  await page.goto('/');
  const origin = await page.evaluate(() => performance.timeOrigin);
  for (const [name, id] of [
    ['Shërbimet', 'sherbimet'],
    ['Projektet', 'projektet'],
    ['Rreth nesh', 'rreth-nesh'],
    ['Kontakt', 'kontakt'],
  ]) {
    await page
      .getByRole('navigation')
      .getByRole('link', { name, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    expect(await page.evaluate(() => performance.timeOrigin)).toBe(origin);
    await expect
      .poll(() =>
        page
          .locator(`#${id}`)
          .evaluate((el) => Math.abs(el.getBoundingClientRect().top - 24)),
      )
      .toBeLessThan(3);
  }
  await page.goto('/projektet/');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Shërbimet', exact: true })
    .click();
  await expect(page).toHaveURL('/#sherbimet');
  await expect(page.locator('#sherbimet')).toBeVisible();
  expect(
    await page
      .locator('html')
      .evaluate((el) => getComputedStyle(el).scrollBehavior),
  ).toBe('smooth');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page
      .locator('html')
      .evaluate((el) => getComputedStyle(el).scrollBehavior),
  ).toBe('auto');
});

test('long project captions stay within small screens', async ({ page }) => {
  for (const width of [360, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/projektet/');
    await page
      .locator('.caption h3')
      .first()
      .evaluate((element) => {
        element.textContent =
          'Instalime ndriçimi për një hapësirë tregtare me disa ambiente të ndryshme';
      });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
for (const route of ['/', '/projektet/', '/404.html']) {
  test(`page ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'sq');
    await expect(page.locator('meta[name=robots]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
for (const width of [360, 390, 768, 1440, 1920]) {
  test(`layout ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/', '/projektet/']) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    await page.goto('/');
    for (const img of await page.locator('.project-image img').all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate((el: HTMLImageElement) => el.decode());
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
  });
}
test('mobile navigation and preview contacts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('.menu-toggle');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(menu.locator('.menu-icon > span').first()).toHaveCSS(
    'transform',
    /matrix\(0\.707/,
  );
  await page.screenshot({ path: 'test-results/mobile-menu-open.png' });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu.locator('.menu-icon > span').first()).toHaveCSS(
    'transform',
    'matrix(1, 0, 0, 1, 0, -7)',
  );
  await expect(page.locator('.benefit-grid > div').first()).toHaveCSS(
    'justify-content',
    'center',
  );
  await menu.click();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('link', { name: 'Kërko ofertë' }).click();
  await expect(page).toHaveURL(/#kontakt$/);
  await page.getByRole('link', { name: 'Na telefononi' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.getByRole('button', { name: 'E kuptova' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('link', { name: 'Na telefononi' })).toBeFocused();
});
test('gallery keyboard and focus containment', async ({ page }) => {
  await page.goto('/projektet/');
  const link = page.getByRole('link', {
    name: 'Zmadho fotografinë: Ndriçim komercial',
  });
  await link.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#gallery-caption')).toHaveText(
    'Ndriçim dekorativ',
  );
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(
      await page.evaluate(() =>
        document
          .querySelector('#gallery-dialog')
          ?.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(link).toBeFocused();
});
test('no JavaScript navigation and contact fallback', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.getByRole('link', { name: 'Kërko ofertë' }).click();
  await expect(page.locator('#kontakt')).toBeVisible();
  await page.getByRole('link', { name: 'Na telefononi' }).click();
  await expect(page.locator('#demo')).toBeVisible();
  await context.close();
});
test('reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projektet/');
  expect(
    await page
      .locator('.project-image img')
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe('0s');
});
test('missing URL uses the custom 404', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: 'Një lidhje që mungon.' }),
  ).toBeVisible();
});
test('production CSP permits local interactions and resources', async ({
  page,
}) => {
  const violations: string[] = [];
  await page.addInitScript(() =>
    document.addEventListener('securitypolicyviolation', (event) =>
      console.error(`CSP:${event.violatedDirective}`),
    ),
  );
  page.on('console', (message) => {
    if (message.text().startsWith('CSP:')) violations.push(message.text());
  });
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: {
        ...response.headers(),
        'Content-Security-Policy':
          "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'",
      },
    });
  });
  await page.goto('/projektet/');
  await page
    .getByRole('link', { name: 'Zmadho fotografinë: Ndriçim komercial' })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page
    .locator('#gallery-image')
    .evaluate((el: HTMLImageElement) => el.decode());
  await page.keyboard.press('Escape');
  await page.getByRole('link', { name: 'Na kontaktoni' }).first().click();
  await page.getByRole('link', { name: 'Na telefononi' }).click();
  await expect(page.locator('#demo-dialog')).toBeVisible();
  expect(violations).toEqual([]);
});
