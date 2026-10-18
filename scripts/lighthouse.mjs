import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { mkdir, writeFile } from 'node:fs/promises';
const chrome = await launch({
  chromePath:
    process.env.CHROME_PATH ||
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  chromeFlags: ['--headless', '--no-sandbox'],
});
await mkdir('.lighthouse', { recursive: true });
try {
  const summary = [];
  for (const path of (process.env.AUDIT_PATHS || '/,/projektet/').split(',')) {
    for (let run = 1; run <= Number(process.env.AUDIT_RUNS || 3); run++) {
      const result = await lighthouse(
        (process.env.AUDIT_URL || 'http://127.0.0.1:4321') + path,
        {
          port: chrome.port,
          output: 'json',
          onlyCategories: [
            'performance',
            'accessibility',
            'best-practices',
            'seo',
          ],
        },
      );
      const report = result.lhr;
      summary.push({
        path,
        run,
        performance: report.categories.performance.score,
        accessibility: report.categories.accessibility.score,
        lcp: report.audits['largest-contentful-paint'].numericValue,
        cls: report.audits['cumulative-layout-shift'].numericValue,
      });
      await writeFile(
        `.lighthouse/${path.replaceAll('/', '') || 'home'}-${run}.json`,
        result.report,
      );
      console.log(
        `${path} run ${run}: performance ${report.categories.performance.score}, accessibility ${report.categories.accessibility.score}`,
      );
    }
  }
  await writeFile('.lighthouse/summary.json', JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await chrome.kill();
}
