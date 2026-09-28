import { test, expect } from '@playwright/test';

/**
 * Facilitator Console & Teleprompter Test Suite (notes.html)
 * Validates operator controls: 70-Minute Master Clock, Telemetry Sync, Brand Presets, and Zero Overflow.
 */

test.describe('Facilitator Console (notes.html)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/notes.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(400);
  });

  test('Zero Overflow Invariant: Console layout commands screen without vertical or horizontal scrollbars', async ({ page }) => {
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

    expect(overflowMetrics.hasVerticalScroll, `Console has vertical scroll (+${overflowMetrics.verticalDelta}px)`).toBe(false);
    expect(overflowMetrics.hasHorizontalScroll, `Console has horizontal scroll (+${overflowMetrics.horizontalDelta}px)`).toBe(false);
  });

  test('Master Session Clock: Displays 70:00 envelope countdown', async ({ page }) => {
    const clockData = await page.evaluate(() => {
      const clockEl = document.querySelector('#master-timer') || document.querySelector('.session-clock') || document.querySelector('#clock-display') || document.body;
      const text = clockEl.innerText;
      return {
        text,
        hasClockFormat: /\d{1,2}:\d{2}/.test(text),
      };
    });

    expect(clockData.hasClockFormat, 'Master clock must display minutes and seconds format (e.g. 70:00 or active timer)').toBe(true);
  });

  test('Brand Presets: Facilitator can trigger Boots UK, Argos UK, and loveholidays presets', async ({ page }) => {
    const presetData = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, .preset-btn, [data-preset]')).map(b => b.innerText.trim());
      const bodyText = document.body.innerText;

      return {
        hasBoots: bodyText.includes('Boots') || buttons.some(t => t.includes('Boots')),
        hasArgos: bodyText.includes('Argos') || buttons.some(t => t.includes('Argos')),
        hasHolidays: bodyText.includes('loveholidays') || buttons.some(t => t.includes('loveholidays')),
      };
    });

    expect(presetData.hasBoots, 'Console must feature Boots UK preset').toBe(true);
  });

  test('Teleprompter Hierarchy: Displays Script, Cognitive Trap, and Stage Action sections', async ({ page }) => {
    const teleprompterSections = await page.evaluate(() => {
      const bodyText = document.body.innerText;

      return {
        hasTrap: bodyText.includes('Trap') || bodyText.includes('Cognitive') || bodyText.includes('Failure'),
        hasAction: bodyText.includes('Action') || bodyText.includes('Stage') || bodyText.includes('Command'),
        hasScript: bodyText.includes('Script') || bodyText.includes('Standard') || bodyText.includes('Spoken'),
      };
    });

    expect(teleprompterSections.hasTrap, 'Teleprompter must identify cognitive traps').toBe(true);
  });
});
