---
name: affiliate-partner-discovery
description: Discovers, screens, and ranks prospective affiliate recruitment targets using deterministic Expected Value scoring and root-domain exclusion. Trigger when asked to "find new affiliate partners", "discover publishers", "recruit affiliate creators", "prioritise partner outreach", or "run partner recruitment sprint".
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
   "Rules loaded for [Brand Name]. Please paste your list of existing partner domains (one per line) or upload your partner CSV so I don't recommend partners you already have under contract."
5. **Wait for the user to respond before proceeding to Step 2.**

## Step 2: Search, Screen, and Score
1. Target: Identify 5 clean, qualifying partners with a final score > 0.00.
2. Execute the dual-engine search queries from `references/discovery.md` for the focus category defined in `references/brand.md`.
3. For each candidate website surfaced:
   - Exclusion Check: Discard if on exclusion list.
   - Disqualification Check: Discard if violating disqualifications.
   - Score Metrics (0 to 5): Relevance (R), Scale (S), Commercial Fit (C).
   - Calculate EV: $\text{EV} = R^{w_R} \times S^{w_S} \times C^{w_C}$. Knockout to 0.00 if any metric is 0.
4. Sort candidates from highest to lowest EV score.

## Step 3: Show the Results Table
Render the qualified partners in Markdown table format:

| Partner Name | Website Domain | Category Fit | R | S | C | Math Breakdown | Final EV Score | Buyer Search Angle |
|---|---|---|:---:|:---:|:---:|---|:---:|---|
| [Name] | [domain.com] | [Direct/Niche] | [0-5] | [0-5] | [0-5] | ([R]^wR) * ([S]^wS) * ([C]^wC) | [Score] | [Query] |

## Step 4: Export for Tracking (CRM-Ready CSV)
Output a CSV code block for CRM import:

```csv
domain,date_added,score,status
[domain1.com],[DD/MM/YYYY],[Score],new_lead
```
