# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary Attendees:** Brand affiliate managers, agency publisher heads, and growth marketing practitioners attending the in-person Affilifest Brand Huddle London. They need to transition from low-intent "brand-out" coupon scraping to deterministic "consumer-in" partner recruitment.
- **Masterclass Facilitator / Operator:** Alex Ratford (Senior Publisher Development Strategist @ impact.com), who commands the stage display and pacing in real time via a synchronized dual-screen presenter console.

## Product Purpose

The Affilifest Masterclass Display & Operator Engine is a high-impact, stage-calibrated web application (`workshop.html` + `notes.html`) built to drive a 70-minute intensive workshop on *Autonomous Partner Discovery*. It pairs a 16:9 stage presentation view with live Claude-style code-streaming demonstrations and timed attendee sprints, eliminating passive attendee disengagement and ensuring every participant leaves with production-ready partner discovery pipelines.

## Positioning

Unlike conventional, passive slide decks (Google Slides, Keynote) or static web dashboards, this system is an interactive operator-led stage environment. It features synchronized dual-display orchestration, subpixel projector stability, real-time code artifact streaming with pinned tactical rationales, and an integrated COM-B behavioral science execution ledger.

## Operating Context

- **Environment:** Live presentation hall with digital projectors and large format stage displays (1080p, 1440p, 4K, 8K ultra-wide).
- **Display Architecture:** 16:9 widescreen presentation surface constrained strictly to 84vh–90vh viewport bounds with zero document scrollbars.
- **Dual-Screen Runtime:** Facilitator controls pacing, timers, step progression, and notes via `notes.html`, which synchronizes state seamlessly with the front-of-room stage display (`workshop.html`) over BroadcastChannel and localStorage fallbacks.

## Capabilities and Constraints

- **Dual Stage Modes:** Instant, smooth view-transition toggling between 16:9 Presentation Slide Mode and Split Engineering Code Mode (25% chat stream / 75% artifact code viewer).
- **Subpixel Projector Stability:** Absolute ban on `transform: scale()` on text-bearing containers to eliminate font shimmer across projector optics; focus and states are communicated via `box-shadow` depth and `border-color` transitions.
- **Viewport Clamping:** Responsive CSS clamping (`clamp()`) locking all content within viewport bounds without letterboxing or page scrolling.
- **Character-by-Character Typewriter Streaming:** Live code reveals with syntax highlighting, line numbers, copy-to-clipboard, and pinned tactical rationales.
- **Live Telemetry & Countdown Timers:** Dedicated sprint timers for timed attendee laptop sprints, step counter badges, and connection heartbeat status.

## Brand Commitments

- **Brand Entities:** Affilifest Brand Huddle London & impact.com.
- **Typography:** `Sarabun` (weights 200–800) for structural and presentation copy; high-contrast monospace font stack for code and technical parameters.
- **Semantic Colour Palette:**
  - **Blue (`#298DDA` / `#38BDF8`):** Baseline structural parameters, file inputs, primary navigation.
  - **Amber (`#F59E0B`):** Exploratory search vectors, cognitive processing, active sprint countdowns.
  - **Green (`#10B981`):** Commercial fit, validated ledger outputs, completed code chunks.
  - **Red (`#F5333F`):** Disqualifications, negative exclusions, system halt gates, mathematical zero-knockouts.
  - **Dark Base (`#0A0F1D` / `#0F172A`):** Deep stage background with subtle Aurora gradient accent lines.

## Evidence on Hand

- **Presentation & Facilitator Interfaces:** `workshop.html` (Stage Display) and `notes.html` (Facilitator Console).
- **Styling Architecture:** `src/css/tokens.css`, `src/css/workshop.css`, `src/css/notes.css`.
- **Runtime Engine:** `src/workshop-main.js`, `public/src/lib/typewriter.js`, state broadcasting modules.
- **Curriculum Architecture:** 70-Minute Masterclass Execution Ledger structured on the COM-B behavioral framework embedded in `notes.html`.
- **Automated Verification:** Playwright visual regression and viewport boundary test suites in `tests/viewport-text-bounds.spec.js` running across 1080p, 4K, and 8K viewport matrices.
- **Underlying AI Agent Skill:** `partner-research-skill/` repository containing `SKILL.md`, `references/brand.md`, `references/estimated_value.md`, and `references/discovery.md`.

## Product Principles

1. **Ground Theory in Mechanical Elimination:** Never present technical parameters in isolation; every slide and code chunk must anchor to a concrete behavioral heuristic (NeedScope / Messy Middle) or commercial failure mode (voucher leakage, wasted budget).
2. **Projector Ergonomics & Optical Stability:** Maintain absolute stability on digital displays—no font jitter, zero accidental scrollbars, and high-contrast back-of-room legibility (minimum 18px body font).
3. **Progressive Cognitive Fading:** Structure delivery following worked-example pedagogy—global system epitome first, scaffolded pair-programming code streaming second, and independent timed attendee sprints third.
4. **Operator Authority & Decoupled Telemetry:** The facilitator console maintains authoritative command over presentation state, timing, and stage synchronization without exposing presenter controls on the public stage canvas.

## Accessibility & Inclusion

- Back-row visual readability designed for conference projection.
- Semantic colour coding always accompanied by secondary shape, textual badge, or iconography indicators to ensure complete legibility for colorblind attendees.
