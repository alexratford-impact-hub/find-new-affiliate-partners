---
trigger: always_on
---

# Display Guidelines: TV Projector and Code Console (`workshop.html`)

## 1. Viewport, Display, and Brand Architecture

The display runs at a minimum resolution of 1920x1080 across a widescreen 16:9 ratio[cite: 5]. All interface elements render natively in modern browser runtimes without horizontal overflow or window scrolling[cite: 5]. 

* Viewport Budgeting: Anchor main slide stage containers to `min-height: 84vh` and clamp card widths to `1200` to fill the visual space cleanly.
* Top Accent: The top viewport maintains a 4 animated aurora accent bar (`linear-gradient(90deg, #298dda, #d73184, #f5333f, #fccc38)`)[cite: 1, 5].
* Permanent Footer: The lower viewport pins a permanent 72 co-branded footer featuring impact.com and Affilifest marks[cite: 1, 5].
* Affilifest Logo Visual Integration: Align the bottom-left Affilifest mark with the animated top aurora bar using CSS gradient masking (`-webkit-mask`) on transparent assets, or wrap the mark in a neumorphic pill badge with a matching gradient border line.

## 2. Slide Mode Standards & Depth-of-Field Staging

Slide Mode isolates attention without stripping spatial context. Eliminate the "white void" by keeping structural cards mounted while shifting visual focus.

* Depth-of-Field Blur Staging: Do not use `display: none` on inactive cards during multi-stage slides. Inactive or upcoming cards sit in place blurred (`filter: blur(4); opacity: 0.25;`). The active card renders in sharp focus (`filter: blur(0); opacity: 1.0; border: 2 solid var(--color-accent);`). Completed cards sit in neutral focus (`opacity: 0.65; border: 1 solid var(--color-success);`).
* No Static Takeaway Banners: Prohibit static `.slide-takeaway-banner` elements at the bottom of slides[cite: 1]. Takeaways are delivered verbally by the speaker; visual space is reserved for system diagrams and data cards.
* Typographic Scale: Main headlines scale between 44 and 60[cite: 5]. Subheadings scale between 19 and 24[cite: 5]. Body bullets sit at a minimum of 16 to guarantee legibility from the back row[cite: 5].
* Content Density: Limit cards to a maximum of four concise bullet points describing concrete commercial mechanisms rather than abstract theory[cite: 5].
* Signalling Palette: Positive criteria use green `#10B981`[cite: 5]. Negative disqualifications and zero-knockouts use red `#F5333F`[cite: 5]. Exploratory queries and active timers use amber `#F59E0B`[cite: 5]. Primary actions use accent blue `#298DDA`[cite: 5].
* Subpixel Stability: Never use CSS `transform: scale()` on containers holding typography during hover, breathing, or pulse animations[cite: 1]. High-lumen digital projectors magnify subpixel font rasterisation, causing severe text shimmering. Focus animations must rely exclusively on CSS `box-shadow` depth and `border-color` transitions[cite: 1].

## 3. Curriculum Structure & Content Standards

The presentation enforces 100% curriculum preservation across the six locked steps[cite: 1].

* Step 0 (Kickoff): Replace facilitator CV cards with the interactive 4-Question Icebreaker demonstrating the drop-off from general AI usage to zero recruited partners. Establish the shift from brand-out search to consumer-in interception[cite: 1].
* Step 1 (Brand): Render commercial bounds (Boots UK £45 AOV, Currys baselines) and the Negative Shield (banning voucher aggregators and coupon extensions)[cite: 1].
* Step 2 (Math): Present the geometric mean formula $EV = (R^{wR}) \times (S^{wS}) \times (C^{wC})$ with weights $w_R=0.4, w_S=0.3, w_C=0.3$ and the zero-knockout comparison proof[cite: 1].
* Step 3 (Discovery Zoom Sequence): Structure as three top-level sibling elements under `#slide-content-area` to avoid layout collapsing:
  * Stage 1: Macro Lemniscate SVG loop explaining the Confidence Gap and Decision Paralysis[cite: 1].
  * Stage 2: Loop 1 Kantar NeedScope Matrix detailing the Assertive-Receptive and Individual-Social axes with the 6 emotional mindsets and canonical queries[cite: 1].
  * Stage 3: Loop 2 6 Behavioural Heuristics explaining System 1 decision shortcuts with canonical queries[cite: 1].
  * Viewport Budgeting: Set `.kantar-chip { min-height: 0; height: 100%; }` and use a 2x3 grid with `clamp(11, 0.8vw, 13)` body copy to guarantee zero vertical scrolling on 1080p displays[cite: 1].
* Step 4 (Skill): Display the 4-phase architecture pipeline, the mandatory Step 1 HALT gate directive, and the auditable Markdown schema[cite: 1].
* Step 5 (Run): Display the single-prompt execution command and the scored candidate recruitment ledger[cite: 1].

## 4. Code Mode and Split-Console Standards

Code Mode splits the screen into a dual-pane engineering console[cite: 5].

* Left Pane (Chat Stream): Restricted to 25% viewport width[cite: 5]. Displays the facilitator prompt, an animated thinking loop, and artifact build notifications[cite: 5]. The thinking status cycles through a non-repeating Fisher-Yates shuffled deck of technical quips with pixel-shattering dissolve transitions[cite: 1].
* Right Pane (Artifact Window): Occupies 75% viewport width[cite: 5]. Displays active code blocks with monospace syntax formatting at 22 to 24 font size[cite: 1, 5].
* Header Meta: Displays the exact filepath, target language tag, and active part index[cite: 5].
* Footer Rationale: Every revealed chunk must include a pinned tactical rationale explaining the commercial outcome of the block[cite: 1, 5].
* DOM Preservation: Never wipe `container.innerHTML = ''` when advancing code chunks[cite: 1]. Prior chunks ease over 0.55s into `.completed` cards (opacity 0.65, green border, reduced font) while the incoming chunk mounts with active typewriter streaming[cite: 1, 5].
* Character Streaming: Stream active code at 35 characters per second (28ms ticks) with a blue vertical blinking cursor `#298DDA`[cite: 1, 5].

## 5. Audio Policy

The presentation application remains completely silent across all modes.

* No Synthetic Audio: Prohibit simulated typewriter keystroke clicks, UI boops, or hover chimes.
* No Acoustic Metronomes: Prohibit rhythmic beats, bass pulses, or periodic timer chimes during local laptop sprints. Timekeeping is communicated purely through the header's pulsing amber timer badge[cite: 1, 2].
* Room Collaboration: Preserve acoustic space for attendee peer-to-peer discussion and instructor guidance.

## 6. Synchronisation and Keystroke Navigation

Navigation operates via hardware keystrokes or remote console messages across `BroadcastChannel('workshop_sync')` with automated `localStorage` fallback[cite: 1, 4, 5].

* Keystroke `[S]`: Toggles Slide Presentation View[cite: 1, 4, 5].
* Keystroke `[C]`: Toggles Monospace Code View[cite: 1, 4, 5].
* Keystrokes `[Space]` or `[Right Arrow]`: Advances to the next slide stage or streams the next code chunk[cite: 1, 4, 5].
* Keystroke `[Left Arrow]`: Reverses to the prior code chunk or returns to Slide Mode[cite: 1, 4, 5].
* Keystrokes `[1]` through `[6]`: Map directly to `stepKeys[num - 1]` (`setup`, `brand`, `math`, `discovery`, `skill`, `run`)[cite: 1].
* Array Alignment: The staging engine must guarantee that `getSlideStageElements().length` matches `slideStageTitles[activ