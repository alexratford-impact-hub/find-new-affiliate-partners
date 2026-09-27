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
    // Pointer down handler for computing exact touch origin coordinates
    this.viewport.addEventListener('pointerdown', (e) => this.handlePointerDown(e));

    // Keyboard listener: Escape collapses active expanded card
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeCard) {
        this.collapse();
      }
    });

    // Clicking backdrop when in background plane collapses
    this.viewport.addEventListener('click', (e) => {
      if (this.activeCard && !e.target.closest('[data-expanded="true"]') && !e.target.closest('.floating-dock') && !e.target.closest('.live-capsule')) {
        this.collapse();
      }
    });

    this.initLiveCapsule();
  }

  handlePointerDown(e) {
    // Ignore clicks on form inputs, sliders, and buttons inside cards so their controls work
    if (e.target.closest('input, button, select, textarea, a, .no-zoom')) {
      return;
    }

    const card = e.target.closest('.zoom-card, .stage-card');
    if (!card) return;

    // 1. Calculate and bind exact touch origin coordinates
    const rect = card.getBoundingClientRect();
    const originX = `${((e.clientX - rect.left) / rect.width) * 100}%`;
    const originY = `${((e.clientY - rect.top) / rect.height) * 100}%`;

    card.style.setProperty('--origin-x', originX);
    card.style.setProperty('--origin-y', originY);

    this.triggerZoom(card);
  }

  triggerZoom(card) {
    if (this.activeCard === card) {
      this.collapse();
      return;
    }

    // If another card is already active, collapse it first
    if (this.activeCard && this.activeCard !== card) {
      this.activeCard.removeAttribute('data-expanded');
    }

    // 2. Execute spatial expansion via View Transitions API
    if (!document.startViewTransition) {
      this.fallbackZoom(card);
      return;
    }

    card.style.viewTransitionName = 'active-spatial-target';

    const transition = document.startViewTransition(() => {
      this.viewport.setAttribute('data-focal-plane', 'background');
      card.setAttribute('data-expanded', 'true');
      this.activeCard = card;
    });

    transition.finished.finally(() => {
      card.style.viewTransitionName = '';
    });
  }

  collapse() {
    if (!this.activeCard) return;

    const target = this.activeCard;
    target.style.viewTransitionName = 'active-spatial-target';

    if (!document.startViewTransition) {
      this.viewport.setAttribute('data-focal-plane', 'focus');
      target.removeAttribute('data-expanded');
      this.activeCard = null;
      return;
    }

    const transition = document.startViewTransition(() => {
      this.viewport.setAttribute('data-focal-plane', 'focus');
      target.removeAttribute('data-expanded');
      this.activeCard = null;
    });

    transition.finished.finally(() => {
      document.querySelectorAll('.zoom-card, .stage-card').forEach((c) => {
        c.style.viewTransitionName = '';
      });
    });
  }

  fallbackZoom(card) {
    this.viewport.setAttribute('data-focal-plane', 'background');
    card.setAttribute('data-expanded', 'true');
    this.activeCard = card;
  }

  initLiveCapsule() {
    const capsule = this.viewport.querySelector('.live-capsule') || document.querySelector('.live-capsule');
    if (!capsule) return;

    capsule.addEventListener('click', (e) => {
      // Don't toggle if clicking buttons inside the expanded tray
      if (e.target.closest('button, input, select')) return;

      const currentState = capsule.getAttribute('data-state');
      const nextState = currentState === 'collapsed' ? 'expanded' : 'collapsed';
      capsule.setAttribute('data-state', nextState);
    });
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
