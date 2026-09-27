---
trigger: always_on
---

# Spatial Depth, Floating Island, and Kinematic Design System Specification

## Operational Scope

This system is an operator-led presentation web app built for stage displays, TV screens, and projector outputs. It is not a consumer-facing website or self-serve product dashboard. Every visual layer, floating dock, and depth transition exists to direct audience attention and support live facilitation pacing rather than personal screen navigation.

---

## 1. Spatial Tokens and Material Variables

### What to Do

* Define fixed, predictable surface materials using low-opacity fills and subtle border strokes to create physical separation on large monitors.
* Establish dedicated coordinate planes along the Z-axis to separate background context, active stage focus, and foreground overlays.
* Use non-linear cubic-bezier timing curves that decelerate smoothly into place, giving expanded cards a weighted physical arrival.
* Calculate dynamic transform origins based on where the presenter initiates the transition, anchoring expansion to the focal card.
* Maintain consistent corner geometry across all containers, reserving circular pill bounds for floating docks and generous radii for stage cards.

### What to Avoid

* Do not alter easing curves or duration speeds between different slides; inconsistencies in motion create visual distraction.
* Do not use percentage-based Z-axis values that shift wildly across different projector resolutions.
* Do not introduce arbitrary colour shifts or bright background surfaces that wash out high-contrast code blocks in dark conference rooms.

---

## 2. DOM Architecture and Layer Hierarchy

### What to Do

* Nest the continuous scene canvas inside a top-level presentation viewport locked to the display boundaries.
* Separate floating status monitors, the presentation stage canvas, and presenter control docks into distinct structural layers.
* Group stage cards inside a single semantic layout so the entire slide deck maintains continuous spatial alignment.
* Treat the status pill as an ambient session telemetry display showing workshop state and active modes.
* Keep the presenter dock decoupled from slide content, positioning it as an overlay that floats above the background plane.

### What to Avoid

* Do not nest slide cards inside multi-level interactive wrappers intended for consumer mouse interaction.
* Do not attach keyboard navigation handlers to individual inner card elements; keep input coordination at the document root.
* Do not allow slide content to break out of the established viewport into standard vertical document flow.

---

## 3. Viewport Styling and Material Rules

### What to Do

* Lock the presentation viewport to the full width and height of the display, disabling default document scrolling entirely.
* Suppress native browser touch behaviours, text selection highlights, and context menus to prevent presenter misclicks on stage.
* Push inactive background scenes into virtual space using depth-of-field blur and subtle brightness reduction when a focal card expands.
* Style floating control docks with ambient backdrop diffusion so slide content remains softly visible underneath.
* Use high-contrast typography and clear indicator badges so attendees in the back row can track state changes.

### What to Avoid

* Do not allow the viewport to display horizontal or vertical scrollbars under any circumstance.
* Do not use hover states designed for consumer web browsing; stage visual states should respond to presenter progression, not mouse movement.
* Do not leave background content at full brightness when foreground details are under active discussion.

---

## 4. Kinematics and Stage Zoom Engine

### What to Do

* Coordinate spatial movements through presenter hardware cues, remote synchronisation messages, or direct facilitator clicks.
* Measure the exact screen boundaries of the target card before running an expansion, routing the zoom outward from that point.
* Use native view transition capabilities to move elements between resting and expanded states without tearing down the underlying DOM.
* Ensure cards return to their exact previous place in the grid when collapsing back to the full stage view.
* Provide an immediate fallback layout switch for display environments that lack modern transition support.

### What to Avoid

* Do not expand cards from the exact physical centre of the screen if the card originates from a corner or side column.
* Do not unmount or rebuild slide DOM nodes during a transition; rebuilding nodes causes subpixel flicker on projection hardware.
* Do not trigger multiple spatial movements at the same time; keep the audience focused on one primary transition vector.

---

## 5. Focal View Transitions and Presentation Readability

### What to Do

* Expand active reference files and diagrams until they fill roughly ninety percent of the visual canvas, maximising legible space.
* Retain large typographic scales and strict monospace line heights on expanded code cards so syntax is readable from a distance.
* Anchor the transition origin strictly to the presenter focus point to create a natural zoom effect.
* Apply subtle deep shadows behind expanded cards to lift them physically above the blurred background deck.

### What to Avoid

* Do not allow expanded cards to bleed off the edge of the television or projector screen.
* Do not let dense instructional text scale down below eighteen pixels during presentation view.
* Do not introduce rotation or tilt effects during stage transitions; maintain flat, legible projection planes.

---

## 6. Compositing and Hardware Constraints

### What to Do

* Restrict active backdrop diffusion filters to a maximum of two layers on screen simultaneously to sustain consistent sixty frames per second rendering.
* Disable pointer interaction completely on blurred background layers to eliminate accidental inputs while a card is expanded.
* Assign hardware acceleration hints strictly while an animation runs, clearing them immediately after the element settles into position.
* Keep the stage fixed in place by suppressing browser pull-to-refresh and pinch-to-zoom at the window level.

### What to Avoid

* Do not leave hardware acceleration flags permanently enabled across all elements, as this wastes GPU texture memory.
* Do not apply heavy blur filters to large off-screen elements that the audience cannot see.
* Do not rely on continuous heavy CSS filters on low-power display hardware connected to secondary stage ports.