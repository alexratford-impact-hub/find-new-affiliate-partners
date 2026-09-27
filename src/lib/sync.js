/**
 * Resilient Cross-Window Synchronization Bus
 * Encapsulates BroadcastChannel('workshop_sync') with localStorage fallback,
 * message deduplication via msgId, and automatic heartbeat keep-alive.
 */

export class WorkshopSync {
  constructor({ role = 'client', onConnectionChange } = {}) {
    this.role = role; // 'notes' | 'workshop' | 'client'
    this.onConnectionChange = onConnectionChange || (() => {});
    this.listeners = new Map();
    this.processedMsgIds = new Set();
    this.isConnected = false;
    this.channel = null;
    this.heartbeatTimer = null;
    this.watchdogTimer = null;

    this.initChannel();
    this.initStorageFallback();
    this.initHeartbeat();
  }

  initChannel() {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.channel = new BroadcastChannel('workshop_sync');
        this.channel.onmessage = (event) => this.handleIncoming(event.data);
      }
    } catch (e) {
      console.warn('[Sync] BroadcastChannel unavailable; relying on localStorage sync:', e);
    }
  }

  initStorageFallback() {
    if (typeof window === 'undefined') return;
    window.addEventListener('storage', (e) => {
      if (e.key === 'workshop_remote_sync' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          this.handleIncoming(data);
        } catch (err) {
          // ignore corrupted JSON
        }
      }
    });
  }

  initHeartbeat() {
    if (this.role === 'notes') {
      // Facilitator console pings every 2.5 seconds
      this.heartbeatTimer = setInterval(() => {
        this.broadcast('HEARTBEAT_PING', { sender: 'notes' });
      }, 2500);
    }

    // Default watchdog timeout: 6.5 seconds
    this.resetWatchdog();
  }

  resetWatchdog() {
    if (this.watchdogTimer) clearTimeout(this.watchdogTimer);
    this.watchdogTimer = setTimeout(() => {
      this.setConnected(false);
    }, 6500);
  }

  setConnected(status) {
    if (this.isConnected !== status) {
      this.isConnected = status;
      this.onConnectionChange(status);
    }
  }

  handleIncoming(payload) {
    if (!payload || !payload.action) return;

    // Deduplication check
    if (payload.msgId) {
      if (this.processedMsgIds.has(payload.msgId)) return;
      this.processedMsgIds.add(payload.msgId);
      if (this.processedMsgIds.size > 250) {
        const first = this.processedMsgIds.values().next().value;
        this.processedMsgIds.delete(first);
      }
    }

    // Keep connection alive on valid incoming messages
    this.setConnected(true);
    this.resetWatchdog();

    // Internal protocol handling
    if (payload.action === 'HEARTBEAT_PING' && this.role === 'workshop') {
      this.broadcast('HEARTBEAT_PONG', { sender: 'workshop' });
    } else if (payload.action === 'HEARTBEAT_PONG' && this.role === 'notes') {
      // Heartbeat acknowledged
    }

    // Trigger registered subscribers
    const callbacks = this.listeners.get(payload.action);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[Sync] Error in listener for "${payload.action}":`, err);
        }
      });
    }

    // Trigger universal wildcard listener if defined
    const wildcard = this.listeners.get('*');
    if (wildcard) {
      wildcard.forEach((cb) => cb(payload));
    }
  }

  /**
   * Register an action handler
   * @param {string} action
   * @param {Function} handler
   */
  on(action, handler) {
    if (!this.listeners.has(action)) {
      this.listeners.set(action, new Set());
    }
    this.listeners.get(action).add(handler);

    // Return unbind function
    return () => {
      const set = this.listeners.get(action);
      if (set) set.delete(handler);
    };
  }

  /**
   * Broadcast an event across BroadcastChannel & localStorage
   * @param {string} action
   * @param {Object} payload
   */
  broadcast(action, payload = {}) {
    const message = {
      ...payload,
      action,
      msgId: Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      timestamp: Date.now()
    };

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {
        console.warn('[Sync] channel.postMessage failed:', e);
      }
    }

    try {
      localStorage.setItem('workshop_remote_sync', JSON.stringify(message));
    } catch (e) {
      console.warn('[Sync] localStorage.setItem failed:', e);
    }
  }

  destroy() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.watchdogTimer) clearTimeout(this.watchdogTimer);
    if (this.channel) {
      try { this.channel.close(); } catch (e) {}
    }
  }
}
