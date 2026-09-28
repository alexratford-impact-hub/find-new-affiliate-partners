# Metric Weights (Pick any positive numbers)
- raw_wR: 0.4  # Weight for Relevance
- raw_wS: 0.3  # Weight for Scale
- raw_wC: 0.3  # Weight for Commercial Fit

# Normalisation (Makes weights sum to 1.0)
total_W = raw_wR + raw_wS + raw_wC
- wR = raw_wR / total_W
- wS = raw_wS / total_W
- wC = raw_wC / total_W

# Scoring Rules (0 to 5)

## Relevance (R): How well they match what you sell & close confidence gaps
- 5: Direct match. Delivers NeedScope answers plus 2+ behavioral confidence cues.
- 4: Strong authority in product category with clear testing methodology.
- 3: General category overlap.
- 2: Weak overlap.
- 1: Almost no link. Incidental keyword hit only.
- 0: Wrong category or completely off-topic. (Automatic knockout: EV = 0.00).

## Scale (S): Proxy signals and organic search footprint
- 5: Top 3 organic search results for unbranded competitive stems across multiple queries.
- 4: High organic search visibility (top 5) with active ongoing editorial cadence.
- 3: Page 1–2 for long-tail query stems.
- 2: Lower-tier search visibility.
- 1: Inactive domain or forum thread.
- 0: Inaccessible domain, parked URL, or dead link. (Automatic knockout: EV = 0.00).

## Commercial Fit (C): Can they run affiliate links?
- 5: Active affiliate publisher with affiliate monetization links and network memberships.
- 4: Commerce-friendly. Runs sponsored editorial and performance commercial partnerships.
- 3: Editorial-first. Open to PR samples and testing.
- 2: Difficult. Only accepts fixed upfront tenancies.
- 1: Hostile to commerce or behind hard paywall.
- 0: Non-profit, NHS, government, or charity site. (Automatic knockout: EV = 0.00).

# Final Score Formula (Canonical Authority)
EV = (R^wR) * (S^wS) * (C^wC)

- **Multiplicative Knockout Rule:** If any metric ($R$, $S$, or $C$) is scored 0, the final score collapses to **0.00**.
