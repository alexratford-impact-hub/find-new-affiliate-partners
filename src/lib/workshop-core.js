/**
 * Core Workshop Engine Library (src/lib/workshop-core.js)
 * Centralizes state management, cross-window synchronization, session/sprint timers,
 * brand preset switching, and deterministic EV math calculations.
 */

import curriculumData from '../data/curriculum.json';
import presetsData from '../data/presets.json';
import { WorkshopSync } from './sync.js';
import { createTimer, formatTime } from './timer.js';

export { formatTime };

export const { stepKeys, curriculum, fileSections, slideStageTitles, stepMilestones, speakerData } = curriculumData;
export const { brandProfiles } = presetsData;

export const stepSlideStageCounts = {
  agenda: 1,
  setup: 2,
  brand: 2,
  math: 2,
  discovery: 2,
  skill: 2,
  run: 3
};

// HTML Escaping Utility
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export class WorkshopEngine {
  constructor({ role = 'workshop', channelName = 'workshop_sync' } = {}) {
    this.role = role; // 'workshop' | 'notes'
    this.channelName = channelName;

    this.state = {
      activeKey: 'agenda',
      viewMode: 'slide', // 'slide' | 'code'
      activeSectionIndex: 0,
      activeSlideStage: 0,
      activePreset: 'boots',
      isCodingSprintActive: false,
      codingSprintTimeStr: '00:00',
      sprintRemaining: 0,
      scoringWeights: { r: 0.40, s: 0.30, c: 0.30 },
      masterRemaining: 4200, // 70 minutes
      masterRunning: false,
      sectionRemaining: 300
    };

    this.listeners = new Set();
    this.masterTimer = null;
    this.sectionTimer = null;
    this.sprintTimerInstance = null;

    // Cross-Window Sync Initialization
    this.sync = new WorkshopSync({
      channelName: this.channelName,
      onMessage: (msg) => this.handleRemoteMessage(msg)
    });
  }

  getState() {
    return { ...this.state };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(changeType, payload = {}) {
    for (const listener of this.listeners) {
      try {
        listener(this.state, changeType, payload);
      } catch (err) {
        console.error('Error in WorkshopEngine listener:', err);
      }
    }
  }

  handleRemoteMessage(msg) {
    if (!msg || !msg.type) return;
    const { type, payload = {} } = msg;

    switch (type) {
      case 'LOAD_STEP':
        if (curriculum[payload.key]) {
          this.loadStep(payload.key, true, false);
        }
        break;

      case 'SET_MODE':
        if (payload.mode === 'slide' || payload.mode === 'code') {
          this.setViewMode(payload.mode, false);
        }
        break;

      case 'SET_SLIDE_STAGE':
        if (payload.key && payload.key !== this.state.activeKey && curriculum[payload.key]) {
          this.loadStep(payload.key, true, false);
        }
        this.setSlideStage(payload.stage, false);
        break;

      case 'APPLY_PRESET':
        if (brandProfiles[payload.preset]) {
          this.applyPreset(payload.preset, false);
        }
        break;

      case 'SET_SECTION':
        if (payload.key && payload.key !== this.state.activeKey && curriculum[payload.key]) {
          this.loadStep(payload.key, false, false);
        }
        this.setSection(payload.index, false);
        break;

      case 'CODING_SPRINT':
        this.state.isCodingSprintActive = !!payload.active;
        this.state.codingSprintTimeStr = payload.timeStr || '00:00';
        if (this.state.isCodingSprintActive && this.state.viewMode === 'slide' && this.role === 'workshop') {
          this.setViewMode('code', false);
        } else {
          this.notify('CODING_SPRINT_UPDATE');
        }
        break;

      case 'TOGGLE_CHECK':
        if (payload.key) {
          this.toggleCheck(payload.key, payload.checked, false);
        }
        break;

      default:
        break;
    }
  }

  loadStep(key, switchToSlide = true, broadcast = true) {
    if (!curriculum[key]) return;
    this.state.activeKey = key;
    this.state.activeSlideStage = 0;
    this.state.activeSectionIndex = 0;

    // Reset section timer if milestone exists
    const ms = stepMilestones[key];
    if (ms) {
      this.state.sectionRemaining = ms.sprintDuration || 300;
    }

    if (switchToSlide) {
      this.state.viewMode = 'slide';
    } else {
      this.state.viewMode = 'code';
    }

    if (broadcast) {
      this.sync.send('LOAD_STEP', { key, switchToSlide });
    }

    this.notify('STEP_LOADED', { key });
  }

  setViewMode(mode, broadcast = true) {
    if (mode !== 'slide' && mode !== 'code') return;
    this.state.viewMode = mode;

    if (broadcast) {
      this.sync.send('SET_MODE', { mode });
    }

    this.notify('MODE_CHANGED', { mode });
  }

  setSlideStage(stageIdx, broadcast = true) {
    const maxStages = stepSlideStageCounts[this.state.activeKey] || 3;
    const clamped = Math.max(0, Math.min(maxStages - 1, stageIdx));
    this.state.activeSlideStage = clamped;

    if (broadcast) {
      this.sync.send('SET_SLIDE_STAGE', { key: this.state.activeKey, stage: clamped });
    }

    this.notify('SLIDE_STAGE_CHANGED', { stage: clamped, key: this.state.activeKey });
  }

  setSection(sectionIdx, broadcast = true) {
    const sections = fileSections[this.state.activeKey] || [];
    let clamped = sectionIdx;
    if (sectionIdx !== 'all') {
      clamped = Math.max(0, Math.min(sections.length - 1, sectionIdx));
    }
    this.state.activeSectionIndex = clamped;

    if (broadcast) {
      this.sync.send('SET_SECTION', { key: this.state.activeKey, index: clamped });
    }

    this.notify('SECTION_CHANGED', { index: clamped, key: this.state.activeKey });
  }

  applyPreset(presetId, broadcast = true) {
    if (!brandProfiles[presetId]) return;
    this.state.activePreset = presetId;

    if (broadcast) {
      this.sync.send('APPLY_PRESET', { preset: presetId });
    }

    this.notify('PRESET_APPLIED', { preset: presetId });
  }

  next() {
    if (this.state.viewMode === 'slide') {
      const maxStages = stepSlideStageCounts[this.state.activeKey] || 1;
      if (this.state.activeSlideStage < maxStages - 1) {
        this.setSlideStage(this.state.activeSlideStage + 1);
      } else {
        // End of slide stages for this module:
        // Automatically hand off to Code View if chunks exist
        const chunks = fileSections[this.state.activeKey] || [];
        if (chunks.length > 0) {
          this.setViewMode('code');
          this.setSection(0);
        } else {
          // If no code chunks (e.g. 'agenda'), advance to next module in slide mode
          const currentIdx = stepKeys.indexOf(this.state.activeKey);
          if (currentIdx >= 0 && currentIdx < stepKeys.length - 1) {
            const nextKey = stepKeys[currentIdx + 1];
            this.loadStep(nextKey, true);
          }
        }
      }
    } else {
      // In code mode: advance chunk section
      const sections = fileSections[this.state.activeKey] || [];
      if (typeof this.state.activeSectionIndex === 'number' && this.state.activeSectionIndex < sections.length - 1) {
        this.setSection(this.state.activeSectionIndex + 1);
      } else if (this.state.activeSectionIndex !== 'all') {
        this.setSection('all');
      } else {
        // Completed all code chunks for this step ('all'):
        // Advance to the NEXT module in slide mode!
        const currentIdx = stepKeys.indexOf(this.state.activeKey);
        if (currentIdx >= 0 && currentIdx < stepKeys.length - 1) {
          const nextKey = stepKeys[currentIdx + 1];
          this.loadStep(nextKey, true);
        }
      }
    }
  }

  prev() {
    if (this.state.viewMode === 'slide') {
      if (this.state.activeSlideStage > 0) {
        this.setSlideStage(this.state.activeSlideStage - 1);
      } else {
        // At slide stage 0: go back to prior module
        const currentIdx = stepKeys.indexOf(this.state.activeKey);
        if (currentIdx > 0) {
          const prevKey = stepKeys[currentIdx - 1];
          const prevChunks = fileSections[prevKey] || [];
          if (prevChunks.length > 0) {
            this.loadStep(prevKey, false);
            this.setSection('all');
          } else {
            this.loadStep(prevKey, true);
            const prevMaxStages = stepSlideStageCounts[prevKey] || 1;
            this.setSlideStage(prevMaxStages - 1);
          }
        }
      }
    } else {
      // In code mode: move to prior chunk or return to slide
      if (this.state.activeSectionIndex === 'all') {
        const sections = fileSections[this.state.activeKey] || [];
        this.setSection(Math.max(0, sections.length - 1));
      } else if (typeof this.state.activeSectionIndex === 'number' && this.state.activeSectionIndex > 0) {
        this.setSection(this.state.activeSectionIndex - 1);
      } else {
        // Returning from chunk 0 back to slide view of current step at its last slide stage
        const maxStages = stepSlideStageCounts[this.state.activeKey] || 1;
        this.setViewMode('slide');
        this.setSlideStage(maxStages - 1);
      }
    }
  }

  // Sprint Timer Management
  startSprint(durationSeconds) {
    if (this.sprintTimerInstance) {
      this.sprintTimerInstance.stop();
    }

    this.state.isCodingSprintActive = true;
    this.state.sprintRemaining = durationSeconds;
    this.state.codingSprintTimeStr = formatTime(durationSeconds);

    this.sync.send('CODING_SPRINT', {
      active: true,
      timeStr: this.state.codingSprintTimeStr
    });
    this.notify('CODING_SPRINT_UPDATE');

    this.sprintTimerInstance = createTimer(
      durationSeconds,
      (rem) => {
        this.state.sprintRemaining = rem;
        this.state.codingSprintTimeStr = formatTime(rem);
        this.sync.send('CODING_SPRINT', {
          active: true,
          timeStr: this.state.codingSprintTimeStr
        });
        this.notify('CODING_SPRINT_UPDATE');
      },
      () => {
        this.state.isCodingSprintActive = false;
        this.sync.send('CODING_SPRINT', {
          active: false,
          timeStr: '00:00'
        });
        this.notify('CODING_SPRINT_UPDATE');
      }
    );
  }

  stopSprint() {
    if (this.sprintTimerInstance) {
      this.sprintTimerInstance.stop();
      this.sprintTimerInstance = null;
    }
    this.state.isCodingSprintActive = false;
    this.sync.send('CODING_SPRINT', { active: false, timeStr: '00:00' });
    this.notify('CODING_SPRINT_UPDATE');
  }

  toggleSprint(durationSeconds) {
    if (this.state.isCodingSprintActive) {
      this.stopSprint();
    } else {
      const dur = durationSeconds || this.state.sprintRemaining || 180;
      this.startSprint(dur);
    }
  }

  resetSprint(seconds) {
    this.stopSprint();
    const dur = typeof seconds === 'number' ? seconds : (stepMilestones[this.state.activeKey]?.sprintDuration || 180);
    this.state.sprintRemaining = dur;
    this.state.codingSprintTimeStr = formatTime(dur);
    this.sync.send('CODING_SPRINT', {
      active: false,
      timeStr: this.state.codingSprintTimeStr
    });
    this.notify('CODING_SPRINT_UPDATE');
  }

  adjustSprintTime(seconds) {
    if (!this.state.isCodingSprintActive && seconds > 0) {
      this.startSprint(seconds);
      return;
    }

    if (this.sprintTimerInstance) {
      this.sprintTimerInstance.adjustTime(seconds);
      this.state.sprintRemaining = Math.max(0, this.state.sprintRemaining + seconds);
      this.state.codingSprintTimeStr = formatTime(this.state.sprintRemaining);
      this.sync.send('CODING_SPRINT', {
        active: true,
        timeStr: this.state.codingSprintTimeStr
      });
      this.notify('CODING_SPRINT_UPDATE');
    }
  }

  // Master 70-Minute Timer
  startMasterClock(onTick) {
    if (this.state.masterRunning) return;
    this.state.masterRunning = true;
    this.notify('MASTER_CLOCK_STATE', { running: true });

    this.masterTimer = createTimer(
      this.state.masterRemaining,
      (rem) => {
        this.state.masterRemaining = rem;
        onTick?.(rem, 4200 - rem);
        this.notify('MASTER_CLOCK_TICK', { remaining: rem, elapsed: 4200 - rem });
      },
      () => {
        this.state.masterRunning = false;
        this.notify('MASTER_CLOCK_STATE', { running: false });
      }
    );
  }

  pauseMasterClock() {
    if (!this.state.masterRunning) return;
    this.masterTimer?.stop();
    this.state.masterRunning = false;
    this.notify('MASTER_CLOCK_STATE', { running: false });
  }

  toggleMasterClock(onTick) {
    if (this.state.masterRunning) {
      this.pauseMasterClock();
    } else {
      this.startMasterClock(onTick);
    }
  }

  resetMasterClock(seconds = 4200) {
    this.pauseMasterClock();
    this.state.masterRemaining = seconds;
    this.notify('MASTER_CLOCK_TICK', { remaining: seconds, elapsed: 0 });
  }

  // Section Clock Methods
  startSectionClock(onTick) {
    if (this.sectionRunning) return;
    this.sectionRunning = true;
    this.sectionTimer = createTimer(
      this.state.sectionRemaining,
      (rem) => {
        this.state.sectionRemaining = rem;
        onTick?.(rem);
        this.notify('SECTION_CLOCK_TICK', { remaining: rem });
      },
      () => {
        this.sectionRunning = false;
        this.notify('SECTION_CLOCK_COMPLETE');
      }
    );
  }

  pauseSectionClock() {
    this.sectionTimer?.stop();
    this.sectionRunning = false;
  }

  resetSectionClock(seconds) {
    this.pauseSectionClock();
    const sec = typeof seconds === 'number' ? seconds : 300;
    this.state.sectionRemaining = sec;
    this.notify('SECTION_CLOCK_TICK', { remaining: sec });
  }

  toggleCheck(key, checked, broadcast = true) {
    this.state.checkedSteps = this.state.checkedSteps || {};
    this.state.checkedSteps[key] = !!checked;

    if (broadcast) {
      this.sync.send('TOGGLE_CHECK', { key, checked: !!checked });
    }

    this.notify('STEP_CHECK_TOGGLED', { key, checked: !!checked });
  }

  // EV Math Calculation & Normalization
  setScoringWeight(dialKey, newVal) {
    newVal = parseFloat(newVal);
    newVal = Math.max(0.10, Math.min(0.80, Math.round(newVal * 100) / 100));
    const oldVal = this.state.scoringWeights[dialKey];
    if (Math.abs(oldVal - 1.0) < 0.001) return;

    const otherKeys = ['r', 's', 'c'].filter(k => k !== dialKey);
    const oldOtherSum = this.state.scoringWeights[otherKeys[0]] + this.state.scoringWeights[otherKeys[1]];
    const newOtherTarget = 1.0 - newVal;

    if (oldOtherSum > 0) {
      let w0 = Math.round((this.state.scoringWeights[otherKeys[0]] * (newOtherTarget / oldOtherSum)) * 100) / 100;
      w0 = Math.max(0.10, Math.min(0.80, w0));
      let w1 = Math.round((newOtherTarget - w0) * 100) / 100;
      w1 = Math.max(0.10, Math.min(0.80, w1));

      const sum = Math.round((newVal + w0 + w1) * 100) / 100;
      const diff = Math.round((1.0 - sum) * 100) / 100;
      w1 = Math.round((w1 + diff) * 100) / 100;

      this.state.scoringWeights[dialKey] = newVal;
      this.state.scoringWeights[otherKeys[0]] = w0;
      this.state.scoringWeights[otherKeys[1]] = w1;
    }

    this.notify('WEIGHTS_CHANGED', { weights: { ...this.state.scoringWeights } });
  }

  calculateEV(r, s, c) {
    if (r <= 0 || s <= 0 || c <= 0) return 0.00;
    const w = this.state.scoringWeights;
    const ev = Math.pow(r, w.r) * Math.pow(s, w.s) * Math.pow(c, w.c);
    return Math.round(ev * 100) / 100;
  }
}
