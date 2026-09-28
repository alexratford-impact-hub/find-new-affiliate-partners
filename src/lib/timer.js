/**
 * Consolidated Countdown Timer Utility
 */

export function formatTime(seconds) {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.floor(Math.max(0, seconds) % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function createTimer(durationSeconds, onTick, onComplete) {
  let remaining = durationSeconds;
  const timerInterval = setInterval(() => {
    remaining -= 1;
    onTick(remaining);
    if (remaining <= 0) {
      clearInterval(timerInterval);
      onComplete?.();
    }
  }, 1000);

  return {
    stop: () => clearInterval(timerInterval),
    adjustTime: (seconds) => { remaining += seconds; },
    getRemaining: () => remaining
  };
}
