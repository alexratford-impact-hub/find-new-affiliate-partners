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
- 5: Direct match. Delivers NeedScope answers plus 2+ behavioral confidence cues (expert testing, spec benchmarks, user reviews).
- 4: Strong authority. Regularly reviews your product category with clear testing methodology.
- 3: General lifestyle overlap. Mentions your category alongside other unrelated topics.
- 2: Weak overlap. Rare single mentions without closing the confidence gap.
- 1: Almost no link. Incidental keyword hit only.
- 0: Wrong category or completely off-topic. (Automatic knockout: EV = 0.00).

## Scale (S): Website reach and organic traffic
- 5: Massive national authority. Millions of visits every month.
- 4: Large established site with strong Google search presence.
- 3: Mid-sized specialist or community blog with steady engagement.
- 2: Small niche blog with modest traffic footprint.
- 1: Brand new website or tiny traffic footprint.
- 0: Dead link, parked domain, or inactive for 12+ months. (Automatic knockout: EV = 0.00).

## Commercial Fit (C): Can they run affiliate links?
- 5: Active affiliate publisher. Already writes buyer guides and reviews with affiliate monetization links.
- 4: Commerce-friendly. Runs sponsored editorial and accepts performance commercial partnerships.
- 3: Editorial-first. Open to PR samples, product gifting, and free testing.
- 2: Difficult. Only accepts expensive fixed upfront tenancy fees.
- 1: Hostile to commerce or behind a hard paywall.
- 0: Non-profit, NHS, government (.gov/.nhs), or registered charity site. (Automatic knockout: EV = 0.00).

# Final Score Formula
EV = (R^wR) * (S^wS) * (C^wC)
