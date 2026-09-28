# Autonomous Affiliate Partner Discovery Skill

> Developed for the **[Affilifest Brand Huddle London](https://www.affilifest.com/brand-huddle-london)** workshop: *Find and Prioritise New Partners*  
> Facilitator: **Alex Ratford** (Senior Publisher Development Strategist @ [impact.com](https://impact.com))

A deterministic, exclusion-proof AI Agent Skill that reverse-engineers consumer search journeys to surface high-converting, undiscovered affiliate partners across **any vertical** (Retail, SaaS, FinTech, Travel, Subscriptions).

---

## The Dual-Engine Mental Model

Traditional AI prompts (`"Find top affiliates for my brand"`) fail because they search **brand-out**, returning coupon scrapers, mass broadsheets, and existing partners.

This skill searches **consumer-in** by combining two proven behavioral frameworks:

1. **Kantar's NeedScope (Emotional Entry Velocity):** Captures unbranded expansive search queries driven by 6 emotional need states (*Educate, Help, Reassure, Impress, Thrill, Surprise*) before a customer knows your brand.
2. **Google's Messy Middle (Cognitive Exit Closure):** Captures reductive evaluation queries testing 6 behavioral shortcuts (*Social Proof, Authority Bias, Category Heuristics, Power of Free, Scarcity, Power of Now*) to uncover independent testing desks and comparison engines.

---

## Directory Architecture

```
partner-discovery/
├── SKILL.md                # Master controller with Step 1 Exclusion HALT Gate
├── run.md                  # Launch prompt for Gemini Enterprise, Claude, or ChatGPT
└── references/
    ├── brand.md            # Brand parameters, vertical focus, competitor baselines & disqualifications
    ├── estimated_value.md  # EV scoring formula, auto-normalizing weights & zero-knockouts
    └── discovery.md        # Dual-engine search queries (NeedScope x Messy Middle)
```

---

## Quickstart

1. **Clone or Download:** Copy this folder to your machine.
2. **Customise `references/brand.md`:** Set your brand, **one sharp category vertical**, competitor benchmarks, and negative disqualifications.
3. **Run:** In Gemini Enterprise, Claude, or ChatGPT, paste the execution prompt from `run.md`:
   ```markdown
   Execute skill affiliate-partner-discovery from SKILL.md using the /references/ folder.
   Start with Step 1 (Read the Rules and Stop).
   ```
4. **Step 1 HALT Gate:** Watch the AI pause and demand your existing partner exclusion list. Paste exclusions (or type `continue`).
5. **Export:** Review the audited Markdown table and copy the CRM-ready CSV block directly into your outreach pipeline.

---

## The Expected Value (EV) Formula

```text
┌────────────────────────────────────────────────────────────────────────┐
│      EV = (Relevance ^ wR) × (Scale ^ wS) × (Commercial Fit ^ wC)      │
└────────────────────────────────────────────────────────────────────────┘
```

- **Metric Weights ($w_R, w_S, w_C$):** Automatically normalized: `w_i = raw_w_i / sum(raw_w)` (always sums to 1.0; e.g. `0.4 + 0.3 + 0.3 = 1.0`).
- **Multiplicative Knockout (The Zero Rule):** Because terms multiply geometrically rather than add, if any metric is zero—especially Commercial Fit ($C = 0$ for charities, public bodies, NHS, or dead links)—the entire score collapses to **0.00**.

---

## Operational Evaluation Mechanisms & Failure Boundaries

Three distinct operational mechanisms determine how the model evaluates candidates across these three pillars, along with clear failure boundaries where human instruction must intervene.

### 1. Relevance: Semantic Overlap and Consumer Intent Matching

The model evaluates relevance by matching the candidate domain's published text against the brand parameters and unbranded search problems defined in `brand.md` and `discovery.md`.

Because language models map words and concepts into high-dimensional vector spaces, the model does not rely on keyword matching alone. It measures semantic distance across three operational checks:

* **Core Topic vs. Mention:** Does the site focus primarily on the vertical (e.g., an independent grooming blog dedicated to wet-shaving techniques), or did it mention the keyword once in an off-topic article?
* **Problem-State Alignment:** Does the publisher's editorial voice directly answer the specific NeedScope queries (e.g., side-by-side product comparisons, ingredient breakdowns, durability stress-tests) rather than listing disconnected retail links?
* **Exclusion Filtering:** The model parses text for negative indicators defined in the Negative Shield (e.g., terms like "promo code", "voucher", "cashback", or "discount at checkout"). If those phrases dominate the site layout, the model scores category relevance at 0.

### 2. Scale: Proxy Signals and Organic Search Footprint

A language model does not have direct access to private traffic analytics (such as Google Analytics) or paid third-party traffic APIs (such as Similarweb, Ahrefs, or Semrush) unless integrated via an API tool.

In a standard web-browsing run, the model infers scale strictly through external proxies:

* **Search Engine Placement:** The search rank of the domain when querying the unbranded NeedScope and Messy Middle stems. Ranking on the first page for competitive unbranded queries serves as a proxy for organic authority.
* **Content Depth and Publishing Cadence:** The sheer volume of indexed articles, active publication dates, archive history, and visible comment sections or community activity.
* **Domain Footprint:** Editorial mastheads, multiple contributing writers, and syndication footprints versus single-page static blogs.

### 3. Commercial Fit: Structural Monetisation Fingerprints

The model determines commercial readiness by scanning the DOM structure and editorial copy of target URLs for established affiliate publishing conventions:

* **Affiliate Disclosure Blocks:** The presence of standard regulatory disclosures required by the ASA and FTC (e.g., "We may earn an affiliate commission when you purchase through links on our site").
* **Outbound Link Architecture:** URL redirect formats commonly used by major affiliate networks, tracking subdomains (e.g., `/go/`, `/out/`, `/recommends/`), and outbound links pointing to merchant checkout platforms.
* **Buying Guides and Review Formats:** Structured evaluation components such as "Pros and Cons" tables, "Where to Buy" buttons, and price-comparison modules.
* **Disqualification Scanning:** If the site is hosted on `.gov`, `.nhs.uk`, or registered educational/charity domains, or lacks commercial links entirely, it assigns $C = 0$.

---

## Where the Model Fails and How to Guide It

| Metric | Primary Failure Mode | Root Cause | Deterministic Fix |
|---|---|---|---|
| **Relevance** | **Broad Aggregator Drift** | Portals that cover 50 topics write one high-ranking review and pass the semantic check. | Require that the candidate site's primary menu or root category directly maps to the focus vertical. |
| **Scale** | **Authority Hallucination** | The model assumes a slick design or niche enthusiast forum has large reach, or mistakes high search rank for sustained monthly volume. | Ground the Scale metric with strict traffic thresholds or direct API inputs. |
| **Commercial Fit** | **Affiliate Readiness Guesswork** | The model detects external links but cannot confirm whether the publisher uses active networks or accepts commercial introductions. | Restrict $C = 5$ to domains with explicitly verified affiliate disclaimers or product review widgets. |

### Operational Improvements Codified in the Skill

#### 1. Replace Descriptive Scale Anchors with Verifiable Signals

Instead of letting the model estimate traffic from search prominence, bind the Scale scoring rubric to explicit, measurable evidence:

* **Score 5:** Appears in the top 3 organic search results for unbranded competitive stems across multiple queries, with an active multi-author editorial desk and daily/weekly publishing cadence.
* **Score 3:** Ranks on page 1–2 for long-tail query stems, with individual specialist authorship and regular monthly updates.
* **Score 1:** Single-author static site, forum thread, or inactive domain with no articles published in the last 6 months.
* **Score 0:** Inaccessible domain, parked URL, or dead link.

*(If your deployment environment allows function calls or external scripts, pass domain lists through an API endpoint like Similarweb or Ahrefs to populate monthly organic search sessions directly into the prompt context before scoring.)*

#### 2. Codify Binary Gates in `references/estimated_value_calculations.md`

Prevent score inflation by forcing the model to cite the exact URL element justifying its score:

```markdown
### Verification Rules
For each candidate:
1. Relevance: State the exact site section or URL showing primary category alignment. If the site covers general news/lifestyle without a dedicated vertical hub, Relevance cannot exceed 2.
2. Scale: State the search query and page rank where the domain was intercepted.
3. Commercial Fit: Quote the exact on-page affiliate disclosure statement or commercial review CTA found on the target URL. If no commercial disclosure exists, Commercial Fit MUST be set to 0.
```

Requiring the model to extract verbatim on-page evidence before calculating the geometric mean prevents it from making high-level assumptions about publisher fit.

