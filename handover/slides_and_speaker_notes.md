# Affilifest Brand Huddle Masterclass: Slides & Facilitator Teleprompter Guide

## Masterclass Schedule & Milestone Ledger (70-Minute Envelope)

| Window | Milestone | Cognitive / Commercial Goal | Sprint Duration | Core Artifact |
| :--- | :--- | :--- | :--- | :--- |
| **00:00 - 05:00** (5m) | Room Settling & AV Sync | Seating, calibration & `BroadcastChannel` check | - | `Display & Network Checks` |
| **05:00 - 13:00** (8m) | **Step 0: AI Blind Spot & Setup** | Overcome status quo bias; 4-question icebreaker | 3.5 mins | `partner-discovery/` directories |
| **13:00 - 22:00** (9m) | **Step 1: Commercial Guardrails** | Loss aversion; eliminate low-intent voucher leakage | 4.0 mins | `references/brand.md` |
| **22:00 - 31:00** (9m) | **Step 2: Deterministic EV Scoring** | Psychological capability; replace gut-feel with geometric mean | 4.0 mins | `references/estimated_value.md` |
| **31:00 - 45:00** (14m) | **Step 3: Dual-Engine Search** | Friction reduction; map genuine search behaviour (NeedScope + Heuristics) | 5.0 mins | `references/discovery.md` |
| **45:00 - 53:00** (8m) | **Step 4: Master Controller** | Choice architecture; enforce governance breakpoint (HALT gate) | 4.0 mins | `SKILL.md` |
| **53:00 - 60:00** (7m) | **Step 5: Live Run & Ledger** | Implementation intentions; form CRM habits | 3.0 mins | `run.md` & impact.com CSV |
| **60:00 - 70:00** (10m) | Technical Q&A & Pipeline Audit | Enterprise deployment & weekly vertical sprint routines | - | `Recruitment Tracker Ingestion` |

---

## Pedagogical & Cognitive Architecture

Each instructional step is partitioned into the **HCDC 4-Phase Micro-Cycle**:
1. **The Hook (90s)**: Expose the acute operational failure mode of default intuitive habits.
2. **The Chunk (3m)**: Live demonstration in Code Mode streamed character-by-character at 35 chars/sec with pinned tactical rationales.
3. **The Do (3.5-5m)**: Timed local laptop build sprint accompanied by an amber countdown timer on the screen.
4. **The Error Embrace / Commit (60-90s)**: Intentional error-recovery drill targeting known pitfalls (e.g. hidden `.txt` extensions, category dilution, non-profit false positives).

---

## Detailed Curriculum Modules

### Step 0: AI Blind Spot & Setup
* **Milestone**: 05:00 - 13:00 (8m) • **Sprint**: 3.5m
* **Artifact**: `partner-discovery/` on Desktop, `references/` subfolder, unhidden file extensions.
* **The Hook**:
  > *"Let's take a quick pulse of the room. Look at the display. Question 1: Who uses AI tools weekly in their everyday workflow? Hands up. Nearly the whole room raises their hand — about 90%. Question 2: Who has asked an AI tool to find affiliate partners or creators? About 60% of hands stay up. Question 3: Who actually recruited a top-performing partner from that search? Every single hand drops — 0%. Default prompts fail because they scrape search results brand-out. That surfaces voucher aggregators and coupon toolbars that already rank for your brand name plus 'discount'. Today we flip the architecture. Customers search to resolve uncertainty long before they select a retailer. We will build an autonomous skill on your machines that intercepts consumers where purchase decisions actually happen."*
* **The Chunk**: Scaffold the directory architecture:
  ```text
  Desktop/
  └── partner-discovery/
      ├── SKILL.md
      ├── run.md
      └── references/
          ├── brand.md
          ├── estimated_value.md
          └── discovery.md
  ```
* **The Error Embrace**: Fix Windows/macOS hidden extensions that silently create `brand.md.txt`.

---

### Step 1: Commercial Guardrails (`references/brand.md`)
* **Milestone**: 13:00 - 22:00 (9m) • **Sprint**: 4.0m
* **Artifact**: `references/brand.md`
* **The Hook**:
  > *"Here is how affiliate budgets bleed margin: coupon toolbars intercept shoppers who are already in the checkout funnel, claiming commission on sales they did not create. When you run an unconstrained web search prompt, the model follows the path of least resistance and fills your list with those exact coupon scrapers. We stop that by building a Negative Shield in brand.md."*
* **The Shield Configuration**:
  ```markdown
  # Target Parameters
  - Brand: Boots UK
  - Focus Category: Consumer Electronics & Personal Care
  - Commercial Model: CPA
  - Target AOV: £45
  - Target Territory: UK (Strict ASA compliance)

  # Competitor Baselines
  - currys.co.uk
  - lookfantastic.com

  # Disqualifications
  - Exclude voucher-code aggregator directories, coupon browser extensions, and cash-back scraping portals.
  - Exclude non-UK traffic sources.
  - Exclude direct retail brand competitors.
  ```
* **The Error Embrace**: Multi-category dilution trap. Enforce strictly one commercial vertical per run.

---

### Step 2: Scoring Engine Math (`references/estimated_value.md`)
* **Milestone**: 22:00 - 31:00 (9m) • **Sprint**: 4.0m
* **Artifact**: `references/estimated_value.md`
* **The Zero Rule**:
  $$EV = (R^{wR}) \times (S^{wS}) \times (C^{wC})$$
  Normalized Weights: $w_R = 0.40, w_S = 0.30, w_C = 0.30$.
* **The Knockout Proof**:
  - **Content Partner**: $R=5, S=4, C=4 \implies 5^{0.4} \times 4^{0.3} \times 4^{0.3} = \mathbf{4.37}$ (Tier 1 Priority).
  - **Coupon Scraper**: $R=0, S=5, C=5 \implies 0^{0.4} \times 5^{0.3} \times 5^{0.3} = \mathbf{0.00}$ (Immediate Knockout).
* **The Error Embrace**: Non-profit false positives (e.g. NHS guides). Set Commercial Fit $C = 0$ for non-monetizable sites.

---

### Step 3: Dual-Engine Search Protocol (`references/discovery.md`)
* **Milestone**: 31:00 - 45:00 (14m) • **Sprint**: 5.0m
* **Artifact**: `references/discovery.md`
* **The Lemniscate Decision Loop**:
  - Shoppers loop between **Exploration** (Expansive foraging) and **Evaluation** (Reductive validation).
  - 1 in 3 shoppers drop out due to choice overload (the Confidence Gap).
* **Loop 1: Kantar NeedScope Matrix**:
  1. *Educate Me (Competence)*: `"what is the difference between [CAT_A] and [CAT_B]"`
  2. *Help Me (Simplicity)*: `"how do I choose between [SUB_CAT] for [CONTEXT]"`
  3. *Reassure Me (Security)*: `"how can I tell if [CAT] is good quality"`
  4. *Impress Me (Status)*: `"who makes the best [SUB_CAT] for [AUDIENCE]"`
  5. *Thrill Me (Vitality)*: `"what are the top new [SUB_CAT] trends 2026"`
  6. *Surprise Me (Ingenuity)*: `"what is the best way to [UNCONVENTIONAL_USE] [CAT]"`
* **Loop 2: Google Messy Middle Heuristics**:
  1. *Authority Bias*: `"who is the top recommended [CAT] [AUTHORITY]"`
  2. *Social Proof*: `"what's the best rated [CAT] reviews reddit"`
  3. *Category Heuristics*: `"who has the best [HEURISTIC] [CAT]"`
  4. *Power of Free*: `"how do I get free delivery for [BRAND]"`
  5. *Scarcity Bias*: `"[SUB_CAT] restock alert UK release date"`
  6. *Power of Now*: `"who can deliver [SUB_CAT] tomorrow [GEO]"`
* **The Error Embrace**: Brand name query leakage. Strip merchant names from question stems.

---

### Step 4: Master Controller Skill (`SKILL.md`)
* **Milestone**: 45:00 - 53:00 (8m) • **Sprint**: 4.0m
* **Artifact**: `SKILL.md`
* **The Step 1 HALT Gate**:
  The AI agent is commanded to ingest references, compute metric weights, and **STOP IMMEDIATELY**:
  > *"Rules loaded for [Brand Name]. Please paste your list of existing partner domains (one per line) or upload your partner CSV so I don't recommend partners you already have."*
* **The Error Embrace**: Runaway models skipping the pause gate. Demand strict Step 1 enforcement.

---

### Step 5: Live Run & Verification (`run.md`)
* **Milestone**: 53:00 - 60:00 (7m) • **Sprint**: 3.0m
* **Artifact**: Scored recruitment ledger & impact.com copy-paste CSV block.
* **The Commercial Payoff**:
  Collapses 15-20 hours a month of manual Google searching into under 90 seconds of autonomous discovery.
* **Operational Next Steps**:
  1. Push vetted domains directly into impact.com recruitment tracking.
  2. Persist `partner-discovery/` as a permanent team asset in Claude Projects.
  3. Execute weekly vertical sprints across newly launched categories.

---

## Hardware Navigation Reference

| Keystroke | Facilitator Action |
| :--- | :--- |
| `[S]` | Project Slide Presentation Mode |
| `[C]` | Project Monospace Code Mode |
| `[Space]` or `[→]` | Advance slide micro-stage or stream next code chunk |
| `[←]` or `[Backspace]` | Step back to prior code chunk or slide micro-stage |
| `[` and `]` | Navigate speaker section tabs on laptop screen |
| `[1]` through `[6]` | Jump directly to Steps 0 through 5 simultaneously across both viewports |
