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

## Scale (S): Proxy signals and organic search footprint
- 5: Top 3 organic search results for unbranded competitive stems across multiple queries, with an active multi-author editorial desk and daily/weekly publishing cadence.
- 4: High organic search visibility (top 5) with active ongoing editorial cadence.
- 3: Ranks on page 1–2 for long-tail query stems, with individual specialist authorship and regular monthly updates.
- 2: Lower-tier search visibility or infrequent publishing cadence.
- 1: Single-author static site, forum thread, or inactive domain with no articles published in the last 6 months.
- 0: Inaccessible domain, parked URL, or dead link. (Automatic knockout: EV = 0.00).

## Commercial Fit (C): Can they run affiliate links?
- 5: Active affiliate publisher. Already writes buyer guides and reviews with affiliate monetization links and clear advertiser or sponsored content contact information, and are members of at least one major affiliate network.
- 4: Commerce-friendly. Runs sponsored editorial and accepts performance commercial partnerships.
- 3: Editorial-first. Open to PR samples, product gifting, and free testing.
- 2: Difficult. Only accepts expensive fixed upfront tenancy fees.
- 1: Hostile to commerce or behind a hard paywall.
- 0: Non-profit, NHS, government (.gov/.nhs), or registered charity site. (Automatic knockout: EV = 0.00).

# Verification Rules
For each candidate domain surfaced, the model must verify and cite explicit on-page evidence:
1. **Relevance:** State the exact site section or URL showing primary category alignment. If the site covers general news/lifestyle without a dedicated vertical hub, Relevance cannot exceed 2.
2. **Scale:** State the search query stem and organic rank/placement where the domain was intercepted.
3. **Commercial Fit:** Quote the exact on-page affiliate disclosure statement or commercial review CTA found on the target URL. If no commercial disclosure exists, Commercial Fit MUST be set to 0.

# Final Score Formula
EV = (R^wR) * (S^wS) * (C^wC)

