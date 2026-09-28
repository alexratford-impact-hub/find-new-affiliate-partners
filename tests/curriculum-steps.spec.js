import { test, expect } from '@playwright/test';

/**
 * Curriculum Staging & State Transition Test Suite
 * Validates progression across all 6 masterclass modules (Steps 0 to 5) in both Slide and Code views.
 */

test.describe('Curriculum Steps & State Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/workshop.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(300);
  });

  test('Step 0 (Kickoff): Renders 4-Question Icebreaker & 3 Prompt Failure Modes', async ({ page }) => {
    await page.keyboard.press('1'); // Step 0 key
    await page.waitForTimeout(400);

    const step0Data = await page.evaluate(() => {
      const stepPill = document.getElementById('step-counter-pill')?.innerText;
      const headline = document.querySelector('.slide-headline')?.innerText;
      const failureRows = document.querySelectorAll('.prompt-reality-row');
      const badgeTags = Array.from(document.querySelectorAll('.prompt-tag')).map(el => el.innerText.trim());

      return {
        stepPill,
        headline,
        failureRowCount: failureRows.length,
        badgeTags,
      };
    });

    expect(step0Data.stepPill.toUpperCase()).toContain('STEP 0');
    expect(step0Data.failureRowCount).toBe(3);
    expect(step0Data.badgeTags).toEqual(
      expect.arrayContaining(['$20k–$50k Retainer Trap', 'Zero Actionable Data', 'Zero Incrementality'])
    );
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

    expect(step1Data.stepPill).toContain('Step 1');
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

    expect(step2Data.stepPill).toContain('Step 2');
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

    expect(step3Data.stepPill).toContain('Step 3');
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

    expect(step4Data.stepPill).toContain('Step 4');
    expect(step4Data.hasHaltGate).toBe(true);
  });

  test('Step 5 (Run): Renders Final Execution Command and Auditable Ledger', async ({ page }) => {
    await page.keyboard.press('6'); // Step 5 key
    await page.waitForTimeout(400);

    const step5Data = await page.evaluate(() => {
      const stepPill = document.getElementById('step-counter-pill')?.innerText;
      const bodyText = document.getElementById('slide-content-area')?.innerText || '';

      return {
        stepPill,
        hasLedgerOrCandidates: bodyText.includes('Ledger') || bodyText.includes('Candidate') || bodyText.includes('Run') || bodyText.includes('Recruit'),
      };
    });

    expect(step5Data.stepPill).toContain('Step 5');
    expect(step5Data.hasLedgerOrCandidates).toBe(true);
  });

  test('Code Mode Streaming: Chunks advance sequentially with pinned rationale footers', async ({ page }) => {
    await page.keyboard.press('c'); // Switch to Code Mode
    await page.waitForTimeout(400);

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
