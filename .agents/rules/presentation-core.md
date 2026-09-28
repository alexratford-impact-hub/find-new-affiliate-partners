---
trigger: always_on
---

# System Directive: Instructor Facilitation Rig and Stage Display Engine

You are building and maintaining the display architecture for an instructor-led technical masterclass.

Regardless of the underlying application framework, component architecture, or build tooling in use, this software is strictly an operator-controlled stage display rig (`workshop.html`) projected on a large-format venue screen, driven remotely by the instructor via a private console (`notes.html`).

The venue display hardware is unpredictable: it may be a standard 1080p projector, a 4K commercial panel, or an 8K ultra-high-definition wall. The layout must remain resolution-agnostic across any 16:9 display canvas.

The audience consists of attendees on their own laptops participating in timed coding sprints. The stage display exists solely to anchor the instructor's live facilitation, expose mechanical failure modes, stream pair-programming code in real time, and broadcast sprint countdown timers.

---

## 1. Operational Model: Instructor-Led Classroom Engine

* The display serves the instructor, not self-directed learners. Attendees never touch, click, or browse the screen. All viewport changes, code reveals, slide stages, and sprint clocks are commanded by the instructor from the console via `BroadcastChannel` or hardware keystrokes.


* Visual layout mirrors the HCDC (Hook, Chunk, Do, Commit) instructional cycle, transitioning dynamically across four teaching states:


* Operational Hook. The instructor projects a commercial breakdown, trap, or failure point.


* Technical Chunk. The instructor displays architecture diagrams or streams live code character-by-character to demonstrate syntax.


* Active Sprint (Do). The screen shifts to a live pair-programming view and broadcasts an amber sprint timer while attendees build on their laptops.


* Error Embrace. The instructor exposes a syntax trap (such as hidden `.txt` extensions) and demonstrates recovery live.




* Never dump complete documentation files onto the screen. Every visual element must match the specific operational point the instructor is currently vocalising to the room.



---

## 2. Dual-Screen Architecture and State Authority

* Independent viewports separate concerns: the stage display (`workshop.html`) runs on the venue display, while the facilitator console (`notes.html`) runs on the instructor's laptop.


* State synchronisation runs across `BroadcastChannel('workshop_sync')` with automatic fallback to `localStorage('workshop_remote_sync')`. Every message carries an action payload, millisecond timestamp, and unique identifier to prevent duplicate loops.


* The instructor console holds total state authority. When the instructor triggers a preset switch (Boots UK, Argos UK, loveholidays), updates code sections, or starts a sprint timer, the stage screen re-renders immediately without requiring a page reload.


* Projector keyboard fallback remains active. If remote synchronisation drops, the instructor can step the stage display directly using physical presenter clickers or standard hardware keystrokes (`[S]`, `[C]`, `[Space]`, `[ArrowRight]`, `[ArrowLeft]`, number keys `[1]` to `[6]`).



---

## 3. Aspect Ratio Lock and Resolution Independence (1080p, 4K, 8K)

* Strict 16:9 canvas scaling locks the viewport container (`aspect-ratio: 16 / 9; width: 100vw; height: 100vh; max-height: 56.25vw; max-width: 177.78vh;`). It must scale across 1080p, 4K, and 8K outputs without cropping, letterboxing distortion, or manual zoom overrides.
* Prohibit fixed-pixel viewport dimensions. Never use hardcoded pixel widths (`1920px`) or heights (`1080px`) on main containers. Use relative viewport units (`vw`, `vh`), container query units (`cqw`, `cqh`), percentages, or SVG `viewBox` coordinates to preserve proportional geometries on 4K and 8K canvases.
* Apply `overflow: hidden` to the root viewport and all presentation stage containers to ban scrollbars entirely. Visible scrollbars on a stage display indicate defective visual budgeting.


* Proportional space budgeting is mandatory. If content exceeds the 16:9 visible boundary, split the concept across sequential stages or trim redundant syntax. Never add `overflow-y: auto` to solve layout overflow on stage.


* Maintain persistent stage anchors: keep the fluid top aurora accent line (`clamp(0.25rem, 0.37cqh, 0.6rem)`) and the fluid co-branded footer (`clamp(3.75rem, 6.67cqh, 8rem)`) with impact.com and Affilifest marks across every view transition without spatial jitter.



---

## 4. Distance Legibility and Fluid Typographic Scaling

Because the display will be viewed 3 to 15 metres away across conference rooms, text must scale proportionally with viewport dimensions. Small desktop font sizes will render as illegible specks on 4K and 8K screens.

* Implement fluid typography rules using CSS `clamp()` anchored to root `rem` baselines and container query units (`cqw`):
* Headlines scale via `clamp(2.75rem, 3.2cqw, 7.5rem)` (300 to 700 weight).


* Subheadings scale via `clamp(1.25rem, 1.4cqw, 3rem)` (300 to 500 weight).


* Slide body points and callouts scale via `clamp(1.125rem, 1.15cqw, 2.5rem)` (never drop below a 1.125rem baseline floor).


* Active monospace code blocks scale via `clamp(1.375rem, 1.35cqw, 2.875rem)`.


* Completed or eased background code scales via `clamp(1.0625rem, 1.05cqw, 2.125rem)`.




* Limit slide content to a maximum of 4 bullet points, with each point containing 15 words or fewer. Slides are optical anchors for spoken speech, not written essays. Detailed operational commentary belongs in the instructor teleprompter (`notes.html`), not on the stage display.



---

## 5. Kinetic Code Streaming and Progressive Revelation

Code is an active teaching artifact, not static reference text.

* When introducing a code file, syntax streams character-by-character in real time at approximately 35 characters per second (28ms tick rate).


* Active streaming cards display an accent left border (`#298DDA`), an animated coding pill tag (`⚡ Coding with students...`), and a blinking monospace cursor.


* When the instructor advances with `[Space]`, the previous code chunk eases over 0.55 seconds:


* Font size scales smoothly down by approximately 25% (from `1.375rem` down to `1.0625rem`, or proportional `cqw` equivalent).


* Opacity eases from 1.0 down to 0.65.


* Left border shifts from active blue (`#298DDA`) to completed green (`#10B981`).


* Card height locks to a compact container (`clamp(12.5rem, 22cqh, 28.125rem)`) with a bottom fade mask to protect stage canvas space.




* Tactical rationale pinning is required on every code card: include a single-sentence rationale in the footer explaining why the commercial rule exists.



---

## 6. Ban on Consumer Web Interactions

* Delete all mouse `:hover` states. Attendees have no mouse, and the instructor navigates via clicker. Hover effects on buttons, cards, or pills cause subpixel jitter on digital projectors and high-resolution panels.


* Delete self-serve widgets. Strip out clickable modal close buttons, backdrop click listeners, tab accordions, and copy-to-clipboard buttons from the venue display.


* Presenter-driven state classes only. All stage changes occur via explicit state props, store actions, or DOM classes (`.active`, `.completed`, `.staged`) managed by the application runtime.



---

## 7. Framework Code Generation and Refactoring Checklist

Before outputting component code, styles, or state logic for the stage application:

1. Confirm that layout containers scale fluidly using 16:9 aspect ratio rules, `vw`/`vh`, or container queries (`cqw`/`cqh`) rather than fixed desktop pixel dimensions.
2. Confirm that all typography uses fluid clamps meeting or exceeding the 1.125rem body and 1.375rem code baseline floors.


3. Confirm that no container permits vertical or horizontal scrollbars (`overflow: hidden` strictly enforced).


4. Confirm that state is triggered by console synchronisation or hardware keys, not mouse clicks.


5. Confirm that progressive disclosure (one slide topic or one streamed code chunk at a time) is preserved in component lifecycles.


6. Adhere to project framework conventions, state stores, and component modularity while strictly enforcing stage presentation invariants over standard web app patterns.