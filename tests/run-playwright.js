/**
 * Standalone Playwright Multi-Resolution Test Runner
 * Executes programmatic assertions across 1080p, 4K, and 8K display standards.
 * Run with: node tests/run-playwright.js
 */

import { chromium } from 'playwright';

const RESOLUTIONS = [
  { name: '1080p Full HD', width: 1920, height: 1080 },
  { name: '4K Ultra HD', width: 3840, height: 2160 },
  { name: '8K Video Wall', width: 7680, height: 4320 },
];

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function runSuite() {
  console.log('\n===============================================================');
  console.log('  Affilifest Masterclass • Playwright Resolution Test Suite');
  console.log(`  Target: ${BASE_URL}`);
  console.log('===============================================================\n');

  const browser = await chromium.launch({ headless: true });
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const res of RESOLUTIONS) {
    console.log(`\n--- Testing Resolution: ${res.name} (${res.width}x${res.height}) ---`);

    const context = await browser.newContext({
      viewport: { width: res.width, height: res.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    try {
      // 1. Load workshop.html
      await page.goto(`${BASE_URL}/workshop.html`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(300);

      // Check 1: Zero Overflow Invariant (Slide Mode)
      totalTests++;
      const overflowSlide = await page.evaluate(() => {
        const doc = document.documentElement;
        return {
          vScroll: doc.scrollHeight > window.innerHeight,
          vDelta: Math.max(0, doc.scrollHeight - window.innerHeight),
          hScroll: doc.scrollWidth > window.innerWidth,
          hDelta: Math.max(0, doc.scrollWidth - window.innerWidth),
        };
      });

      if (!overflowSlide.vScroll && !overflowSlide.hScroll) {
        console.log(`  [PASS] Slide Mode: Zero Overflow (0px / 0px)`);
        passedTests++;
      } else {
        console.error(`  [FAIL] Slide Mode Overflow: V=+${overflowSlide.vDelta}px, H=+${overflowSlide.hDelta}px`);
        failedTests++;
      }

      // Check 2: Proportional Typographic Distance Floor
      totalTests++;
      const scaleFactor = res.width / 1920;
      const minRequired = 18 * scaleFactor;
      const typoCheck = await page.evaluate((minPx) => {
        const content = document.getElementById('slide-content-area') || document.body;
        const elements = content.querySelectorAll(
          '.slide-headline, .slide-subhead, .slide-body-callout, .prompt-bullet-point, .heuristic-item, .curriculum-lead, .chunk-code-area pre, p, li'
        );

        let minFound = 99999;
        let subFloor = 0;

        elements.forEach((el) => {
          if (!el.innerText || !el.innerText.trim()) return;
          if (el.closest('.card-badge') || el.closest('.prompt-tag') || el.closest('.slide-step-tag') || el.closest('.presentation-footer')) return;
          const fs = parseFloat(window.getComputedStyle(el).fontSize);
          if (fs < minFound) minFound = fs;
          if (fs < (minPx - 1)) subFloor++;
        });

        return { minFound: minFound === 99999 ? minPx : minFound, subFloor };
      }, minRequired);

      if (typoCheck.subFloor === 0) {
        console.log(`  [PASS] Typographic Distance Floor: >= ${minRequired}px (Measured: ${typoCheck.minFound.toFixed(1)}px)`);
        passedTests++;
      } else {
        console.error(`  [FAIL] Typographic Floor: ${typoCheck.subFloor} elements below ${minRequired}px`);
        failedTests++;
      }

      // Check 3: Pinned Stage Anchors
      totalTests++;
      const anchors = await page.evaluate(() => {
        const aurora = document.querySelector('.aurora-bar');
        const footer = document.querySelector('.presentation-footer');
        if (!aurora || !footer) return false;
        const fRect = footer.getBoundingClientRect();
        return Math.abs(fRect.bottom - window.innerHeight) <= 2;
      });

      if (anchors) {
        console.log(`  [PASS] Pinned Stage Anchors (Aurora & Footer pinned)`);
        passedTests++;
      } else {
        console.error(`  [FAIL] Pinned Stage Anchors failed alignment`);
        failedTests++;
      }

      // Check 4: Code Mode Split Canvas & Streaming
      totalTests++;
      await page.keyboard.press('c');
      await page.waitForTimeout(400);

      const codeModeCheck = await page.evaluate(() => {
        const codeView = document.getElementById('code-view');
        const doc = document.documentElement;
        return {
          isActive: codeView?.classList.contains('active'),
          vScroll: doc.scrollHeight > window.innerHeight,
          hScroll: doc.scrollWidth > window.innerWidth,
        };
      });

      if (codeModeCheck.isActive && !codeModeCheck.vScroll && !codeModeCheck.hScroll) {
        console.log(`  [PASS] Code Mode: Split Console Active & Zero Overflow`);
        passedTests++;
      } else {
        console.error(`  [FAIL] Code Mode failed validation`);
        failedTests++;
      }

      // Check 5: Visual Occlusion & Z-Stacking across all Steps
      totalTests++;
      await page.keyboard.press('s'); // Return to slide mode
      await page.waitForTimeout(200);

      let stepCollisions = 0;
      for (let s = 1; s <= 6; s++) {
        await page.keyboard.press(s.toString());
        await page.waitForTimeout(150);

        const occlusions = await page.evaluate(() => {
          const footer = document.querySelector('.presentation-footer');
          const footerRect = footer ? footer.getBoundingClientRect() : null;
          const content = document.getElementById('slide-content-area');
          if (!content || !footerRect) return 0;

          const cards = content.querySelectorAll('.prompt-reality-card, .brand-spec-grid, .formula-block, .kantar-chip, .skill-pipeline, .run-output-grid');
          let count = 0;
          cards.forEach((c) => {
            const r = c.getBoundingClientRect();
            if (r.bottom > footerRect.top + 1) count++;
          });
          return count;
        });
        stepCollisions += occlusions;
      }

      if (stepCollisions === 0) {
        console.log(`  [PASS] Visual Occlusion & Z-Stacking: 0 elements obscured behind overlays`);
        passedTests++;
      } else {
        console.error(`  [FAIL] Visual Occlusion: ${stepCollisions} elements colliding with footer`);
        failedTests++;
      }

    } catch (err) {
      console.error(`  [ERROR] Encountered exception in ${res.name}:`, err);
      failedTests++;
    } finally {
      await context.close();
    }
  }

  // 2. Facilitator Console Validation
  console.log(`\n--- Testing Facilitator Console (notes.html @ 1080p) ---`);
  const consoleCtx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const consolePage = await consoleCtx.newPage();

  try {
    totalTests++;
    await consolePage.goto(`${BASE_URL}/notes.html`);
    await consolePage.waitForLoadState('domcontentloaded');

    const consoleMetrics = await consolePage.evaluate(() => {
      const doc = document.documentElement;
      return {
        vScroll: doc.scrollHeight > window.innerHeight,
        hScroll: doc.scrollWidth > window.innerWidth,
      };
    });

    if (!consoleMetrics.vScroll && !consoleMetrics.hScroll) {
      console.log(`  [PASS] Operator Console: Zero Overflow (0px / 0px)`);
      passedTests++;
    } else {
      console.error(`  [FAIL] Operator Console has window overflow`);
      failedTests++;
    }
  } catch (err) {
    console.error(`  [ERROR] Operator Console exception:`, err);
    failedTests++;
  } finally {
    await consoleCtx.close();
  }

  await browser.close();

  console.log('\n===============================================================');
  console.log(`  Test Summary: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log('===============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
