---
name: affiliate-partner-discovery
description: Discovers, screens, and ranks prospective affiliate recruitment targets using deterministic Expected Value scoring and root-domain exclusion. Trigger when asked to "find new affiliate partners", "discover publishers", "recruit affiliate creators", "prioritise partner outreach", or "run partner recruitment sprint". Do NOT trigger for reporting on existing partner performance, tracking tag debugging, or voucher code lookup.
---

# Reference Files
- references/brand.md
- references/estimated_value.md
- references/discovery.md
- references/exclusions.md

# Instructions for the AI

## Step 1: Read the Rules and Stop (MANDATORY HALT GATE)
1. Read all files inside the `/references/` directory.
2. Calculate the normalized metric weights ($w_R, w_S, w_C$) following the formula in `references/estimated_value.md`.
3. **STOP IMMEDIATELY. Do not execute any searches yet.**
4. Ask the user:
   "Rules loaded for [Brand Name]. Please paste your list of existing partner domains (one per line) or upload your partner CSV so I don't recommend partners you already have under contract. (If running in a local offline environment without exclusions, type 'continue')."
5. **Wait for the user to respond before proceeding to Step 2.**

## Step 2: Search, Screen, and Score
1. Target: Identify **5 clean, qualifying partners** with a final score $> 0.00$.
2. Execute the dual-engine search queries from `references/discovery.md` for the focus category defined in `references/brand.md`:
   - 3 Expansive Foraging queries (Kantar NeedScope emotional search states).
   - 3 Reductive Evaluation queries (Google Messy Middle cognitive biases).
3. For each candidate website surfaced:
   - **Exclusion Check:** If the domain matches the user's exclusion list (or `references/exclusions.md`), discard immediately.
   - **Disqualification Check:** If the domain violates Disqualifications in `references/brand.md` (voucher aggregators, coupon scrapers, direct retail competitors, non-UK), discard immediately.
   - **Score Metrics (0 to 5):**
     - Score Relevance ($R$) based on confidence cues from `references/estimated_value.md`.
     - Score Scale ($S$) based on organic search presence.
     - Score Commercial Fit ($C$) based on affiliate monetization. If public sector / NHS / Gov / charity, score $C = 0$.
   - **Calculate EV:** Compute Expected Value using the multiplicative formula and knockout rules in `references/estimated_value.md`: $\text{EV} = R^{w_R} \times S^{w_S} \times C^{w_C}$. If any metric is 0, the final score collapses to $0.00$ (knockout).
4. Continue screening until 5 distinct partners score $> 0.00$, or a maximum of 3 query cycles across `references/discovery.md`.
5. If fewer than 5 qualify after 3 iterations, output all evaluated candidates, explicitly note which criteria caused knockouts ($R=0$, $S=0$, or $C=0$), and prompt the user to expand category query stems.
6. Sort the top candidates from highest to lowest EV score.

## Step 3: Show the Results Table
Render the qualified partners in this exact Markdown table format:

| Partner Name | Website Domain | Category Fit | R | S | C | Math Breakdown | Final EV Score | Buyer Search Angle |
|---|---|---|:---:|:---:|:---:|---|:---:|---|
| [Name] | [domain.com] | [Direct/Niche] | [0-5] | [0-5] | [0-5] | ([R]^wR) * ([S]^wS) * ([C]^wC) | [Score] | [NeedScope/Messy Middle query] |

## Step 4: Export for Tracking (CRM-Ready CSV)
Output a persistent, copy-paste CSV code block so the user can import these directly into their CRM or recruitment workflow:

```csv
domain,date_added,score,status
[domain1.com],[DD/MM/YYYY],[Score],new_lead
[domain2.co.uk],[DD/MM/YYYY],[Score],new_lead
```

# Guardrails & Traps
- Always show the full mathematical breakdown in the table so numbers can be audited.
- Non-profit, NHS, government (.gov/.nhs), and charity sites receive $C = 0$ (instant knockout).
- Never recommend voucher-code scraper directories or coupon browser extensions.
- If live web searches return fewer than 5 candidates after 3 query loops, do not hallucinate domains; output the partial ledger with explicit knockout rationales.
