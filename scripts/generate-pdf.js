import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function generatePDF() {
  const screenshotsDir = path.join(rootDir, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    console.error(`Screenshots directory not found at: ${screenshotsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(screenshotsDir)
    .filter(f => /^\d\d_.*\.png$/i.test(f))
    .sort();

  if (files.length === 0) {
    console.error('No numbered screenshot images found in screenshots/ directory.');
    process.exit(1);
  }

  console.log(`Found ${files.length} screenshots. Generating PDF...`);

  const pagesHtml = files.map((file, idx) => {
    const filePath = path.join(screenshotsDir, file);
    const imgBuffer = fs.readFileSync(filePath);
    const base64Data = imgBuffer.toString('base64');
    const dataUri = `data:image/png;base64,${base64Data}`;
    return `
      <div class="page" id="page-${idx + 1}">
        <img src="${dataUri}" alt="Slide ${idx + 1}" />
      </div>
    `;
  }).join('\n');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Affiliate Partner Discovery Workshop</title>
      <style>
        @page {
          size: 1920px 1080px;
          margin: 0;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html, body {
          width: 1920px;
          background: #0b0f19;
          font-family: sans-serif;
        }
        .page {
          width: 1920px;
          height: 1080px;
          page-break-after: always;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0b0f19;
          overflow: hidden;
        }
        .page img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
      </style>
    </head>
    <body>
      ${pagesHtml}
    </body>
    </html>
  `;

  const outputPath = path.join(rootDir, 'workshop-slides.pdf');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  await page.setContent(html, { waitUntil: 'load' });
  // Wait a short moment to ensure all local images are rendered
  await page.waitForTimeout(1000);

  await page.pdf({
    path: outputPath,
    width: '1920px',
    height: '1080px',
    printBackground: true,
    preferCSSPageSize: true
  });

  await browser.close();

  const stats = fs.statSync(outputPath);
  console.log(`PDF successfully created at: ${outputPath}`);
  console.log(`File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB (${files.length} pages)`);
}

generatePDF().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
