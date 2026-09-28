/**
 * Lightweight Cross-Window Synchronization Bus
 * Uses BroadcastChannel with storage event fallback for isolated windows.
 */

export class WorkshopSync {
  constructor({ channelName = 'workshop_sync', onMessage } = {}) {
    this.channelName = channelName;
    this.onMessage = onMessage;
    this.handlers = new Map();
    this.hasBC = typeof BroadcastChannel !== 'undefined';

    const dispatch = (message) => {
      this.onMessage?.(message);
      const action = message?.type || message?.action;
      if (action) {
        const payload = message.payload !== undefined ? message.payload : message;
        const cbs = this.handlers.get(action);
        if (cbs) cbs.forEach((cb) => cb(payload));
      }
    };

    if (this.hasBC) {
      this.channel = new BroadcastChannel(channelName);
      this.channel.onmessage = (event) => dispatch(event.data);
    } else {
      window.addEventListener('storage', (event) => {
        if (event.key === this.channelName && event.newValue) {
          try {
            dispatch(JSON.parse(event.newValue));
          } catch {}
        }
      });
    }
  }

  on(type, handler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type).push(handler);
  }

  send(type, payload = {}) {
    const message = { type, action: type, payload, ...payload, timestamp: Date.now() };
    if (this.hasBC) {
      this.channel.postMessage(message);
    } else {
      localStorage.setItem(this.channelName, JSON.stringify(message));
    }
  }

  broadcast(action, data = {}) {
    this.send(action, data);
  }
}
