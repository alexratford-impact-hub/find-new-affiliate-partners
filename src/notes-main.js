/**
 * Facilitator Console & Teleprompter Entry Module (src/notes-main.js)
 * Coordinates 70m masterclass session clock, sprint timers, teleprompter scripts, and sync bus.
 */

import { stepKeys, speakerData, stepMilestones } from './data/curriculum.js';
import { WorkshopSync } from './lib/sync.js';
import { MasterClock, SectionClock, TaskSprintTimer, PacingCalculator, formatTime } from './lib/timer.js';

// Application State
let activeKey = 'setup';
let activeHcdcPhase = 'hook'; // 'hook' | 'chunk' | 'do' | 'error'
let activeSectionIndex = 0;   // 0..N-1 for chunks, or 'all'
let activeSlideStage = 0;
let facilitatorMode = 'slide';
let speedRunSetting = 'AUTO'; // 'AUTO' | 'FORCE_ON' | 'FORCE_OFF'
let isAutoOvertime = false;
const stepCompletionState = {};

const stepSlideStageCounts = {
  setup: 3,
  brand: 2,
  math: 3,
  discovery: 3,
  skill: 3,
  run: 3
};

// Cross-Window Sync Bus
const sync = new WorkshopSync({
  role: 'notes',
  onConnectionChange: (connected) => {
    const box = document.getElementById('sync-box');
    const label = document.getElementById('sync-label');
    if (box) box.classList.toggle('connected', connected);
    if (label) {
      label.innerText = connected ? 'Connected to workshop.html' : 'Searching for workshop.html...';
    }
  }
});

// Pacing Engine
const pacingEngine = new PacingCalculator(stepMilestones);

// Clocks & Timers
const masterClock = new MasterClock({
  totalSeconds: 4200, // 70 minutes
  onTick: (remaining, elapsed) => {
    const display = document.getElementById('master-timer-display');
    if (display) display.innerText = formatTime(remaining);

    // Alert styling: amber at 15m, pulsing red at 5m
    if (display) {
      if (remaining <= 300) {
        display.style.color = '#F5333F';
        display.classList.add('pulse-alert');
      } else if (remaining <= 900) {
        display.style.color = '#F59E0B';
        display.classList.remove('pulse-alert');
      } else {
        display.style.color = '#F8FAFC';
        display.classList.remove('pulse-alert');
      }
    }

    calculatePacing(elapsed);
  },
  onStateChange: (running) => {
    const btn = document.getElementById('master-clock-btn');
    if (btn) btn.innerText = running ? 'Pause' : 'Start';
  }
});

const sectionClock = new SectionClock({
  onTick: (remaining) => {
    const display = document.getElementById('section-timer-display');
    if (display) display.innerText = formatTime(remaining);
  }
});

const sprintTimer = new TaskSprintTimer({
  onTick: (remaining, timeStr) => {
    const display = document.getElementById('task-timer-display');
    if (display) display.innerText = timeStr;
  },
  onStateChange: (running) => {
    const btn = document.getElementById('task-sprint-btn');
    const badge = document.getElementById('sprint-status-badge');
    if (btn) btn.innerText = running ? '⏸ Pause' : '🚀 Start Coding';
    if (badge) {
      badge.className = running ? 'sprint-badge active' : 'sprint-badge idle';
      badge.innerText = running ? 'RUNNING' : 'PAUSED';
    }
  },
  onBroadcast: (data) => {
    sync.broadcast('CODING_SPRINT', data);
  }
});

// Pacing & Speed-Run Mode
function calculatePacing(elapsedSeconds) {
  if (elapsedSeconds === undefined) {
    elapsedSeconds = masterClock.getElapsedSeconds();
  }

  const result = pacingEngine.evaluate(activeKey, elapsedSeconds);
  const badge = document.getElementById('pacing-badge');
  if (badge) {
    badge.innerText = result.label;
    badge.className = `pacing-badge ${result.status === 'ahead' ? 'pacing-ok' : (result.status === 'behind' ? 'pacing-danger' : 'pacing-ok')}`;
  }

  isAutoOvertime = (result.status === 'behind');
  updateSpeedRunUI();
}

export function isEffectiveSpeedRun() {
  if (speedRunSetting === 'FORCE_ON') return true;
  if (speedRunSetting === 'FORCE_OFF') return false;
  return isAutoOvertime;
}

export function toggleSpeedRunMode() {
  if (speedRunSetting === 'AUTO') {
    speedRunSetting = 'FORCE_ON';
  } else if (speedRunSetting === 'FORCE_ON') {
    speedRunSetting = 'FORCE_OFF';
  } else {
    speedRunSetting = 'AUTO';
  }
  updateSpeedRunUI();
  setHcdcPhase(activeHcdcPhase, false);
}

function updateSpeedRunUI() {
  const btn = document.getElementById('btn-speedrun-toggle');
  const label = document.getElementById('speedrun-mode-label');
  const cueCard = document.getElementById('note-cue-card');
  const sayPill = document.getElementById('say-mode-pill');
  const active = isEffectiveSpeedRun();

  if (btn) btn.classList.toggle('speedrun-active', active);
  if (cueCard) cueCard.classList.toggle('speedrun-active', active);

  if (label) {
    if (speedRunSetting === 'FORCE_ON') {
      label.innerHTML = `<span style="color:#F59E0B;">ON (15s)</span>`;
    } else if (speedRunSetting === 'FORCE_OFF') {
      label.innerText = `OFF (45s)`;
    } else {
      label.innerHTML = active
        ? `<span style="color:#EF4444;">AUTO: BEHIND (+15s)</span>`
        : `AUTO: ON TRACK`;
    }
  }

  if (sayPill) {
    if (active) {
      sayPill.style.background = 'rgba(245, 158, 11, 0.2)';
      sayPill.style.color = '#F59E0B';
      sayPill.innerText = '⚡ SPEED-RUN (15s PUNCHY POINTS)';
    } else {
      sayPill.style.background = 'rgba(41, 141, 218, 0.2)';
      sayPill.style.color = 'var(--color-accent)';
      sayPill.innerText = 'STANDARD SCRIPT (45s)';
    }
  }
}

function formatSayContent(text) {
  if (!text) return "";
  if (text.includes('•') || text.includes('\n- ') || text.includes('\n• ') || text.includes('\n1.')) {
    const lines = text.split('\n');
    return lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d+\./.test(trimmed)) {
        const clean = trimmed.replace(/^([•\-]|(\d+\.))\s*/, '');
        const formatted = clean.replace(/^([^:]+):/, '<strong style="color:#FFFFFF;">$1:</strong>');
        return `<div style="display:flex; align-items:flex-start; gap:8px; margin-bottom:6px;">
          <span style="color:#F59E0B; font-weight:800; line-height:1.4;">•</span>
          <span style="line-height:1.45;">${formatted}</span>
        </div>`;
      }
      return `<p style="margin-bottom:6px; line-height:1.45;">${line}</p>`;
    }).join('');
  }
  return text;
}

// 70M Masterclass Execution Ledger Modal
export function toggleLedgerModal() {
  const modal = document.getElementById('ledger-modal-backdrop');
  if (modal) {
    modal.classList.toggle('open');
  }
}

// HCDC Phase Switcher
export function setHcdcPhase(phase, syncProjector = true) {
  activeHcdcPhase = phase;
  const step = speakerData[activeKey] || speakerData.setup;
  const hcdc = step.hcdc || {};
  const current = hcdc[phase] || hcdc.hook;

  ['hook', 'chunk', 'do', 'error'].forEach(p => {
    const btn = document.getElementById(`tab-phase-${p}`);
    if (btn) btn.classList.toggle('active', p === phase);
  });

  const actionTextEl = document.getElementById('stage-action-text');
  const actionLabelEl = document.getElementById('stage-action-phase-label');
  if (actionTextEl) actionTextEl.innerText = current.action || "";
  if (actionLabelEl) actionLabelEl.innerText = (current.title || phase).toUpperCase();

  const chunkStepper = document.getElementById('chunk-stepper-container');
  if (chunkStepper) {
    chunkStepper.style.display = (phase === 'chunk') ? 'flex' : 'none';
  }

  const sayHeading = document.getElementById('note-say-heading');
  const sayEl = document.getElementById('note-say');
  const speedRunActive = isEffectiveSpeedRun();

  if (sayHeading) {
    const phaseName = (phase === 'error') ? (current.title || 'The Error Embrace') : (phase === 'hook' ? 'The Hook' : (phase === 'chunk' ? 'The Chunk' : 'The Do'));
    sayHeading.innerText = `Say This to the Room (${phaseName} Script)`;
  }

  const scriptContent = (speedRunActive && current.speedScript) ? current.speedScript : current.script;
  if (sayEl) sayEl.innerHTML = formatSayContent(scriptContent);

  if (syncProjector) {
    if (phase === 'hook') {
      setFacilitatorMode('slide');
    } else if (phase === 'chunk') {
      setFacilitatorMode('code');
      renderSpeakerStepper();
    } else if (phase === 'do') {
      setFacilitatorMode('code');
    }
  }
}

// Facilitator Stepper & Code Parts Navigation
export function renderSpeakerStepper() {
  const step = speakerData[activeKey];
  if (!step) return;

  const parts = step.parts || [];
  const tabsList = document.getElementById('substep-tabs-list');
  if (!tabsList) return;

  let html = '';
  parts.forEach((p, idx) => {
    const isActive = activeSectionIndex === idx;
    html += `
      <button class="substep-tab ${isActive ? 'active' : ''}" onclick="window.setSpeakerSection(${idx})">
        <span>Part ${idx + 1}</span>
      </button>
    `;
  });

  const isAllActive = activeSectionIndex === 'all';
  html += `
    <button class="substep-tab full-file ${isAllActive ? 'active' : ''}" onclick="window.setSpeakerSection('all')">
      <span>📄 Full File</span>
    </button>
  `;

  tabsList.innerHTML = html;

  const prevBtn = document.getElementById('btn-substep-prev');
  const nextBtn = document.getElementById('btn-substep-next');
  if (prevBtn) prevBtn.disabled = activeSectionIndex === 0;
  if (nextBtn) nextBtn.disabled = activeSectionIndex === 'all';

  const badgeEl = document.getElementById('substep-title-badge');
  const syncLabelEl = document.getElementById('substep-sync-label');
  const previewEl = document.getElementById('substep-code-preview');

  if (previewEl) previewEl.style.display = (activeHcdcPhase === 'chunk') ? 'block' : 'none';

  if (activeSectionIndex === 'all') {
    if (badgeEl) badgeEl.innerHTML = `<span>📄 Complete Assembled File</span>`;
    if (syncLabelEl) syncLabelEl.innerText = `● Projecting complete file`;
    if (previewEl) previewEl.innerText = step.fullFileCode || "";
  } else {
    const currentPart = parts[activeSectionIndex] || parts[0];
    if (badgeEl) badgeEl.innerHTML = `<span>${currentPart.title}</span>`;
    if (syncLabelEl) syncLabelEl.innerText = `● Projecting Part ${activeSectionIndex + 1} of ${parts.length}`;
    if (previewEl) previewEl.innerText = currentPart.code || "";
  }
}

export function setSpeakerSection(idx) {
  activeSectionIndex = idx;
  facilitatorMode = 'code';
  const slideBtn = document.getElementById('btn-mode-slide');
  const codeBtn = document.getElementById('btn-mode-code');
  if (slideBtn) slideBtn.classList.remove('active');
  if (codeBtn) codeBtn.classList.add('active');

  renderSpeakerStepper();
  sync.broadcast('SET_MODE', { mode: 'code' });
  sync.broadcast('SET_SECTION', { index: idx, key: activeKey });
}

export function nextSpeakerSection() {
  const step = speakerData[activeKey];
  if (!step) return;
  const parts = step.parts || [];
  if (activeSectionIndex === 'all') return;
  if (activeSectionIndex < parts.length - 1) {
    setSpeakerSection(activeSectionIndex + 1);
  } else {
    setSpeakerSection('all');
  }
}

export function prevSpeakerSection() {
  const step = speakerData[activeKey];
  if (!step) return;
  const parts = step.parts || [];
  if (activeSectionIndex === 'all') {
    setSpeakerSection(parts.length - 1);
  } else if (activeSectionIndex > 0) {
    setSpeakerSection(activeSectionIndex - 1);
  } else {
    setHcdcPhase('hook');
    const totalStages = stepSlideStageCounts[activeKey] || 3;
    activeSlideStage = totalStages - 1;
    sync.broadcast('SET_SLIDE_STAGE', { stage: activeSlideStage, key: activeKey });
  }
}

export function facilitatorRevealNext() {
  if (activeHcdcPhase === 'hook') {
    const totalStages = stepSlideStageCounts[activeKey] || 3;
    if (activeSlideStage < totalStages - 1) {
      activeSlideStage++;
      sync.broadcast('SET_SLIDE_STAGE', { stage: activeSlideStage, key: activeKey });
    } else {
      setHcdcPhase('chunk');
      setSpeakerSection(0);
    }
  } else if (activeHcdcPhase === 'chunk') {
    const step = speakerData[activeKey];
    const parts = step ? (step.parts || []) : [];
    if (activeSectionIndex < parts.length - 1) {
      setSpeakerSection(activeSectionIndex + 1);
    } else if (activeSectionIndex === parts.length - 1) {
      setSpeakerSection('all');
    } else {
      setHcdcPhase('do');
    }
  } else if (activeHcdcPhase === 'do') {
    setHcdcPhase('error');
  } else if (activeHcdcPhase === 'error') {
    const curIdx = stepKeys.indexOf(activeKey);
    if (curIdx < stepKeys.length - 1) {
      broadcastStep(stepKeys[curIdx + 1]);
    }
  }
}

// Mode & Step Controls
export function setFacilitatorMode(mode) {
  facilitatorMode = mode;
  const slideBtn = document.getElementById('btn-mode-slide');
  const codeBtn = document.getElementById('btn-mode-code');
  if (slideBtn) slideBtn.classList.toggle('active', mode === 'slide');
  if (codeBtn) codeBtn.classList.toggle('active', mode === 'code');

  sync.broadcast('SET_MODE', { mode: mode });
}

export function broadcastStep(key) {
  activeKey = key;
  activeSectionIndex = 0;
  activeSlideStage = 0;
  activeHcdcPhase = 'hook';
  facilitatorMode = 'slide';

  const slideBtn = document.getElementById('btn-mode-slide');
  const codeBtn = document.getElementById('btn-mode-code');
  if (slideBtn) slideBtn.classList.add('active');
  if (codeBtn) codeBtn.classList.remove('active');

  document.querySelectorAll('.step-card').forEach(el => el.classList.remove('active'));
  const activeCard = document.getElementById('card-' + key);
  if (activeCard) activeCard.classList.add('active');

  const step = speakerData[key] || speakerData.setup;
  document.getElementById('active-step-title').innerText = step.title;

  const winEl = document.getElementById('milestone-window');
  const goalEl = document.getElementById('milestone-goal');
  const artEl = document.getElementById('milestone-artifact');
  if (winEl) winEl.innerText = step.window;
  if (goalEl) goalEl.innerHTML = `<strong>Goal:</strong> ${step.goal}`;
  if (artEl) artEl.innerText = `📦 ${step.artifact}`;

  const phase4Title = document.getElementById('title-phase-error');
  const phase4Sub = document.getElementById('sub-phase-error');
  const isCommit = (key === 'run');
  if (phase4Title) phase4Title.innerText = isCommit ? '🎯 The Commit' : '🛡️ Error Embrace';
  if (phase4Sub) phase4Sub.innerText = isCommit ? 'CRM Habits' : 'Recovery Drill';

  const hcdc = step.hcdc || {};
  const hookDur = document.getElementById('badge-phase-hook');
  const chunkDur = document.getElementById('badge-phase-chunk');
  const doDur = document.getElementById('badge-phase-do');
  const errDur = document.getElementById('badge-phase-error');
  if (hookDur && hcdc.hook) hookDur.innerText = hcdc.hook.duration;
  if (chunkDur && hcdc.chunk) chunkDur.innerText = hcdc.chunk.duration;
  if (doDur && hcdc.do) doDur.innerText = `${Math.round(hcdc.do.sprintSeconds / 60)}m Sprint`;
  if (errDur && hcdc.error) errDur.innerText = hcdc.error.duration;

  const checkEl = document.getElementById('step-done-check');
  if (checkEl) checkEl.checked = !!stepCompletionState[key];

  const milestone = stepMilestones[key];
  if (milestone) {
    sprintTimer.init(milestone.sprintDuration);
    sectionClock.init(milestone.sprintDuration);
  }

  calculatePacing();
  setHcdcPhase('hook', false);

  sync.broadcast('LOAD_STEP', { key: key });
  sync.broadcast('SET_MODE', { mode: 'slide' });
}

export function selectBrandPreset(preset) {
  document.querySelectorAll('.btn-preset').forEach(btn => {
    btn.classList.toggle('active', btn.id === `btn-preset-${preset}`);
  });
  sync.broadcast('APPLY_PRESET', { preset: preset });
}

export function broadcastCheck(isChecked) {
  stepCompletionState[activeKey] = isChecked;
  sync.broadcast('TOGGLE_CHECK', { key: activeKey, checked: isChecked });
}

// Window global bindings for inline HTML attributes
window.toggleMasterClock = () => masterClock.toggle();
window.resetMasterClock = () => masterClock.reset();
window.resetSectionClock = () => {
  const milestone = stepMilestones[activeKey];
  if (milestone) sectionClock.reset(milestone.sprintDuration);
};
window.toggleTaskSprint = () => sprintTimer.toggle();
window.addTaskSprintMinute = () => sprintTimer.addMinute();
window.resetTaskSprint = () => sprintTimer.reset();
window.toggleLedgerModal = toggleLedgerModal;
window.toggleSpeedRunMode = toggleSpeedRunMode;
window.setFacilitatorMode = setFacilitatorMode;
window.selectBrandPreset = selectBrandPreset;
window.setHcdcPhase = setHcdcPhase;
window.setSpeakerSection = setSpeakerSection;
window.nextSpeakerSection = nextSpeakerSection;
window.prevSpeakerSection = prevSpeakerSection;
window.facilitatorRevealNext = facilitatorRevealNext;
window.broadcastStep = broadcastStep;
window.broadcastCheck = broadcastCheck;

// Keyboard Listeners
window.addEventListener('keydown', (e) => {
  const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
  if (tag === 'input' || tag === 'textarea') return;

  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= 6) {
    broadcastStep(stepKeys[num - 1]);
    return;
  }

  if (e.key === 's' || e.key === 'S') {
    setFacilitatorMode('slide');
  } else if (e.key === 'c' || e.key === 'C') {
    setFacilitatorMode('code');
  } else if (e.key === ' ' || e.key === 'ArrowRight') {
    e.preventDefault();
    facilitatorRevealNext();
  } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
    prevSpeakerSection();
  } else if (e.key === ']') {
    nextSpeakerSection();
  } else if (e.key === '[') {
    prevSpeakerSection();
  }
});

// Initialise with Step 0
broadcastStep('setup');
