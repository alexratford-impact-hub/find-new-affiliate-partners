/**
 * Tri-Engine Clock & Pacing Architecture (70-Minute Masterclass Envelope)
 * - Master Session Clock (70:00 countdown with 15m amber & 5m pulsing red alert)
 * - Section Countdown Clock
 * - Task Sprint Timer with +1m manual override & broadcast hooks
 * - Pacing & Speed-Run Auto-Detection Engine
 */

export function formatTime(seconds) {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.floor(Math.max(0, seconds) % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export class MasterClock {
  constructor({ totalSeconds = 4200, onTick, onStateChange } = {}) {
    this.totalSeconds = totalSeconds; // 70 minutes = 4200s
    this.remainingSeconds = totalSeconds;
    this.isRunning = false;
    this.timer = null;
    this.onTick = onTick || (() => {});
    this.onStateChange = onStateChange || (() => {});
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timer = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.onTick(this.remainingSeconds, this.getElapsedSeconds());
      } else {
        this.stop();
      }
    }, 1000);
    this.onStateChange(true);
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.onStateChange(false);
  }

  toggle() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  reset() {
    this.stop();
    this.remainingSeconds = this.totalSeconds;
    this.onTick(this.remainingSeconds, 0);
  }

  getElapsedSeconds() {
    return this.totalSeconds - this.remainingSeconds;
  }
}

export class SectionClock {
  constructor({ onTick } = {}) {
    this.remainingSeconds = 480; // 8 minutes default
    this.isRunning = false;
    this.timer = null;
    this.onTick = onTick || (() => {});
  }

  init(seconds) {
    this.remainingSeconds = seconds;
    this.onTick(this.remainingSeconds);
  }

  tick() {
    if (this.remainingSeconds > 0) {
      this.remainingSeconds--;
      this.onTick(this.remainingSeconds);
    }
  }

  reset(seconds) {
    this.remainingSeconds = seconds;
    this.onTick(this.remainingSeconds);
  }
}

export class TaskSprintTimer {
  constructor({ onTick, onStateChange, onBroadcast } = {}) {
    this.totalSeconds = 210;
    this.remainingSeconds = 210;
    this.isRunning = false;
    this.timer = null;
    this.onTick = onTick || (() => {});
    this.onStateChange = onStateChange || (() => {});
    this.onBroadcast = onBroadcast || (() => {});
  }

  init(seconds) {
    this.stop();
    this.totalSeconds = seconds;
    this.remainingSeconds = seconds;
    this.onTick(this.remainingSeconds, formatTime(this.remainingSeconds));
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timer = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        const timeStr = formatTime(this.remainingSeconds);
        this.onTick(this.remainingSeconds, timeStr);
        this.onBroadcast({ active: true, timeStr, seconds: this.remainingSeconds });
      } else {
        this.stop();
      }
    }, 1000);
    this.onStateChange(true);
    this.onBroadcast({ active: true, timeStr: formatTime(this.remainingSeconds), seconds: this.remainingSeconds });
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.onStateChange(false);
    this.onBroadcast({ active: false, timeStr: formatTime(this.remainingSeconds), seconds: this.remainingSeconds });
  }

  toggle() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  addMinute() {
    this.remainingSeconds += 60;
    const timeStr = formatTime(this.remainingSeconds);
    this.onTick(this.remainingSeconds, timeStr);
    if (this.isRunning) {
      this.onBroadcast({ active: true, timeStr, seconds: this.remainingSeconds });
    }
  }

  reset() {
    this.stop();
    this.remainingSeconds = this.totalSeconds;
    const timeStr = formatTime(this.remainingSeconds);
    this.onTick(this.remainingSeconds, timeStr);
    this.onBroadcast({ active: false, timeStr, seconds: this.remainingSeconds });
  }
}

export class PacingCalculator {
  constructor(milestones) {
    this.milestones = milestones;
  }

  /**
   * Calculate pacing delta for current active step
   * @param {string} stepKey
   * @param {number} elapsedSeconds
   * @returns {{ status: 'ahead'|'on-track'|'behind', deltaSeconds: number, label: string }}
   */
  evaluate(stepKey, elapsedSeconds) {
    const milestone = this.milestones[stepKey];
    if (!milestone) return { status: 'on-track', deltaSeconds: 0, label: '● ON TRACK' };

    const targetElapsed = milestone.targetElapsed;
    const delta = elapsedSeconds - targetElapsed;

    if (delta > 60) {
      const mins = Math.ceil(delta / 60);
      return { status: 'behind', deltaSeconds: delta, label: `▲ BEHIND (+${mins}m)` };
    } else if (delta < -120) {
      const mins = Math.floor(Math.abs(delta) / 60);
      return { status: 'ahead', deltaSeconds: delta, label: `▼ AHEAD (-${mins}m)` };
    }

    return { status: 'on-track', deltaSeconds: delta, label: '● ON TRACK' };
  }
}
