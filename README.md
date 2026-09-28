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

$$\text{EV} = R^{w_R} \times S^{w_S} \times C^{w_C}$$

- **Weights Auto-Normalize:** $$w_i = \text{raw\_}w_i / \sum \text{raw\_}w$$ (always sums to 1.0).
- **Multiplicative Knockout:** If Commercial Fit is zero ($C=0$, such as public bodies, NHS, or dead links), the entire score collapses to **0.00**.
