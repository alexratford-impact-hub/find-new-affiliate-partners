/**
 * TV Projector & Code Console Entry Module (src/workshop-main.js)
 * Coordinates 1920x1080 stage canvas, depth-of-field slide staging,
 * instant keyframe code reveals, and sync bus.
 */

import {
  WorkshopEngine,
  curriculum,
  fileSections,
  slideStageTitles,
  brandProfiles,
  stepKeys,
  stepSlideStageCounts,
  escapeHtml,
  formatTime
} from './lib/workshop-core.js';
import { claudeStepData } from './data/quips.js';

export const engine = new WorkshopEngine({ role: 'workshop' });

// Application State cache for local DOM rendering
let activeKey = 'agenda';
let activeViewMode = 'slide';
let activeSectionIndex = 0;
let activeSlideStage = 0;
let activePreset = 'boots';

const dynamicBuffer = {};
for (const k in curriculum) {
  dynamicBuffer[k] = curriculum[k].content;
}

// Lightweight Quip Cycler for Claude Thinking Pane
class ThinkingIndicator {
  constructor(elementId) {
    this.el = document.getElementById(elementId);
    this.quips = [
      "Synthesizing deterministic guardrails...",
      "Evaluating unbranded query stems...",
      "Enforcing geometric mean EV formula...",
      "Verifying zero-knockout criteria...",
      "Extracting independent reviewer domains...",
      "Checking existing partner exclusions..."
    ];
    this.idx = 0;
    this.interval = null;
  }

  start() {
    if (!this.el) return;
    this.update();
    if (!this.interval) {
      this.interval = setInterval(() => this.update(), 4000);
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  update() {
    if (!this.el) return;
    this.el.innerHTML = `
      <span class="thinking-stream-body">${this.quips[this.idx]}</span>
      <span class="thinking-pulse-cursor"></span>
    `;
    this.idx = (this.idx + 1) % this.quips.length;
  }
}

const thinkingIndicator = new ThinkingIndicator('claude-thinking-text');

// Subscribe to Centralized WorkshopEngine
engine.subscribe((state, changeType, payload) => {
  activeKey = state.activeKey;
  activeViewMode = state.viewMode;
  activeSectionIndex = state.activeSectionIndex;
  activeSlideStage = state.activeSlideStage;
  activePreset = state.activePreset;

  switch (changeType) {
    case 'STEP_LOADED':
      onStepLoaded(state.activeKey);
      onViewModeChanged(state.viewMode);
      break;

    case 'MODE_CHANGED':
      onViewModeChanged(state.viewMode);
      break;

    case 'SLIDE_STAGE_CHANGED':
      applySlideStaging(state.activeKey, state.activeSlideStage);
      break;

    case 'SECTION_CHANGED':
      renderCodeChunks();
      scrollToActiveChunk();
      break;

    case 'PRESET_APPLIED':
      onPresetApplied(state.activePreset);
      break;

    case 'CODING_SPRINT_UPDATE':
      updateTimerVisibility(state);
      break;

    case 'WEIGHTS_CHANGED':
      updateSliderDialsUI();
      updateLiveEVMath();
      break;

    default:
      break;
  }
});

function updateTimerVisibility(state = engine.getState()) {
  const timerBox = document.getElementById('timer-box');
  const auroraBar = document.querySelector('.aurora-bar');
  const traySprint = document.getElementById('tray-sprint-val');
  if (traySprint) traySprint.innerText = state.codingSprintTimeStr || '00:00';

  if (!timerBox) return;
  if (state.isCodingSprintActive && state.viewMode === 'code') {
    timerBox.style.display = 'inline-flex';
    timerBox.innerHTML = `⏱️ Coding Sprint: ${state.codingSprintTimeStr}`;
    timerBox.classList.add('sprint-pulsing');
    if (auroraBar) auroraBar.classList.add('aurora-sprint');
  } else {
    timerBox.style.display = 'none';
    timerBox.classList.remove('sprint-pulsing');
    if (auroraBar) auroraBar.classList.remove('aurora-sprint');
  }
}

// View Mode Controller
export function setViewMode(mode) {
  engine.setViewMode(mode);
}

function onViewModeChanged(mode) {
  executeTransition(() => {
    const slideViewEl = document.getElementById('slide-view');
    const codeViewEl = document.getElementById('code-view');
    const modeBadge = document.getElementById('mode-badge');

    if (mode === 'slide') {
      if (codeViewEl) codeViewEl.classList.remove('active');
      if (slideViewEl) slideViewEl.classList.add('active');
      if (modeBadge) {
        modeBadge.innerText = 'Presentation Slide';
        modeBadge.className = 'mode-pill slide-mode';
      }
      thinkingIndicator.stop();
    } else {
      if (slideViewEl) slideViewEl.classList.remove('active');
      if (codeViewEl) codeViewEl.classList.add('active');
      thinkingIndicator.start();
      renderCodeChunks();
      if (modeBadge) {
        modeBadge.innerText = 'Live Code';
        modeBadge.className = 'mode-pill code-mode';
      }
      setTimeout(scrollToActiveChunk, 50);
    }

    const dockSlide = document.getElementById('dock-btn-slide');
    const dockCode = document.getElementById('dock-btn-code');
    if (dockSlide) dockSlide.setAttribute('data-active', mode === 'slide' ? 'true' : 'false');
    if (dockCode) dockCode.setAttribute('data-active', mode === 'code' ? 'true' : 'false');

    const trayMode = document.getElementById('tray-mode-badge');
    if (trayMode) trayMode.innerText = mode === 'slide' ? 'Slide Mode' : 'Code Mode';

    updateTimerVisibility();
  });
}

// View Transition Helper for Presenter Navigation
export function executeTransition(callback) {
  if (typeof document !== 'undefined' && document.startViewTransition) {
    try {
      return document.startViewTransition(() => {
        try {
          callback();
        } catch (innerErr) {
          console.error('Error during slide transition callback:', innerErr);
        }
      });
    } catch (e) {
      // Fallback immediately if startViewTransition throws (e.g. InvalidStateError)
      callback();
      return;
    }
  }
  callback();
}

// Step Loader
export function loadStep(key, forceSlide = false) {
  engine.loadStep(key, forceSlide);
}

function onStepLoaded(key) {
  const item = curriculum[key];
  if (!item) return;

  const stepPill = document.getElementById('step-counter-pill');
  if (stepPill) {
    stepPill.innerText = (key === 'agenda') ? 'Overview • Agenda' : `Step ${item.stepNum} of 5`;
  }
  const filePill = document.getElementById('file-path-pill');
  if (filePill) filePill.innerText = item.filePill || item.path;
  const codeFilePill = document.getElementById('code-file-pill');
  if (codeFilePill) codeFilePill.innerText = item.path;

  executeTransition(() => {
    renderSlide(key);
    applySlideStaging(key, engine.getState().activeSlideStage);
  });

  const trayStep = document.getElementById('tray-step-val');
  if (trayStep) trayStep.innerText = (key === 'agenda') ? 'Agenda' : `Step ${item.stepNum}`;

  const trayPreset = document.getElementById('tray-preset-val');
  if (trayPreset) {
    const p = brandProfiles[activePreset] || brandProfiles.boots;
    trayPreset.innerText = p.name || p.brand || 'Boots UK';
  }

  const codeTitle = document.getElementById('code-intro-title');
  if (codeTitle) codeTitle.innerText = item.name;

  if (activeViewMode === 'slide') {
    onViewModeChanged('slide');
  } else {
    renderCodeChunks();
  }

  ['brand', 'math', 'discovery'].forEach(stepKey => {
    const btn = document.getElementById(`rail-chat-${stepKey}`);
    if (btn) btn.classList.toggle('active', stepKey === key);
  });
}

// Brand Preset Application
export function applyBrandPreset(preset) {
  engine.applyPreset(preset);
}

function onPresetApplied(preset) {
  const profile = brandProfiles[preset];
  if (!profile) return;

  const slideViewEl = document.getElementById('slide-view');
  const codeViewEl = document.getElementById('code-view');
  const targets = [slideViewEl, codeViewEl].filter(Boolean);

  targets.forEach(el => {
    el.style.transition = 'opacity 0.25s ease';
    el.style.opacity = '0';
  });

  setTimeout(() => {
    dynamicBuffer['brand'] = profile.brandMd || "";
    if (curriculum['brand']) {
      curriculum['brand'].content = profile.brandMd || "";
    }

    if (fileSections.brand && fileSections.brand.length >= 3) {
      fileSections.brand[0].code = `# Target Parameters\n- Brand: ${profile.name}\n- Focus Category: ${profile.category}\n- Commercial Model: ${profile.commercialModel}\n- Target AOV: ${profile.aov}\n- Target Territory: ${profile.territory}`;
      fileSections.brand[1].code = `# Competitor Baselines\n` + profile.competitors.map(c => `- ${c}`).join('\n');
      fileSections.brand[2].code = `# Disqualifications\n` + profile.disqualifications.map(d => `- ${d}`).join('\n');
    }

    if (activeViewMode === 'slide') {
      renderSlide(activeKey);
      applySlideStaging(activeKey, activeSlideStage);
    } else {
      renderCodeChunks();
    }

    targets.forEach(el => {
      el.style.opacity = '1';
    });
  }, 250);
}

// Step 2: Scoring Engine Weight Normalisation Dials
export function handleWeightChange(dialKey, newVal) {
  engine.setScoringWeight(dialKey, newVal);
}

function updateSliderDialsUI() {
  const weights = engine.getState().scoringWeights;
  const tagR = document.getElementById('weight-val-r');
  const tagS = document.getElementById('weight-val-s');
  const tagC = document.getElementById('weight-val-c');

  const fillR = document.getElementById('weight-fill-r');
  const fillS = document.getElementById('weight-fill-s');
  const fillC = document.getElementById('weight-fill-c');

  const sliderR = document.getElementById('slider-r');
  const sliderS = document.getElementById('slider-s');
  const sliderC = document.getElementById('slider-c');

  if (tagR) tagR.innerText = weights.r.toFixed(2);
  if (tagS) tagS.innerText = weights.s.toFixed(2);
  if (tagC) tagC.innerText = weights.c.toFixed(2);

  if (sliderR) {
    if (document.activeElement !== sliderR) sliderR.value = weights.r.toFixed(2);
    const pct = (weights.r * 100).toFixed(0);
    sliderR.style.background = `linear-gradient(to right, #298DDA 0%, #298DDA ${pct}%, #E2E8F0 ${pct}%, #E2E8F0 100%)`;
  }
  if (sliderS) {
    if (document.activeElement !== sliderS) sliderS.value = weights.s.toFixed(2);
    const pct = (weights.s * 100).toFixed(0);
    sliderS.style.background = `linear-gradient(to right, #F59E0B 0%, #F59E0B ${pct}%, #E2E8F0 ${pct}%, #E2E8F0 100%)`;
  }
  if (sliderC) {
    if (document.activeElement !== sliderC) sliderC.value = weights.c.toFixed(2);
    const pct = (weights.c * 100).toFixed(0);
    sliderC.style.background = `linear-gradient(to right, #10B981 0%, #10B981 ${pct}%, #E2E8F0 ${pct}%, #E2E8F0 100%)`;
  }

  const formulaReadout = document.getElementById('formula-live-math');
  if (formulaReadout) {
    formulaReadout.innerHTML = `EV = (Relevance<sup>${weights.r.toFixed(2)}</sup>) &times; (Scale<sup>${weights.s.toFixed(2)}</sup>) &times; (Commercial<sup>${weights.c.toFixed(2)}</sup>)`;
  }
}

function bindMathListeners() {
  const widget = document.getElementById('math-slider-widget');
  if (!widget) return;

  ['r', 's', 'c'].forEach(dial => {
    const input = document.getElementById(`slider-${dial}`);
    if (input && !input.dataset.bound) {
      input.dataset.bound = 'true';
      input.addEventListener('input', (e) => {
        handleWeightChange(dial, parseFloat(e.target.value));
      });
    }
  });

  widget.querySelectorAll('.weight-step-btn').forEach(btn => {
    if (!btn.dataset.bound) {
      btn.dataset.bound = 'true';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dial = btn.getAttribute('data-dial');
        const delta = parseFloat(btn.getAttribute('data-delta'));
        const current = engine.getState().scoringWeights[dial];
        handleWeightChange(dial, Math.round((current + delta) * 100) / 100);
      });
    }
  });
}

function calculateEV(r, s, c) {
  return engine.calculateEV(r, s, c);
}

function updateLiveEVMath() {
  const scoringWeights = engine.getState().scoringWeights;
  const contentEV = calculateEV(5, 4, 4).toFixed(2);
  const couponEV = calculateEV(0, 5, 5).toFixed(2);

  const contentBox = document.getElementById('live-content-partner-ev');
  if (contentBox) {
    contentBox.innerHTML = `(5<sup>${scoringWeights.r.toFixed(2)}</sup>) &times; (4<sup>${scoringWeights.s.toFixed(2)}</sup>) &times; (4<sup>${scoringWeights.c.toFixed(2)}</sup>) = <strong style="color:#059669; font-size:1.15em;">${contentEV}</strong> (Approved Tier 1)`;
  }

  const couponBox = document.getElementById('live-coupon-scraper-ev');
  if (couponBox) {
    couponBox.innerHTML = `(0<sup>${scoringWeights.r.toFixed(2)}</sup>) &times; (5<sup>${scoringWeights.s.toFixed(2)}</sup>) &times; (5<sup>${scoringWeights.c.toFixed(2)}</sup>) = <strong style="color:#DC2626; font-size:1.15em;">${couponEV}</strong> (Zero Knockout)`;
  }
}

// Slide Renderer
function renderSlide(key) {
  const container = document.getElementById('slide-content-area');
  if (!container) return;
  const profile = brandProfiles[activePreset] || brandProfiles.boots;
  const scoringWeights = engine.getState().scoringWeights;

  if (key === 'agenda') {
    container.innerHTML = `
      <div class="slide-hero">
        <h1 class="slide-headline">Engineering Autonomous Discovery</h1>
        <p class="slide-subheadline">
          Moving from conversational prompt guessing to a deterministic, production-grade affiliate recruitment engine.
        </p>
      </div>

      <div class="slide-card stage-card focused" id="agenda-stage-0">
        <div class="slide-card-header" style="justify-content: space-between;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="card-badge" style="background:#EBF4FC; color:#298DDA;">Run of Play</span>
            <h2 class="slide-card-title">Session Timetable &amp; Milestones</h2>
          </div>
          <span class="slide-mini-tag tag-blue">⏱️ 60-Minute Session Roadmap</span>
        </div>

        <table class="ledger-preview-table" style="margin-top:4px;">
          <thead>
            <tr>
              <th style="width:70px;">Step</th>
              <th style="width:280px;">Module</th>
              <th style="width:260px;">File Target</th>
              <th>Operational Focus</th>
              <th style="width:190px; text-align:center;">Window</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong style="color:var(--color-primary); font-size:1.1em;">1</strong></td>
              <td><strong>Brand Configuration</strong></td>
              <td><code>references/brand.md</code></td>
              <td>Commercial boundaries, target AOV baselines, Negative Shield</td>
              <td style="text-align:center;"><span class="agenda-window-pill">00:00 – 15:00</span></td>
            </tr>
            <tr>
              <td><strong style="color:var(--color-primary); font-size:1.1em;">2</strong></td>
              <td><strong>Deterministic Scoring Engine</strong></td>
              <td><code>references/estimated_value.md</code></td>
              <td>Multiplicative geometric mean math, The Zero Rule, 0–5 anchors</td>
              <td style="text-align:center;"><span class="agenda-window-pill">15:00 – 25:00</span></td>
            </tr>
            <tr>
              <td><strong style="color:var(--color-primary); font-size:1.1em;">3</strong></td>
              <td><strong>Dual-Engine Search</strong></td>
              <td><code>references/discovery.md</code></td>
              <td>NeedScope emotional vectors, Messy Middle behavioural heuristics</td>
              <td style="text-align:center;"><span class="agenda-window-pill">25:00 – 38:00</span></td>
            </tr>
            <tr>
              <td><strong style="color:var(--color-primary); font-size:1.1em;">4</strong></td>
              <td><strong>Master Controller Skill</strong></td>
              <td><code>SKILL.md</code></td>
              <td>Deterministic pipeline orchestration, Step 1 HALT gate, CRM schema</td>
              <td style="text-align:center;"><span class="agenda-window-pill">38:00 – 48:00</span></td>
            </tr>
            <tr>
              <td><strong style="color:var(--color-primary); font-size:1.1em;">5</strong></td>
              <td><strong>Live Deployment &amp; Verification</strong></td>
              <td><code>SKILL.md (Runtime)</code></td>
              <td>Single-trigger runtime execution, auditable ledger, CRM CSV export</td>
              <td style="text-align:center;"><span class="agenda-window-pill">48:00 – 60:00</span></td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 22px; padding-top: 0;">
          <div style="display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 16px; margin-bottom:14px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="card-badge" style="background:#0F172A; color:#38BDF8; font-size:11px; padding:3px 8px;">Prerequisites</span>
              <span style="font-size:14px; font-weight:800; color:#0F172A; letter-spacing:0.02em;">Workshop Engineering Principles</span>
            </div>
            <span class="slide-mini-tag tag-blue" style="font-size:11px; padding:2px 8px;">3 Invariants</span>
          </div>
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:16px;">
            <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: var(--radius-card-md); padding: 18px 20px; box-shadow: var(--shadow-sm);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="font-size:11px; font-weight:800; background:#EBF4FC; color:#0284C7; padding:2px 8px; border-radius:4px; font-family:var(--font-mono);">01</span>
                <span style="color:#0284C7; font-weight:900;">⚡</span>
              </div>
              <h4 style="font-size:15px; font-weight:800; color:#0F172A; margin:0 0 6px 0;">Deterministic Over Conversational</h4>
              <p style="font-size:13px; color:#475569; line-height:1.45; margin:0;">Zero prompt guessing. The agent executes strictly against isolated local file directives.</p>
            </div>
            <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: var(--radius-card-md); padding: 18px 20px; box-shadow: var(--shadow-sm);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="font-size:11px; font-weight:800; background:#FEE2E2; color:#DC2626; padding:2px 8px; border-radius:4px; font-family:var(--font-mono);">02</span>
                <span style="color:#DC2626; font-weight:900;">🚫</span>
              </div>
              <h4 style="font-size:15px; font-weight:800; color:#0F172A; margin:0 0 6px 0;">The Zero Rule Math</h4>
              <p style="font-size:13px; color:#475569; line-height:1.45; margin:0;">Geometric multiplication drops irrelevant coupon scrapers to 0.00 instantly.</p>
            </div>
            <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: var(--radius-card-md); padding: 18px 20px; box-shadow: var(--shadow-sm);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="font-size:11px; font-weight:800; background:#FEF3C7; color:#D97706; padding:2px 8px; border-radius:4px; font-family:var(--font-mono);">03</span>
                <span style="color:#D97706; font-weight:900;">🛡️</span>
              </div>
              <h4 style="font-size:15px; font-weight:800; color:#0F172A; margin:0 0 6px 0;">Human-in-the-Loop Governance</h4>
              <p style="font-size:13px; color:#475569; line-height:1.45; margin:0;">The pipeline halts at Step 1 to load your CRM exclusion ledger before searching.</p>
            </div>
          </div>
        </div>

      </div>
    `;

  } else if (key === 'setup') {
    container.innerHTML = `
      <div class="slide-hero">
        <h1 class="slide-headline">Autonomous Affiliate Discovery Skills</h1>
        <p class="slide-subheadline">
          Build deterministic AI skills to discover high-intent partners across any commercial vertical.
        </p>
      </div>

      <div class="slide-grid-2" id="setup-grids">
        <div class="slide-card stage-card" id="setup-card-1" style="display:flex; flex-direction:column; justify-content:space-between; height:100%; box-sizing:border-box;">
          <div>
            <div class="slide-card-header" style="justify-content:space-between; margin-bottom:10px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <span class="card-badge" style="background:#FEF2F2; color:#DC2626;">The Trap</span>
                <h2 class="slide-card-title">Brand-Out Search Ceiling</h2>
              </div>
              <span class="slide-mini-tag tag-red">Default Prompt Failure</span>
            </div>

            <p style="font-size:14px; color:#334155; line-height:1.45; margin:0 0 12px 0;">
              Querying AI for <em>"affiliate partners for [Brand]"</em> triggers conversational pattern-matching into three acute failure modes:
            </p>

            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:10px 14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <span style="font-size:14px; font-weight:800; color:#0F172A;">1. Mass Media Giants</span>
                  <span style="font-size:11.5px; font-weight:700; color:#DC2626; background:#FEE2E2; padding:2px 8px; border-radius:4px;">$20k–$50k Retainer</span>
                </div>
                <div style="font-size:11.5px; font-family:var(--font-mono); color:#475569; background:#EDF2F7; padding:2px 6px; border-radius:4px; display:inline-block; margin-bottom:4px;">national-review-portal.com &bull; tier1-buyer-guide.com</div>
                <div style="font-size:13px; color:#334155; line-height:1.4;">Demands 5-figure monthly retainers, 3–6 month agency review cycles, and delivers 0% incremental discovery.</div>
              </div>

              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:10px 14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <span style="font-size:14px; font-weight:800; color:#0F172A;">2. Abstract Category Fluff</span>
                  <span style="font-size:11.5px; font-weight:700; color:#D97706; background:#FEF3C7; padding:2px 8px; border-radius:4px;">Zero Actionable Data</span>
                </div>
                <div style="font-size:11.5px; font-family:var(--font-mono); color:#475569; background:#EDF2F7; padding:2px 6px; border-radius:4px; display:inline-block; margin-bottom:4px;">"Niche Blogs" &bull; "Lifestyle Hubs" &bull; "Parenting Reviewers"</div>
                <div style="font-size:13px; color:#334155; line-height:1.4;">Zero website URLs, no verified traffic metrics, and zero publisher outreach contacts.</div>
              </div>

              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:10px 14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <span style="font-size:14px; font-weight:800; color:#0F172A;">3. Voucher Scrapers</span>
                  <span style="font-size:11.5px; font-weight:700; color:#DC2626; background:#FEE2E2; padding:2px 8px; border-radius:4px;">-100% Margin Drain</span>
                </div>
                <div style="font-size:11.5px; font-family:var(--font-mono); color:#475569; background:#EDF2F7; padding:2px 6px; border-radius:4px; display:inline-block; margin-bottom:4px;">checkout-voucher-extension.com &bull; coupon-directory.com</div>
                <div style="font-size:13px; color:#334155; line-height:1.4;">Hijacks cart checkout via browser extensions, paying CPA commissions on already-converted traffic.</div>
              </div>
            </div>
          </div>

          <div style="background:#FEF2F2; border:1px solid #FECACA; border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
            <span style="font-size:13px; font-weight:800; color:#991B1B;">🛑 Net Commercial Outcome: 0% Incremental Reach &bull; Negative Gross ROI</span>
            <span class="slide-mini-tag tag-red">CPA Cannibalisation</span>
          </div>
        </div>

        <div class="slide-card stage-card" id="setup-card-2" style="display:flex; flex-direction:column; justify-content:space-between; height:100%; box-sizing:border-box;">
          <div>
            <div class="slide-card-header" style="justify-content:space-between; margin-bottom:10px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <span class="card-badge" style="background:#ECFDF5; color:#10B981;">The Paradigm</span>
                <h2 class="slide-card-title">Consumer-In Interception</h2>
              </div>
              <span class="slide-mini-tag tag-green">Deterministic Skill</span>
            </div>

            <p style="font-size:14px; color:#334155; line-height:1.45; margin:0 0 12px 0;">
              Intercepting high-intent buyers in Google's <em>"Messy Middle"</em> before brand choice using deterministic quality gates:
            </p>

            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:10px 14px; display:flex; align-items:center; gap:12px;">
                <span style="font-size:12px; font-weight:800; color:#15803D; background:#DCFCE7; padding:4px 8px; border-radius:6px; font-family:var(--font-mono);">01</span>
                <div>
                  <div style="font-size:14px; font-weight:800; color:#0F172A; margin-bottom:2px;">Local Directive Files</div>
                  <div style="font-size:13px; color:#334155; line-height:1.4;">4 modular local Markdown files replace conversational prompts with bounded constraints.</div>
                </div>
              </div>

              <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:10px 14px; display:flex; align-items:center; gap:12px;">
                <span style="font-size:12px; font-weight:800; color:#15803D; background:#DCFCE7; padding:4px 8px; border-radius:6px; font-family:var(--font-mono);">02</span>
                <div>
                  <div style="font-size:14px; font-weight:800; color:#0F172A; margin-bottom:2px;">Unbranded NeedScope Vectors</div>
                  <div style="font-size:13px; color:#334155; line-height:1.4;">Vectors target emotional problem states and decision heuristics before brand loyalty forms.</div>
                </div>
              </div>

              <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:10px 14px; display:flex; align-items:center; gap:12px;">
                <span style="font-size:12px; font-weight:800; color:#15803D; background:#DCFCE7; padding:4px 8px; border-radius:6px; font-family:var(--font-mono);">03</span>
                <div>
                  <div style="font-size:14px; font-weight:800; color:#0F172A; margin-bottom:2px;">Multiplicative EV Math Formula</div>
                  <div style="font-size:13px; color:#334155; line-height:1.4;">Geometric mean formula drops low-relevance scrapers to 0.00 instantly with zero-knockouts.</div>
                </div>
              </div>

              <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:10px 14px; display:flex; align-items:center; gap:12px;">
                <span style="font-size:12px; font-weight:800; color:#15803D; background:#DCFCE7; padding:4px 8px; border-radius:6px; font-family:var(--font-mono);">04</span>
                <div>
                  <div style="font-size:14px; font-weight:800; color:#0F172A; margin-bottom:2px;">Negative Shield Gate</div>
                  <div style="font-size:13px; color:#334155; line-height:1.4;">Pre-search exclusion permanently filters coupon scrapers, direct competitors, and non-UK domains.</div>
                </div>
              </div>
            </div>
          </div>

          <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
            <span style="font-size:13px; font-weight:800; color:#166534;">🎯 Net Commercial Outcome: 100% Net-New Customers &bull; High-Margin Editorial</span>
            <span class="slide-mini-tag tag-green">Auditable CRM Pipeline</span>
          </div>
        </div>
      </div>
    `;

  } else if (key === 'brand') {
    container.innerHTML = `
      <div class="slide-hero">
        <h1 class="slide-headline">Constraint-Driven Discovery (brand.md)</h1>
        <p class="slide-subheadline">
          Grounding the autonomous AI agent in commercial reality and enforcing the Negative Shield.
        </p>
      </div>

      <div class="slide-grid-2" id="brand-grid">
        <div class="slide-card stage-card" id="brand-card-1">
          <div class="slide-card-header">
            <span class="card-badge" style="background:#EBF4FC; color:#298DDA;">Commercial Guardrails</span>
            <h2 class="slide-card-title">Defining Operational Margins</h2>
          </div>
          <ul class="slide-card-bullets">
            <li><span class="bullet-check">✓</span> <span><strong>Focus Category:</strong> <code>${profile.category}</code> (locks agent scope strictly).</span></li>
            <li><span class="bullet-check">✓</span> <span><strong>Benchmark AOV:</strong> <strong>${profile.aov}</strong> (${profile.commercialModel} model).</span></li>
            <li><span class="bullet-check">✓</span> <span><strong>Competitor Seeds:</strong> ${profile.competitors.join(', ')} (reverse-engineers pathways).</span></li>
            <li><span class="bullet-check">✓</span> <span><strong>Incrementality Gate:</strong> Top-of-funnel creators over coupon catchers.</span></li>
          </ul>

          <!-- Structured Visual Metric & Parameter Panels -->
          <div class="brand-visual-grid">
            <div class="brand-metric-pill-box">
              <span class="metric-label">Benchmark Model</span>
              <span class="metric-value-lg">${profile.aov}</span>
              <span class="metric-sub">${profile.commercialModel} CPA Baseline</span>
            </div>
            <div class="brand-metric-pill-box">
              <span class="metric-label">Target Conversion Gate</span>
              <span class="metric-value-lg">100%</span>
              <span class="metric-sub">Zero Incentivised Traffic</span>
            </div>
          </div>

          <div class="brand-seeds-table">
            <div class="seed-row-header">
              <span>Rival Benchmark Seeds</span>
              <span class="seed-badge">Reverse-Engineered</span>
            </div>
            <div class="seed-chips-cluster">
              ${profile.competitors.map(c => `<span class="seed-chip">🌐 ${c}</span>`).join('')}
            </div>
          </div>

          <div class="slide-tag-row">
            <span class="slide-mini-tag tag-blue">🎯 Focus: ${profile.name}</span>
            <span class="slide-mini-tag tag-blue">💷 Benchmark AOV: ${profile.aov}</span>
            <span class="slide-mini-tag tag-blue">📊 Non-Incentivised Traffic</span>
          </div>
        </div>

        <div class="slide-card stage-card" id="brand-card-2">
          <div class="slide-card-header">
            <span class="card-badge" style="background:#FEF2F2; color:#F5333F;">Negative Shield</span>
            <h2 class="slide-card-title">Hard Disqualification Gates</h2>
          </div>
          <ul class="slide-card-bullets">
            <li><span class="bullet-cross">✕</span> <span><strong>Voucher Aggregators &amp; Toolbars:</strong> Zero margin coupon hijackers.</span></li>
            <li><span class="bullet-cross">✕</span> <span><strong>Direct Rivals:</strong> Instant disqualification for ${profile.competitors[0]}.</span></li>
            <li><span class="bullet-cross">✕</span> <span><strong>Territory Gate:</strong> UK traffic only; strict ASA regulations.</span></li>
            <li><span class="bullet-cross">✕</span> <span><strong>Brand Bidding:</strong> Prohibit trademark ad hijackers and direct redirects.</span></li>
          </ul>

          <div class="brand-visual-grid">
            <div class="brand-metric-pill-box" style="border-left:3px solid #DC2626;">
              <span class="metric-label" style="color:#B91C1C;">Hard Knockout Floor</span>
              <span class="metric-value-lg" style="color:#DC2626;">0.00 EV</span>
              <span class="metric-sub">Multiplicative Zero-Gate</span>
            </div>
            <div class="brand-metric-pill-box" style="border-left:3px solid #DC2626;">
              <span class="metric-label" style="color:#B91C1C;">Exclusion Filters</span>
              <span class="metric-value-lg" style="color:#DC2626;">3 Gates</span>
              <span class="metric-sub">Vouchers &bull; Rivals &bull; Non-UK</span>
            </div>
          </div>

          <div class="brand-seeds-table" style="border-color:#FECACA; background:#FFF5F5;">
            <div class="seed-row-header" style="color:#991B1B;">
              <span>Active Negative Exclusions</span>
              <span class="seed-badge" style="background:#FEE2E2; color:#DC2626;">Enforced</span>
            </div>
            <div class="seed-chips-cluster">
              <span class="seed-chip" style="border-color:#FCA5A5; color:#991B1B; background:#FFF;">🚫 Voucher / Toolbars</span>
              <span class="seed-chip" style="border-color:#FCA5A5; color:#991B1B; background:#FFF;">🚫 Direct Rival (${profile.competitors[0]})</span>
              <span class="seed-chip" style="border-color:#FCA5A5; color:#991B1B; background:#FFF;">🚫 Non-UK / Compliance</span>
            </div>
          </div>

          <div class="slide-tag-row">
            <span class="slide-mini-tag tag-red">⛔ No Voucher Aggregators</span>
            <span class="slide-mini-tag tag-red">⛔ Zero Direct Competitors</span>
            <span class="slide-mini-tag tag-red">⛔ UK Traffic Only</span>
          </div>
        </div>
      </div>
    `;

  } else if (key === 'math') {
    container.innerHTML = `
      <div class="slide-hero">
        <h1 class="slide-headline">Deterministic Expected Value Scoring (estimated_value.md)</h1>
        <p class="slide-subheadline">
          Replacing affiliate manager gut-feel and model hallucination with multiplicative geometric mean arithmetic.
        </p>
      </div>

      <div class="slider-widget-container stage-card" id="math-slider-widget" style="height:100%; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box;">
        <div>
          <div class="slider-widget-header" style="justify-content:space-between; margin-bottom:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="card-badge" style="background:#EBF4FC; color:#298DDA;">Deterministic Calibration</span>
              <h2 class="slider-widget-title" style="font-size:16px;">Geometric Mean Normalisation Weights (Sum Strictly = 1.00)</h2>
            </div>
            <span class="slide-mini-tag tag-blue">Live Interactive Model</span>
          </div>
          
          <div class="formula-live-readout" id="formula-live-math" style="padding:10px 20px; font-size:clamp(1.15rem, 1.3cqw, 1.7rem); margin-bottom:8px;">
            EV = (Relevance<sup>${scoringWeights.r.toFixed(2)}</sup>) &times; (Scale<sup>${scoringWeights.s.toFixed(2)}</sup>) &times; (Commercial<sup>${scoringWeights.c.toFixed(2)}</sup>)
          </div>

          <div class="slider-dials-row" style="gap:12px; margin-top:2px;">
            <div class="slider-dial-box dial-r" style="padding:10px 14px; gap:6px;">
              <div class="slider-dial-label" style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:13px; font-weight:700;">Relevance (wR)</span>
                <span class="slider-val-tag" id="weight-val-r" style="font-size:13px; padding:1px 6px;">${scoringWeights.r.toFixed(2)}</span>
              </div>
              <input type="range" class="weight-slider-input" id="slider-r" min="0.10" max="0.80" step="0.05" value="${scoringWeights.r.toFixed(2)}" style="width:100%; cursor:pointer; margin:4px 0; background:linear-gradient(to right, #298DDA 0%, #298DDA ${(scoringWeights.r * 100).toFixed(0)}%, #E2E8F0 ${(scoringWeights.r * 100).toFixed(0)}%, #E2E8F0 100%);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                <button type="button" class="weight-step-btn" data-dial="r" data-delta="-0.05" style="border:1px solid #CBD5E1; background:#FFF; border-radius:4px; padding:2px 8px; font-size:12px; font-weight:700; cursor:pointer;">-</button>
                <span style="font-size:11.5px; color:#64748B;">Category alignment</span>
                <button type="button" class="weight-step-btn" data-dial="r" data-delta="0.05" style="border:1px solid #CBD5E1; background:#FFF; border-radius:4px; padding:2px 8px; font-size:12px; font-weight:700; cursor:pointer;">+</button>
              </div>
            </div>

            <div class="slider-dial-box dial-s" style="padding:10px 14px; gap:6px;">
              <div class="slider-dial-label" style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:13px; font-weight:700;">Scale (wS)</span>
                <span class="slider-val-tag" id="weight-val-s" style="font-size:13px; padding:1px 6px;">${scoringWeights.s.toFixed(2)}</span>
              </div>
              <input type="range" class="weight-slider-input" id="slider-s" min="0.10" max="0.80" step="0.05" value="${scoringWeights.s.toFixed(2)}" style="width:100%; cursor:pointer; margin:4px 0; background:linear-gradient(to right, #F59E0B 0%, #F59E0B ${(scoringWeights.s * 100).toFixed(0)}%, #E2E8F0 ${(scoringWeights.s * 100).toFixed(0)}%, #E2E8F0 100%);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                <button type="button" class="weight-step-btn" data-dial="s" data-delta="-0.05" style="border:1px solid #CBD5E1; background:#FFF; border-radius:4px; padding:2px 8px; font-size:12px; font-weight:700; cursor:pointer;">-</button>
                <span style="font-size:11.5px; color:#64748B;">Audience volume</span>
                <button type="button" class="weight-step-btn" data-dial="s" data-delta="0.05" style="border:1px solid #CBD5E1; background:#FFF; border-radius:4px; padding:2px 8px; font-size:12px; font-weight:700; cursor:pointer;">+</button>
              </div>
            </div>

            <div class="slider-dial-box dial-c" style="padding:10px 14px; gap:6px;">
              <div class="slider-dial-label" style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:13px; font-weight:700;">Commercial (wC)</span>
                <span class="slider-val-tag" id="weight-val-c" style="font-size:13px; padding:1px 6px;">${scoringWeights.c.toFixed(2)}</span>
              </div>
              <input type="range" class="weight-slider-input" id="slider-c" min="0.10" max="0.80" step="0.05" value="${scoringWeights.c.toFixed(2)}" style="width:100%; cursor:pointer; margin:4px 0; background:linear-gradient(to right, #10B981 0%, #10B981 ${(scoringWeights.c * 100).toFixed(0)}%, #E2E8F0 ${(scoringWeights.c * 100).toFixed(0)}%, #E2E8F0 100%);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                <button type="button" class="weight-step-btn" data-dial="c" data-delta="-0.05" style="border:1px solid #CBD5E1; background:#FFF; border-radius:4px; padding:2px 8px; font-size:12px; font-weight:700; cursor:pointer;">-</button>
                <span style="font-size:11.5px; color:#64748B;">Affiliate readiness</span>
                <button type="button" class="weight-step-btn" data-dial="c" data-delta="0.05" style="border:1px solid #CBD5E1; background:#FFF; border-radius:4px; padding:2px 8px; font-size:12px; font-weight:700; cursor:pointer;">+</button>
              </div>
            </div>
          </div>
        </div>

        <div class="slide-grid-2" id="math-grid-cards" style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:clamp(8px, 1.2vh, 14px); flex:1;">
          <div class="slide-card stage-card" id="math-card-1" style="box-shadow:none; border:1px solid #E2E8F0; padding:12px 16px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="slide-card-header" style="margin-bottom:6px;">
                <span class="card-badge" style="background:#FEF2F2; color:#F5333F;">Zero-Tolerance</span>
                <h2 class="slide-card-title" style="font-size:15px;">The Zero Rule: Multiplicative Knockout</h2>
              </div>
              <ul class="slide-card-bullets" style="gap:4px; margin-bottom:8px;">
                <li><span class="bullet-cross">✕</span> <span><strong>The Additive Flaw:</strong> Addition allows coupon scrapers to score 10/15 (67%) with 0 category relevance.</span></li>
                <li><span class="bullet-arrow">&rarr;</span> <span><strong>The Multiplicative Knockout:</strong> If <em>any</em> metric is 0 (wrong category, coupon site), EV drops to <strong>0.00 instantly</strong>.</span></li>
              </ul>
            </div>
            <div class="math-compare-box" style="padding:10px 14px; margin-top:4px;">
              <div><span style="color:#059669; font-weight:700;">Content Partner (R:5, S:4, C:4):</span> <span id="live-content-partner-ev">(5<sup>0.40</sup>) &times; (4<sup>0.30</sup>) &times; (4<sup>0.30</sup>) = <strong>4.37</strong></span></div>
              <div style="margin-top:4px;"><span style="color:#DC2626; font-weight:700;">Coupon Scraper (R:0, S:5, C:5):</span> <span id="live-coupon-scraper-ev">(0<sup>0.40</sup>) &times; (5<sup>0.30</sup>) &times; (5<sup>0.30</sup>) = <strong>0.00 Knockout</strong></span></div>
            </div>
          </div>

          <div class="slide-card stage-card" id="math-card-2" style="box-shadow:none; border:1px solid #E2E8F0; padding:12px 16px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="slide-card-header" style="margin-bottom:6px;">
                <span class="card-badge" style="background:#ECFDF5; color:#10B981;">0 to 5 Anchors</span>
                <h2 class="slide-card-title" style="font-size:15px;">Standardised Scoring Rules</h2>
              </div>
              <ul class="slide-card-bullets" style="gap:4px; margin-bottom:8px;">
                <li><span class="bullet-check">&check;</span> <span><strong>Relevance (R):</strong> 5 = Direct match answering NeedScope; 0 = Wrong vertical knockout.</span></li>
                <li><span class="bullet-check">&check;</span> <span><strong>Scale (S):</strong> 5 = High national authority; 0 = Dead domain or inactive.</span></li>
                <li><span class="bullet-check">&check;</span> <span><strong>Commercial Fit (C):</strong> 5 = Active buying guides; 0 = Charity / NHS / Non-commercial.</span></li>
              </ul>
            </div>
            <div class="scoring-tiers-box" style="padding:10px 14px; margin-top:4px;">
              <div style="display:flex; align-items:center; gap:8px;"><span class="slide-mini-tag tag-green" style="font-size:11px; font-weight:800; padding:2px 8px;">EV &ge; 3.80</span> <span><strong>Tier 1:</strong> High-touch recruitment outreach.</span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span class="slide-mini-tag tag-blue" style="font-size:11px; font-weight:800; padding:2px 8px;">3.00 &le; EV &lt; 3.80</span> <span><strong>Tier 2:</strong> Automated outreach nurture track.</span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span class="slide-mini-tag tag-red" style="font-size:11px; font-weight:800; padding:2px 8px;">EV &lt; 3.00</span> <span><strong>Disqualified:</strong> Automatically rejected by gate.</span></div>
            </div>
          </div>
        </div>
      </div>
    `;
    updateSliderDialsUI();
    updateLiveEVMath();
    bindMathListeners();

  } else if (key === 'discovery') {
    container.innerHTML = `
      <div class="slide-hero">
        <h1 class="slide-headline">Dual-Engine Search Architecture (discovery.md)</h1>
        <p class="slide-subheadline">
          Embedding Kantar's NeedScope and Google's Messy Middle into natural unbranded question stems.
        </p>
      </div>

      <div class="discovery-tri-wrapper" id="discovery-wrapper">
        <!-- Left Wing: Loop 1 Kantar NeedScope Matrix (Expanded from Left Loop) -->
        <div class="slide-card stage-card discovery-wing discovery-wing-amber" id="discovery-wing-left">
          <div class="discovery-wing-header">
            <span class="card-badge" style="background:#FEF3C7; color:#B45309;">Loop 1 &bull; Expansive Foraging</span>
            <h2 class="slide-card-title" style="font-size:clamp(13px, 1.05cqw, 15px); color:#92400E;">Kantar NeedScope Matrix</h2>
          </div>
          <div class="discovery-wing-sub">6 Emotional search vectors intercepting unbranded problem queries:</div>
          <div class="kantar-wing-grid">
            <div class="kantar-wing-chip">
              <div class="kantar-wing-bar" style="background:#3B82F6;">Educate Me &bull; Competence</div>
              <div class="kantar-wing-body">
                Analytical validation &amp; lab teardown data.
                <div class="kantar-wing-query">"what is the difference between [CAT_A] and [CAT_B]"</div>
              </div>
            </div>
            <div class="kantar-wing-chip">
              <div class="kantar-wing-bar" style="background:#EA580C;">Help Me &bull; Simplicity</div>
              <div class="kantar-wing-body">
                Plain-language filtering; removes decision jargon.
                <div class="kantar-wing-query">"how do I choose between [SUB_CAT] for [CONTEXT]"</div>
              </div>
            </div>
            <div class="kantar-wing-chip">
              <div class="kantar-wing-bar" style="background:#B45309;">Reassure Me &bull; Security</div>
              <div class="kantar-wing-body">
                Durability validation, long-term wear &amp; safety tests.
                <div class="kantar-wing-query">"how can I tell if [CAT] is good quality"</div>
              </div>
            </div>
            <div class="kantar-wing-chip">
              <div class="kantar-wing-bar" style="background:#8B5CF6;">Impress Me &bull; Status</div>
              <div class="kantar-wing-body">
                Professional-tier gear &amp; elite trade benchmarks.
                <div class="kantar-wing-query">"who makes the best [SUB_CAT] for [AUDIENCE]"</div>
              </div>
            </div>
            <div class="kantar-wing-chip">
              <div class="kantar-wing-bar" style="background:#EF4444;">Thrill Me &bull; Vitality</div>
              <div class="kantar-wing-body">
                Novel drops, bleeding-edge releases &amp; trends.
                <div class="kantar-wing-query">"what are the top new [SUB_CAT] trends 2026"</div>
              </div>
            </div>
            <div class="kantar-wing-chip">
              <div class="kantar-wing-bar" style="background:#D97706;">Surprise Me &bull; Ingenuity</div>
              <div class="kantar-wing-body">
                Lateral problem hacks &amp; unconventional use cases.
                <div class="kantar-wing-query">"what is the best way to [UNCONVENTIONAL_USE] [CAT]"</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Center Column: Square Infinity Decision Engine -->
        <div class="slide-card stage-card discovery-center-card" id="discovery-center-col">
          <div class="discovery-center-header">
            <span class="card-badge" style="background:#0F172A; color:#38BDF8; font-size:10px;">Macro Decision Engine</span>
            <div style="font-size:11.5px; font-weight:700; color:#334155; margin-top:2px;">Google "Messy Middle" Model</div>
          </div>

          <svg viewBox="0 0 360 360" class="discovery-square-svg" id="discovery-lemniscate-svg">
            <!-- Exposure Boundary Circle -->
            <circle cx="180" cy="180" r="165" fill="none" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="4,4" />
            <text x="180" y="32" font-size="10" font-weight="800" text-anchor="middle" fill="#94A3B8" letter-spacing="2">EXPOSURE</text>

            <!-- Triggers Vector -->
            <path d="M 180,38 L 180,180" fill="none" stroke="#F5333F" stroke-width="2.5" />
            <circle cx="180" cy="38" r="4.5" fill="#F5333F" />
            <text x="180" y="24" font-size="10.5" font-weight="800" text-anchor="middle" fill="#0F172A" letter-spacing="1.5">TRIGGERS</text>

            <!-- Infinite Background Track -->
            <path d="M 180,180 C 145,110 55,100 35,180 C 15,260 125,270 180,180 C 235,90 325,100 345,180 C 365,260 255,270 180,180 Z" 
                  fill="none" stroke="#F1F5F9" stroke-width="14" />

            <!-- Loop 1: Exploration (Amber) -->
            <g id="svg-loop-1" class="svg-loop-group">
              <path d="M 180,180 C 145,110 55,100 35,180 C 15,260 125,270 180,180" 
                    fill="none" stroke="#F59E0B" stroke-width="6" stroke-linecap="round" />
              <text x="100" y="166" font-size="14" font-weight="800" text-anchor="middle" fill="#0F172A">Exploration</text>
              <rect x="42" y="178" width="116" height="20" rx="10" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.2" />
              <text x="100" y="189" font-size="8.5" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="#B45309" letter-spacing="0.5">LOOP 1: NEEDSCOPE</text>
            </g>

            <!-- Loop 2: Evaluation (Emerald) -->
            <g id="svg-loop-2" class="svg-loop-group">
              <path d="M 180,180 C 235,90 325,100 345,180 C 365,260 255,270 180,180" 
                    fill="none" stroke="#10B981" stroke-width="6" stroke-linecap="round" />
              <text x="260" y="166" font-size="14" font-weight="800" text-anchor="middle" fill="#0F172A">Evaluation</text>
              <rect x="200" y="178" width="120" height="20" rx="10" fill="#ECFDF5" stroke="#10B981" stroke-width="1.2" />
              <text x="260" y="189" font-size="8.5" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="#065F46" letter-spacing="0.5">LOOP 2: 6 HEURISTICS</text>
            </g>

            <!-- Orbiting Beam Light -->
            <path d="M 180,180 C 145,110 55,100 35,180 C 15,260 125,270 180,180 C 235,90 325,100 345,180 C 365,260 255,270 180,180 Z" 
                  fill="none" stroke="#FFFFFF" stroke-width="5" pathLength="1000" stroke-dasharray="140 860" stroke-linecap="round" 
                  style="animation: beamOrbit 3.5s linear infinite; filter: drop-shadow(0 2px 4px rgba(41, 141, 218, 0.5));" />

            <!-- Purchase Exit Vector -->
            <path d="M 180,180 L 180,315" fill="none" stroke="#2563EB" stroke-width="2" stroke-dasharray="3,3" />
            <circle cx="180" cy="315" r="11" fill="none" stroke="#2563EB" stroke-dasharray="3,3" />
            <circle cx="180" cy="315" r="3.5" fill="#2563EB" />
            <text x="180" y="340" font-size="10" font-weight="800" text-anchor="middle" fill="#0F172A" letter-spacing="1">PURCHASE</text>
          </svg>

          <div class="discovery-center-caption">
            Consumers explore and evaluate in the Messy Middle until cognitive shortcuts trigger purchase.
          </div>
        </div>

        <!-- Right Wing: Loop 2 Behavioural Economics Heuristics (Expanded from Right Loop) -->
        <div class="slide-card stage-card discovery-wing discovery-wing-green" id="discovery-wing-right">
          <div class="discovery-wing-header">
            <span class="card-badge" style="background:#ECFDF5; color:#065F46;">Loop 2 &bull; Reductive Evaluation</span>
            <h2 class="slide-card-title" style="font-size:clamp(13px, 1.05cqw, 15px); color:#065F46;">6 Decision Heuristics</h2>
          </div>
          <div class="discovery-wing-sub">6 Cognitive shortcuts prompting checkout commitment:</div>
          <div class="kantar-wing-grid">
            <div class="kantar-wing-chip">
              <div class="kantar-wing-bar" style="background:#0284C7;">Authority Bias</div>
              <div class="kantar-wing-body">
                Delegation to recognised institutions &amp; testing labs.
                <div class="kantar-wing-query">"who is the top recommended [CAT] [AUTHORITY]"</div>
              </div>
            </div>
            <div class="kantar-wing-chip">
              <div class="kantar-wing-bar" style="background:#059669;">Social Proof</div>
              <div class="kantar-wing-body">
                Community consensus &amp; Reddit forum validation.
                <div class="kantar-wing-query">"what's the best rated [CAT] reviews reddit"</div>
              </div>
            </div>
            <div class="kantar-wing-chip">
              <div class="kantar-wing-bar" style="background:#7C3AED;">Category Heuristics</div>
              <div class="kantar-wing-body">
                Proxy specifications evaluating build quality.
                <div class="kantar-wing-query">"who has the best [HEURISTIC] [CAT]"</div>
              </div>
            </div>
            <div class="kantar-wing-chip">
              <div class="kantar-wing-bar" style="background:#D97706;">Power of Free</div>
              <div class="kantar-wing-body">
                Disproportionate pull of complimentary trials &amp; shipping.
                <div class="kantar-wing-query">"how do I get free delivery for [BRAND]"</div>
              </div>
            </div>
            <div class="kantar-wing-chip">
              <div class="kantar-wing-bar" style="background:#DC2626;">Scarcity Bias</div>
              <div class="kantar-wing-body">
                Diminishing stock availability &amp; release urgency.
                <div class="kantar-wing-query">"[SUB_CAT] restock alert UK release date"</div>
              </div>
            </div>
            <div class="kantar-wing-chip">
              <div class="kantar-wing-bar" style="background:#475569;">Power of Now</div>
              <div class="kantar-wing-body">
                Immediate dispatch &amp; local next-day delivery.
                <div class="kantar-wing-query">"who can deliver [SUB_CAT] tomorrow [GEO]"</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

  } else if (key === 'skill') {
    container.innerHTML = `
      <div class="slide-hero">
        <h1 class="slide-headline">The Master Controller Skill (SKILL.md)</h1>
        <p class="slide-subheadline">
          Transforming prompt engineering into an autonomous production pipeline with deterministic quality gates.
        </p>
      </div>

      <div class="pipeline-grid" id="skill-pipeline-bar">
        <div class="pipeline-step-card active-phase" id="pipe-card-1">
          <span class="pipeline-step-num">Phase 1</span>
          <div class="pipeline-step-title">Ingest References</div>
          <div class="pipeline-step-desc">Load brand rules, normalise EV weights, and parse unbranded question stems.</div>
        </div>

        <div class="pipeline-step-card locked" id="pipe-card-2">
          <span class="pipeline-step-num">Phase 2 &bull; MANDATORY</span>
          <div class="pipeline-step-title">The Step 1 HALT Gate</div>
          <div class="pipeline-step-desc">Agent MUST halt and demand existing partner domains before searching. Prevents pitching current affiliates.</div>
        </div>

        <div class="pipeline-step-card locked" id="pipe-card-3">
          <span class="pipeline-step-num">Phase 3</span>
          <div class="pipeline-step-title">Dual-Engine Search</div>
          <div class="pipeline-step-desc">Run unbranded query loops; enforce negative exclusion filters on coupon aggregators.</div>
        </div>

        <div class="pipeline-step-card locked" id="pipe-card-4">
          <span class="pipeline-step-num">Phase 4</span>
          <div class="pipeline-step-title">Multiplicative EV &amp; Export</div>
          <div class="pipeline-step-desc">Compute math scores with zero-knockouts; format auditable table and recruitment CSV ledger.</div>
        </div>
      </div>

      <div class="arch-pill-grid" id="skill-arch-grid">
        <div class="arch-pill-card">
          <div class="arch-pill-header">
            <span class="arch-pill-file">SKILL.md</span>
            <span class="arch-pill-role" style="background:#EBF4FC; color:#298DDA;">The Brain</span>
          </div>
          <div class="arch-pill-desc">Master controller directing search, screen, score, and export pipelines.</div>
        </div>
        <div class="arch-pill-card">
          <div class="arch-pill-header">
            <span class="arch-pill-file">references/</span>
            <span class="arch-pill-role" style="background:#F1F5F9; color:#475569;">The Memory Bank</span>
          </div>
          <div class="arch-pill-desc">Modular business rules separate from prompts; swap brands without touching core logic.</div>
        </div>
        <div class="arch-pill-card">
          <div class="arch-pill-header">
            <span class="arch-pill-file">brand.md</span>
            <span class="arch-pill-role" style="background:#FEE2E2; color:#DC2626;">The Guardrails</span>
          </div>
          <div class="arch-pill-desc">Operational boundaries, target AOV baselines, and negative exclusion filters.</div>
        </div>
        <div class="arch-pill-card">
          <div class="arch-pill-header">
            <span class="arch-pill-file">estimated_value.md</span>
            <span class="arch-pill-role" style="background:#FEF3C7; color:#B45309;">The Calibrator</span>
          </div>
          <div class="arch-pill-desc">Deterministic scoring engine eliminating subjective bias with zero-knockout proofs.</div>
        </div>
        <div class="arch-pill-card">
          <div class="arch-pill-header">
            <span class="arch-pill-file">discovery.md</span>
            <span class="arch-pill-role" style="background:#ECFDF5; color:#059669;">The Compass</span>
          </div>
          <div class="arch-pill-desc">Natural-language search stems intercepting active purchase research in the Messy Middle.</div>
        </div>
      </div>

      <div class="slide-grid-2" id="skill-detail-cards" style="margin-top:8px; display:none;">
        <div class="slide-card stage-card" id="skill-card-1">
          <div class="slide-card-header">
            <span class="card-badge" style="background:#FEF2F2; color:#F5333F;">Safety Gate</span>
            <h2 class="slide-card-title">Why the HALT Gate is Non-Negotiable</h2>
          </div>
          <ul class="slide-card-bullets">
            <li><span class="bullet-arrow">&rarr;</span> <span><strong>The Cannibalisation Risk:</strong> Without an explicit pause gate, the AI immediately searches Google and recommends publishers you already have under active contract.</span></li>
            <li><span class="bullet-arrow">&rarr;</span> <span><strong>Hard Breakpoint Enforcement:</strong> Claude is strictly instructed to stop execution at Step 1 and wait for human input before firing a search query.</span></li>
            <li><span class="bullet-arrow">&rarr;</span> <span><strong>Zero-Leakage Guarantee:</strong> Discovered domains are cross-referenced against your active roster, ensuring 100% of candidates are net-new opportunities.</span></li>
          </ul>
        </div>

        <div class="slide-card stage-card" id="skill-card-2">
          <div class="slide-card-header">
            <span class="card-badge" style="background:#ECFDF5; color:#10B981;">Transparency</span>
            <h2 class="slide-card-title">Auditable Mathematical Breakdown &amp; Export Schema</h2>
          </div>
          <ul class="slide-card-bullets">
            <li><span class="bullet-check">&check;</span> <span><strong>No Black Boxes:</strong> Every score is published with the complete geometric mean formula visible: <code>(5^0.4) * (4^0.3) * (4^0.3) = 4.37</code>.</span></li>
            <li><span class="bullet-check">&check;</span> <span><strong>Manager Verification:</strong> Partnership leads can inspect every sub-score (R, S, C) to ensure alignment with brand standards.</span></li>
            <li><span class="bullet-check">&check;</span> <span><strong>Deterministic Knockout Audit:</strong> Zero scores in Relevance or Commercial fit immediately fail the candidate with auditable justification.</span></li>
          </ul>
        </div>
      </div>
    `;

  } else if (key === 'run') {
    const candidateRows = profile.candidates.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.niche}</td>
        <td>${c.r}</td>
        <td>${c.s}</td>
        <td>${c.c}</td>
        <td><strong style="color:${c.ev > 0 ? '#059669' : '#DC2626'};">${c.ev.toFixed(2)}</strong></td>
        <td><span class="slide-mini-tag ${c.ev > 0 ? 'tag-green' : 'tag-red'}">${c.status}</span></td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="slide-hero">
        <h1 class="slide-headline">Deploy &amp; Verify (Autonomous Ledger)</h1>
        <p class="slide-subheadline">
          Executing the runtime prompt in Claude or your LLM workspace to generate an auditable recruitment ledger.
        </p>
      </div>

      <div class="slide-grid-2" id="run-grid">
        <div class="slide-card stage-card" id="run-card-1">
          <div class="slide-card-header">
            <span class="card-badge" style="background:#EBF4FC; color:#298DDA;">Deployment</span>
            <h2 class="slide-card-title">Single-Prompt Autonomous Orchestration</h2>
          </div>
          
          <div class="runtime-command-banner">
            <div class="runtime-command-label">Runtime Trigger Command (SKILL.md)</div>
            <div class="runtime-command-code">
              Execute skill <strong>affiliate-partner-discovery</strong> from <code>SKILL.md</code> using <code>/references/</code>.<br>
              Start with Step 1 (Read the Rules and Stop).
            </div>
          </div>

          <ul class="slide-card-bullets" style="margin-top:12px;">
            <li><span class="bullet-check">✓</span> <span><strong>Deterministic Context Ingestion:</strong> The agent loads vertical parameters, locks AOV bounds, and ingests competitor baselines from local Markdown.</span></li>
            <li><span class="bullet-check">✓</span> <span><strong>Mandatory Step 1 HALT Gate:</strong> Autonomous execution halts immediately, prompting the operator for domain exclusions before running web searches.</span></li>
            <li><span class="bullet-check">✓</span> <span><strong>Dual-Engine Interception:</strong> Runs NeedScope query loops and behavioural heuristics, scoring candidates via geometric mean.</span></li>
          </ul>
        </div>

        <div class="slide-card stage-card" id="run-card-2">
          <div class="slide-card-header" style="justify-content:space-between;">
            <span class="card-badge" style="background:#ECFDF5; color:#10B981;">Commercial Output</span>
            <span class="slide-mini-tag tag-green">✓ Multiplicative EV Verified</span>
          </div>
          <h2 class="slide-card-title" style="margin-bottom:6px;">Audited Recruitment Ledger (${profile.name})</h2>
          <table class="ledger-preview-table">
            <thead>
              <tr>
                <th>Publisher Candidate</th>
                <th>Vertical Match</th>
                <th>R</th>
                <th>S</th>
                <th>C</th>
                <th>EV</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${candidateRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Stage 1: Comparison Scorecard -->
      <div id="run-scorecard-container" style="display:none; width:100%; flex-direction:column; gap:16px;">
        <div class="scorecard-grid">
          <div class="scorecard-box scorecard-traditional">
            <div class="scorecard-header">
              <span class="scorecard-title">Traditional Manual Search</span>
              <span class="scorecard-badge" style="color:#DC2626; background:#FEE2E2;">Status Quo</span>
            </div>
            <ul class="scorecard-steps">
              <li>⏱️ <strong>15–20 Hours / Month:</strong> Manual Google trawling, social scraping, and messy spreadsheets.</li>
              <li>🔍 <strong>Brand-Out Search:</strong> Surfaces coupon toolbars and existing mass-media retainers.</li>
              <li>📉 <strong>Margin Dilution:</strong> Zero incremental reach, severe partner recruitment fatigue.</li>
            </ul>
          </div>

          <div class="scorecard-box scorecard-autonomous">
            <div class="scorecard-header">
              <span class="scorecard-title">Autonomous Skill Interception</span>
              <span class="scorecard-badge" style="color:#059669; background:#D1FAE5;">Production Standard</span>
            </div>
            <ul class="scorecard-steps">
              <li>⚡ <strong>&lt;90 Seconds Execution:</strong> Deterministic pipeline runs end-to-end with one trigger prompt.</li>
              <li>🎯 <strong>Consumer-In Interception:</strong> NeedScope and 6 heuristics intercept uncommitted buyers.</li>
              <li>🚀 <strong>High-Margin Reach:</strong> Discovers specialist creators, educators, and review desks.</li>
            </ul>
          </div>
        </div>

        <div class="next-steps-bar">
          <div class="next-step-pill">
            <span class="next-step-num">1</span>
            <div>
              <div class="next-step-heading">1-Click CSV Export</div>
              <div class="next-step-desc">Export vetted partner domains directly into your recruitment CRM.</div>
            </div>
          </div>
          <div class="next-step-pill">
            <span class="next-step-num">2</span>
            <div>
              <div class="next-step-heading">Load to Claude Projects</div>
              <div class="next-step-desc">Persist partner-discovery/ as a permanent organizational asset.</div>
            </div>
          </div>
          <div class="next-step-pill">
            <span class="next-step-num">3</span>
            <div>
              <div class="next-step-heading">Weekly Vertical Sprints</div>
              <div class="next-step-desc">Execute iterative recruitment across newly launched categories.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stage 2: Masterclass Completion Ticklist & Enterprise Expansions -->
      <div id="run-ticklist-container" class="slide-grid-2" style="display:none; height:100%; box-sizing:border-box;">
        <div class="slide-card stage-card focused" id="ticklist-left-card" style="display:flex; flex-direction:column; justify-content:space-between; height:100%; box-sizing:border-box;">
          <div>
            <div class="slide-card-header" style="justify-content:space-between; margin-bottom:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="card-badge" style="background:#ECFDF5; color:#059669;">Architecture Built</span>
                <h2 class="slide-card-title" style="font-size:16px;">Workshop Completion Ticklist</h2>
              </div>
              <span class="slide-mini-tag tag-green">6 Modules Verified</span>
            </div>
            <p style="font-size:14px; color:#475569; margin:0 0 10px 0;">All 6 deterministic governance components successfully constructed and validated:</p>
            <div class="ticklist-items-stack" style="display:flex; flex-direction:column; gap:6px;">
              <div class="ticklist-row">
                <span class="ticklist-check">✓</span>
                <div>
                  <div class="ticklist-title"><code>references/brand.md</code> &bull; Commercial Guardrails</div>
                  <div class="ticklist-desc">AOV benchmarks, CPA model, and Negative Shield (zero-knockout for scrapers &amp; direct rivals).</div>
                </div>
              </div>
              <div class="ticklist-row">
                <span class="ticklist-check">✓</span>
                <div>
                  <div class="ticklist-title"><code>references/estimated_value.md</code> &bull; Deterministic EV Math</div>
                  <div class="ticklist-desc">Geometric mean formula EV = (R^wR)*(S^wS)*(C^wC) with 0-5 anchors and zero-tolerance knockout.</div>
                </div>
              </div>
              <div class="ticklist-row">
                <span class="ticklist-check">✓</span>
                <div>
                  <div class="ticklist-title"><code>references/discovery.md</code> &bull; Dual-Engine Search Loops</div>
                  <div class="ticklist-desc">Kantar NeedScope (6 emotional states) and Google Messy Middle (6 decision heuristics).</div>
                </div>
              </div>
              <div class="ticklist-row">
                <span class="ticklist-check">✓</span>
                <div>
                  <div class="ticklist-title"><code>SKILL.md</code> &bull; Master Controller Pipeline</div>
                  <div class="ticklist-desc">4-phase execution engine with Mandatory Step 1 HALT Gate preventing partner cannibalisation.</div>
                </div>
              </div>
              <div class="ticklist-row">
                <span class="ticklist-check">✓</span>
                <div>
                  <div class="ticklist-title">Recruitment CRM Ledger &bull; Auditable Schema</div>
                  <div class="ticklist-desc">Markdown breakdown table and copy-paste CSV block ready for direct CRM import.</div>
                </div>
              </div>
              <div class="ticklist-row">
                <span class="ticklist-check">✓</span>
                <div>
                  <div class="ticklist-title">Desktop Directive Storage &bull; Local Bounded Architecture</div>
                  <div class="ticklist-desc">Replaced fragile conversational prompts with reusable, version-controlled Markdown files.</div>
                </div>
              </div>
            </div>
          </div>
          <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:6px; padding:8px 12px; display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
            <span style="font-size:12px; font-weight:800; color:#166534;">🎉 Production Skill Ready for Immediate Deployment</span>
            <span class="slide-mini-tag tag-green">Zero Prompt Hallucination</span>
          </div>
        </div>

        <div class="slide-card stage-card focused" id="ticklist-right-card" style="display:flex; flex-direction:column; justify-content:space-between; height:100%; box-sizing:border-box;">
          <div>
            <div class="slide-card-header" style="justify-content:space-between; margin-bottom:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="card-badge" style="background:#EBF4FC; color:#0284C7;">Operational Horizons</span>
                <h2 class="slide-card-title" style="font-size:16px;">Suggested Enterprise Expansions</h2>
              </div>
              <span class="slide-mini-tag tag-blue">4 Advanced Upgrades</span>
            </div>
            <p style="font-size:14px; color:#475569; margin:0 0 10px 0;">Scale your autonomous recruitment engine with these enterprise integrations:</p>
            <div class="expansions-grid" style="display:flex; flex-direction:column; gap:8px;">
              <div class="expansion-box">
                <div class="expansion-icon">🌐</div>
                <div>
                  <div class="expansion-heading">Automated Search API (Serper / Tavily)</div>
                  <div class="expansion-text">Wire live SERP API tools directly into Claude or OpenAI to execute query loops and extract organic rankings autonomously.</div>
                </div>
              </div>
              <div class="expansion-box">
                <div class="expansion-icon">📊</div>
                <div>
                  <div class="expansion-heading">Authority Encoders (SimilarWeb / Ahrefs API)</div>
                  <div class="expansion-text">Enrich the Scale (S) metric with verified monthly traffic, Domain Rating, and organic UK geographic share.</div>
                </div>
              </div>
              <div class="expansion-box">
                <div class="expansion-icon">⚡</div>
                <div>
                  <div class="expansion-heading">CRM Webhook Ingestion (HubSpot / Impact.com)</div>
                  <div class="expansion-text">Dispatch scored Tier 1 candidates (EV &ge; 3.80) directly into your recruitment pipeline and email sequences via Zapier.</div>
                </div>
              </div>
              <div class="expansion-box">
                <div class="expansion-icon">🔄</div>
                <div>
                  <div class="expansion-heading">Multi-Vertical Dynamic Presets</div>
                  <div class="expansion-text">Swap brand.md across Retail, SaaS, Travel, and FinTech without altering any discovery stems or scoring logic.</div>
                </div>
              </div>
            </div>
          </div>
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; padding:8px 12px; display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
            <span style="font-size:12px; font-weight:700; color:#334155;">🚀 Next Step: Add to Claude Projects &amp; Schedule Weekly Sprints</span>
            <span class="slide-mini-tag tag-blue">Enterprise Scale</span>
          </div>
        </div>
      </div>
    `;
  }

  applySlideStaging(key, activeSlideStage);
}

// Depth-of-Field Slide Staging
export function applySlideStaging(key, stageIdx) {
  activeSlideStage = stageIdx;

  if (key === 'agenda') {
    const stage0 = document.getElementById('agenda-stage-0');
    if (stage0) {
      stage0.style.display = 'block';
      stage0.className = 'slide-card stage-card focused';
    }

  } else if (key === 'setup') {
    const card1 = document.getElementById('setup-card-1');
    const card2 = document.getElementById('setup-card-2');

    if (stageIdx === 0) {
      if (card1) card1.className = 'slide-card stage-card focused';
      if (card2) card2.className = 'slide-card stage-card blurred';
    } else {
      if (card1) card1.className = 'slide-card stage-card completed';
      if (card2) card2.className = 'slide-card stage-card focused';
    }

  } else if (key === 'brand') {
    const grid = document.getElementById('brand-grid');
    const card1 = document.getElementById('brand-card-1');
    const card2 = document.getElementById('brand-card-2');

    if (grid) grid.style.display = 'grid';
    if (stageIdx === 0) {
      if (card1) card1.className = 'slide-card stage-card focused';
      if (card2) card2.className = 'slide-card stage-card blurred';
    } else {
      if (card1) card1.className = 'slide-card stage-card completed';
      if (card2) card2.className = 'slide-card stage-card focused';
    }

  } else if (key === 'math') {
    const widget = document.getElementById('math-slider-widget');
    const cardsGrid = document.getElementById('math-grid-cards');
    const card1 = document.getElementById('math-card-1');
    const card2 = document.getElementById('math-card-2');

    if (widget) widget.style.display = 'flex';
    if (cardsGrid) cardsGrid.style.display = 'grid';

    if (stageIdx === 0) {
      if (widget) widget.className = 'slider-widget-container stage-card focused';
      if (card1) card1.className = 'slide-card stage-card';
      if (card2) card2.className = 'slide-card stage-card';
    } else {
      if (widget) widget.className = 'slider-widget-container stage-card';
      if (card1) card1.className = 'slide-card stage-card focused';
      if (card2) card2.className = 'slide-card stage-card focused';
    }

  } else if (key === 'discovery') {
    const wingLeft = document.getElementById('discovery-wing-left');
    const wingRight = document.getElementById('discovery-wing-right');
    const loop1 = document.getElementById('svg-loop-1');
    const loop2 = document.getElementById('svg-loop-2');

    if (stageIdx === 0) {
      if (wingLeft) wingLeft.className = 'slide-card stage-card discovery-wing discovery-wing-amber focused';
      if (wingRight) wingRight.className = 'slide-card stage-card discovery-wing discovery-wing-green blurred';
      if (loop1) { loop1.style.opacity = '1.0'; loop1.style.filter = 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.85))'; }
      if (loop2) { loop2.style.opacity = '0.30'; loop2.style.filter = 'none'; }
    } else {
      if (wingLeft) wingLeft.className = 'slide-card stage-card discovery-wing discovery-wing-amber completed';
      if (wingRight) wingRight.className = 'slide-card stage-card discovery-wing discovery-wing-green focused';
      if (loop1) { loop1.style.opacity = '0.30'; loop1.style.filter = 'none'; }
      if (loop2) { loop2.style.opacity = '1.0'; loop2.style.filter = 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.85))'; }
    }

  } else if (key === 'skill') {
    const pipe1 = document.getElementById('pipe-card-1');
    const pipe2 = document.getElementById('pipe-card-2');
    const pipe3 = document.getElementById('pipe-card-3');
    const pipe4 = document.getElementById('pipe-card-4');
    const archGrid = document.getElementById('skill-arch-grid');
    const detailCards = document.getElementById('skill-detail-cards');
    const card1 = document.getElementById('skill-card-1');
    const card2 = document.getElementById('skill-card-2');
    const pipeBar = document.getElementById('skill-pipeline-bar');

    if (pipeBar) { pipeBar.style.display = 'grid'; pipeBar.classList.toggle('compact-bar', stageIdx > 0); }

    if (stageIdx === 0) {
      if (pipe1) pipe1.className = 'pipeline-step-card active-phase';
      if (pipe2) pipe2.className = 'pipeline-step-card locked';
      if (pipe3) pipe3.className = 'pipeline-step-card locked';
      if (pipe4) pipe4.className = 'pipeline-step-card locked';
      if (archGrid) archGrid.style.display = 'grid';
      if (detailCards) detailCards.style.display = 'none';
    } else {
      if (pipe1) pipe1.className = 'pipeline-step-card completed-phase';
      if (pipe2) pipe2.className = 'pipeline-step-card halt-phase-active';
      if (pipe3) pipe3.className = 'pipeline-step-card active-phase';
      if (pipe4) pipe4.className = 'pipeline-step-card active-phase';
      if (archGrid) archGrid.style.display = 'none';
      if (detailCards) detailCards.style.display = 'grid';
      if (card1) card1.className = 'slide-card stage-card completed';
      if (card2) card2.className = 'slide-card stage-card focused';
    }

  } else if (key === 'run') {
    const runGrid = document.getElementById('run-grid');
    const runScorecard = document.getElementById('run-scorecard-container');
    const runTicklist = document.getElementById('run-ticklist-container');
    const card1 = document.getElementById('run-card-1');
    const card2 = document.getElementById('run-card-2');

    if (stageIdx === 0) {
      if (runGrid) runGrid.style.display = 'grid';
      if (runScorecard) runScorecard.style.display = 'none';
      if (runTicklist) runTicklist.style.display = 'none';
      if (card1) card1.className = 'slide-card stage-card focused';
      if (card2) card2.className = 'slide-card stage-card focused';
    } else if (stageIdx === 1) {
      if (runGrid) runGrid.style.display = 'none';
      if (runScorecard) runScorecard.style.display = 'flex';
      if (runTicklist) runTicklist.style.display = 'none';
    } else if (stageIdx === 2) {
      if (runGrid) runGrid.style.display = 'none';
      if (runScorecard) runScorecard.style.display = 'none';
      if (runTicklist) runTicklist.style.display = 'grid';
    }
  }
}

export function setSlideStage(stageIdx) {
  engine.setSlideStage(stageIdx);
}

export function nextSlideStage() {
  const stages = slideStageTitles[activeKey] || [];
  if (activeSlideStage < stages.length - 1) {
    setSlideStage(activeSlideStage + 1);
  } else if (activeKey === 'agenda') {
    loadStep('setup', true);
  } else {
    setSection(0);
  }
}

export function prevSlideStage() {
  if (activeSlideStage > 0) {
    setSlideStage(activeSlideStage - 1);
  }
}

// Progressive Code Chunks Renderer (Instant reveal with fadeInChunk keyframe animation)
export function renderCodeChunks() {
  const chunks = fileSections[activeKey] || [];
  const container = document.getElementById('chunks-list');
  const introCount = document.getElementById('code-intro-count');
  const cData = claudeStepData[activeKey] || claudeStepData.brand;
  const curItem = curriculum[activeKey] || { path: 'references/brand.md' };

  const userPromptEl = document.getElementById('claude-user-prompt-text');
  if (userPromptEl) {
    if (cData.userPromptHtml) {
      userPromptEl.innerHTML = cData.userPromptHtml;
    } else if (userPromptEl.innerText !== cData.userPrompt) {
      userPromptEl.innerText = cData.userPrompt;
    }
  }

  const isAll = (activeSectionIndex === 'all');
  const activeIdx = typeof activeSectionIndex === 'number' ? activeSectionIndex : (isAll ? 'all' : 0);

  const activeChunkObj = (typeof activeIdx === 'number' && chunks[activeIdx]) ? chunks[activeIdx] : null;
  const currentPath = (activeChunkObj && activeChunkObj.pathOverride) ? activeChunkObj.pathOverride : curItem.path;

  const artifactFilename = document.getElementById('artifact-current-filename');
  if (artifactFilename) artifactFilename.innerText = currentPath;
  const artifactBannerTitle = document.getElementById('artifact-embed-title');
  if (artifactBannerTitle) artifactBannerTitle.innerText = `Created Artifact: ${currentPath}`;

  if (!chunks.length) {
    if (container) {
      container.setAttribute('data-step-key', activeKey);
      container.innerHTML = '<div style="color:#8D96A0; padding:20px;">No code chunks configured.</div>';
    }
    return;
  }

  const progressPill = document.getElementById('artifact-progress-pill');
  if (isAll) {
    if (introCount) introCount.innerText = `Assembled File (${chunks.length} parts)`;
    if (progressPill) progressPill.innerText = `Complete File (${chunks.length} parts)`;
  } else {
    const num = typeof activeIdx === 'number' ? activeIdx : 0;
    if (introCount) introCount.innerText = `Revealing chunk in the side-by-side artifact window`;
    if (progressPill) progressPill.innerText = `Part ${num + 1} of ${chunks.length}`;
  }

  let html = '';

  if (isAll) {
    // When viewing the complete file, hide all other step elements and only show the full assembled file
    const rawContent = dynamicBuffer[activeKey] || curItem.content || '';
    const lineCount = rawContent.split('\n').length;
    const isTwoCol = lineCount > 20;
    const colClass = isTwoCol ? 'two-col-layout' : '';

    html = `
      <div class="chunk-card complete-mode ${colClass}" id="chunk-all" style="display: flex; flex-direction: column; height: 100%; min-height: 0; flex: 1;">
        <div class="chunk-header">
          <div class="chunk-title-group">
            <span class="chunk-num chunk-badge-green">Complete File</span>
            <span class="chunk-title">${curItem.path}</span>
          </div>
        </div>
        <div class="chunk-code-area" style="flex: 1; min-height: 0;">
          <pre><code id="chunk-code-all">${escapeHtml(rawContent)}</code></pre>
        </div>
      </div>
    `;
  } else {
    for (let i = 0; i <= activeIdx; i++) {
      const chunk = chunks[i];
      if (!chunk) continue;

      const isCurrentActive = (i === activeIdx);
      const extraCardClass = isCurrentActive ? 'active' : 'completed';
      const pillHtml = `<span class="chunk-num ${isCurrentActive ? 'chunk-badge-blue' : 'chunk-badge-green'}">PART ${i + 1} OF ${chunks.length}</span>`;

      html += `
        <div class="chunk-card ${extraCardClass}" id="chunk-item-${i}" data-chunk-index="${i}">
          <div class="chunk-header">
            <div class="chunk-title-group">
              ${pillHtml}
              <span class="chunk-title">${chunk.title}</span>
            </div>
          </div>
          <div class="chunk-code-area">
            <pre><code id="chunk-code-${i}">${escapeHtml(chunk.code)}</code></pre>
          </div>
          <div class="chunk-footer">
            <strong>Tactical Rationale:</strong>
            <span>${chunk.why}</span>
          </div>
        </div>
      `;
    }
  }

  if (container) {
    container.setAttribute('data-step-key', activeKey);
    container.setAttribute('data-active-index', String(activeSectionIndex));
    container.innerHTML = html;
  }

  scrollToActiveChunk();
}

export function setSection(idx) {
  activeSectionIndex = idx;
  engine.setSection(idx);
  engine.setViewMode('code');
}

function scrollToActiveChunk() {
  const activeEl = document.querySelector('.chunk-card.active') || document.getElementById('chunk-all');
  if (activeEl) {
    activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.warn('Fallback copy failed', err);
  }
  document.body.removeChild(textArea);
}

export function copyCurrentChunkCode() {
  const chunks = fileSections[activeKey] || [];
  const curItem = curriculum[activeKey] || {};
  let textToCopy = '';

  if (activeSectionIndex === 'all') {
    textToCopy = dynamicBuffer[activeKey] || curItem.content || '';
  } else {
    const idx = typeof activeSectionIndex === 'number' ? activeSectionIndex : 0;
    textToCopy = chunks[idx] ? chunks[idx].code : (curItem.content || '');
  }

  if (!textToCopy) return;

  const performFeedback = () => {
    const copyBtn = document.getElementById('artifact-copy-btn');
    if (copyBtn) {
      copyBtn.classList.add('copied');
      const label = document.getElementById('copy-btn-label') || copyBtn.querySelector('span');
      if (label) {
        label.innerText = 'Copied!';
        setTimeout(() => {
          label.innerText = 'Copy Code';
          copyBtn.classList.remove('copied');
        }, 1800);
      } else {
        setTimeout(() => { copyBtn.classList.remove('copied'); }, 1800);
      }
    }
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy)
      .then(performFeedback)
      .catch(() => {
        fallbackCopyText(textToCopy);
        performFeedback();
      });
  } else {
    fallbackCopyText(textToCopy);
    performFeedback();
  }
}

export function advanceSlideOrChunk() {
  engine.next();
}

window.copyCurrentChunkCode = copyCurrentChunkCode;
window.advanceSlideOrChunk = advanceSlideOrChunk;

function bindStageListeners() {
  const copyBtn = document.getElementById('artifact-copy-btn');
  if (copyBtn && !copyBtn.dataset.bound) {
    copyBtn.dataset.bound = 'true';
    copyBtn.addEventListener('click', copyCurrentChunkCode);
  }

  const dockSlide = document.getElementById('dock-btn-slide');
  const dockCode = document.getElementById('dock-btn-code');
  if (dockSlide && !dockSlide.dataset.bound) {
    dockSlide.dataset.bound = 'true';
    dockSlide.addEventListener('click', () => {
      engine.setViewMode('slide');
    });
  }
  if (dockCode && !dockCode.dataset.bound) {
    dockCode.dataset.bound = 'true';
    dockCode.addEventListener('click', () => {
      engine.setViewMode('code');
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindStageListeners);
} else {
  bindStageListeners();
}

// Stage Protection: Suppress accidental context menu and pinch-to-zoom
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

window.addEventListener('wheel', (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

// Keyboard Listeners
window.addEventListener('keydown', (e) => {
  const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
  if ((tag === 'input' && document.activeElement.type !== 'range') || tag === 'textarea') return;

  // Numeric step navigation: 0 -> agenda, 1..6 -> steps 0..5 (setup, brand, math, discovery, skill, run)
  if (e.key === '0') {
    engine.loadStep('agenda', true);
    return;
  }
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= 6) {
    const numberedSteps = ['setup', 'brand', 'math', 'discovery', 'skill', 'run'];
    engine.loadStep(numberedSteps[num - 1], true);
    return;
  } else if (num === 7) {
    engine.loadStep('run', true);
    return;
  }

  if (e.key === 's' || e.key === 'S') {
    engine.setViewMode('slide');
  } else if (e.key === 'c' || e.key === 'C') {
    engine.setViewMode('code');
  } else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
    e.preventDefault();
    engine.next();
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    engine.prev();
  }
});

// Stage Clicker Support: Tapping/clicking anywhere on viewport advances stage or chunk
const workshopViewport = document.getElementById('workshop-viewport') || document.getElementById('stage-viewport');
if (workshopViewport) {
  workshopViewport.addEventListener('click', (e) => {
    if (e.target.closest('button, input, textarea, a, select, .slider-dial-box, .weight-meter-bar, .floating-dock, .console-floating-tray, .sync-status-box, .runtime-command-banner, #chunks-list')) {
      return;
    }
    advanceSlideOrChunk();
  });
}

// Responsive Stage Scale Controller (Uniform 1920x1080 Viewport Geometry)
function syncFooterLogoGradient() {
  const footer = document.querySelector('.presentation-footer');
  const logo = document.querySelector('.footer-logo-affilifest');
  if (!footer || !logo) return;
  const footerRect = footer.getBoundingClientRect();
  const logoRect = logo.getBoundingClientRect();
  const scale = footerRect.width > 0 ? (footerRect.width / 1920) : 1;
  const relativeX = (logoRect.left - footerRect.left) / scale;
  if (relativeX > 0) {
    logo.style.setProperty('--logo-offset-x', `${Math.round(relativeX)}px`);
  }
}

function updateStageScale() {
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  document.documentElement.style.setProperty('--stage-scale', scale.toString());
  syncFooterLogoGradient();
}
window.addEventListener('resize', updateStageScale);
updateStageScale();

// Initialise on Agenda
loadStep('agenda', true);
requestAnimationFrame(syncFooterLogoGradient);

// Claude Navigation Rail & Artifact Pane Maximize
function initClaudeRailControls() {
  const toggleBtn = document.getElementById('rail-btn-toggle');
  const codeLayout = document.querySelector('.code-layout-split');
  if (toggleBtn && codeLayout) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      codeLayout.classList.toggle('chat-collapsed');
    });
  }

  const overviewBtn = document.getElementById('rail-btn-overview');
  if (overviewBtn) {
    overviewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      engine.loadStep('agenda', false);
    });
  }

  ['brand', 'math', 'discovery'].forEach(stepKey => {
    const btn = document.getElementById(`rail-chat-${stepKey}`);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        engine.loadStep(stepKey, false);
      });
    }
  });
}
initClaudeRailControls();


