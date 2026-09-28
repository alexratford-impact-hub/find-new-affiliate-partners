/**
 * Facilitator Console & Teleprompter Entry Module (src/notes-main.js)
 * Coordinates 70m masterclass session clock, sprint timers, teleprompter scripts, and sync bus.
 */

import {
  WorkshopEngine,
  stepKeys,
  speakerData,
  stepMilestones,
  stepSlideStageCounts,
  fileSections,
  formatTime,
  curriculum,
  slideStageTitles,
  escapeHtml
} from './lib/workshop-core.js';

// Centralized Engine Instance for Notes/Console
export const engine = new WorkshopEngine({ role: 'notes' });

// Local Facilitator Console State
let activeKey = 'agenda';
let activeHcdcPhase = 'hook'; // 'hook' | 'chunk' | 'do' | 'error'
let speedRunSetting = 'AUTO'; // 'AUTO' | 'FORCE_ON' | 'FORCE_OFF'
let isAutoOvertime = false;

// Sync Status helper
function updateSyncStatus(connected) {
  const box = document.getElementById('sync-box');
  const label = document.getElementById('sync-label');
  if (box) box.classList.toggle('connected', connected);
  if (label) {
    label.innerText = connected ? 'Connected to workshop.html' : 'Searching for workshop.html...';
  }
}
updateSyncStatus(true);

// Subscribe to WorkshopEngine state changes
engine.subscribe((state, changeType, payload) => {
  activeKey = state.activeKey || activeKey;
  if (changeType === 'STEP_LOADED') {
    renderStepView(state.activeKey);
  } else if (changeType === 'MODE_CHANGED') {
    updateModeUI(state.viewMode);
  } else if (changeType === 'PRESET_APPLIED') {
    updatePresetUI(state.activePreset);
  } else if (changeType === 'SECTION_CHANGED') {
    renderSpeakerStepper();
  } else if (changeType === 'SLIDE_STAGE_CHANGED') {
    updateSlideStageNotes();
  } else if (changeType === 'CODING_SPRINT_UPDATE') {
    updateSprintUI();
  } else if (changeType === 'MASTER_CLOCK_TICK') {
    updateMasterClockUI(payload.remaining, payload.elapsed);
  } else if (changeType === 'MASTER_CLOCK_STATE') {
    const btn = document.getElementById('master-clock-btn');
    if (btn) btn.innerText = payload.running ? 'Pause' : 'Start';
  } else if (changeType === 'SECTION_CLOCK_TICK') {
    const display = document.getElementById('section-timer-display');
    if (display) display.innerText = formatTime(payload.remaining);
  } else if (changeType === 'STEP_CHECK_TOGGLED') {
    const checkEl = document.getElementById('step-done-check');
    if (checkEl && payload.key === state.activeKey) {
      checkEl.checked = !!payload.checked;
    }
  }
});

function updateModeUI(mode) {
  const slideBtn = document.getElementById('btn-mode-slide');
  const codeBtn = document.getElementById('btn-mode-code');
  if (slideBtn) slideBtn.classList.toggle('active', mode === 'slide');
  if (codeBtn) codeBtn.classList.toggle('active', mode === 'code');
}

function updatePresetUI(preset) {
  document.querySelectorAll('.btn-preset').forEach(btn => {
    btn.classList.toggle('active', btn.id === `btn-preset-${preset}`);
  });
}

function updateSprintUI() {
  const display = document.getElementById('task-timer-display');
  if (display) display.innerText = engine.state.codingSprintTimeStr;
  const btn = document.getElementById('task-sprint-btn');
  const badge = document.getElementById('sprint-status-badge');
  const running = engine.state.isCodingSprintActive;
  if (btn) btn.innerText = running ? '⏸ Pause' : '🚀 Start Coding';
  if (badge) {
    badge.className = running ? 'sprint-badge active' : 'sprint-badge idle';
    badge.innerText = running ? 'RUNNING' : 'PAUSED';
  }
}

function updateMasterClockUI(remaining, elapsed) {
  const display = document.getElementById('master-timer-display');
  if (display) {
    display.innerText = formatTime(remaining);
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
}

// Pacing & Speed-Run Mode
function calculatePacing(elapsedSeconds) {
  if (elapsedSeconds === undefined) {
    elapsedSeconds = 4200 - engine.state.masterRemaining;
  }

  const milestone = stepMilestones[engine.state.activeKey];
  let status = 'ahead';
  let label = '● ON TRACK';

  if (milestone && typeof milestone.targetElapsed === 'number') {
    const delta = milestone.targetElapsed - elapsedSeconds;
    if (delta < -60) {
      status = 'behind';
      label = `⚠️ ${Math.abs(Math.round(delta / 60))}m BEHIND`;
    } else if (delta > 120) {
      status = 'ahead';
      label = `⚡ ${Math.round(delta / 60)}m AHEAD`;
    }
  }

  const badge = document.getElementById('pacing-badge');
  if (badge) {
    badge.innerText = label;
    badge.className = `pacing-badge ${status === 'behind' ? 'pacing-danger' : 'pacing-ok'}`;
  }

  isAutoOvertime = (status === 'behind');
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
  const step = speakerData[activeKey] || speakerData.agenda;
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
  } else if (phase === 'chunk') {
    renderSpeakerStepper();
  }
}

// Facilitator Stepper & Code Parts Navigation
// Facilitator Stepper & Code Parts Navigation
export function renderSpeakerStepper() {
  const currentKey = engine.state.activeKey;
  const step = speakerData[currentKey];
  if (!step) return;

  const chunks = fileSections[currentKey] || [];
  const curItem = curriculum[currentKey] || {};
  const tabsList = document.getElementById('substep-tabs-list');
  if (!tabsList) return;

  if (chunks.length === 0) {
    tabsList.innerHTML = `<span style="font-size:12px; color:#94A3B8; padding:4px 8px;">No code chunks for this overview step</span>`;
    const badgeEl = document.getElementById('substep-title-badge');
    const syncLabelEl = document.getElementById('substep-sync-label');
    const previewEl = document.getElementById('substep-code-preview');
    if (badgeEl) badgeEl.innerHTML = `<span>${curItem.name || 'Overview'}</span>`;
    if (syncLabelEl) syncLabelEl.innerText = `● Projecting slide overview`;
    if (previewEl) previewEl.style.display = 'none';
    return;
  }

  let html = '';
  chunks.forEach((chunk, idx) => {
    const isActive = engine.state.activeSectionIndex === idx;
    html += `
      <button class="substep-tab ${isActive ? 'active' : ''}" data-part-index="${idx}" title="${escapeHtml(chunk.title)}">
        <span>Part ${idx + 1}</span>
      </button>
    `;
  });

  const isAllActive = engine.state.activeSectionIndex === 'all';
  html += `
    <button class="substep-tab full-file ${isAllActive ? 'active' : ''}" data-part-index="all" title="Assembled Complete File">
      <span>📄 Full File</span>
    </button>
  `;

  tabsList.innerHTML = html;

  // Re-attach listeners to dynamically rendered tabs
  tabsList.querySelectorAll('.substep-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const idxAttr = btn.getAttribute('data-part-index');
      setSpeakerSection(idxAttr === 'all' ? 'all' : parseInt(idxAttr, 10));
    });
  });

  const prevBtn = document.getElementById('btn-substep-prev');
  const nextBtn = document.getElementById('btn-substep-next');
  if (prevBtn) prevBtn.disabled = engine.state.activeSectionIndex === 0;
  if (nextBtn) nextBtn.disabled = engine.state.activeSectionIndex === 'all';

  const badgeEl = document.getElementById('substep-title-badge');
  const syncLabelEl = document.getElementById('substep-sync-label');
  const previewEl = document.getElementById('substep-code-preview');

  if (previewEl) previewEl.style.display = (activeHcdcPhase === 'chunk') ? 'block' : 'none';

  if (engine.state.activeSectionIndex === 'all') {
    if (badgeEl) badgeEl.innerHTML = `<span>📄 Complete Assembled File: ${curItem.path || ''}</span>`;
    if (syncLabelEl) syncLabelEl.innerText = `● Projecting complete file (${chunks.length} parts)`;
    if (previewEl) {
      previewEl.innerText = curItem.content || step.fullFileCode || "";
    }
  } else {
    const currentChunk = chunks[engine.state.activeSectionIndex] || chunks[0] || {};
    if (badgeEl) badgeEl.innerHTML = `<span>${currentChunk.title || 'Part 1'}</span>`;
    const partNum = typeof engine.state.activeSectionIndex === 'number' ? engine.state.activeSectionIndex + 1 : 1;
    if (syncLabelEl) syncLabelEl.innerText = `● Projecting Part ${partNum} of ${chunks.length}`;
    if (previewEl) {
      let codeText = currentChunk.code || "";
      if (currentChunk.why) {
        codeText += `\n\n# Tactical Rationale:\n# ${currentChunk.why}`;
      }
      previewEl.innerText = codeText;
    }
  }
}

export function setSpeakerSection(idx) {
  engine.setSection(idx);
  engine.setViewMode('code');
  renderSpeakerStepper();
}

export function nextSpeakerSection() {
  engine.next();
}

export function prevSpeakerSection() {
  engine.prev();
}

export function facilitatorRevealNext() {
  engine.next();
}

// Mode & Step Controls
export function setFacilitatorMode(mode) {
  engine.setViewMode(mode);
}

export function broadcastStep(key) {
  engine.loadStep(key, true);
}

export function selectBrandPreset(preset) {
  engine.applyPreset(preset);
}

export function broadcastCheck(isChecked) {
  engine.toggleCheck(engine.state.activeKey, isChecked);
}

export function toggleMasterClock() {
  engine.toggleMasterClock();
}

export function resetMasterClock() {
  engine.resetMasterClock(4200);
}

export function toggleSprint() {
  engine.toggleSprint();
}

export function resetSprint() {
  engine.resetSprint();
}

export function addSprintMinute() {
  engine.adjustSprintTime(60);
}

function updateSlideStageNotes() {
  const currentKey = engine.state.activeKey;
  const stages = slideStageTitles[currentKey] || [];
  const stageIdx = engine.state.activeSlideStage || 0;
  const stageTitle = stages[stageIdx] || `Stage ${stageIdx + 1}`;
  const isFinalStage = stageIdx >= stages.length - 1;
  const curItem = curriculum[currentKey] || {};

  const actionLabelEl = document.getElementById('stage-action-phase-label');
  const actionTextEl = document.getElementById('stage-action-text');
  const sayHeading = document.getElementById('note-say-heading');
  const sayEl = document.getElementById('note-say');

  if (engine.state.viewMode === 'slide') {
    if (actionLabelEl) {
      actionLabelEl.innerText = `SLIDE STAGE ${stageIdx + 1}/${stages.length}: ${stageTitle.toUpperCase()}`;
    }

    if (isFinalStage && stages.length > 1) {
      if (actionTextEl) {
        actionTextEl.innerText = `Presenting final stage: ${stageTitle}. Deliver takeaway, verify attendee laptops, and prepare for code demonstration.`;
      }
      if (sayHeading) {
        sayHeading.innerText = `Say This to the Room (${stageTitle} Wrap-Up)`;
      }
      if (sayEl && curItem.takeaway) {
        sayEl.innerHTML = formatSayContent(
          `• <strong>Core Takeaway:</strong> ${curItem.takeaway}\n` +
          `• <strong>Executive Alignment:</strong> Confirm the room understands the failure mode and structural antidote.\n` +
          `• <strong>Next Action:</strong> Press [C] to switch to Code Mode or [Space] to reveal the local build steps.`
        );
      }
    } else {
      const step = speakerData[currentKey] || speakerData.agenda;
      const hcdc = step.hcdc || {};
      const current = hcdc[activeHcdcPhase] || hcdc.hook;
      if (actionTextEl) {
        actionTextEl.innerText = `Focusing on ${stageTitle}. ${current.action || ''}`;
      }
    }
  }
}

function renderStepView(key) {
  activeKey = key;
  document.querySelectorAll('.step-card').forEach(el => el.classList.remove('active'));
  const activeCard = document.getElementById('card-' + key);
  if (activeCard) activeCard.classList.add('active');

  const step = speakerData[key] || speakerData.agenda;
  const curItem = curriculum[key] || {};
  const titleEl = document.getElementById('active-step-title');
  if (titleEl) {
    if (key === 'agenda') {
      titleEl.innerText = '0. Agenda & Run of Play (00:00 - 05:00)';
    } else if (key === 'setup') {
      titleEl.innerText = 'Kickoff & Setup: AI Blind Spot (05:00 - 13:00)';
    } else {
      const cleanTitle = step.title.replace(/^\d+\.\s*/, '');
      titleEl.innerText = `Step ${curItem.stepNum} of 5: ${cleanTitle}`;
    }
  }

  const winEl = document.getElementById('milestone-window');
  const goalEl = document.getElementById('milestone-goal');
  const artEl = document.getElementById('milestone-artifact');
  if (winEl) winEl.innerText = step.window;
  if (goalEl) goalEl.innerHTML = `<strong>Goal:</strong> ${step.goal}`;
  if (artEl) {
    const artifactText = (key === 'run') ? 'SKILL.md (Runtime) & Candidate CSV' : step.artifact;
    artEl.innerText = `📦 ${artifactText}`;
  }

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
  if (doDur && hcdc.do) doDur.innerText = hcdc.do.sprintSeconds > 0 ? `${Math.round(hcdc.do.sprintSeconds / 60)}m Sprint` : 'Active';
  if (errDur && hcdc.error) errDur.innerText = hcdc.error.duration;

  const checkEl = document.getElementById('step-done-check');
  if (checkEl) checkEl.checked = !!(engine.state.checkedSteps && engine.state.checkedSteps[key]);

  const milestone = stepMilestones[key];
  if (milestone) {
    engine.resetSprint(milestone.sprintDuration || 180);
    const prevElapsed = stepMilestones[stepKeys[Math.max(0, stepKeys.indexOf(key)-1)]]?.targetElapsed || 0;
    engine.resetSectionClock(milestone.targetElapsed ? (milestone.targetElapsed - prevElapsed) : 300);
  }

  calculatePacing();
  setHcdcPhase('hook', false);
  renderSpeakerStepper();
}

// Attach Event Listeners directly to DOM elements
document.addEventListener('DOMContentLoaded', () => {
  // Preset Buttons
  document.getElementById('btn-preset-boots')?.addEventListener('click', () => selectBrandPreset('boots'));
  document.getElementById('btn-preset-argos')?.addEventListener('click', () => selectBrandPreset('argos'));
  document.getElementById('btn-preset-loveholidays')?.addEventListener('click', () => selectBrandPreset('loveholidays'));

  // Mode Buttons
  document.getElementById('btn-mode-slide')?.addEventListener('click', () => setFacilitatorMode('slide'));
  document.getElementById('btn-mode-code')?.addEventListener('click', () => setFacilitatorMode('code'));

  // Master Clock
  document.getElementById('master-clock-btn')?.addEventListener('click', () => toggleMasterClock());
  document.querySelector('.timer-module.master-module .btn-icon')?.addEventListener('click', () => resetMasterClock());

  // Section Clock
  document.querySelector('.timer-module.section-module .btn-icon')?.addEventListener('click', () => {
    const milestone = stepMilestones[engine.state.activeKey];
    if (milestone) engine.resetSectionClock();
  });

  // Task Sprint
  document.getElementById('task-sprint-btn')?.addEventListener('click', () => toggleSprint());
  document.querySelector('.timer-module.sprint-module button[title="Add 1 minute"]')?.addEventListener('click', () => addSprintMinute());
  document.querySelector('.timer-module.sprint-module .btn-icon')?.addEventListener('click', () => resetSprint());

  // Ledger & Speedrun
  document.querySelector('.btn-ledger')?.addEventListener('click', toggleLedgerModal);
  document.querySelector('.ledger-modal-close')?.addEventListener('click', toggleLedgerModal);
  document.getElementById('ledger-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) toggleLedgerModal();
  });
  document.getElementById('btn-speedrun-toggle')?.addEventListener('click', toggleSpeedRunMode);

  // Steps Navigation
  stepKeys.forEach(k => {
    document.getElementById('card-' + k)?.addEventListener('click', () => broadcastStep(k));
  });

  // HCDC Tabs
  ['hook', 'chunk', 'do', 'error'].forEach(p => {
    document.getElementById(`tab-phase-${p}`)?.addEventListener('click', () => setHcdcPhase(p));
  });

  // Substep navigation buttons
  document.getElementById('btn-substep-prev')?.addEventListener('click', prevSpeakerSection);
  document.getElementById('btn-substep-next')?.addEventListener('click', nextSpeakerSection);

  // Checkbox
  document.getElementById('step-done-check')?.addEventListener('change', (e) => broadcastCheck(e.target.checked));
});

// Expose handlers to window for inline onclick attributes
if (typeof window !== 'undefined') {
  window.selectBrandPreset = selectBrandPreset;
  window.setFacilitatorMode = setFacilitatorMode;
  window.toggleMasterClock = toggleMasterClock;
  window.resetMasterClock = resetMasterClock;
  window.toggleSprint = toggleSprint;
  window.resetSprint = resetSprint;
  window.addSprintMinute = addSprintMinute;
  window.toggleLedgerModal = toggleLedgerModal;
  window.toggleSpeedRunMode = toggleSpeedRunMode;
  window.broadcastStep = broadcastStep;
  window.setHcdcPhase = setHcdcPhase;
  window.prevSpeakerSection = prevSpeakerSection;
  window.nextSpeakerSection = nextSpeakerSection;
  window.facilitatorRevealNext = facilitatorRevealNext;
  window.broadcastCheck = broadcastCheck;
}

// Keyboard Listeners
window.addEventListener('keydown', (e) => {
  const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
  if (tag === 'input' || tag === 'textarea') return;

  // Numeric step navigation: 0 -> agenda, 1..6 -> steps 0..5 (setup, brand, math, discovery, skill, run)
  if (e.key === '0') {
    broadcastStep('agenda');
    return;
  }
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= 6) {
    const numberedSteps = ['setup', 'brand', 'math', 'discovery', 'skill', 'run'];
    broadcastStep(numberedSteps[num - 1]);
    return;
  } else if (num === 7) {
    broadcastStep('run');
    return;
  }

  if (e.key === 's' || e.key === 'S') {
    setFacilitatorMode('slide');
  } else if (e.key === 'c' || e.key === 'C') {
    setFacilitatorMode('code');
  } else if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'PageDown') {
    e.preventDefault();
    facilitatorRevealNext();
  } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
    e.preventDefault();
    prevSpeakerSection();
  } else if (e.key === ']') {
    nextSpeakerSection();
  } else if (e.key === '[') {
    prevSpeakerSection();
  }
});

// Initialise with Slide 0 Agenda
broadcastStep('agenda');
