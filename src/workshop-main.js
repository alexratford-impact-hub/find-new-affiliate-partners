/**
 * TV Projector & Code Console Entry Module (src/workshop-main.js)
 * Coordinates slide staging, typewriter streaming, interactive widgets, and sync bus.
 */

import { stepKeys, curriculum, fileSections, slideStageTitles } from './data/curriculum.js';
import { brandProfiles, brandPresets } from './data/presets.js';
import { claudeStepData } from './data/quips.js';
import { WorkshopSync } from './lib/sync.js';
import { TypewriterStreamer, ThinkingLoop, escapeHtml } from './lib/typewriter.js';
import { SpatialZoomEngine } from './lib/spatial-zoom.js';

// Application State
let activeKey = 'setup';
let activeViewMode = 'slide'; // 'slide' | 'code'
let activeSectionIndex = 0;   // 0..N-1 for chunks, or 'all'
let activeSlideStage = 0;
let activePreset = 'boots';
let icebreakerStep = 0;
let isCodingSprintActive = false;
let codingSprintTimeStr = '00:00';

const dynamicBuffer = {};
for (const k in curriculum) {
  dynamicBuffer[k] = curriculum[k].content;
}

// Engines
const typewriter = new TypewriterStreamer();
const thinkingLoop = new ThinkingLoop('claude-thinking-text');

// Cross-Window Sync Bus
const sync = new WorkshopSync({
  role: 'workshop',
  onConnectionChange: (connected) => {
    const box = document.getElementById('sync-status-box');
    const label = document.getElementById('sync-label');
    if (box) box.classList.toggle('connected', connected);
    if (label) {
      label.innerText = connected ? 'Instructor Console: Connected' : 'Instructor Console: Listening';
    }
    const traySync = document.getElementById('tray-sync-val');
    if (traySync) traySync.innerText = connected ? 'Active' : 'Listening';
    if (typeof spatialZoom !== 'undefined') {
      spatialZoom.updateLiveCapsuleStatus(connected ? 'Console Sync' : 'Sync Listening', connected);
    }
  }
});

// Sync Listeners
sync.on('LOAD_STEP', (data) => {
  if (curriculum[data.key]) {
    loadStep(data.key, true);
  }
});

sync.on('SET_MODE', (data) => {
  if (data.mode === 'slide' || data.mode === 'code') {
    setViewMode(data.mode);
  }
});

sync.on('SET_SLIDE_STAGE', (data) => {
  if (data.key && data.key !== activeKey && curriculum[data.key]) {
    loadStep(data.key, true);
  }
  setSlideStage(data.stage);
});

sync.on('APPLY_PRESET', (data) => {
  if (brandProfiles[data.preset]) {
    applyBrandPreset(data.preset);
  }
});

sync.on('SET_SECTION', (data) => {
  if (data.key && data.key !== activeKey && curriculum[data.key]) {
    loadStep(data.key, false);
  }
  setSection(data.index);
});

sync.on('CODING_SPRINT', (data) => {
  isCodingSprintActive = !!data.active;
  codingSprintTimeStr = data.timeStr || '00:00';
  if (isCodingSprintActive && activeViewMode === 'slide') {
    setViewMode('code');
  } else {
    updateTimerVisibility();
  }
});

function updateTimerVisibility() {
  const timerBox = document.getElementById('timer-box');
  const traySprint = document.getElementById('tray-sprint-val');
  if (traySprint) traySprint.innerText = codingSprintTimeStr;

  if (!timerBox) return;
  if (isCodingSprintActive && activeViewMode === 'code') {
    timerBox.style.display = 'inline-flex';
    timerBox.innerHTML = `⏱️ Coding Sprint: ${codingSprintTimeStr}`;
    if (typeof spatialZoom !== 'undefined') {
      spatialZoom.updateLiveCapsuleStatus(`⏱️ ${codingSprintTimeStr}`, true);
    }
  } else {
    timerBox.style.display = 'none';
  }
}

// View Mode Controller
export function setViewMode(mode) {
  activeViewMode = mode;
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
  } else {
    if (slideViewEl) slideViewEl.classList.remove('active');
    if (codeViewEl) codeViewEl.classList.add('active');
    thinkingLoop.start();
    renderCodeChunks();
    if (modeBadge) {
      modeBadge.innerText = 'Live Code';
      modeBadge.className = 'mode-pill code-mode';
    }
    setTimeout(scrollToActiveChunk, 50);
  }

  // Update floating dock pill states
  const dockSlide = document.getElementById('dock-btn-slide');
  const dockCode = document.getElementById('dock-btn-code');
  if (dockSlide) dockSlide.setAttribute('data-active', mode === 'slide' ? 'true' : 'false');
  if (dockCode) dockCode.setAttribute('data-active', mode === 'code' ? 'true' : 'false');

  const trayMode = document.getElementById('tray-mode-badge');
  if (trayMode) trayMode.innerText = mode === 'slide' ? 'Slide Mode' : 'Code Mode';

  updateTimerVisibility();
}

// Step Loader
export function loadStep(key, forceSlide = false) {
  if (!curriculum[key]) return;
  activeKey = key;
  activeSectionIndex = 0;
  activeSlideStage = 0;
  icebreakerStep = 0;

  const item = curriculum[key];

  const stepPill = document.getElementById('step-counter-pill');
  if (stepPill) stepPill.innerText = `Step ${item.stepNum} of 5`;
  const filePill = document.getElementById('file-path-pill');
  if (filePill) filePill.innerText = item.filePill || item.path;
  const codeFilePill = document.getElementById('code-file-pill');
  if (codeFilePill) codeFilePill.innerText = item.path;

  renderSlide(key);

  const trayStep = document.getElementById('tray-step-val');
  if (trayStep) trayStep.innerText = `Step ${item.stepNum}`;
  const trayPreset = document.getElementById('tray-preset-val');
  if (trayPreset) {
    const p = brandProfiles[activePreset] || brandProfiles.boots;
    trayPreset.innerText = p.name || p.brand || 'Boots UK';
  }

  const codeTitle = document.getElementById('code-intro-title');
  if (codeTitle) codeTitle.innerText = item.name;

  if (forceSlide) {
    setViewMode('slide');
  } else {
    renderCodeChunks();
  }
}

// Brand Preset Application
export function applyBrandPreset(preset) {
  if (!brandProfiles[preset]) return;
  activePreset = preset;
  const profile = brandProfiles[preset];

  const slideViewEl = document.getElementById('slide-view');
  const codeViewEl = document.getElementById('code-view');
  const targets = [slideViewEl, codeViewEl].filter(Boolean);

  targets.forEach(el => {
    el.style.transition = 'opacity 0.3s ease';
    el.style.opacity = '0';
  });

  setTimeout(() => {
    dynamicBuffer['brand'] = profile.brandMd;
    curriculum['brand'].content = profile.brandMd;

    fileSections.brand[0].code = `# Target Parameters\n- Brand: ${profile.name}\n- Focus Category: ${profile.category}\n- Commercial Model: ${profile.commercialModel}\n- Target AOV: ${profile.aov}\n- Target Territory: ${profile.territory}`;
    fileSections.brand[1].code = `# Competitor Baselines\n` + profile.competitors.map(c => `- ${c}`).join('\n');
    fileSections.brand[2].code = `# Disqualifications\n` + profile.disqualifications.map(d => `- ${d}`).join('\n');

    typewriter.markStepGenerated('brand', fileSections.brand.length);

    if (activeViewMode === 'slide') {
      renderSlide(activeKey);
    } else {
      renderCodeChunks();
    }

    targets.forEach(el => {
      el.style.opacity = '1';
    });
  }, 300);
}

// Step 0: Icebreaker Controller
function renderIcebreakerUI() {
  const container = document.getElementById('icebreaker-container');
  if (!container) return;

  const q1Badge = document.getElementById('ib-badge-1');
  const row2 = document.getElementById('ib-row-2');
  const q2Badge = document.getElementById('ib-badge-2');
  const row3 = document.getElementById('ib-row-3');
  const q3Badge = document.getElementById('ib-badge-3');
  const callout = document.getElementById('ib-callout');

  if (q1Badge) q1Badge.style.display = (icebreakerStep >= 1) ? 'inline-flex' : 'none';
  if (row2) row2.style.display = (icebreakerStep >= 1) ? 'flex' : 'none';
  if (q2Badge) q2Badge.style.display = (icebreakerStep >= 2) ? 'inline-flex' : 'none';
  if (row3) row3.style.display = (icebreakerStep >= 2) ? 'flex' : 'none';
  if (q3Badge) q3Badge.style.display = (icebreakerStep >= 3) ? 'inline-flex' : 'none';
  if (callout) callout.style.display = (icebreakerStep >= 3) ? 'block' : 'none';
}

// Step 2: Scoring Engine Weight Normalisation Dials
let scoringWeights = { r: 0.40, s: 0.30, c: 0.30 };

export function handleWeightChange(dialKey, newVal) {
  newVal = parseFloat(newVal);
  newVal = Math.max(0.10, Math.min(0.80, Math.round(newVal * 100) / 100));
  const oldVal = scoringWeights[dialKey];
  if (Math.abs(oldVal - 1.0) < 0.001) return;

  const otherKeys = ['r', 's', 'c'].filter(k => k !== dialKey);
  const oldOtherSum = scoringWeights[otherKeys[0]] + scoringWeights[otherKeys[1]];
  const newOtherTarget = 1.0 - newVal;

  if (oldOtherSum > 0) {
    let w0 = Math.round((scoringWeights[otherKeys[0]] * (newOtherTarget / oldOtherSum)) * 100) / 100;
    w0 = Math.max(0.10, Math.min(0.80, w0));
    let w1 = Math.round((newOtherTarget - w0) * 100) / 100;
    w1 = Math.max(0.10, Math.min(0.80, w1));

    const sum = Math.round((newVal + w0 + w1) * 100) / 100;
    const diff = Math.round((1.0 - sum) * 100) / 100;
    w1 = Math.round((w1 + diff) * 100) / 100;

    scoringWeights[dialKey] = newVal;
    scoringWeights[otherKeys[0]] = w0;
    scoringWeights[otherKeys[1]] = w1;
  }

  updateSliderDialsUI();
  updateLiveEVMath();
}

function updateSliderDialsUI() {
  const sliderR = document.getElementById('weight-slider-r');
  const sliderS = document.getElementById('weight-slider-s');
  const sliderC = document.getElementById('weight-slider-c');

  const tagR = document.getElementById('weight-val-r');
  const tagS = document.getElementById('weight-val-s');
  const tagC = document.getElementById('weight-val-c');

  if (sliderR) sliderR.value = scoringWeights.r.toFixed(2);
  if (sliderS) sliderS.value = scoringWeights.s.toFixed(2);
  if (sliderC) sliderC.value = scoringWeights.c.toFixed(2);

  if (tagR) tagR.innerText = scoringWeights.r.toFixed(2);
  if (tagS) tagS.innerText = scoringWeights.s.toFixed(2);
  if (tagC) tagC.innerText = scoringWeights.c.toFixed(2);

  const formulaReadout = document.getElementById('formula-live-math');
  if (formulaReadout) {
    formulaReadout.innerHTML = `EV = (Relevance<sup>${scoringWeights.r.toFixed(2)}</sup>) &times; (Scale<sup>${scoringWeights.s.toFixed(2)}</sup>) &times; (Commercial<sup>${scoringWeights.c.toFixed(2)}</sup>)`;
  }
}

function calculateEV(r, s, c) {
  if (r <= 0 || s <= 0 || c <= 0) return 0.00;
  const ev = Math.pow(r, scoringWeights.r) * Math.pow(s, scoringWeights.s) * Math.pow(c, scoringWeights.c);
  return Math.round(ev * 100) / 100;
}

function updateLiveEVMath() {
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

// Bespoke Slide Renderer
function renderSlide(key) {
  const container = document.getElementById('slide-content-area');
  if (!container) return;
  const profile = brandProfiles[activePreset] || brandProfiles.boots;

  if (key === 'setup') {
    container.innerHTML = `
      <div class="slide-hero">
        <div class="slide-step-tag">AFFILIFEST MASTERCLASS &bull; AI BLIND SPOT &amp; SETUP</div>
        <h1 class="slide-headline">Autonomous Affiliate Discovery Skills</h1>
        <p class="slide-subheadline">
          Build deterministic AI skills to discover high-intent partners across any commercial vertical.
        </p>
      </div>

      <div class="icebreaker-card stage-card" id="icebreaker-container">
        <div class="icebreaker-header">
          <span class="card-badge" style="background:#EBF4FC; color:#298DDA;">Audience Pulse &bull; The AI Blind Spot</span>
          <h2 class="icebreaker-title">Why Default AI Partner Discovery Fails</h2>
        </div>
        
        <div class="icebreaker-row" id="ib-row-1">
          <span class="icebreaker-q-num">1</span>
          <span class="icebreaker-q-text">"Who uses AI tools weekly in their everyday workflow?"</span>
          <span class="tally-pill tally-high" id="ib-badge-1" style="display:none;">~90% Hands Raised</span>
        </div>

        <div class="icebreaker-row" id="ib-row-2" style="display:none;">
          <span class="icebreaker-q-num">2</span>
          <span class="icebreaker-q-text">"Who has asked an AI tool to find affiliate partners or creators?"</span>
          <span class="tally-pill tally-mid" id="ib-badge-2" style="display:none;">~60% Hands Raised</span>
        </div>

        <div class="icebreaker-row" id="ib-row-3" style="display:none;">
          <span class="icebreaker-q-num">3</span>
          <span class="icebreaker-q-text">"Who actually recruited a top-performing partner from that search?"</span>
          <span class="tally-pill tally-drop" id="ib-badge-3" style="display:none;">0% Every Hand Drops</span>
        </div>

        <div class="icebreaker-callout" id="ib-callout" style="display:none;">
          💡 <strong>The Commercial Failure Mode:</strong> Default prompts search <em>brand-out</em>, surfacing coupon scrapers and existing partners. Autonomous skills search <em>consumer-in</em> where buying decisions actually happen.
        </div>
      </div>

      <div class="slide-grid-2" id="setup-grids" style="display:none;">
        <div class="slide-card stage-card" id="setup-card-1">
          <div class="slide-card-header">
            <span class="card-badge" style="background:#FEF2F2; color:#F5333F;">The Trap</span>
            <h2 class="slide-card-title">The Brand-Out Search Ceiling</h2>
          </div>
          <ul class="slide-card-bullets">
            <li><span class="bullet-cross">✕</span> <span>Traditional discovery queries brand names, competitor coupon terms, or generic category directories.</span></li>
            <li><span class="bullet-cross">✕</span> <span>Surfaces checkout coupon aggregators and browser toolbars demanding expensive placement fees.</span></li>
            <li><span class="bullet-cross">✕</span> <span>Brands pay commission on buyers already in the checkout funnel, generating zero incremental sales.</span></li>
          </ul>
        </div>

        <div class="slide-card stage-card" id="setup-card-2">
          <div class="slide-card-header">
            <span class="card-badge" style="background:#ECFDF5; color:#10B981;">The Paradigm</span>
            <h2 class="slide-card-title">Consumer-In Interception</h2>
          </div>
          <ul class="slide-card-bullets">
            <li><span class="bullet-arrow">→</span> <span>High-intent buyers search to resolve uncertainty in the Messy Middle before selecting a merchant.</span></li>
            <li><span class="bullet-arrow">→</span> <span>Targeting emotional need states and behavioural heuristics intercepts buyers during active research.</span></li>
            <li><span class="bullet-arrow">→</span> <span>Deterministic rules discover high-margin editorial partners across Boots UK, Argos, loveholidays, or any brand.</span></li>
          </ul>
        </div>
      </div>
    `;
    renderIcebreakerUI();

  } else if (key === 'brand') {
    container.innerHTML = `
      <div class="slide-hero">
        <div class="slide-step-tag">Step 1 &bull; Brand Configuration</div>
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
            <li><span class="bullet-check">✓</span> <span><strong>Focus Category Lock:</strong> Constrain the agent strictly to ${profile.category}. Broad queries default to mass media spam.</span></li>
            <li><span class="bullet-check">✓</span> <span><strong>Commercial Model:</strong> ${profile.commercialModel} with target benchmark AOV of <strong>${profile.aov}</strong>.</span></li>
            <li><span class="bullet-check">✓</span> <span><strong>Competitor Seed Baselines:</strong> Seed domains (${profile.competitors.join(', ')}) allow the agent to reverse-engineer referral pathways.</span></li>
            <li><span class="bullet-check">✓</span> <span><strong>Incrementality Gate:</strong> Prioritise top-of-funnel creators who introduce new buyers over checkout coupon catchers.</span></li>
          </ul>
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
            <li><span class="bullet-cross">✕</span> <span><strong>Voucher Aggregators &amp; Toolbars:</strong> Explicitly ban coupon scrapers that erode margin without creating new demand.</span></li>
            <li><span class="bullet-cross">✕</span> <span><strong>Territory &amp; Regulatory Compliance:</strong> Disqualify non-UK traffic sources; enforce strict ASA and trade regulations.</span></li>
            <li><span class="bullet-cross">✕</span> <span><strong>Direct Retail Competitors:</strong> Immediate disqualification for direct commercial rivals (${profile.competitors[0]}).</span></li>
            <li><span class="bullet-cross">✕</span> <span><strong>Brand Bidding:</strong> Prohibit publishers who bid on brand trademarks or redirect paid search traffic without editorial content.</span></li>
          </ul>
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
        <div class="slide-step-tag">Step 2 &bull; Deterministic Scoring Engine</div>
        <h1 class="slide-headline">Deterministic Expected Value Scoring (estimated_value.md)</h1>
        <p class="slide-subheadline">
          Replacing affiliate manager gut-feel and model hallucination with multiplicative geometric mean arithmetic.
        </p>
      </div>

      <div class="slider-widget-container stage-card" id="math-slider-widget">
        <div class="slider-widget-header">
          <span class="card-badge" style="background:#EBF4FC; color:#298DDA;">Interactive Calibration</span>
          <h2 class="slider-widget-title">Geometric Mean Normalisation Dials (Sum Strictly = 1.00)</h2>
        </div>
        
        <div class="formula-live-readout" id="formula-live-math">
          EV = (Relevance<sup>${scoringWeights.r.toFixed(2)}</sup>) &times; (Scale<sup>${scoringWeights.s.toFixed(2)}</sup>) &times; (Commercial<sup>${scoringWeights.c.toFixed(2)}</sup>)
        </div>

        <div class="slider-dials-row">
          <div class="slider-dial-box dial-r">
            <div class="slider-dial-label">
              <span>Relevance Weight (wR)</span>
              <span class="slider-val-tag" id="weight-val-r">${scoringWeights.r.toFixed(2)}</span>
            </div>
            <input type="range" class="weight-slider" id="weight-slider-r" min="0.10" max="0.80" step="0.05" value="${scoringWeights.r.toFixed(2)}" oninput="window.handleWeightChange('r', this.value)">
            <div class="slider-dial-desc">Category fit &amp; problem-first alignment</div>
          </div>

          <div class="slider-dial-box dial-s">
            <div class="slider-dial-label">
              <span>Scale Weight (wS)</span>
              <span class="slider-val-tag" id="weight-val-s">${scoringWeights.s.toFixed(2)}</span>
            </div>
            <input type="range" class="weight-slider" id="weight-slider-s" min="0.10" max="0.80" step="0.05" value="${scoringWeights.s.toFixed(2)}" oninput="window.handleWeightChange('s', this.value)">
            <div class="slider-dial-desc">Organic traffic authority &amp; audience volume</div>
          </div>

          <div class="slider-dial-box dial-c">
            <div class="slider-dial-label">
              <span>Commercial Fit (wC)</span>
              <span class="slider-val-tag" id="weight-val-c">${scoringWeights.c.toFixed(2)}</span>
            </div>
            <input type="range" class="weight-slider" id="weight-slider-c" min="0.10" max="0.80" step="0.05" value="${scoringWeights.c.toFixed(2)}" oninput="window.handleWeightChange('c', this.value)">
            <div class="slider-dial-desc">Affiliate readiness &amp; review structure</div>
          </div>
        </div>
      </div>

      <div class="slide-grid-2" id="math-grid-cards">
        <div class="slide-card stage-card" id="math-card-1">
          <div class="slide-card-header">
            <span class="card-badge" style="background:#FEF2F2; color:#F5333F;">Zero-Tolerance</span>
            <h2 class="slide-card-title">The Zero Rule: Multiplicative Knockout</h2>
          </div>
          <ul class="slide-card-bullets">
            <li><span class="bullet-cross">✕</span> <span><strong>The Additive Flaw:</strong> Traditional addition allows coupon spam to score 10/15 (67%) with 0 category relevance.</span></li>
            <li><span class="bullet-arrow">&rarr;</span> <span><strong>The Multiplicative Knockout:</strong> If <em>any</em> metric is 0 (wrong category, coupon scraper), the score collapses to <strong>0.00 instantly</strong>.</span></li>
            <li><span class="bullet-arrow">&rarr;</span> <span><strong>Audit Trail:</strong> Eliminates score inflation and subjective affiliate recruitment pitches across LLM runs.</span></li>
          </ul>
          <div class="math-compare-box">
            <div><span style="color:#059669; font-weight:700;">Content Partner (R:5, S:4, C:4):</span> <span id="live-content-partner-ev">(5<sup>0.40</sup>) &times; (4<sup>0.30</sup>) &times; (4<sup>0.30</sup>) = <strong>4.37</strong></span></div>
            <div><span style="color:#DC2626; font-weight:700;">Coupon Scraper (R:0, S:5, C:5):</span> <span id="live-coupon-scraper-ev">(0<sup>0.40</sup>) &times; (5<sup>0.30</sup>) &times; (5<sup>0.30</sup>) = <strong>0.00 Knockout</strong></span></div>
          </div>
        </div>

        <div class="slide-card stage-card" id="math-card-2">
          <div class="slide-card-header">
            <span class="card-badge" style="background:#ECFDF5; color:#10B981;">0 to 5 Anchors</span>
            <h2 class="slide-card-title">Standardised Scoring Rules</h2>
          </div>
          <ul class="slide-card-bullets">
            <li><span class="bullet-check">&check;</span> <span><strong>Relevance (R):</strong> 5 = Direct match answering NeedScope states; 3 = Adjacent category; 0 = Wrong vertical knockout.</span></li>
            <li><span class="bullet-check">&check;</span> <span><strong>Scale (S):</strong> 5 = High national authority; 3 = Niche enthusiast forum; 0 = Dead domain or inactive.</span></li>
            <li><span class="bullet-check">&check;</span> <span><strong>Commercial Fit (C):</strong> 5 = Active editorial reviews &amp; buying guides; 0 = Charity / NHS / Non-commercial.</span></li>
          </ul>
          <div class="scoring-tiers-box">
            <div><span class="slide-mini-tag tag-green">EV &ge; 3.80</span> <strong>Tier 1 Priority:</strong> Immediate high-touch recruitment outreach.</div>
            <div><span class="slide-mini-tag tag-blue">3.00 &le; EV &lt; 3.80</span> <strong>Tier 2 Secondary:</strong> Automated outreach queue &amp; nurture track.</div>
            <div><span class="slide-mini-tag tag-red">EV &lt; 3.00</span> <strong>Disqualified:</strong> Automatically rejected by deterministic gate.</div>
          </div>
        </div>
      </div>
    `;
    updateSliderDialsUI();
    updateLiveEVMath();

  } else if (key === 'discovery') {
    container.innerHTML = `
      <div class="slide-hero">
        <div class="slide-step-tag">Step 3 &bull; Dual-Engine Architecture</div>
        <h1 class="slide-headline">Dual-Engine Search Architecture (discovery.md)</h1>
        <p class="slide-subheadline">
          Embedding Kantar's NeedScope and Google's Messy Middle into natural unbranded question stems.
        </p>
      </div>

      <div class="discovery-zoom-wrapper" id="discovery-wrapper">
        <div class="discovery-macro-col stage-card focused" id="discovery-macro-col">
          <div style="font-size:12.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#0F172A; display:flex; align-items:center; gap:8px;">
            <span style="display:inline-block; width:9px; height:9px; border-radius:50%; background:#F59E0B;"></span>
            <span>Google "Messy Middle" Macro Decision Engine</span>
          </div>
          <div style="font-size:12px; color:#475569; line-height:1.45; text-align:center; margin-top:2px;">
            High-intent shoppers do not search brand terms first. They explore and evaluate in the Messy Middle until cognitive shortcuts trigger purchase.
          </div>

          <svg viewBox="0 0 540 250" style="width:100%; height:auto; max-height:28vh; flex:1; margin:4px 0; overflow:visible;" id="discovery-lemniscate-svg">
            <circle cx="270" cy="125" r="115" fill="none" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="4,4" />
            <text x="160" y="24" font-size="11" font-weight="800" fill="#94A3B8" letter-spacing="2">EXPOSURE</text>

            <path d="M 270,12 C 270,45 270,80 270,125" fill="none" stroke="#F5333F" stroke-width="3" />
            <circle cx="270" cy="12" r="5" fill="#F5333F" />
            <text x="270" y="6" font-size="11" font-weight="800" text-anchor="middle" fill="#0F172A" letter-spacing="1.5">TRIGGERS</text>

            <path d="M 270,125 C 235,65 155,55 135,125 C 115,195 215,205 270,125 C 325,45 425,55 405,125 C 385,195 305,185 270,125 Z" 
                  fill="none" stroke="#F1F5F9" stroke-width="14" />

            <g id="svg-loop-1" class="svg-loop-group">
              <path d="M 270,125 C 235,65 155,55 135,125 C 115,195 215,205 270,125" 
                    fill="none" stroke="#F59E0B" stroke-width="6" stroke-linecap="round" />
              <text x="180" y="115" font-size="16" font-weight="800" text-anchor="middle" fill="#0F172A">Exploration</text>
              <rect x="110" y="128" width="140" height="22" rx="11" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.2" />
              <text x="180" y="139" font-size="9.5" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="#B45309" letter-spacing="0.5">LOOP 1: NEEDSCOPE</text>
            </g>

            <g id="svg-loop-2" class="svg-loop-group">
              <path d="M 270,125 C 325,45 425,55 405,125 C 385,195 305,185 270,125" 
                    fill="none" stroke="#10B981" stroke-width="6" stroke-linecap="round" />
              <text x="360" y="115" font-size="16" font-weight="800" text-anchor="middle" fill="#0F172A">Evaluation</text>
              <rect x="286" y="128" width="148" height="22" rx="11" fill="#ECFDF5" stroke="#10B981" stroke-width="1.2" />
              <text x="360" y="139" font-size="9.5" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="#065F46" letter-spacing="0.5">LOOP 2: 6 HEURISTICS</text>
            </g>

            <path d="M 270,125 C 235,65 155,55 135,125 C 115,195 215,205 270,125 C 325,45 425,55 405,125 C 385,195 305,185 270,125 Z" 
                  fill="none" stroke="#FFFFFF" stroke-width="6" pathLength="1000" stroke-dasharray="140 860" stroke-linecap="round" 
                  style="animation: beamOrbit 3.5s linear infinite; filter: drop-shadow(0 0 5px #FFFFFF) drop-shadow(0 0 10px rgba(41, 141, 218, 0.6));" />

            <path d="M 270,125 C 270,165 270,200 270,215" fill="none" stroke="#2563EB" stroke-width="2" stroke-dasharray="3,3" />
            <circle cx="270" cy="215" r="12" fill="none" stroke="#2563EB" stroke-dasharray="3,3" />
            <circle cx="270" cy="215" r="3.5" fill="#2563EB" />
            <text x="270" y="240" font-size="10.5" font-weight="800" text-anchor="middle" fill="#0F172A" letter-spacing="1">PURCHASE</text>
          </svg>

          <div id="discovery-macro-callouts" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; width:100%; border-top:1px solid #E2E8F0; padding-top:10px; margin-top:2px;">
            <div style="background:#FFF5F5; border:1px solid #FED7D7; border-radius:10px; padding:8px 12px; text-align:left;">
              <div style="font-size:11.5px; font-weight:800; color:#C53030; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:3px;">
                ⚠️ The Problem: The Confidence Gap
              </div>
              <div style="font-size:11px; color:#4A5568; line-height:1.4;">
                Shoppers loop continuously between exploration and evaluation. 1 in 3 abandon purchases due to choice overload. Brand-out queries miss uncommitted buyers.
              </div>
            </div>
            <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:10px; padding:8px 12px; text-align:left;">
              <div style="font-size:11.5px; font-weight:800; color:#15803D; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:3px;">
                🎯 The Opportunity: Consumer-In Interception
              </div>
              <div style="font-size:11px; color:#4A5568; line-height:1.4;">
                Autonomous queries intercept buyers during active evaluation loops. Unbranded question stems surface specialist review desks and creator hubs that trigger purchase exit.
              </div>
            </div>
          </div>
        </div>

        <div class="discovery-detail-col" id="discovery-detail-col" style="display:none;">
          <div class="slide-card stage-card" id="discovery-matrix-needscope" style="height:100%; box-sizing:border-box; margin:0;">
            <div class="slide-card-header" style="margin-bottom:6px;">
              <span class="card-badge" style="background:#FEF3C7; color:#B45309;">Kantar NeedScope Matrix &bull; Loop 1</span>
              <h2 class="slide-card-title">6 Emotional Search Need States</h2>
            </div>
            <div class="kantar-grid">
              <div class="kantar-chip">
                <div class="kantar-chip-bar" style="background:#3B82F6;">Educate Me &bull; Competence</div>
                <div class="kantar-chip-body">
                  Analytical validation &amp; lab teardown data.
                  <div class="kantar-chip-query">"what is the difference between [CAT_A] and [CAT_B]"</div>
                </div>
              </div>
              <div class="kantar-chip">
                <div class="kantar-chip-bar" style="background:#EA580C;">Help Me &bull; Simplicity</div>
                <div class="kantar-chip-body">
                  Plain-language filtering; removes decision jargon.
                  <div class="kantar-chip-query">"how do I choose between [SUB_CAT] for [CONTEXT]"</div>
                </div>
              </div>
              <div class="kantar-chip">
                <div class="kantar-chip-bar" style="background:#92400E;">Reassure Me &bull; Security</div>
                <div class="kantar-chip-body">
                  Durability validation, long-term wear &amp; safety tests.
                  <div class="kantar-chip-query">"how can I tell if [CAT] is good quality"</div>
                </div>
              </div>
              <div class="kantar-chip">
                <div class="kantar-chip-bar" style="background:#8B5CF6;">Impress Me &bull; Status</div>
                <div class="kantar-chip-body">
                  Professional-tier gear &amp; elite trade benchmarks.
                  <div class="kantar-chip-query">"who makes the best [SUB_CAT] for [AUDIENCE]"</div>
                </div>
              </div>
              <div class="kantar-chip">
                <div class="kantar-chip-bar" style="background:#EF4444;">Thrill Me &bull; Vitality</div>
                <div class="kantar-chip-body">
                  Novel drops, bleeding-edge releases &amp; trends.
                  <div class="kantar-chip-query">"what are the top new [SUB_CAT] trends 2026"</div>
                </div>
              </div>
              <div class="kantar-chip">
                <div class="kantar-chip-bar" style="background:#F59E0B;">Surprise Me &bull; Ingenuity</div>
                <div class="kantar-chip-body">
                  Lateral problem hacks &amp; unconventional use cases.
                  <div class="kantar-chip-query">"what is the best way to [UNCONVENTIONAL_USE] [CAT]"</div>
                </div>
              </div>
            </div>
          </div>

          <div class="slide-card stage-card" id="discovery-matrix-heuristics" style="height:100%; box-sizing:border-box; margin:0; display:none;">
            <div class="slide-card-header" style="margin-bottom:6px;">
              <span class="card-badge" style="background:#ECFDF5; color:#10B981;">Behavioural Economics &bull; Loop 2</span>
              <h2 class="slide-card-title">6 Behavioural Decision Heuristics</h2>
            </div>
            <div class="kantar-grid">
              <div class="kantar-chip">
                <div class="kantar-chip-bar" style="background:#0284C7;">Authority Bias</div>
                <div class="kantar-chip-body">
                  Delegation to recognised institutions &amp; testing labs.
                  <div class="kantar-chip-query">"who is the top recommended [CAT] [AUTHORITY]"</div>
                </div>
              </div>
              <div class="kantar-chip">
                <div class="kantar-chip-bar" style="background:#059669;">Social Proof</div>
                <div class="kantar-chip-body">
                  Community consensus &amp; Reddit forum validation.
                  <div class="kantar-chip-query">"what's the best rated [CAT] reviews reddit"</div>
                </div>
              </div>
              <div class="kantar-chip">
                <div class="kantar-chip-bar" style="background:#7C3AED;">Category Heuristics</div>
                <div class="kantar-chip-body">
                  Proxy specifications evaluating build quality.
                  <div class="kantar-chip-query">"who has the best [HEURISTIC] [CAT]"</div>
                </div>
              </div>
              <div class="kantar-chip">
                <div class="kantar-chip-bar" style="background:#D97706;">Power of Free</div>
                <div class="kantar-chip-body">
                  Disproportionate pull of complimentary trials &amp; shipping.
                  <div class="kantar-chip-query">"how do I get free delivery for [BRAND]"</div>
                </div>
              </div>
              <div class="kantar-chip">
                <div class="kantar-chip-bar" style="background:#DC2626;">Scarcity Bias</div>
                <div class="kantar-chip-body">
                  Diminishing stock availability &amp; release urgency.
                  <div class="kantar-chip-query">"[SUB_CAT] restock alert UK release date"</div>
                </div>
              </div>
              <div class="kantar-chip">
                <div class="kantar-chip-bar" style="background:#475569;">Power of Now</div>
                <div class="kantar-chip-body">
                  Immediate dispatch &amp; local next-day delivery.
                  <div class="kantar-chip-query">"who can deliver [SUB_CAT] tomorrow [GEO]"</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

  } else if (key === 'skill') {
    container.innerHTML = `
      <div class="slide-hero">
        <div class="slide-step-tag">Step 4 &bull; Master Controller Skill</div>
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
        <div class="arch-pill-card">
          <div class="arch-pill-header">
            <span class="arch-pill-file">run.md</span>
            <span class="arch-pill-role" style="background:#F3E8FF; color:#7C3AED;">The Ignition Switch</span>
          </div>
          <div class="arch-pill-desc">Single trigger command enforcing the human-in-the-loop pause before execution.</div>
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
        <div class="slide-step-tag">Step 5 &bull; Live Run &amp; Verification</div>
        <h1 class="slide-headline">Deploy &amp; Verify (run.md)</h1>
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
          <ul class="slide-card-bullets">
            <li><span class="bullet-check">✓</span> <span><strong>Trigger Command:</strong> Execute skill <code>affiliate-partner-discovery</code> from <code>SKILL.md</code> using the <code>/references/</code> folder in Claude.</span></li>
            <li><span class="bullet-check">✓</span> <span><strong>Context Ingestion:</strong> The model reads brand rules, normalises weights, pauses for existing exclusions, and initiates dual-engine search loops.</span></li>
            <li><span class="bullet-check">✓</span> <span><strong>Exclusion Check:</strong> Interactive halt triggers immediately, requiring facilitator validation before web searches.</span></li>
          </ul>
        </div>

        <div class="slide-card stage-card" id="run-card-2">
          <div class="slide-card-header" style="justify-content:space-between;">
            <span class="card-badge" style="background:#ECFDF5; color:#10B981;">Commercial Output</span>
            <button class="copy-chunk-btn" onclick="window.copyPresetCSV()">📋 Copy CRM CSV</button>
          </div>
          <h2 class="slide-card-title" style="margin-bottom:6px;">Audited Recruitment Ledger Preview (${profile.name})</h2>
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

      <div id="run-finale-container" style="display:none; width:100%; flex-direction:column; gap:16px;">
        <div class="scorecard-grid">
          <div class="scorecard-box scorecard-traditional">
            <div class="scorecard-header">
              <span class="scorecard-title">Traditional Manual Search</span>
              <span style="font-size:11px; font-weight:800; color:#DC2626; background:#FEE2E2; padding:3px 8px; border-radius:999px;">Status Quo</span>
            </div>
            <ul class="scorecard-steps">
              <li>⏱️ <strong>15–20 Hours / Month:</strong> Manual Google trawling, social scraping, and messy spreadsheets.</li>
              <li>🔍 <strong>Brand-Out Search:</strong> Surfaces coupon toolbars and existing partners.</li>
              <li>📉 <strong>Margin Dilution:</strong> Zero incremental reach, high recruitment fatigue.</li>
            </ul>
          </div>

          <div class="scorecard-box scorecard-autonomous">
            <div class="scorecard-header">
              <span class="scorecard-title">Autonomous Skill Interception</span>
              <span style="font-size:11px; font-weight:800; color:#059669; background:#D1FAE5; padding:3px 8px; border-radius:999px;">Production Standard</span>
            </div>
            <ul class="scorecard-steps">
              <li>⚡ <strong>&lt;90 Seconds Execution:</strong> Deterministic pipeline runs end-to-end with one trigger prompt.</li>
              <li>🎯 <strong>Consumer-In Interception:</strong> NeedScope and 6 heuristics intercept uncommitted queries.</li>
              <li>🚀 <strong>High-Margin Reach:</strong> Discovers specialist creators and review desks.</li>
            </ul>
          </div>
        </div>

        <div class="next-steps-bar">
          <div class="next-step-pill">
            <span class="next-step-num">1</span>
            <div>
              <div style="font-size:12.5px; font-weight:700;">1-Click CSV Export</div>
              <div style="font-size:11px; color:#64748B;">Push vetted domains into impact.com recruitment tracking.</div>
            </div>
          </div>
          <div class="next-step-pill">
            <span class="next-step-num">2</span>
            <div>
              <div style="font-size:12.5px; font-weight:700;">Load to Claude Projects</div>
              <div style="font-size:11px; color:#64748B;">Persist partner-discovery/ as a permanent team asset.</div>
            </div>
          </div>
          <div class="next-step-pill">
            <span class="next-step-num">3</span>
            <div>
              <div style="font-size:12.5px; font-weight:700;">Weekly Vertical Sprints</div>
              <div style="font-size:11px; color:#64748B;">Execute iterative partner recruitment across newly launched categories.</div>
            </div>
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

  if (key === 'setup') {
    const ibCard = document.getElementById('icebreaker-container');
    const grid2 = document.getElementById('setup-grids');
    const card1 = document.getElementById('setup-card-1');
    const card2 = document.getElementById('setup-card-2');

    if (stageIdx === 0) {
      if (ibCard) {
        ibCard.style.display = 'flex';
        ibCard.className = 'icebreaker-card stage-card focused';
      }
      if (grid2) grid2.style.display = 'none';
    } else {
      if (ibCard) ibCard.style.display = 'none';
      if (grid2) grid2.style.display = 'grid';

      if (stageIdx === 1) {
        if (card1) card1.className = 'slide-card stage-card focused';
        if (card2) card2.className = 'slide-card stage-card blurred';
      } else {
        if (card1) card1.className = 'slide-card stage-card completed';
        if (card2) card2.className = 'slide-card stage-card focused';
      }
    }

  } else if (key === 'brand') {
    const card1 = document.getElementById('brand-card-1');
    const card2 = document.getElementById('brand-card-2');
    if (stageIdx === 0) {
      if (card1) card1.className = 'slide-card stage-card focused';
      if (card2) card2.className = 'slide-card stage-card blurred';
    } else {
      if (card1) card1.className = 'slide-card stage-card completed';
      if (card2) card2.className = 'slide-card stage-card focused';
    }

  } else if (key === 'math') {
    const widget = document.getElementById('math-slider-widget');
    const card1 = document.getElementById('math-card-1');
    const card2 = document.getElementById('math-card-2');

    if (stageIdx === 0) {
      if (widget) widget.className = 'slider-widget-container stage-card focused';
      if (card1) card1.className = 'slide-card stage-card blurred';
      if (card2) card2.className = 'slide-card stage-card blurred';
    } else if (stageIdx === 1) {
      if (widget) widget.className = 'slider-widget-container stage-card completed';
      if (card1) card1.className = 'slide-card stage-card focused';
      if (card2) card2.className = 'slide-card stage-card blurred';
    } else {
      if (widget) widget.className = 'slider-widget-container stage-card completed';
      if (card1) card1.className = 'slide-card stage-card completed';
      if (card2) card2.className = 'slide-card stage-card focused';
    }

  } else if (key === 'discovery') {
    const wrapper = document.getElementById('discovery-wrapper');
    const macroCol = document.getElementById('discovery-macro-col');
    const detailCol = document.getElementById('discovery-detail-col');
    const macroCallouts = document.getElementById('discovery-macro-callouts');
    const loop1 = document.getElementById('svg-loop-1');
    const loop2 = document.getElementById('svg-loop-2');
    const matrixNeedscope = document.getElementById('discovery-matrix-needscope');
    const matrixHeuristics = document.getElementById('discovery-matrix-heuristics');

    if (wrapper) wrapper.classList.toggle('zoomed', stageIdx > 0);

    if (stageIdx === 0) {
      if (macroCol) macroCol.className = 'discovery-macro-col stage-card focused';
      if (detailCol) detailCol.style.display = 'none';
      if (macroCallouts) macroCallouts.style.display = 'grid';
      if (loop1) { loop1.style.opacity = '1.0'; loop1.style.filter = 'none'; }
      if (loop2) { loop2.style.opacity = '1.0'; loop2.style.filter = 'none'; }
    } else if (stageIdx === 1) {
      if (macroCol) macroCol.className = 'discovery-macro-col stage-card';
      if (macroCallouts) macroCallouts.style.display = 'none';
      if (detailCol) detailCol.style.display = 'flex';
      if (matrixNeedscope) {
        matrixNeedscope.style.display = 'flex';
        matrixNeedscope.className = 'slide-card stage-card focused';
      }
      if (matrixHeuristics) matrixHeuristics.style.display = 'none';
      if (loop1) {
        loop1.style.opacity = '1.0';
        loop1.style.filter = 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.8))';
      }
      if (loop2) {
        loop2.style.opacity = '0.15';
        loop2.style.filter = 'none';
      }
    } else {
      if (macroCol) macroCol.className = 'discovery-macro-col stage-card';
      if (macroCallouts) macroCallouts.style.display = 'none';
      if (detailCol) detailCol.style.display = 'flex';
      if (matrixNeedscope) matrixNeedscope.style.display = 'none';
      if (matrixHeuristics) {
        matrixHeuristics.style.display = 'flex';
        matrixHeuristics.className = 'slide-card stage-card focused';
      }
      if (loop1) {
        loop1.style.opacity = '0.15';
        loop1.style.filter = 'none';
      }
      if (loop2) {
        loop2.style.opacity = '1.0';
        loop2.style.filter = 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))';
      }
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

    if (stageIdx === 0) {
      if (pipe1) pipe1.className = 'pipeline-step-card active-phase';
      if (pipe2) pipe2.className = 'pipeline-step-card locked';
      if (pipe3) pipe3.className = 'pipeline-step-card locked';
      if (pipe4) pipe4.className = 'pipeline-step-card locked';
      if (archGrid) archGrid.style.display = 'grid';
      if (detailCards) detailCards.style.display = 'none';
    } else if (stageIdx === 1) {
      if (pipe1) pipe1.className = 'pipeline-step-card completed-phase';
      if (pipe2) pipe2.className = 'pipeline-step-card halt-phase-active';
      if (pipe3) pipe3.className = 'pipeline-step-card locked';
      if (pipe4) pipe4.className = 'pipeline-step-card locked';
      if (archGrid) archGrid.style.display = 'none';
      if (detailCards) detailCards.style.display = 'grid';
      if (card1) card1.className = 'slide-card stage-card focused';
      if (card2) card2.className = 'slide-card stage-card blurred';
    } else {
      if (pipe1) pipe1.className = 'pipeline-step-card completed-phase';
      if (pipe2) pipe2.className = 'pipeline-step-card completed-phase';
      if (pipe3) pipe3.className = 'pipeline-step-card active-phase';
      if (pipe4) pipe4.className = 'pipeline-step-card active-phase';
      if (archGrid) archGrid.style.display = 'none';
      if (detailCards) detailCards.style.display = 'grid';
      if (card1) card1.className = 'slide-card stage-card completed';
      if (card2) card2.className = 'slide-card stage-card focused';
    }

  } else if (key === 'run') {
    const runGrid = document.getElementById('run-grid');
    const runFinale = document.getElementById('run-finale-container');
    const card1 = document.getElementById('run-card-1');
    const card2 = document.getElementById('run-card-2');

    if (stageIdx === 0) {
      if (runGrid) runGrid.style.display = 'grid';
      if (runFinale) runFinale.style.display = 'none';
      if (card1) card1.className = 'slide-card stage-card focused';
      if (card2) card2.className = 'slide-card stage-card blurred';
    } else if (stageIdx === 1) {
      if (runGrid) runGrid.style.display = 'grid';
      if (runFinale) runFinale.style.display = 'none';
      if (card1) card1.className = 'slide-card stage-card completed';
      if (card2) card2.className = 'slide-card stage-card focused';
    } else {
      if (runGrid) runGrid.style.display = 'none';
      if (runFinale) runFinale.style.display = 'flex';
    }
  }
}

export function setSlideStage(stageIdx) {
  activeSlideStage = stageIdx;
  if (activeViewMode !== 'slide') {
    setViewMode('slide');
  }
  applySlideStaging(activeKey, stageIdx);
}

export function nextSlideStage() {
  if (activeKey === 'setup' && activeSlideStage === 0) {
    if (icebreakerStep < 3) {
      icebreakerStep++;
      renderIcebreakerUI();
      return;
    }
  }

  const stages = slideStageTitles[activeKey] || [];
  if (activeSlideStage < stages.length - 1) {
    setSlideStage(activeSlideStage + 1);
  } else {
    setSection(0);
  }
}

export function prevSlideStage() {
  if (activeKey === 'setup' && activeSlideStage === 0) {
    if (icebreakerStep > 0) {
      icebreakerStep--;
      renderIcebreakerUI();
      return;
    }
  }

  if (activeSlideStage > 0) {
    setSlideStage(activeSlideStage - 1);
    if (activeKey === 'setup' && activeSlideStage === 0) {
      icebreakerStep = 3;
      renderIcebreakerUI();
    }
  }
}

// Progressive Code Chunks Renderer (DOM Preservation)
export function renderCodeChunks() {
  const chunks = fileSections[activeKey] || [];
  const container = document.getElementById('chunks-list');
  const introCount = document.getElementById('code-intro-count');
  const cData = claudeStepData[activeKey] || claudeStepData.brand;
  const curItem = curriculum[activeKey] || { path: 'references/brand.md' };

  const userPromptEl = document.getElementById('claude-user-prompt-text');
  if (userPromptEl && userPromptEl.innerText !== cData.userPrompt) {
    userPromptEl.innerText = cData.userPrompt;
  }

  thinkingLoop.start(false);

  const artifactFilename = document.getElementById('artifact-current-filename');
  if (artifactFilename) artifactFilename.innerText = curItem.path;
  const artifactBannerTitle = document.getElementById('artifact-embed-title');
  if (artifactBannerTitle) artifactBannerTitle.innerText = `Created Artifact: ${curItem.path}`;

  if (!chunks.length) {
    if (container) {
      container.setAttribute('data-step-key', activeKey);
      container.innerHTML = '<div style="color:#8D96A0; padding:20px;">No code chunks configured.</div>';
    }
    return;
  }

  const isAll = (activeSectionIndex === 'all');
  const activeIdx = typeof activeSectionIndex === 'number' ? activeSectionIndex : (isAll ? 'all' : 0);

  const progressPill = document.getElementById('artifact-progress-pill');
  const embedTag = document.getElementById('artifact-embed-tag');
  if (isAll) {
    if (introCount) introCount.innerText = `Assembled File (${chunks.length} parts)`;
    if (progressPill) progressPill.innerText = `Complete File (${chunks.length} parts)`;
    if (embedTag) embedTag.innerText = `Complete`;
  } else {
    const num = typeof activeIdx === 'number' ? activeIdx : 0;
    if (introCount) introCount.innerText = `Revealing Part ${num + 1} of ${chunks.length}`;
    if (progressPill) progressPill.innerText = `Part ${num + 1} of ${chunks.length}`;
    if (embedTag) embedTag.innerText = `Part ${num + 1} of ${chunks.length}`;
  }

  const hasMountedCards = container && (container.getAttribute('data-step-key') === activeKey) && !!container.querySelector('.chunk-card');
  let needsTypingChunkIdx = null;

  if (hasMountedCards && !isAll) {
    container.setAttribute('data-active-index', String(activeSectionIndex));

    for (let i = 0; i <= (chunks.length - 1); i++) {
      const card = document.getElementById(`chunk-item-${i}`);
      if (!card) continue;

      if (i < activeIdx) {
        card.classList.remove('active', 'typing');
        card.classList.add('completed');

        const pill = card.querySelector('.chunk-num, .typing-active-pill');
        if (pill) {
          pill.className = 'chunk-num';
          pill.innerText = `Part ${i + 1} of ${chunks.length}`;
        }

        const codeEl = document.getElementById(`chunk-code-${i}`);
        if (codeEl && (!codeEl.innerText.trim() || !typewriter.isChunkGenerated(activeKey, i))) {
          codeEl.innerHTML = escapeHtml(chunks[i].code);
        }
      } else if (i === activeIdx) {
        card.classList.remove('completed');
        card.classList.add('active');
      } else {
        card.remove();
      }
    }

    let activeCard = document.getElementById(`chunk-item-${activeIdx}`);
    const activeChunk = chunks[activeIdx];
    if (!activeCard && activeChunk) {
      const newCardHtml = `
        <div class="chunk-card active typing" id="chunk-item-${activeIdx}" data-chunk-index="${activeIdx}">
          <div class="chunk-header">
            <div class="chunk-title-group">
              <span class="typing-active-pill">⚡ Coding with students...</span>
              <span class="chunk-title">${activeChunk.title}</span>
            </div>
          </div>
          <div class="chunk-code-area">
            <pre><code id="chunk-code-${activeIdx}"><span class="typing-cursor">&#8203;</span></code></pre>
          </div>
          <div class="chunk-footer">
            <strong>Tactical Rationale:</strong>
            <span>${activeChunk.why}</span>
          </div>
        </div>
      `;
      const allCard = document.getElementById('chunk-all');
      if (allCard) {
        allCard.insertAdjacentHTML('beforebegin', newCardHtml);
      } else {
        container.insertAdjacentHTML('beforeend', newCardHtml);
      }
      needsTypingChunkIdx = activeIdx;
    }

    const allCard = document.getElementById('chunk-all');
    if (allCard) allCard.style.display = 'none';

  } else {
    const visibleMax = isAll ? (chunks.length - 1) : activeIdx;
    let html = '';

    for (let i = 0; i <= visibleMax; i++) {
      const chunk = chunks[i];
      if (!chunk) continue;

      const isCurrentActive = (!isAll && i === activeIdx);
      const alreadyGenerated = typewriter.isChunkGenerated(activeKey, i);

      let pillHtml = `<span class="chunk-num">Part ${i + 1} of ${chunks.length}</span>`;
      let codeBody = '';
      let extraCardClass = '';

      if (isAll || (i < activeIdx) || alreadyGenerated) {
        codeBody = escapeHtml(chunk.code);
        extraCardClass = isCurrentActive ? 'active' : 'completed';
      } else {
        codeBody = '<span class="typing-cursor">&#8203;</span>';
        pillHtml = `<span class="typing-active-pill">⚡ Coding with students...</span>`;
        extraCardClass = 'active typing';
        needsTypingChunkIdx = i;
      }

      html += `
        <div class="chunk-card ${extraCardClass}" id="chunk-item-${i}" data-chunk-index="${i}">
          <div class="chunk-header">
            <div class="chunk-title-group">
              ${pillHtml}
              <span class="chunk-title">${chunk.title}</span>
            </div>
          </div>
          <div class="chunk-code-area">
            <pre><code id="chunk-code-${i}">${codeBody}</code></pre>
          </div>
          <div class="chunk-footer">
            <strong>Tactical Rationale:</strong>
            <span>${chunk.why}</span>
          </div>
        </div>
      `;
    }

    html += `
      <div class="chunk-card complete-mode" id="chunk-all" style="display: ${isAll ? 'block' : 'none'};">
        <div class="chunk-header">
          <div class="chunk-title-group">
            <span class="chunk-num">Complete File</span>
            <span class="chunk-title">${curItem.path}</span>
          </div>
        </div>
        <div class="chunk-code-area">
          <pre><code>${escapeHtml(dynamicBuffer[activeKey] || curItem.content)}</code></pre>
        </div>
      </div>
    `;

    if (container) {
      container.setAttribute('data-step-key', activeKey);
      container.setAttribute('data-active-index', String(activeSectionIndex));
      container.innerHTML = html;
    }
  }

  if (activeViewMode === 'code' && needsTypingChunkIdx !== null) {
    const targetChunk = chunks[needsTypingChunkIdx];
    if (targetChunk) {
      typewriter.startTyping(activeKey, needsTypingChunkIdx, targetChunk.code, chunks.length);
    }
  }

  scrollToActiveChunk();
}

export function setSection(idx) {
  if (activeSectionIndex === idx && activeViewMode === 'code') {
    const chunks = fileSections[activeKey] || [];
    if (chunks[idx] && !typewriter.isChunkGenerated(activeKey, idx)) {
      typewriter.startTyping(activeKey, idx, chunks[idx].code, chunks.length);
    }
    return;
  }
  if (activeSectionIndex !== idx) {
    typewriter.flushActiveTyping();
    activeSectionIndex = idx;
  }
  setViewMode('code');
  renderCodeChunks();
}

function scrollToActiveChunk() {
  const activeEl = document.querySelector('.chunk-card.active') || document.getElementById('chunk-all');
  if (activeEl) {
    activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
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

  navigator.clipboard.writeText(textToCopy).then(() => {
    const label = document.getElementById('copy-btn-label');
    if (label) {
      const orig = label.innerText;
      label.innerText = 'Copied!';
      setTimeout(() => { label.innerText = orig; }, 2000);
    }
  }).catch(err => {
    console.warn('Clipboard write failed:', err);
  });
}

export function copyPresetCSV() {
  const profile = brandProfiles[activePreset] || brandProfiles.boots;
  navigator.clipboard.writeText(profile.csv).then(() => {
    alert(`Recruitment CSV for ${profile.name} copied to clipboard! Ready to paste into impact.com CRM.`);
  }).catch(err => {
    console.warn('Copy failed:', err);
  });
}

// Window global bindings for inline HTML attributes
window.handleWeightChange = handleWeightChange;
window.copyCurrentChunkCode = copyCurrentChunkCode;
window.copyPresetCSV = copyPresetCSV;

// Keyboard Listeners
window.addEventListener('keydown', (e) => {
  const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
  if (tag === 'input' || tag === 'textarea') return;

  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= 6) {
    loadStep(stepKeys[num - 1], true);
    return;
  }

  if (e.key === 's' || e.key === 'S') {
    setViewMode('slide');
  } else if (e.key === 'c' || e.key === 'C') {
    setViewMode('code');
  } else if (e.key === 'ArrowRight' || e.key === ' ') {
    if (activeViewMode === 'slide') {
      nextSlideStage();
    } else {
      const chunks = fileSections[activeKey] || [];
      if (typeof activeSectionIndex === 'number' && activeSectionIndex < chunks.length - 1) {
        setSection(activeSectionIndex + 1);
      } else if (activeSectionIndex !== 'all') {
        setSection('all');
      } else {
        const curStepIdx = stepKeys.indexOf(activeKey);
        if (curStepIdx >= 0 && curStepIdx < stepKeys.length - 1) {
          loadStep(stepKeys[curStepIdx + 1], true);
        }
      }
    }
  } else if (e.key === 'ArrowLeft') {
    if (activeViewMode === 'slide') {
      prevSlideStage();
    } else {
      if (activeSectionIndex === 'all') {
        const chunks = fileSections[activeKey] || [];
        setSection(chunks.length - 1);
      } else if (typeof activeSectionIndex === 'number' && activeSectionIndex > 0) {
        setSection(activeSectionIndex - 1);
      } else {
        setViewMode('slide');
        const totalStages = (slideStageTitles[activeKey] || []).length;
        setSlideStage(Math.max(0, totalStages - 1));
      }
    }
  }
});

// Spatial Zoom Engine Instance
const spatialZoom = new SpatialZoomEngine(document.getElementById('workshop-viewport'));

// Global Floating Dock & Telemetry Actions
window.setWorkshopMode = (mode) => {
  setViewMode(mode);
  sync.broadcast('SET_MODE', { mode });
};

window.toggleSlideCodeMode = () => {
  const nextMode = activeViewMode === 'slide' ? 'code' : 'slide';
  window.setWorkshopMode(nextMode);
};

window.advanceSlideOrChunk = () => {
  if (activeViewMode === 'slide') {
    nextSlideStage();
  } else {
    const chunks = fileSections[activeKey] || [];
    if (typeof activeSectionIndex === 'number' && activeSectionIndex < chunks.length - 1) {
      setSection(activeSectionIndex + 1);
    } else if (activeSectionIndex !== 'all') {
      setSection('all');
    } else {
      const curStepIdx = stepKeys.indexOf(activeKey);
      if (curStepIdx >= 0 && curStepIdx < stepKeys.length - 1) {
        loadStep(stepKeys[curStepIdx + 1], true);
      }
    }
  }
};

// Initialise
loadStep('setup', true);

