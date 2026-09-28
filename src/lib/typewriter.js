/**
 * Deprecated: Character slicing loop on 28ms interval replaced by CSS keyframe fadeInChunk.
 */
export class TypewriterStreamer {
  constructor() {}
  startTyping() {}
  flushActiveTyping() {}
  isChunkGenerated() { return true; }
  markStepGenerated() {}
}

export class ThinkingLoop {
  constructor() {}
  start() {}
  stop() {}
}

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
