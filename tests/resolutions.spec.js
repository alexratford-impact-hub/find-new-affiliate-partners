import { test, expect } from '@playwright/test';

/**
 * Resolution & Ergonomics Test Suite: 1080p, 4K & 8K
 * Validates display invariants: Zero-Overflow, Typographic Distance Floor, Anchor Stability, and Mode Switching.
 */

test.describe('Display Canvas & Ergonomic Invariants', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/workshop.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(300);
  });

  test('Zero Overflow Invariant: No window scrollbars permitted across 16:9 stage', async ({ page }) => {
    const overflowMetrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const scrollH = doc.scrollHeight;
      const clientH = window.innerHeight;
      const scrollW = doc.scrollWidth;
      const clientW = window.innerWidth;

      return {
        scrollHeight: scrollH,
        clientHeight: clientH,
        hasVerticalScroll: scrollH > clientH,
        verticalDelta: Math.max(0, scrollH - clientH),
        scrollWidth: scrollW,
        clientWidth: clientW,
        hasHorizontalScroll: scrollW > clientW,
        horizontalDelta: Math.max(0, scrollW - clientW),
      };
    });

    expect(overflowMetrics.hasVerticalScroll, `Vertical scroll detected (+${overflowMetrics.verticalDelta}px)`).toBe(false);
    expect(overflowMetrics.hasHorizontalScroll, `Horizontal scroll detected (+${overflowMetrics.horizontalDelta}px)`).toBe(false);
  });

  test('Proportional Typographic Distance Floor: Text satisfies distance requirements', async ({ page }) => {
    const typoAudit = await page.evaluate(() => {
      const width = window.innerWidth;
      const scaleFactor = width / 1920;
      const minRequiredPx = 18 * scaleFactor;
      const tolerancePx = 17.0 * scaleFactor;

      const contentArea = document.getElementById('slide-content-area') || document.body;
      const targetElements = contentArea.querySelectorAll(
        '.slide-headline, .slide-subhead, .slide-body-callout, .prompt-bullet-point, .heuristic-item, .curriculum-lead, .chunk-code-area pre, .formula-box, p, li'
      );

      let minFoundPx = 99999;
      const violations = [];

      targetElements.forEach((el) => {
        if (!el.innerText || !el.innerText.trim()) return;
        // Exclude utility badges and footer metadata
        if (el.closest('.card-badge') || el.closest('.prompt-tag') || el.closest('.slide-step-tag') || el.closest('.presentation-footer')) {
          return;
        }

        const fs = parseFloat(window.getComputedStyle(el).fontSize);
        if (fs < minFoundPx) minFoundPx = fs;

        if (fs < tolerancePx) {
          violations.push({
            tag: el.tagName,
            className: el.className,
            text: el.innerText.slice(0, 35),
            fontSize: fs,
            minRequired: minRequiredPx
          });
        }
      });

      return {
        scaleFactor,
        minFoundPx,
        minRequiredPx,
        violationCount: violations.length,
        violations: violations.slice(0, 5)
      };
    });

    expect(
      typoAudit.violationCount,
      `Found ${typoAudit.violationCount} typography elements below proportional distance floor (${typoAudit.minRequiredPx}px @ scale ${typoAudit.scaleFactor}x): ${JSON.stringify(typoAudit.violations)}`
    ).toBe(0);
  });

  test('Pinned Anchors: Aurora bar and co-branded footer mount within screen bounds', async ({ page }) => {
    const anchorMetrics = await page.evaluate(() => {
      const aurora = document.querySelector('.aurora-bar');
      const footer = document.querySelector('.presentation-footer');

      if (!aurora || !footer) {
        return { mounted: false };
      }

      const auroraRect = aurora.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const winH = window.innerHeight;
      const winW = window.innerWidth;

      return {
        mounted: true,
        auroraTop: auroraRect.top,
        auroraHeight: auroraRect.height,
        auroraVisible: auroraRect.height >= 2 && auroraRect.width >= winW,
        footerBottom: footerRect.bottom,
        footerHeight: footerRect.height,
        footerAtBottom: Math.abs(footerRect.bottom - winH) <= 2,
        footerVisible: footerRect.height >= 40 && footerRect.width >= winW,
      };
    });

    expect(anchorMetrics.mounted, 'Top aurora bar and footer must be mounted in DOM').toBe(true);
    expect(anchorMetrics.auroraVisible, 'Aurora accent bar must span full width').toBe(true);
    expect(anchorMetrics.footerAtBottom, 'Presentation footer must be pinned to viewport bottom').toBe(true);
    expect(anchorMetrics.footerVisible, 'Presentation footer must have adequate presentation height').toBe(true);
  });

  test('Mode Switching Stability: Toggling Slide [S] and Code [C] maintains zero overflow', async ({ page }) => {
    // Switch to Code Mode via keystroke 'c'
    await page.keyboard.press('c');
    await page.waitForTimeout(400);

    const codeModeVisible = await page.evaluate(() => {
      const codeView = document.getElementById('code-view');
      const splitCanvas = document.querySelector('.code-layout-split') || document.querySelector('.claude-split-canvas');
      const doc = document.documentElement;

      return {
        isActive: codeView?.classList.contains('active'),
        hasVScroll: doc.scrollHeight > window.innerHeight,
        hasHScroll: doc.scrollWidth > window.innerWidth,
        splitMounted: !!splitCanvas,
      };
    });

    expect(codeModeVisible.isActive, 'Code Mode container must be active').toBe(true);
    expect(codeModeVisible.hasVScroll, 'Code Mode must not introduce vertical scrollbars').toBe(false);
    expect(codeModeVisible.hasHScroll, 'Code Mode must not introduce horizontal scrollbars').toBe(false);

    // Switch back to Slide Mode via keystroke 's'
    await page.keyboard.press('s');
    await page.waitForTimeout(400);

    const slideModeVisible = await page.evaluate(() => {
      const slideView = document.getElementById('slide-view');
      const doc = document.documentElement;

      return {
        isActive: slideView?.classList.contains('active'),
        hasVScroll: doc.scrollHeight > window.innerHeight,
        hasHScroll: doc.scrollWidth > window.innerWidth,
      };
    });

    expect(slideModeVisible.isActive, 'Slide Mode container must be active').toBe(true);
    expect(slideModeVisible.hasVScroll, 'Slide Mode must not introduce vertical scrollbars').toBe(false);
    expect(slideModeVisible.hasHScroll, 'Slide Mode must not introduce horizontal scrollbars').toBe(false);
  });

  test('Visual Occlusion & Z-Stacking: Active slide content is never hidden behind headers, footers, or overlays', async ({ page }) => {
    const stepKeys = ['1', '2', '3', '4', '5', '6'];

    for (const key of stepKeys) {
      await page.keyboard.press(key);
      await page.waitForTimeout(200);

      const occlusionAudit = await page.evaluate(() => {
        const footer = document.querySelector('.presentation-footer');
        const header = document.querySelector('.presentation-header');
        const footerRect = footer ? footer.getBoundingClientRect() : null;
        const headerRect = header ? header.getBoundingClientRect() : null;
        const contentArea = document.getElementById('slide-content-area');

        if (!contentArea) return { error: 'contentArea missing', occlusions: [] };

        // Test cards, callouts, grids, and primary text containers
        const targets = Array.from(contentArea.querySelectorAll(
          '.prompt-reality-card, .prompt-reality-callout, .prompt-reality-row, .brand-spec-grid, .formula-block, .kantar-chip, .matrix-grid, .skill-pipeline, .run-output-grid, .proof-row'
        ));

        const collisions = [];

        for (const el of targets) {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;

          // 1. Footer collision (element bottom exceeds footer top)
          if (footerRect && rect.bottom > (footerRect.top + 1)) {
            collisions.push({
              className: el.className,
              rectBottom: rect.bottom,
              footerTop: footerRect.top,
              overlapPx: (rect.bottom - footerRect.top).toFixed(2),
              type: 'clipped-behind-footer'
            });
          }

          // 2. Header collision (element top encroaches into header bottom)
          if (headerRect && rect.top < (headerRect.bottom - 1)) {
            collisions.push({
              className: el.className,
              rectTop: rect.top,
              headerBottom: headerRect.bottom,
              overlapPx: (headerRect.bottom - rect.top).toFixed(2),
              type: 'clipped-behind-header'
            });
          }

          // 3. Center point hit-test verification
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          if (cx >= 0 && cx <= window.innerWidth && cy >= 0 && cy <= window.innerHeight) {
            const topEl = document.elementFromPoint(cx, cy);
            if (topEl && topEl !== el && !el.contains(topEl) && !topEl.contains(el)) {
              // Only report if covering element is an unrelated overlay (e.g. footer/header)
              if (topEl.closest('.presentation-footer') || topEl.closest('.presentation-header') || topEl.classList.contains('live-capsule')) {
                collisions.push({
                  className: el.className,
                  coveredBy: topEl.className,
                  type: 'occluded-by-overlay'
                });
              }
            }
          }
        }

        return {
          totalTargets: targets.length,
          collisionsCount: collisions.length,
          collisions
        };
      });

      expect(
        occlusionAudit.collisionsCount,
        `Step ${key} has ${occlusionAudit.collisionsCount} occluded or colliding elements: ${JSON.stringify(occlusionAudit.collisions)}`
      ).toBe(0);
    }
  });
});

