/**
 * Spatial Depth, Floating Island, and Kinematic Design System
 * Implementation of SpatialZoomEngine per .agents/rules/design-guidelines.md
 */

export class SpatialZoomEngine {
  constructor(viewportElement) {
    this.viewport = viewportElement || document.querySelector('.viewport') || document.body;
    this.activeCard = null;
    this.init();
  }

  init() {
    // Viewport click delegations for close button and backdrop
    this.viewport.addEventListener('click', (e) => {
      if (e.target.closest('.focal-close-btn')) {
        e.stopPropagation();
        this.collapse();
        return;
      }

      if (e.target.closest('.card-zoom-btn')) {
        e.stopPropagation();
        const card = e.target.closest('.zoom-card, .stage-card, .chunk-card');
        if (card) this.handlePointerDown(e, card);
        return;
      }

      if (this.activeCard && !e.target.closest('[data-expanded="true"]')) {
        e.stopPropagation();
        this.collapse();
        return;
      }
    });

    // Double-click on any stage card zooms it into focal view
    this.viewport.addEventListener('dblclick', (e) => {
      const card = e.target.closest('.zoom-card, .stage-card, .chunk-card');
      if (card && !e.target.closest('input, button, select, textarea, a, .no-zoom')) {
        this.handlePointerDown(e, card);
      }
    });

    this.initLiveCapsule();
  }

  toggleZoomOnActive() {
    if (this.activeCard) {
      this.collapse();
      return;
    }

    const focalTarget = document.querySelector('.stage-card.focused') ||
      document.querySelector('.chunk-card.active') ||
      document.querySelector('.prompt-reality-card') ||
      document.querySelector('.stage-card');

    if (focalTarget) {
      this.triggerZoom(focalTarget);
    }
  }

  handlePointerDown(e, targetCard) {
    const card = targetCard || (e ? e.target.closest('.zoom-card, .stage-card, .chunk-card') : null);
    if (!card) return;

    // Calculate dynamic transform origin based on where the interaction initiated
    const rect = card.getBoundingClientRect();
    const clientX = e && e.clientX ? e.clientX : (rect.left + rect.width / 2);
    const clientY = e && e.clientY ? e.clientY : (rect.top + rect.height / 2);
    const originX = `${Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)))}%`;
    const originY = `${Math.max(0, Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100)))}%`;

    card.style.setProperty('--origin-x', originX);
    card.style.setProperty('--origin-y', originY);

    this.triggerZoom(card);
  }

  triggerZoom(card) {
    if (this.activeCard === card) {
      this.collapse();
      return;
    }

    // Collapse any previous expanded card
    if (this.activeCard && this.activeCard !== card) {
      this.collapse();
    }

    // Set hardware acceleration hints strictly during transition per Section 6
    card.style.willChange = 'transform, opacity, box-shadow';

    // Mount close badge inside card
    let closeBtn = card.querySelector('.focal-close-btn');
    if (!closeBtn) {
      closeBtn = document.createElement('button');
      closeBtn.className = 'focal-close-btn';
      closeBtn.type = 'button';
      closeBtn.innerHTML = '<span class="focal-close-key">ESC</span> Close View';
      card.appendChild(closeBtn);
    }

    this.viewport.setAttribute('data-focal-active', 'true');
    card.setAttribute('data-expanded', 'true');
    this.activeCard = card;

    // Clear hardware acceleration hints after settling
    setTimeout(() => {
      if (card) card.style.willChange = '';
    }, 450);
  }

  collapse() {
    if (!this.activeCard) return;

    const target = this.activeCard;
    target.style.willChange = 'transform, opacity';

    const closeBtn = target.querySelector('.focal-close-btn');
    if (closeBtn) closeBtn.remove();

    this.viewport.removeAttribute('data-focal-active');
    target.removeAttribute('data-expanded');
    this.activeCard = null;

    setTimeout(() => {
      target.style.willChange = '';
    }, 350);
  }

  initLiveCapsule() {
    // Ambient telemetry status pill: read-only, updated via updateLiveCapsuleStatus
  }

  updateLiveCapsuleStatus(label, isLive = true) {
    const labelEl = document.querySelector('.live-capsule .status-label');
    const indicatorEl = document.querySelector('.live-capsule .status-indicator');
    if (labelEl) labelEl.textContent = label;
    if (indicatorEl) {
      indicatorEl.style.backgroundColor = isLive ? 'var(--color-success)' : 'var(--color-warning)';
    }
  }
}
