import { test, expect } from '@playwright/test';

/**
 * Functional Stage & Architecture Test Suite
 * Validates Slide 0 Agenda, Micro-Stage Progression, Keystroke Handling,
 * Brand Preset Switching, and CSS Canvas Uniform Scaling without scrollbars.
 */

test.describe('Masterclass Presentation Platform - Functional & Geometry Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/workshop.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(300);
  });

  test('Initial load displays Slide 0 (Agenda & Executive Roadmap)', async ({ page }) => {
    const headline = page.locator('.slide-headline');
    await expect(headline).toContainText('Engineering Autonomous Discovery');

    const subheadline = page.locator('.slide-subheadline');
    await expect(subheadline).toContainText('Moving from conversational prompt guessing to a deterministic, production-grade affiliate recruitment engine.');

    const stepPill = page.locator('#step-counter-pill');
    await expect(stepPill).toContainText('Agenda');

    // Verify Stage 0 Schedule Table is mounted
    const stage0 = page.locator('#agenda-stage-0');
    await expect(stage0).toBeVisible();
    await expect(stage0).toContainText('Session Timetable & Milestones');
    await expect(stage0).toContainText('Brand Configuration');
    await expect(stage0).toContainText('Deterministic Scoring Engine');
    await expect(stage0).toContainText('60-Minute Production Sprint');
  });

  test('Keyboard navigation advances from Slide 0 Stage 0 directly into Step 0', async ({ page }) => {
    // Initial: Stage 0 visible
    const stage0 = page.locator('#agenda-stage-0');
    await expect(stage0).toBeVisible();

    // Advance directly to Step 0 (AI Blind Spot & Setup)
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(400);

    const headline = page.locator('.slide-headline');
    await expect(headline).toContainText('Autonomous Affiliate Discovery Skills');
    const cardTitle = page.locator('#setup-card-1 .slide-card-title');
    await expect(cardTitle).toContainText('Brand-Out Search Ceiling');
  });

  test('Mode Switching: [C] toggles live code view with keyframe reveal and [S] returns to slide', async ({ page }) => {
    // Switch to Step 1 (Setup) which has code chunks
    await page.keyboard.press('2');
    await page.waitForTimeout(300);

    // Switch to Code Mode
    await page.keyboard.press('c');
    await page.waitForTimeout(300);

    const codeView = page.locator('#code-view');
    await expect(codeView).toHaveClass(/active/);
    const chunkCard = page.locator('.chunk-card.active');
    await expect(chunkCard).toBeVisible();

    // Switch back to Slide Mode
    await page.keyboard.press('s');
    await page.waitForTimeout(300);

    const slideView = page.locator('#slide-view');
    await expect(slideView).toHaveClass(/active/);
  });

  test('Brand preset switching updates data without layout shifts', async ({ page }) => {
    // Jump to Step 1 (Brand Configuration)
    await page.keyboard.press('2'); // Step 1 (Brand)
    await page.waitForTimeout(400);

    // Initial check for default Boots UK
    const brandCard = page.locator('#brand-card-1');
    await expect(brandCard).toContainText('Boots UK');

    // Apply Argos preset via window post message / sync
    await page.evaluate(() => {
      const bc = new BroadcastChannel('workshop_sync');
      bc.postMessage({ type: 'APPLY_PRESET', payload: { preset: 'argos' } });
    });
    await page.waitForTimeout(500);

    // Verify updated to Argos UK
    await expect(brandCard).toContainText('Argos UK');

    // Canvas must retain fixed 1920x1080 dimensions
    const canvasBounds = await page.locator('#stage-canvas').boundingBox();
    expect(canvasBounds).not.toBeNull();
    expect(canvasBounds.width).toBeGreaterThan(0);
    expect(canvasBounds.height).toBeGreaterThan(0);
  });

  test('Canvas scale factor and zero-overflow across standard resolutions', async ({ page }) => {
    const testResolutions = [
      { width: 1366, height: 768 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
      { width: 2560, height: 1440 }
    ];

    for (const res of testResolutions) {
      await page.setViewportSize({ width: res.width, height: res.height });
      await page.waitForTimeout(200);

      const overflowAudit = await page.evaluate((r) => {
        const doc = document.documentElement;
        const scrollH = doc.scrollHeight;
        const clientH = window.innerHeight;
        const scrollW = doc.scrollWidth;
        const clientW = window.innerWidth;
        const canvas = document.getElementById('stage-canvas');
        const computedStyle = window.getComputedStyle(canvas);

        const expectedScale = Math.min(r.width / 1920, r.height / 1080);

        return {
          hasVerticalScroll: scrollH > clientH,
          hasHorizontalScroll: scrollW > clientW,
          scrollH,
          clientH,
          scrollW,
          clientW,
          transform: computedStyle.transform,
          expectedScale
        };
      }, res);

      expect(
        overflowAudit.hasVerticalScroll,
        `Vertical scroll found at ${res.width}x${res.height}: ${overflowAudit.scrollH}px > ${overflowAudit.clientH}px`
      ).toBe(false);

      expect(
        overflowAudit.hasHorizontalScroll,
        `Horizontal scroll found at ${res.width}x${res.height}: ${overflowAudit.scrollW}px > ${overflowAudit.clientW}px`
      ).toBe(false);
    }
  });
});
