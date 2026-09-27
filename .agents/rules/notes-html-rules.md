---
trigger: always_on
---

Both rule files require immediate updates because they conflict with the 70-minute timetable, the zero-whiteboard constraint, and the depth-of-field staging architecture.   Key Conflicts in Current RulesThe 60-Minute Mismatch (notes.html): Section 2 enforces a 60:00 countdown and old step timings (10m, 10m, 10m, 12m, 10m, 8m). This breaks the 70-minute masterclass allocation (5m settling, 55m build, 10m Q&A) and misallocates Step 3's required 14-minute zoom sequence.   The Whiteboard Fallacy (notes.html): Section 3 instructs the facilitator to "write specific operational rules on the whiteboard". The room has zero physical whiteboards; every visual demonstration must render digitally in workshop.html.   The "White Void" Conflict (workshop.html): Section 2 commands the engine to "never render multi-column cards simultaneously". This produces an empty white void. It directly contradicts the depth-of-field architecture where all cards stay mounted on screen, using background blur and opacity shifts to show the wider roadmap without overloading focus.   Missing Visual & Audio Guardrails (workshop.html): The rules omit the subpixel stability ban on transform: scale(), the Affilifest gradient logo alignment, the 4-Question Icebreaker mandate, and the room silence policy.Updated File 1: notes-html-rules.mdMarkdown---
trigger: always_on
---

# Console Guidelines: Facilitator Console and Teleprompter (`notes.html`)

## 1. System Architecture and Local Sync

The facilitator console runs locally on the presenter laptop screen, operating alongside the primary projector view. It coordinates presentation states without requiring external internet access or external database services[cite: 4].

* Run state synchronisation across `BroadcastChannel('workshop_sync')`[cite: 4].
* Maintain automatic fallback to `localStorage('workshop_remote_sync')` for browsers or window contexts that restrict broadcast channels[cite: 4].
* Dispatch unique message identifiers (`msgId`) and millisecond timestamps with every remote command to prevent duplicate execution loops[cite: 4].
* Maintain active heartbeat pings (`HEARTBEAT_PING`) every five seconds to verify connection with `workshop.html`[cite: 4]. Revert the connection badge to listening mode if a pong response fails for 6.5 seconds[cite: 4].

## 2. Clock Engine and Time Management (70-Minute Masterclass)

The console features three independent timing systems to keep the masterclass running strictly to the 70-minute envelope.

* Master Session Clock: Displays an absolute 70:00 countdown timer for the full workshop. Shift display styling to amber when remaining time reaches 15 minutes. Trigger a pulsing red alert when time drops to 5 minutes[cite: 4].
* Schedule Milestones:
  * 00:00 - 05:00 (5m): Room settling, seating, and AV broadcast sync check.
  * 05:00 - 13:00 (8m): Step 0 Kickoff & Workspace Setup.
  * 13:00 - 22:00 (9m): Step 1 Brand Configuration.
  * 22:00 - 31:00 (9m): Step 2 Scoring Engine Math.
  * 31:00 - 45:00 (14m): Step 3 Dual-Engine Search Zoom Sequence.
  * 45:00 - 53:00 (8m): Step 4 Master Controller Skill.
  * 53:00 - 60:00 (7m): Step 5 Live Run & Ledger Verification.
  * 60:00 - 70:00 (10m): Technical Q&A, CRM pipeline audit, and wrap-up.
* Sprint Timer Overlay: Fires student build timers directly across to the projector screen[cite: 4]. Display the active countdown in an amber pill badge `#B45309`[cite: 4]. Provide an immediate `+1m` manual override control button on the console to extend tight exercises without breaking the broader schedule[cite: 4].

## 3. Teleprompter Delivery Hierarchy & Non-Technical Tone

Every module partitions facilitator instructions into clear operational tiers. All scripts must use plain commercial terms rather than engineering jargon.

* Standard Script: Provides an exact spoken delivery calibrated to a 45-second delivery window[cite: 4]. Focuses on commercial revenue, buyer psychology, and partner recruitment failure points[cite: 4].
* Speed-Run Bullets: Delivers a compressed 15-second spoken summary[cite: 4]. Use this mode whenever a section clock falls behind schedule to recover pacing[cite: 4].
* Cognitive Trap: Flags the specific commercial or technical failure mode attendees will encounter during that step (such as hidden `.txt` extensions, multi-category dilution, or additive scoring inflation)[cite: 4].
* Stage Action: Outlines direct physical instructions for the room[cite: 4]. Commands the facilitator to switch display modes, tally hands during the icebreaker, or highlight specific digital cards[cite: 4]. Zero physical whiteboard references; all visual demonstrations occur through `workshop.html`.
* Plain-English Vocabulary Invariants: Translate technical concepts into commercial outcomes. Refer to the geometric mean as "The Zero Rule" (traffic without fit equals zero commission). Refer to negative constraints as "The Negative Shield". Refer to search vectors as "Problem-First Searches" and "Decision Shortcuts".

## 4. Hardware Keystrokes and Navigation Controls

Hardware keyboard listeners must intercept navigation events unless the facilitator is typing in an active form input[cite: 4].

* Keystroke `[S]` commands the projector to display Slide Presentation View[cite: 4].
* Keystroke `[C]` commands the projector to display Monospace Code View[cite: 4].
* Keystrokes `[Space]` or `[ArrowRight]` advance the projector to the next sequential slide micro-stage or stream the next code chunk[cite: 4].
* Keystrokes `[Left Arrow]` or `[Backspace]` step back to the prior code chunk or return the projector to Slide Mode[cite: 4].
* Keystrokes `[` and `]` navigate between speaker substep tabs inside the console without changing the student projector view[cite: 4].
* Numeric keys `[1]` through `[6]` execute direct jumps to Steps 0 through 5 across both screens simultaneously[cite: 4].

## 5. Preset Switching and Dynamic Overrides

The console houses dedicated controls to reconfigure live data presets across both screens simultaneously[cite: 4].

* Include one-click target brand toggles for Boots UK, Argos UK, and loveholidays[cite: 4].
* Broadcast `APPLY_PRESET` commands instantly through the sync channel without forcing a browser refresh[cite: 4].
* Update local code buffers, slide text, target average order values, and competitor domains dynamically across both viewports[cite: 4].