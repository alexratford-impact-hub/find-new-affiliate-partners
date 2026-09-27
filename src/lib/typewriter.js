/**
 * Resilient Typewriter Streaming Engine & Thinking Loop
 * Character-by-character live streaming (35 chars/sec) with blinking cursor and DOM preservation.
 */

import { wittyThinkingSentences } from '../data/quips.js';

export function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export class TypewriterStreamer {
  constructor() {
    this.generatedChunks = {}; // Tracks chunks generated: `${stepKey}_${chunkIdx}`
    this.state = {
      active: false,
      timer: null,
      key: null,
      index: null,
      charPos: 0,
      fullCode: ""
    };
  }

  isChunkGenerated(stepKey, chunkIdx) {
    return !!this.generatedChunks[`${stepKey}_${chunkIdx}`];
  }

  markChunkGenerated(stepKey, chunkIdx) {
    this.generatedChunks[`${stepKey}_${chunkIdx}`] = true;
  }

  markStepGenerated(stepKey, count) {
    for (let i = 0; i < count; i++) {
      this.generatedChunks[`${stepKey}_${i}`] = true;
    }
  }

  flushActiveTyping() {
    if (this.state.timer) {
      clearInterval(this.state.timer);
      this.state.timer = null;
    }

    if (this.state.active && this.state.key && this.state.index !== null) {
      const liveCodeEl = document.getElementById(`chunk-code-${this.state.index}`);
      if (liveCodeEl) {
        liveCodeEl.innerHTML = escapeHtml(this.state.fullCode);
      }
      const card = document.getElementById(`chunk-item-${this.state.index}`);
      if (card) {
        card.classList.remove('typing');
        card.classList.add('active');
        const pill = card.querySelector('.typing-active-pill');
        if (pill) {
          pill.className = 'chunk-num';
          pill.innerText = `Part ${this.state.index + 1}`;
        }
      }
      this.markChunkGenerated(this.state.key, this.state.index);
    }

    this.state.active = false;
    this.state.key = null;
    this.state.index = null;
    this.state.charPos = 0;
    this.state.fullCode = "";
    document.querySelectorAll('.typing-cursor').forEach(el => el.remove());
  }

  startTyping(stepKey, chunkIdx, fullCode, totalParts, onComplete) {
    // If already actively typing this EXACT chunk, let it continue
    if (this.state.active && this.state.key === stepKey && this.state.index === chunkIdx) {
      return;
    }

    this.flushActiveTyping();

    this.state.active = true;
    this.state.key = stepKey;
    this.state.index = chunkIdx;
    this.state.charPos = 0;
    this.state.fullCode = fullCode || "";

    const card = document.getElementById(`chunk-item-${chunkIdx}`);
    if (card) {
      card.classList.add('typing');
    }

    const embedTag = document.getElementById('artifact-embed-tag');
    if (embedTag) embedTag.innerText = `⚡ Coding Part ${chunkIdx + 1}...`;

    // 1 character per 28ms tick ≈ 35 characters per second
    this.state.timer = setInterval(() => {
      this.state.charPos += 1;
      const liveCodeEl = document.getElementById(`chunk-code-${chunkIdx}`);

      if (this.state.charPos >= this.state.fullCode.length) {
        if (liveCodeEl) {
          liveCodeEl.innerHTML = escapeHtml(this.state.fullCode);
        }
        this.finishTyping(stepKey, chunkIdx, totalParts, onComplete);
      } else {
        if (liveCodeEl) {
          const partial = this.state.fullCode.slice(0, this.state.charPos);
          liveCodeEl.innerHTML = escapeHtml(partial) + '<span class="typing-cursor">&#8203;</span>';
        }
      }
    }, 28);
  }

  finishTyping(stepKey, chunkIdx, totalParts, onComplete) {
    if (this.state.timer) {
      clearInterval(this.state.timer);
      this.state.timer = null;
    }
    this.markChunkGenerated(stepKey, chunkIdx);

    this.state.active = false;
    this.state.key = null;
    this.state.index = null;
    this.state.charPos = 0;
    this.state.fullCode = "";

    const card = document.getElementById(`chunk-item-${chunkIdx}`);
    if (card) {
      card.classList.remove('typing');
      card.classList.add('active');
      const pill = card.querySelector('.typing-active-pill');
      if (pill) {
        pill.style.opacity = '0';
        setTimeout(() => {
          pill.className = 'chunk-num';
          pill.innerText = `Part ${chunkIdx + 1} of ${totalParts}`;
          pill.style.opacity = '1';
        }, 200);
      }
    }

    document.querySelectorAll('.typing-cursor').forEach(el => el.remove());

    const embedTag = document.getElementById('artifact-embed-tag');
    if (embedTag) {
      embedTag.style.transition = 'opacity 0.2s ease';
      embedTag.style.opacity = '0';
      setTimeout(() => {
        embedTag.innerText = `✓ Part ${chunkIdx + 1} Assembled`;
        embedTag.style.opacity = '1';
      }, 200);
    }

    if (onComplete) onComplete();
  }
}

/**
 * Single-Sentence Thinking Dissolve Loop (Fisher-Yates shuffled deck)
 */
export class ThinkingLoop {
  constructor(elementId) {
    this.elementId = elementId;
    this.pool = [];
    this.lastSentence = "";
    this.streamInterval = null;
    this.streamTimeout = null;
    this.isRunning = false;
  }

  getNextSentence() {
    if (!wittyThinkingSentences.length) return "";
    if (wittyThinkingSentences.length === 1) return wittyThinkingSentences[0];

    if (this.pool.length === 0) {
      this.pool = [...wittyThinkingSentences];
      for (let i = this.pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.pool[i], this.pool[j]] = [this.pool[j], this.pool[i]];
      }
      if (this.pool[this.pool.length - 1] === this.lastSentence) {
        [this.pool[this.pool.length - 1], this.pool[0]] = [this.pool[0], this.pool[this.pool.length - 1]];
      }
    }

    this.lastSentence = this.pool.pop();
    return this.lastSentence;
  }

  start(forceRestart = false) {
    if (this.isRunning && !forceRestart) return;
    this.isRunning = true;

    const el = document.getElementById(this.elementId);
    if (!el) return;

    if (this.streamInterval) clearInterval(this.streamInterval);
    if (this.streamTimeout) clearTimeout(this.streamTimeout);

    const typeNextSentence = () => {
      const sentence = this.getNextSentence();
      el.innerHTML = '<span class="thinking-stream-body"></span><span class="thinking-pulse-cursor"></span>';
      const textSpan = el.querySelector('.thinking-stream-body');
      const cursor = el.querySelector('.thinking-pulse-cursor');
      let charIdx = 0;

      this.streamInterval = setInterval(() => {
        charIdx += 2;
        if (charIdx >= sentence.length) {
          textSpan.textContent = sentence;
          clearInterval(this.streamInterval);

          this.streamTimeout = setTimeout(() => {
            if (cursor) cursor.style.display = 'none';
            textSpan.style.transition = 'opacity 0.2s ease';
            textSpan.style.opacity = '0';

            this.streamTimeout = setTimeout(() => {
              typeNextSentence();
            }, 220);
          }, 2800);
          return;
        }
        textSpan.textContent = sentence.slice(0, charIdx);
      }, 28);
    };

    typeNextSentence();
  }

  stop() {
    this.isRunning = false;
    if (this.streamInterval) clearInterval(this.streamInterval);
    if (this.streamTimeout) clearTimeout(this.streamTimeout);
  }
}
