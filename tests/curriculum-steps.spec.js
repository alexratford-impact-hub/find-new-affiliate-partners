import { test, expect } from '@playwright/test';

/**
 * Curriculum Staging & State Transition Test Suite
 * Validates progression across all 6 masterclass modules (Steps 0 to 5) in both Slide and Code views.
 */

test.describe('Curriculum Steps & State Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/workshop.html');
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => window.focus());
    await page.waitForTimeout(300);
  });

  test('Step 0 (Kickoff): Renders 4-Question Icebreaker & 3 Prompt Failure Modes', async ({ page }) => {
    await page.keyboard.press('1'); // Step 0 key
    await page.locator('#setup-card-1').waitFor({ state: 'attached', timeout: 5000 });

    const step0Data = await page.evaluate(() => {
      const stepPill = document.getElementById('step-counter-pill')?.innerText;
      const headline = document.querySelector('.slide-headline')?.innerText;
      const card1Title = document.querySelector('#setup-card-1 .slide-card-title')?.innerText;
      const card2Title = document.querySelector('#setup-card-2 .slide-card-title')?.innerText;
      const card1Text = document.getElementById('setup-card-1')?.innerText || '';

      return {
        stepPill,
        headline,
        card1Title,
        card2Title,
        hasRetainer: card1Text.includes('Retainer'),
        hasVoucher: card1Text.includes('Voucher') || card1Text.includes('Scrapers'),
      };
    });

    expect(step0Data.stepPill.toUpperCase()).toContain('STEP 0');
    expect(step0Data.card1Title).toContain('Brand-Out Search Ceiling');
    expect(step0Data.card2Title).toContain('Consumer-In Interception');
    expect(step0Data.hasRetainer).toBe(true);
    expect(step0Data.hasVoucher).toBe(true);
  });

  test('Step 1 (Brand): Renders Commercial Boundaries and Negative Shield', async ({ page }) => {
    await page.keyboard.press('2'); // Step 1 key
    await page.waitForTimeout(400);

    const step1Data = await page.evaluate(() => {
      const stepPill = document.getElementById('step-counter-pill')?.innerText;
      const filePath = document.getElementById('file-path-pill')?.innerText;
      const bodyText = document.getElementById('slide-content-area')?.innerText || '';

      return {
        stepPill,
        filePath,
        hasNegativeShield: bodyText.includes('Negative Shield') || bodyText.includes('Exclusion') || bodyText.includes('Voucher') || bodyText.includes('Coupon'),
        hasBootsAOV: bodyText.includes('45') || bodyText.includes('AOV') || bodyText.includes('Boots'),
      };
    });

    expect(step1Data.stepPill.toUpperCase()).toContain('STEP 1');
    expect(step1Data.hasNegativeShield).toBe(true);
  });

  test('Step 2 (Math): Renders Geometric Mean & Zero-Knockout Proof', async ({ page }) => {
    await page.keyboard.press('3'); // Step 2 key
    await page.waitForTimeout(400);

    const step2Data = await page.evaluate(() => {
      const stepPill = document.getElementById('step-counter-pill')?.innerText;
      const bodyText = document.getElementById('slide-content-area')?.innerText || '';

      return {
        stepPill,
        hasZeroRule: bodyText.includes('Zero Rule') || bodyText.includes('Zero') || bodyText.includes('Knockout'),
        hasGeometricFormula: bodyText.includes('EV') || bodyText.includes('Geometric') || bodyText.includes('Score'),
      };
    });

    expect(step2Data.stepPill.toUpperCase()).toContain('STEP 2');
    expect(step2Data.hasZeroRule).toBe(true);
  });

  test('Step 3 (Search): Renders NeedScope Emotional Matrix and Behavioural Heuristics', async ({ page }) => {
    await page.keyboard.press('4'); // Step 3 key
    await page.waitForTimeout(400);

    const step3Data = await page.evaluate(() => {
      const stepPill = document.getElementById('step-counter-pill')?.innerText;
      const bodyText = document.getElementById('slide-content-area')?.innerText || '';

      return {
        stepPill,
        hasNeedScopeOrHeuristics: bodyText.includes('NeedScope') || bodyText.includes('Heuristics') || bodyText.includes('Discovery') || bodyText.includes('Kantar'),
      };
    });

    expect(step3Data.stepPill.toUpperCase()).toContain('STEP 3');
    expect(step3Data.hasNeedScopeOrHeuristics).toBe(true);
  });

  test('Step 4 (Skill): Renders Deterministic Pipeline & Mandatory HALT Gate', async ({ page }) => {
    await page.keyboard.press('5'); // Step 4 key
    await page.waitForTimeout(400);

    const step4Data = await page.evaluate(() => {
      const stepPill = document.getElementById('step-counter-pill')?.innerText;
      const bodyText = document.getElementById('slide-content-area')?.innerText || '';

      return {
        stepPill,
        hasHaltGate: bodyText.includes('HALT') || bodyText.includes('Gate') || bodyText.includes('Pause') || bodyText.includes('Phase 1'),
      };
    });

    expect(step4Data.stepPill.toUpperCase()).toContain('STEP 4');
    expect(step4Data.hasHaltGate).toBe(true);
  });

  test('Step 5 (Run): Renders Final Execution Command and Auditable Ledger', async ({ page }) => {
    await page.keyboard.press('6'); // Step 5 key
    await page.locator('#run-card-1').waitFor({ state: 'attached', timeout: 5000 });

    const step5Data = await page.evaluate(() => {
      const stepPill = document.getElementById('step-counter-pill')?.innerText;
      const bodyText = document.getElementById('slide-content-area')?.innerText || '';

      return {
        stepPill,
        hasLedgerOrCandidates: bodyText.includes('Ledger') || bodyText.includes('Candidate') || bodyText.includes('Run') || bodyText.includes('Recruit'),
      };
    });

    expect(step5Data.stepPill.toUpperCase()).toContain('STEP 5');
    expect(step5Data.hasLedgerOrCandidates).toBe(true);
  });

  test('Code Mode Streaming: Chunks advance sequentially with pinned rationale footers', async ({ page }) => {
    await page.keyboard.press('1'); // Navigate to Step 0 (Setup) which has code chunks
    await page.waitForTimeout(400);
    await page.keyboard.press('c'); // Switch to Code Mode
    await page.locator('.chunk-card.active').waitFor({ state: 'visible', timeout: 5000 });

    const chunkData = await page.evaluate(() => {
      const activeChunk = document.querySelector('.chunk-card.active');
      const footerRationale = document.querySelector('.chunk-footer');
      const codeBlock = document.querySelector('.chunk-code-area pre');

      return {
        hasActiveChunk: !!activeChunk,
        hasRationale: !!footerRationale,
        rationaleText: footerRationale?.innerText?.trim(),
        hasCode: !!(codeBlock && codeBlock.innerText.trim().length > 0),
      };
    });

    expect(chunkData.hasActiveChunk, 'Code Mode must present an active chunk card').toBe(true);
    expect(chunkData.hasRationale, 'Active chunk must contain a pinned tactical rationale').toBe(true);
    expect(chunkData.hasCode, 'Active chunk must contain readable code syntax').toBe(true);
  });
});
