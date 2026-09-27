---
trigger: always_on
---

# Spatial Depth, Floating Island, and Kinematic Design System Specification
Update this file as necessary when you change/implement the specific elements of design - do not keep outdated code in this file.
This specification provides the operational tokens, structural DOM hierarchy, and programmatic kinematic rules required to build a 2.5D spatial zoom interface using floating island containers and depth-of-field staging.

---

## 1. System Tokens (CSS)

Add these custom properties to the root stylesheet. Do not alter easing curves or radius dimensions.

```css
:root {
  /* Surface Materials & Diffusion */
  --surface-island-base: rgba(255, 255, 255, 0.08);
  --surface-island-hover: rgba(255, 255, 255, 0.12);
  --surface-island-active: rgba(255, 255, 255, 0.2);
  --surface-stroke: 0.5px solid rgba(255, 255, 255, 0.18);
  --surface-blur-dock: 24px;
  --surface-blur-background: 14px;
  --surface-blur-foreground: 20px;

  /* Corner Geometry */
  --radius-pill: 9999px;
  --radius-card: 28px;
  --radius-tray: 36px;
  --radius-button: 20px;

  /* Kinematic Curves & Durations */
  --ease-fluid: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-expand: 420ms;
  --duration-contract: 320ms;

  /* Spatial Coordinate Planes */
  --plane-background-z: -250px;
  --plane-focus-z: 0px;
  --plane-foreground-z: 220px;

  /* Dynamic Touch Anchors (Populated by JavaScript runtime) */
  --origin-x: 50%;
  --origin-y: 50%;
}

```

---

## 2. DOM Architecture

Construct the page with this exact parent-child hierarchy to ensure proper hardware-accelerated layer compositing.

```html
<div class="viewport" data-focal-plane="focus">

  <!-- Floating Dynamic Live Capsule (Camera punch-hole alignment) -->
  <aside class="live-capsule" data-state="collapsed" aria-label="Active status pill">
    <div class="capsule-compact">
      <span class="status-indicator"></span>
      <span class="status-label">Recording</span>
    </div>
    <div class="capsule-expanded-tray" aria-hidden="true">
      <div class="tray-content"></div>
    </div>
  </aside>

  <!-- Continuous 2.5D Canvas: Content bleeds beneath docks -->
  <main class="scene-canvas" data-layer="canvas">
    <section class="card-grid">
      <article class="zoom-card" data-card-id="card-01" tabindex="0">
        <div class="card-body">
          <h3>Asset Specification</h3>
          <p>Continuous spatial node.</p>
        </div>
      </article>
      <article class="zoom-card" data-card-id="card-02" tabindex="0">
        <div class="card-body">
          <h3>Telemetry Readout</h3>
          <p>Independent parallel layer.</p>
        </div>
      </article>
    </section>
  </main>

  <!-- Detached Global Floating Navigation Island -->
  <nav class="floating-dock" aria-label="Global navigation">
    <div class="dock-housing">
      <div class="pill-group">
        <button class="pill-node" data-active="true">Workspace</button>
        <button class="pill-node" data-active="false">Telemetry</button>
        <button class="pill-node" data-active="false">Configuration</button>
      </div>
      <button class="action-circle-node" aria-label="Commit action">
        <svg class="action-icon" viewBox="0 0 24 24"></svg>
      </button>
    </div>
  </nav>

</div>

```

---

## 3. Structural & Material Styles (CSS)

Apply these structural and material definitions directly.

```css
/* Base Viewport Container */
.viewport {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #0c0d10;
  perspective: 1000px;
}

/* Background Scene Canvas: Full Bleed */
.scene-canvas {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  padding: 80px 24px 120px 24px;
  transform-style: preserve-3d;
  transition: transform var(--duration-expand) var(--ease-fluid),
              filter var(--duration-expand) var(--ease-fluid);
  will-change: transform, filter;
}

/* Viewport Staging Depth States */
.viewport[data-focal-plane="focus"] .scene-canvas {
  transform: translateZ(var(--plane-focus-z));
  filter: blur(0px);
  pointer-events: auto;
}

.viewport[data-focal-plane="background"] .scene-canvas {
  transform: translateZ(var(--plane-background-z)) scale(1.15);
  filter: blur(var(--surface-blur-background)) brightness(0.65);
  pointer-events: none;
}

/* Floating Navigation Island */
.floating-dock {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  pointer-events: auto;
}

.dock-housing {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: var(--surface-island-base);
  backdrop-filter: blur(var(--surface-blur-dock));
  -webkit-backdrop-filter: blur(var(--surface-blur-dock));
  border: var(--surface-stroke);
  border-radius: var(--radius-pill);
}

.pill-group {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-pill);
  padding: 2px;
}

.pill-node {
  padding: 8px 18px;
  border-radius: var(--radius-pill);
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: background var(--duration-contract) var(--ease-fluid),
              color var(--duration-contract) var(--ease-fluid);
}

.pill-node[data-active="true"] {
  background: var(--surface-island-active);
  color: #ffffff;
}

.action-circle-node {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: #2563eb;
  color: #ffffff;
  cursor: pointer;
}

/* Dynamic Live Status Capsule */
.live-capsule {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  background: var(--surface-island-base);
  backdrop-filter: blur(var(--surface-blur-dock));
  -webkit-backdrop-filter: blur(var(--surface-blur-dock));
  border: var(--surface-stroke);
  border-radius: var(--radius-pill);
  overflow: hidden;
  transition: width var(--duration-expand) var(--ease-fluid),
              height var(--duration-expand) var(--ease-fluid),
              border-radius var(--duration-expand) var(--ease-fluid);
  will-change: width, height, border-radius;
}

.live-capsule[data-state="collapsed"] {
  width: 130px;
  height: 32px;
  cursor: pointer;
}

.live-capsule[data-state="expanded"] {
  width: 320px;
  height: 180px;
  border-radius: var(--radius-tray);
}

.capsule-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  font-size: 12px;
  color: #ffffff;
}

.live-capsule[data-state="expanded"] .capsule-compact {
  display: none;
}

.capsule-expanded-tray {
  display: none;
  padding: 16px;
  height: 100%;
}

.live-capsule[data-state="expanded"] .capsule-expanded-tray {
  display: block;
}

```

---

## 4. Kinematics and Zoom Coordinates (JavaScript)

Do not run spatial transitions from element centres. Compute the pointer coordinates on touch or click, bind them to CSS variables, and trigger native View Transitions without unmounting elements.

```javascript
export class SpatialZoomEngine {
  constructor(viewportElement) {
    this.viewport = viewportElement;
    this.activeCard = null;
    this.init();
  }

  init() {
    this.viewport.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    this.initLiveCapsule();
  }

  handlePointerDown(e) {
    const card = e.target.closest('.zoom-card');
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

    this.activeCard.style.viewTransitionName = 'active-spatial-target';

    const transition = document.startViewTransition(() => {
      this.viewport.setAttribute('data-focal-plane', 'focus');
      this.activeCard.removeAttribute('data-expanded');
      this.activeCard = null;
    });

    transition.finished.finally(() => {
      document.querySelectorAll('.zoom-card').forEach((c) => {
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
    const capsule = this.viewport.querySelector('.live-capsule');
    if (!capsule) return;

    capsule.addEventListener('click', () => {
      const currentState = capsule.getAttribute('data-state');
      const nextState = currentState === 'collapsed' ? 'expanded' : 'collapsed';
      capsule.setAttribute('data-state', nextState);
    });
  }
}

```

---

## 5. View Transition Styles (CSS)

Add these rules to handle the radial scale along the pointer vector established in Section 4.

```css
::view-transition-old(active-spatial-target),
::view-transition-new(active-spatial-target) {
  animation-duration: var(--duration-expand);
  animation-timing-function: var(--ease-fluid);
  transform-origin: var(--origin-x) var(--origin-y);
}

.zoom-card[data-expanded="true"] {
  position: fixed;
  inset: 5vh 5vw;
  width: 90vw;
  height: 90vh;
  z-index: 50;
  border-radius: var(--radius-tray);
  background: #14171f;
  border: var(--surface-stroke);
  transform: translateZ(var(--plane-focus-z));
  filter: blur(0px);
}

```

---

## 6. Compositing Constraints for Web Engines

* Limit simultaneous `backdrop-filter` declarations to two DOM nodes on screen at any time (the floating dock and the dynamic live capsule).
* Set `pointer-events: none` on any element where `filter: blur()` exceeds `4px` to eliminate ghost touches on occluded planes.
* Isolate transforms by declaring `will-change: transform` strictly on the moving node; drop `will-change` once transitions conclude.