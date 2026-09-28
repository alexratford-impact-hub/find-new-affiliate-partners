import { test, expect } from '@playwright/test';

/**
 * Text Bounds & Viewport Containment Test Suite
 * Validates that all visible text-bearing elements remain strictly bounded
 * within the 1920x1080 slide stage canvas without overflowing, clipping,
 * or rendering off-screen.
 */

test.describe('Viewport Text Containment Audit', () => {
  const steps = ['agenda', 'setup', 'brand', 'math', 'discovery', 'skill', 'run'];

  test('All slide stages across all modules keep text within stage canvas boundaries', async ({ page }) => {
    await page.goto('/workshop.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    const offScreenElements = [];

    for (const stepKey of steps) {
      // Load step
      await page.evaluate((key) => {
        window.engine?.loadStep(key, true);
      }, stepKey);
      await page.waitForTimeout(300);

      // Get total slide stages for this step
      const stageCount = await page.evaluate((key) => {
        return window.engine?.stepSlideStageCounts?.[key] || 3;
      }, stepKey);

      for (let stageIdx = 0; stageIdx < stageCount; stageIdx++) {
        await page.evaluate((stage) => {
          window.engine?.setSlideStage(stage);
        }, stageIdx);
        await page.waitForTimeout(200);

        // Audit visible text elements
        const violations = await page.evaluate(({ key, stage }) => {
          const canvas = document.getElementById('stage-canvas');
          if (!canvas) return [];
          const canvasRect = canvas.getBoundingClientRect();
          const margin = 2; // small tolerance for subpixel antialiasing

          const results = [];
          const textElements = Array.from(canvas.querySelectorAll('h1, h2, h3, h4, p, span, li, strong, code, pre, .slide-headline, .slide-subheadline, .slide-card, .takeaway-banner, .wrapup-col, .prompt-reality-card, .weight-control-card, .matrix-quadrant, .phase-card'));

          for (const el of textElements) {
            // Only check currently visible elements
            if (el.offsetParent === null) continue;
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) continue;

            const rect = el.getBoundingClientRect();
            // Ignore 0x0 placeholder elements
            if (rect.width === 0 && rect.height === 0) continue;

            // Check if element spills out of canvas bounds
            const isOutOfTop = rect.top < canvasRect.top - margin;
            const isOutOfBottom = rect.bottom > canvasRect.bottom + margin;
            const isOutOfLeft = rect.left < canvasRect.left - margin;
            const isOutOfRight = rect.right > canvasRect.right + margin;

            if (isOutOfTop || isOutOfBottom || isOutOfLeft || isOutOfRight) {
              results.push({
                step: key,
                stage,
                tag: el.tagName.toLowerCase(),
                id: el.id || '',
                className: el.className || '',
                textSnippet: (el.innerText || el.textContent || '').trim().slice(0, 60),
                rect: {
                  top: Math.round(rect.top),
                  bottom: Math.round(rect.bottom),
                  left: Math.round(rect.left),
                  right: Math.round(rect.right),
                  height: Math.round(rect.height),
                  width: Math.round(rect.width)
                },
                canvas: {
                  top: Math.round(canvasRect.top),
                  bottom: Math.round(canvasRect.bottom),
                  left: Math.round(canvasRect.left),
                  right: Math.round(canvasRect.right),
                  height: Math.round(canvasRect.height)
                },
                spill: {
                  top: isOutOfTop ? Math.round(canvasRect.top - rect.top) : 0,
                  bottom: isOutOfBottom ? Math.round(rect.bottom - canvasRect.bottom) : 0,
                  left: isOutOfLeft ? Math.round(canvasRect.left - rect.left) : 0,
                  right: isOutOfRight ? Math.round(rect.right - canvasRect.right) : 0
                }
              });
            }
          }

          return results;
        }, { key: stepKey, stage: stageIdx });

        if (violations.length > 0) {
          offScreenElements.push(...violations);
        }
      }
    }

    if (offScreenElements.length > 0) {
      console.error('Found off-screen text elements:', JSON.stringify(offScreenElements, null, 2));
    }

    expect(
      offScreenElements,
      `Found ${offScreenElements.length} text elements appearing off-screen or out of viewport:\n` +
      offScreenElements.map(e => `[${e.step} stage ${e.stage}] <${e.tag} class="${e.className}" id="${e.id}"> spilled bottom by ${e.spill.bottom}px: "${e.textSnippet}"`).join('\n')
    ).toHaveLength(0);
  });

  test('All code view chunks keep text within stage canvas boundaries', async ({ page }) => {
    await page.goto('/workshop.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    const offScreenElements = [];

    // Switch to code view
    await page.evaluate(() => {
      window.engine?.setViewMode('code');
    });

    for (const stepKey of steps) {
      await page.evaluate((key) => {
        window.engine?.loadStep(key, false);
      }, stepKey);
      await page.waitForTimeout(300);

      const chunkCount = await page.evaluate((key) => {
        return (window.engine?.fileSections?.[key] || []).length;
      }, stepKey);

      const testIndices = chunkCount > 0 ? Array.from({ length: chunkCount }, (_, i) => i).concat(['all']) : [0];

      for (const idx of testIndices) {
        await page.evaluate((sectionIdx) => {
          window.engine?.setSection(sectionIdx);
        }, idx);
        await page.waitForTimeout(200);

        const violations = await page.evaluate(({ key, sectionIdx }) => {
          const canvas = document.getElementById('stage-canvas');
          if (!canvas) return [];
          const canvasRect = canvas.getBoundingClientRect();
          const margin = 2;

          const results = [];
          // Inspect the code view container and header/footer elements
          const elements = Array.from(canvas.querySelectorAll('#code-view .code-main-banner, #code-view .chunk-card.active .chunk-header, #code-view .chunk-card.active .chunk-footer, #code-view #claude-user-prompt-text, #code-view .code-intro-title'));

          for (const el of elements) {
            if (el.offsetParent === null) continue;
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') continue;

            const rect = el.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) continue;

            const isOutOfTop = rect.top < canvasRect.top - margin;
            const isOutOfBottom = rect.bottom > canvasRect.bottom + margin;
            const isOutOfLeft = rect.left < canvasRect.left - margin;
            const isOutOfRight = rect.right > canvasRect.right + margin;

            if (isOutOfTop || isOutOfBottom || isOutOfLeft || isOutOfRight) {
              results.push({
                step: key,
                chunk: sectionIdx,
                tag: el.tagName.toLowerCase(),
                className: el.className || '',
                textSnippet: (el.innerText || el.textContent || '').trim().slice(0, 60),
                spillBottom: isOutOfBottom ? Math.round(rect.bottom - canvasRect.bottom) : 0
              });
            }
          }

          return results;
        }, { key: stepKey, sectionIdx: idx });

        if (violations.length > 0) {
          offScreenElements.push(...violations);
        }
      }
    }

    expect(
      offScreenElements,
      `Found ${offScreenElements.length} code-view elements appearing off-screen`
    ).toHaveLength(0);
  });
});
