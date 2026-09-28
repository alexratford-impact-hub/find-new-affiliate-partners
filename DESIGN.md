---
name: Affilifest Masterclass
description: Operator-led autonomous partner discovery stage display and facilitator engine
colors:
  primary: "#F5333F"
  accent-blue: "#298DDA"
  accent-light: "#EBF4FC"
  success-green: "#10B981"
  warning-amber: "#F59E0B"
  stage-canvas: "#070A12"
  surface-card: "#FFFFFF"
  surface-subtle: "#F8F9FA"
  console-bg: "#111418"
  console-surface: "#1E232B"
  text-primary: "#111827"
  text-secondary: "#556070"
  text-muted: "#8D96A0"
  border-subtle: "#E5E7EB"
typography:
  display:
    fontFamily: "Sarabun, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2.2rem, 2.7cqw, 6.5rem)"
    fontWeight: 700
    lineHeight: 1.15
  headline:
    fontFamily: "Sarabun, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.2rem, 1.35cqw, 2.6rem)"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Sarabun, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.1rem, 1.25cqw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Sarabun, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.05rem, 1.15cqw, 2.2rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "ui-monospace, Cascadia Code, Source Code Pro, Menlo, Consolas, monospace"
    fontSize: "clamp(1.0625rem, 1.05cqw, 2.125rem)"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  xs: "4px"
  sm: "6px"
  card-sm: "8px"
  md: "10px"
  card-md: "12px"
  lg: "16px"
  pill: "9999px"
  card: "clamp(1.125rem, 1.35cqw, 2.75rem)"
  button: "clamp(0.75rem, 1cqw, 2rem)"
spacing:
  xxs: "clamp(0.25rem, 0.3cqw, 0.6rem)"
  xs: "clamp(0.5rem, 0.6cqw, 1.25rem)"
  sm: "clamp(0.75rem, 0.9cqw, 1.875rem)"
  md: "clamp(1.25rem, 1.5cqw, 3.125rem)"
  lg: "clamp(2rem, 2.4cqw, 5rem)"
  xl: "clamp(3rem, 3.6cqw, 7.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface-card}"
    rounded: "{rounded.button}"
    padding: "clamp(0.5rem, 0.6cqw, 1.25rem) clamp(1.25rem, 1.5cqw, 3.125rem)"
  button-primary-hover:
    backgroundColor: "#DE2531"
  artifact-copy:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
  pill-badge:
    backgroundColor: "{colors.accent-light}"
    textColor: "{colors.accent-blue}"
    rounded: "{rounded.pill}"
    padding: "3px 8px"
---

# Design System: Affilifest Masterclass

## Overview

**Creative North Star: "The Claude Artifact Theatre"**

The Affilifest Masterclass visual system is an operator-led presentation and engineering terminal environment calibrated for high-resolution stage projection and synchronized facilitator command. Rejecting passive, bullet-heavy slides and consumer web clutter, it creates a tactile stage theater: deep midnight backdrops (`#070A12`) frame crisp, fluid 16:9 cards, dynamic aurora accent lines, and a live side-by-side Claude-style engineering workspace.

The system transitions smoothly between **16:9 Presentation Slide Mode** for theoretical grounding and **Split Engineering Code Mode** for live, character-by-character typewriter worked-example reveals. In Code Mode, the screen splits into a 25% Claude chat stream on the left (prompting and reflective thinking) and a 75% artifact viewer on the right (syntax-highlighted code chunks with pinned tactical rationales). A dedicated dark facilitator console (`notes.html`) synchronizes session telemetry, countdown timers, and the 70-Minute COM-B execution ledger in real time without cluttering the public audience canvas.

**Key Characteristics:**
- **Subpixel Projector Stability:** Fixed 1920x1080 stage canvas scaled to viewport bounds without text-shimmering transforms.
- **Cognitive Worked-Example Staging:** Global system models fade progressively into scaffolded code streaming and timed laptop sprints.
- **Strict Signalling Color Palette:** Pure semantic color coding; zero arbitrary or decorative hues.
- **Tactile Instrument Aesthetics:** Crisp pill badges, glowing sync indicators, and neumorphic tactile depth.

## Colors

The palette is strictly semantic and functional: each hue communicates a precise operational state or behavioral heuristic.

### Primary
- **Disqualification Red** (`#F5333F`): System halt gates, negative brand exclusions, and multiplicative zero-knockouts ($C = 0$). Used on ≤10% of any view to signal immediate commercial boundaries.

### Secondary
- **Aviator Accent Blue** (`#298DDA`): Baseline parameters, file path pills, structural inputs, and active navigation indicators. Paired with **Soft Blue Tint** (`#EBF4FC`) for background badge fills.

### Tertiary
- **Search Vector Amber** (`#F59E0B`): Exploratory search queries, cognitive middle states, and active sprint countdown timers.
- **Validation Green** (`#10B981`): Commercial fit, validated partner outputs, assembled code chunks, and positive criteria.

### Neutral
- **Stage Midnight Canvas** (`#070A12`): Ultra-deep outer stage viewport surrounding the 16:9 presentation canvas.
- **Card Surface Light** (`#FFFFFF`): Primary foreground card surface providing maximum contrast under conference room projection.
- **Subtle Surface Canvas** (`#F8FAFC` / `#F8F9FA`): Subtle off-white stage background layered with a 32px radial grid pattern.
- **Console Dark Background** (`#111418`): Facilitator cockpit background for low-light operator glare reduction.
- **Console High Surface** (`#1E232B` / `#2A313C`): Raised control surfaces on the facilitator console.
- **Primary Text** (`#111827`): High-contrast ink on light surfaces, ensuring legibility from the back of the auditorium.
- **Secondary Text** (`#556070`): Supporting captions, labels, and secondary explanations.
- **Subtle Border** (`#E5E7EB` / `#CBD5E1`): Sharp 1px structural dividing lines.

### Named Rules
**The Signalling Strictness Rule.** Every accent color must represent a verified system state or behavioral heuristic (Blue for baseline, Amber for exploration/countdown, Green for validation, Red for knockouts). Decorative color variations are strictly prohibited.

**The Ten Percent Red Rule.** Disqualification Red (`#F5333F`) is reserved exclusively for negative exclusions and zero-knockout gates. It must never appear on more than 10% of any view to preserve its psychological impact.

## Typography

**Display Font:** Sarabun (weights 200–800) with system sans fallbacks (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
**Body Font:** Sarabun (weights 300, 400, 500, 600).
**Label/Mono Font:** High-contrast monospace stack (`ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace`).

**Character:** Clean, structural, and legible from 30 feet away under conference projector optics. Fluid typographic tokens clamp automatically across 1080p, 4K, and 8K displays.

### Hierarchy
- **Display** (700 weight, `clamp(2.2rem, 2.7cqw, 6.5rem)`, line-height 1.15): Primary slide hero titles and major workshop stage headers.
- **Headline** (700 weight, `clamp(1.2rem, 1.35cqw, 2.6rem)`, line-height 1.25): Card headers, section milestones, and ledger phase titles.
- **Title** (600 weight, `clamp(1.1rem, 1.25cqw, 2.5rem)`, line-height 1.3): Subsections, artifact titles, and thinking block labels.
- **Body** (400 weight, `clamp(1.05rem, 1.15cqw, 2.2rem)`, line-height 1.5, max-width 75ch): Explanatory tactical notes, behavioral rationale copy, and chat streaming text.
- **Label / Code Active** (600 weight, `clamp(1.0625rem, 1.05cqw, 2.125rem)`, line-height 1.4): Live typewriter code streaming, telemetry badges, and syntax tokens.

### Named Rules
**The Back-Row Legibility Rule.** No body text or code token on the stage canvas may render below 18px computed size on a standard 1080p display.
**The Monospace Purity Rule.** Code blocks, file paths, mathematical weights ($w_R, w_S, w_C$), and telemetry counters must always use the dedicated monospace font stack.

## Layout

The stage layout operates on a fixed 1920x1080 coordinate canvas contained inside a full-viewport outer frame (`#stage-viewport`). The canvas scales uniformly via CSS `transform: scale(var(--stage-scale))` anchored at `center center` to prevent horizontal and vertical page scrollbars across any aspect ratio.

- **Viewport Budgeting:** Primary visual containers target an 84vh to 90vh active height budget using responsive `clamp()` units.
- **Top Aurora Accent:** Continuous 0.25rem–0.6rem animated gradient bar running along the top viewport edge (`#2967da` to `#fcc838`).
- **Header Dock:** Fixed 3rem–6.5rem height bar containing the step counter, file path pill, active mode badge, and live sync status.
- **Split Code View (25/75):** Far-left Claude navigation rail (52px width), followed by a 25% chat stream panel (prompting & thinking process), paired with a 75% expanded code artifact window.

### Named Rules
**The Zero-Scrollbar Mandate.** Under no circumstance may the stage display produce browser scrollbars. All layouts must fit within the fixed stage boundary.

## Elevation & Depth

The system uses a hybrid model of **ambient drop shadows**, **subtle tonal layering**, and **tactile neumorphic insets** to convey depth on large projection screens without visual clutter.

### Shadow Vocabulary
- **Subtle Surface** (`0 2px 8px -1px rgba(15, 23, 42, 0.05)`): Resting state for stage cards and header controls.
- **Card Ambient** (`0 10px 28px -6px rgba(15, 23, 42, 0.08), 0 3px 8px -2px rgba(15, 23, 42, 0.04)`): Standard resting elevation for presentation cards.
- **Card Focused** (`0 18px 42px -8px rgba(15, 23, 42, 0.12), 0 6px 14px -3px rgba(15, 23, 42, 0.06)`): Active focal card elevation lifting the card above the blurred background deck.
- **Neumorphic Raised** (`12px 12px 28px rgba(166, 180, 200, 0.45), -12px -12px 28px rgba(255, 255, 255, 0.95)`): Tactile buttons and operator switches.
- **Neumorphic Inset** (`inset 3px 3px 8px rgba(166, 180, 200, 0.35), inset -3px -3px 8px rgba(255, 255, 255, 0.9)`): Pressed or active input states.

### Named Rules
**The Zero Font Jitter Rule.** Never apply `transform: scale()` to any container that encloses typography during hover, active, or breathing animations. Scaling forces browser subpixel anti-aliasing recomputations, causing visible text shimmer on projectors. Visual focus must be expressed strictly through `box-shadow` depth and `border-color` shifts.

## Shapes

The form language combines generous card corner radii with precision rounded pills for telemetry:

- **Pills (`9999px` radius):** Step counter badges, mode indicators, timer boxes, and file path markers.
- **Cards (`clamp(1.125rem, 1.35cqw, 2.75rem)` radius):** Stage presentation cards, split code panels, and modal containers.
- **Interactive Controls (`6px` to `10px` radius):** Artifact copy buttons, navigation icons, and console buttons.

## Components

### Header Telemetry Pills
- **Shape:** Full pill (`radius: 9999px`).
- **Style:** Subtle transparent background (`rgba(41, 141, 218, 0.08)` to `rgba(245, 158, 11, 0.12)`), 1px border, bold 11px uppercase typography.
- **States:** Ambient pulse on active timers; green glowing dot on synchronized instructor status.

### Claude Navigation Rail
- **Shape:** Vertical dock pinned to the far left of Code Mode.
- **Buttons:** 32x32px square buttons (`radius: 8px`) with centered SVG icons.
- **States:** Blue border and background highlight on active step.

### Artifact Embed Card
- **Shape:** Rounded container (`radius: 10px`), 1px solid border (`#E2E8F0`).
- **Style:** Two-column layout pairing a lightning bolt icon with artifact title and reveal progress badge (`Part 1 of 3`).

### Artifact Code Window
- **Shape:** Rounded panel (`radius: 12px`), dark code background (`#0D1117`) or high-contrast light mode with line numbers.
- **Controls:** Monospace file path tag, language badge (`markdown`), step progress pill, and tactile Copy Code button.
- **Pinned Tactical Rationale:** Explicit pinned card footer declaring the commercial or cognitive purpose of the syntax.

## Do's and Don'ts

### Do:
- **Do** anchor all stage visuals within the fixed 1920x1080 stage canvas (`--stage-scale`).
- **Do** pin an explicit tactical rationale to every revealed code chunk.
- **Do** enforce the Signalling Palette (Blue, Amber, Green, Red) with 100% semantic consistency.
- **Do** use `box-shadow` and `border-color` for focus and breathing animations.

### Don't:
- **Don't** use `transform: scale()` on typography containers during interactive transitions.
- **Don't** introduce vertical or horizontal document scrollbars on stage displays.
- **Don't** place body text or code smaller than 18px computed size on presentation surfaces.
- **Don't** use arbitrary or purely decorative accent colors.
