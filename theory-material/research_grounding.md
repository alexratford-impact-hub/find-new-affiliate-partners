# Research Grounding: Source Materials → Workshop Curriculum

> **Purpose:** Map every insight from the `source-materials/` corpus into actionable workshop content, strengthening the partner discovery skill logic with evidence-based reasoning.

---

## 1. Source Material Inventory

| # | Source File | Core Thesis | Workshop Relevance |
|---|---|---|---|
| 1 | [Buyer Behaviour in the Messy Middle](file:///c:/Users/alexr/Documents/Projects/AffilifestHuddle/source-materials/2026-09%20-%20Buyer%20Behaviour%20in%20the%20Messy%20Middle%20-%20Think%20with%20Google%20AUNZ.md) | Consumers are loyal to **what** they buy, not **where** — retailer switching is 2× higher than brand switching | Discovery logic for retailer-comparison publishers |
| 2 | [How Consumer Needs Shape Search](file:///c:/Users/alexr/Documents/Projects/AffilifestHuddle/source-materials/2026-09%20-%20How%20consumer%20needs%20shape%20search%20behavior%20-%20Think%20with%20Google.md) | Six emotional need states (Surprise, Help, Reassure, Educate, Impress, Thrill) drive search behaviour | Need-state query templates in `discovery.md` |
| 3 | [Profitable Growth in the Messy Middle](file:///c:/Users/alexr/Documents/Projects/AffilifestHuddle/source-materials/2026-09%20-%20Profitable%20growth%20in%20the%20Messy%20Middle%20-%20Think%20with%20Google%20APAC.md) | Show up with profitable products + be compelling with behavioural science at scale | Justification for the "be there" principle in partner recruitment |
| 4 | [Build Brand Confidence with AI](file:///c:/Users/alexr/Documents/Projects/AffilifestHuddle/source-materials/2026-09%20-%20Build%20brand%20confidence%20with%20AI%20marketing%20-%20Think%20with%20Google%20APAC.md) | The "Confidence Gap" — 1 in 3 consumers abandon a brand due to anxiety; 6 confidence cues + trusted platforms shift decisions | Confidence-cue mapping to evaluation search vectors |
| 5 | [First-Party Data in AI Era](file:///c:/Users/alexr/Documents/Projects/AffilifestHuddle/source-materials/2026-09%20-%20First-party%20data%20in%20AI%20era%20-%20Think%20with%20Google%20APAC.md) | Behavioural science + first-party data = up to 43% preference shift to challenger brands | Relevance scoring calibration in `estimated_value.md` |
| 6 | [Untangling the Messy Middle (Embryo)](file:///c:/Users/alexr/Documents/Projects/AffilifestHuddle/source-materials/2026-09%20-%20Untangling%20The%20Messy%20Middle%20%20Embryo.md) | Deep practitioner breakdown of all 6 biases + keyword tiering (Tier 1/2/3) for SEO discovery | Keyword tier logic in `search-term-db.md` and `discovery.md` |
| 7 | [skill.md Explained (GitBook)](file:///c:/Users/alexr/Documents/Projects/AffilifestHuddle/source-materials/2026-09%20-%20skill.md%20explained%20How%20to%20structure%20your%20product%20for%20AI%20agents%20%20GitBook%20Blog.md) | How to structure SKILL.md for AI agents: boundaries, workflows, if/then rules, guardrails | Direct template for Phase 4 (SKILL.md construction) |
| 8 | [Search Term Database](file:///c:/Users/alexr/Documents/Projects/AffilifestHuddle/source-materials/search-term-db.md) | Complete Boolean query taxonomy: 15 parameters, 6 need states, exploration/evaluation patterns, retailer friction | The operational engine powering `discovery.md` |
| 9 | [Question Term Database](file:///c:/Users/alexr/Documents/Projects/AffilifestHuddle/source-materials/question-term-db.md) | Natural language question stems mapped to cognitive drivers, behavioural principles, friction variables & operational regex classifier | Conversational, forum & long-tail search patterns + automated intent triage |

---

## 2. Research → Workshop Phase Mapping

### Phase 1: Brand Context (`brand.md`)

> [!IMPORTANT]
> **Key Research Insight:** "Almost 1 in 2 consumers will switch to their second choice **retailer**, whilst only 1 in 4 switch to their second choice **product brand**" — *Source 1*

**What this means for the skill:**
- The brand constraints file must define the **product category** with surgical precision, not the retailer relationship
- Competitor fields should list product-level competitors, not retail competitors
- The blocklist exists because consumers don't search for retailers — they search for products, then pick where to buy

**Evidence to cite in workshop slides:**
- 60%+ of retail Google searches in ANZ are for **products or product brands**, not retailers (*Source 1*)
- 78% of people look online when researching products (*Source 1*)
- 9 in 10 in-store purchases are influenced by online search (*Source 1*)

**Implication for `brand.md` coaching script:**
> "When you set your brand context, think category-first. Your consumers aren't searching for 'Boots affiliate programme'. They're searching for 'best serum for dry skin over 40'. That's the query space we need to intercept."

---

### Phase 2: EV Scoring Engine (`estimated_value.md`)

> [!IMPORTANT]
> **Key Research Insight:** "Applying all five behavioural science principles can have as much impact as discounting by 15%" — *Source 1*; "A fictional cereal brand managed to clinch 28% of shopper preference... a fictional car insurer won 87% share" — *Source 6*

**What this means for the skill:**
The scoring dimensions (Relevance, Scale, Commercial Fit) map directly to the research's proof that **showing up + being compelling** are the two growth levers:

| EV Dimension | Research Equivalent | Evidence |
|---|---|---|
| **Relevance (R)** | "Be Compelling" — does the publisher deliver the right confidence cues? | Behavioural science principles shift preference by up to 87% (*Source 6*) |
| **Scale (S)** | "Show Up" — does the publisher have the organic presence to be found? | 1 in 3 consumers choose second-choice brands simply because they show up (*Source 3*) |
| **Commercial Fit (C)** | Trust transference + platform legitimacy | Trusted platforms are the 7th confidence cue (*Source 4*); non-commercial sites = instant C=0 |

**Zero-Knockout justification strengthened:**
- *Source 4* proves that 1 in 3 consumers **abandon** brands they were considering due to anxiety. A publisher with zero commercial fit creates the same anxiety — it can't close the confidence gap
- The geometric mean formulation mirrors how confidence cues work: they're multiplicative, not additive. One missing cue breaks the chain

**Evidence to cite in workshop slides:**
- Fictional brands with all 6 biases supercharged won up to 87% preference (*Source 6*)
- Even a fake cereal brand beat established favourites with just social proof + power of free (*Source 6*)
- Layering first-party data on behavioural biases shifted 43% of preference to challenger brands (*Source 5*)

---

### Phase 3: Discovery Protocol (`discovery.md`) — **THE CORE**

This is where the research does the heaviest lifting. The entire `discovery.md` file is a translation of the Messy Middle model into affiliate recruitment search queries.

#### 3a. The Six Need States → Search Query Templates

From *Source 2* (Google/Kantar NeedScope research), every consumer search is driven by one of six emotional need states. Each need state produces a different **type** of publisher when you reverse-engineer who ranks for those queries:

| Need State | Consumer Query Pattern | Publisher Type Surfaced | Workshop Example (Boots UK) |
|---|---|---|---|
| **Educate Me** | "how to choose [category]", "guide for beginners" | Tutorial bloggers, how-to sites, category explainers | "how to choose electric toothbrush" → dental hygiene bloggers |
| **Reassure Me** | "is [product] worth it", "safe to buy from" | Independent review sites, trust-building comparison engines | "is Oral-B worth it reddit" → forum reviewers, trust sites |
| **Help Me** | "how to [task] with [product]", "works with" | Practical how-to publishers, compatibility guides | "best skincare routine for sensitive skin" → dermatology bloggers |
| **Impress Me** | "best luxury [category]", "premium", "award winning" | Aspirational lifestyle publishers, design/luxury editorial | "best luxury moisturiser UK" → premium beauty editors |
| **Thrill Me** | "latest [category]", "new releases", "next generation" | Trend-first publishers, early-adopter tech blogs | "new skincare tech 2026" → innovation/beauty-tech sites |
| **Surprise Me** | "unique [category]", "unusual gifts", "clever" | Discovery-oriented platforms, gift guides, curation sites | "unusual self-care gift ideas" → independent gift curators |

> [!TIP]
> **Workshop coaching hook:** "Default AI searches for partners by brand. We search for partners by **consumer mindset**. The consumer doesn't know your brand exists yet — they're in a need state. We find the publishers who satisfy that need."

#### 3b. Exploration vs. Evaluation — The Two Loops

From *Sources 1, 3, 6*, consumers cycle endlessly between two mental modes. The [search-term-db.md](file:///c:/Users/alexr/Documents/Projects/AffilifestHuddle/source-materials/search-term-db.md) already maps this beautifully, but the research adds critical nuance:

**Exploration (Expansive):**
- Query structure: unbranded, category-first, constraint-driven
- Keyword tier: Tier 2 (mid-tail) and Tier 3 (ontological questions) per *Source 6*
- "More than 60% of retail searches are for products, not retailers" (*Source 1*)
- Publishers found here: passionate niche enthusiasts, hobbyist bloggers, vertical specialists

**Evaluation (Reductive):**
- Query structure: branded, comparison-driven, specification-focused
- Applies the 6 behavioural biases as cognitive shortcuts (*Source 6*):

| Bias | Search Signal | What It Surfaces | Affiliate Value |
|---|---|---|---|
| **Social Proof** | "reviews", "rating", "real user experience", "reddit" | Community forums, review aggregators | Highest conversion-rate content — "most powerful mechanism to counteract discounting" (*Source 1*) |
| **Authority Bias** | "tested by", "award", "certified", "recommended by [expert]" | Independent testing labs, professional review sites, accreditation bodies | "A YouTube creator proved most effective authority bias for laptops" (*Source 1*) |
| **Category Heuristics** | "battery life", "noise level", "spec sheet", "benchmarks" | Technical specification sites, comparison tools, teardown blogs | Simplifies decision-making — "short descriptions of key product specifications" (*Source 1*) |
| **Power of Free** | "free delivery", "free gift", "free returns", "BOGOF" | Deal aggregators, reward-focused blogs | "Offering something free + reducing delivery friction = as compelling as 10% discount" (*Source 1*) |
| **Scarcity** | "in stock", "limited edition", "discontinued", "waiting list" | Stock-tracking sites, alert services | Triggers urgency — "in-built scarcity bias that harks back to caveman days" (*Source 6*) |
| **Power of Now** | "next day delivery", "same day dispatch", "express" | Fulfilment-focused comparison sites | "We love receiving benefits in a shorter time frame" (*Source 6*) |

#### 3c. The Confidence Gap → Partner Quality Criteria

From *Source 4*, the "Confidence Gap" research adds a layer the original Messy Middle didn't have:

- **81%** of consumers struggling with purchase decisions blame too much information or too many options (*Source 4*)
- **70%+** worry about misleading information (*Source 4*)
- **1 in 3** consumers abandon a brand they were considering due to anxiety (*Source 4*)

**Six confidence cues that shift purchase decisions:**
1. **Industry Respect** — awards, marketplace endorsements, certifications
2. **Authority** — expert reviews, category-specific websites
3. **Social Validation** — peer reviews, community consensus
4. **Trusted Platforms** — "trust transference" effect increases perceived brand trustworthiness
5. **Relevant Messaging** — product features matching the customer's shopping mission
6. **Personalised Experience** — context-aware content (not generic)

**For the skill:** Partners who deliver confidence cues should score higher on Relevance (R). The discovery queries should specifically target publishers that **close the confidence gap** rather than simply existing in the category space.

#### 3d. Natural Language Question Stems & Friction Resolution (`question-term-db.md`)

While `search-term-db.md` defines structured boolean parameters (`[CAT] AND [HEURISTIC]`), `question-term-db.md` provides the **conversational question stems** that reflect how real consumers search in natural language (Google conversational search, Reddit, Quora, specialist forums, and TikTok). 

This unlocks three distinct query categories for the agent:

##### 1. Exploration Question Stems (Cognitive Drivers)
Captures unbranded, expansive information foraging where shoppers build category mental models:

| Question Stem | Cognitive Driver | Dynamic Search Pattern | What It Surfaces |
|---|---|---|---|
| `"what is the difference between"` | Category distinction & taxonomy clarification | `"what is the difference between" AND [SUB_CAT] AND [SUB_CAT] NOT ([BRAND_A] OR [RETAILER_A])` | Educational blogs, explainer hubs |
| `"what is the standard"` | Default bias & baseline category heuristics | `"what is the standard" AND [HEURISTIC] AND ("for" OR "in") AND [CAT]` | Industry standards bodies, buyers guides |
| `"what is the best way to"` | Need-state education & practical setup | `"what is the best way to" AND ("choose" OR "calculate" OR "measure" OR "set up") AND [CAT] AND [CONTEXT]` | Specialist hobbyist blogs, tutorial creators |
| `"what are the top"` | Unbranded market scan & exploratory sorting | `"what are the top" AND [SUB_CAT] AND ("trends" OR "options" OR "styles") AND [LIFECYCLE] NOT [BRAND_A]` | Independent trend curators, niche rankings |
| `"how do I know"` | Uncertainty reduction & spec qualification | `"how do I know" AND ("what size" OR "which" OR "if I need") AND [CAT] AND [CONTEXT]` | Problem-solver sites, diagnostic tools |
| `"how do I choose"` | Paradox of choice mitigation | `"how do I choose" AND ("between" OR "the right") AND [SUB_CAT] AND ("guide" OR "checklist")` | Decision checklists, comparison matrices |
| `"how should I"` | Mental accounting & budget framing | `"how should I" AND ("budget for" OR "plan for" OR "finance") AND [CAT] AND [LIFECYCLE]` | Personal finance & budgeting bloggers |
| `"how can I tell if"` | Quality benchmarking & authenticity checking | `"how can I tell if" AND [CAT] AND ("is good quality" OR "is genuine" OR "will fit") AND [CONTEXT]` | Authenticity auditors, tear-down reviewers |
| `"when is the best time to"` | Purchase trigger timing & cyclical sales anticipation | `"when is the best time to" AND ("buy" OR "book" OR "upgrade") AND [CAT] AND (deal OR sale OR discount)` | Deal timing forecasters, seasonal planners |
| `"when is"` | Seasonal renewal & regulatory triggers | `"when is" AND [CAT] AND ("renewal due" OR "cheapest" OR "released" OR "black friday")` | Calendar/renewal tracking publishers |

##### 2. Evaluation Question Stems (Behavioural Principles Tested)
Captures the reductive mindset where shoppers stress-test shortlisted brands using cognitive biases:

| Question Stem | Behavioural Principle Tested | Dynamic Search Pattern | What It Surfaces |
|---|---|---|---|
| `"what's the best"` | Social proof & category-leading heuristic | `"what's the best" AND [SUB_CAT] AND ("for" OR "with") AND ([HEURISTIC] OR [CONTEXT] OR [AUDIENCE]) NOT [RETAILER_A]` | High-intent recommendation engines |
| `"what's the best rated"` | Pure social proof aggregation | `"what's the best rated" AND [CAT] AND ("reviews" OR "customer satisfaction" OR "5 star")` | User review aggregators, consumer forums |
| `"should I buy"` | Stated preference validation & risk aversion | `"should I buy" AND ([BRAND_A] OR [BRAND_B]) AND [SUB_CAT] AND ("worth it" OR "problems" OR "regrets")` | "Long-term ownership" reviewers, Reddit threads |
| `"should I switch to"` | Brand defection & challenger consideration | `"should I switch" AND ("from" AND [BRAND_A]) AND ("to" AND [BRAND_B]) AND [SUB_CAT]` | Head-to-head migration & comparison portals |
| `"could I use"` | Boundary condition testing & compatibility | `"could I use" AND ([BRAND_A] OR [SUB_CAT]) AND ("instead of" OR "for") AND [CONTEXT]` | Hack/workaround blogs, versatile use-case guides |
| `"could I get"` | Spec upgrade evaluation | `"could I get" AND [HEURISTIC] AND ("with" OR "on") AND ([BRAND_A] OR [BRAND_B]) AND [BUDGET]` | Price-to-spec optimization content |
| `"who is the top"` | Authority bias & institutional endorsement | `"who is the top" AND ("rated" OR "recommended" OR "approved") AND [CAT] AND [AUTHORITY]` | Industry award sites, certified testing labs |
| `"who makes the best"` | Provenance & costly signalling validation | `"who makes the best" AND [SUB_CAT] AND ("durability" OR "reliability" OR "luxury" OR "heritage")` | Heritage/craftsmanship editorial, artisan portals |
| `"who has the best"` | Category heuristic dominance | `"who has the best" AND [HEURISTIC] AND ("in the UK" OR "for" AND [AUDIENCE]) AND [CAT]` | Niche benchmarkers (e.g., fastest delivery, best battery) |
| `"why is [BRAND_A] so"` | Pratfall analysis & price-to-value verification | `("why is" AND [BRAND_A]) AND ("so expensive" OR "so cheap" OR "better than" AND [BRAND_B])` | Skeptical consumer watchdogs, value teardowns |

##### 3. Purchase & Friction Question Stems (Commercial Interception)
Captures point-of-sale friction where shoppers resolve delivery, price, and warranty concerns:

| Question Stem | Friction / Commercial Variable | Dynamic Search Pattern | Strategic Affiliate Value |
|---|---|---|---|
| `"where can I buy"` | Stock discovery & availability | `"where can I buy" AND [BRAND_A] AND [SUB_CAT] AND ("in stock" OR "authorised stockist")` | Stock alert trackers, authorized stockist directories |
| `"where can I get the cheapest"` | Direct price minimization | `"where can I get the cheapest" AND ([BRAND_A] OR [SUB_CAT]) AND ("price match" OR "deal" OR "sale")` | Price comparison engines, deal communities |
| `"where's the nearest"` | Omnichannel physical fulfillment | `"where's the nearest" AND ([RETAILER_A] OR [BRAND_A]) AND ("click and collect" OR "store" OR [GEO])` | Local store locators, click-and-collect aggregators |
| `"where's the best place to buy"` | Retailer reputation & service preference | `"where's the best place to buy" AND [BRAND_A] AND ("warranty" OR "customer service" OR "returns")` | Customer service benchmarking & warranty sites |
| `"how can I get free"` | Power of free extraction | `"how can I get free" AND ("delivery" OR "returns" OR "gift" OR "trial") AND ("from" AND [RETAILER_A] OR [BRAND_A])` | Freebie/sample blogs, reward aggregators |
| `"how can I get a discount on"` | Last-mile code hunting | `"how can I get a discount on" AND ([BRAND_A] OR [RETAILER_A]) AND ("code" OR "voucher" OR "first order")` | Voucher/coupon codes, loyalty clubs |
| `"how do I cancel"` | Contractual risk & exit friction | `"how do I cancel" AND ([BRAND_A] OR [RETAILER_A]) AND ("cooling off period" OR "fee" OR "direct debit")` | Subscription-management & consumer rights hubs |
| `"how fast does"` | Delivery friction & Power of Now | `"how fast does" AND ([RETAILER_A] OR [BRAND_A]) AND ("deliver" OR "dispatch" OR "next day")` | Delivery speed comparisons, shipping guides |
| `"who can deliver"` | Fulfillment constraint resolution | `"who can deliver" AND [SUB_CAT] AND ("tomorrow" OR "weekend" OR "same day") AND [GEO]` | Last-minute gift guides, courier directories |
| `"who can price match"` | Margin arbitration | `"who can price match" AND [BRAND_A] AND ([RETAILER_A] OR [RETAILER_B])` | Price-match policy comparison tools |

##### 4. Operational Regex Intent Classifier
The source material provides a production-tested regular expression to automatically classify any incoming natural-language query into the 3 stages:

```regex
^(who\s(is|can|makes|has)|what(\sis|\sare|'s)\sthe|how\s(can\si|do\si|should\si|fast\sdoes)|where(\scan\si|'s\sthe)|could\si|should\si|when\sis)(\s.*)
```

**Automated 3-Stage Routing Logic:**
1. **Exploration:** Starts with `what is the difference`, `what are the top`, or `how do I choose` → route to broad educational/unbranded publishers.
2. **Evaluation:** Contains `should I switch`, `what's the best`, or `who makes the best` → route to review hubs, comparison engines, and authority testing labs.
3. **Friction Resolution:** Contains `where can I get the cheapest`, `how can I get free`, or `where's the nearest` → route to deal publishers, stock trackers, and local fulfilment directories.

---

### Phase 4: SKILL.md Controller

From *Source 7* (GitBook skill.md guide), the SKILL.md structure should follow five principles:

1. **Define clear boundaries** — when this skill should/shouldn't be used
2. **Structural overview** — orient the model on the file architecture first
3. **Document workflows, not features** — step-by-step sequencing
4. **Include if/then decision rules** — lightweight logic for the LLM
5. **Add guardrails and common pitfalls** — negative constraints are powerful

> [!NOTE]
> This directly validates our Phase 4 approach. The Step 1 HALT gate is a guardrail. The weighted normalisation is an if/then rule. The domain blocklist is a boundary definition.

---

## 3. Strengthening the Discovery Logic

Based on the research synthesis, here are specific improvements to ground the skill files in evidence:

### `discovery.md` Enhancements

**Current approach:** Two loops (Exploration + Evaluation) with search query templates.

**Research-grounded upgrades:**

1. **Add Need State Layer:** Before the Exploration/Evaluation loops, add a preliminary "Need State Identification" step where the agent classifies the brand's primary customer need states (from the 6 NeedScope states). This focuses the search on the emotional drivers specific to the category.

2. **Add Confidence Cue Weighting:** During Evaluation queries, explicitly instruct the agent to prioritise publishers that deliver at least 2 of the 6 confidence cues. Research shows that 2 cues = equivalent to a 10% discount in persuasive power (*Source 1*).

3. **Add Keyword Tier Logic:** Structure queries in three tiers per *Source 6*:
   - **Tier 1 (Broad):** High-volume, brand-dominated — skip these (they surface existing partners)
   - **Tier 2 (Mid-tail):** Category + constraint — primary discovery zone
   - **Tier 3 (Ontological):** "Is X better than Y for Z?" — highest-intent publishers

4. **Retailer Fluidity Exploit:** Since consumers are 2× more likely to switch retailers than brands (*Source 1*), discovery queries should focus on "where to buy" content — publishers who help consumers pick the retailer. These publishers have outsized conversion influence.

5. **Conversational Question Stem Queries (Forums & Reddit Discovery):** Inject the question stems from *Source 9* (`"how do I choose"`, `"should I switch to"`, `"why is [BRAND] so expensive"`, `"how can I tell if [CAT] is good quality"`). This surfaces high-authenticity discussions on Reddit, Quora, and specialist enthusiast forums that standard keyword searches miss entirely.

6. **Last-Mile Commercial & Friction Interception:** Target friction-resolution queries (`"where can I get the cheapest"`, `"who can deliver tomorrow"`, `"where's the best place to buy [BRAND] with warranty"`). These surface high-converting commercial affiliates: stock alerts, warranty reviewers, and delivery speed curators.

### `estimated_value.md` Enhancements

**Current approach:** Three-axis geometric mean (R, S, C) with zero-knockout.

**Research-grounded upgrades:**

1. **Confidence Cue Sub-Score for Relevance (R):**
   When scoring Relevance, the agent should check: does this publisher deliver recognisable confidence cues (social proof ratings, authority credentials, category heuristic breakdowns)? A publisher that merely mentions the category without delivering cues should score R=2 max.

2. **"Behavioural Science Supercharge" Test:**
   The research proves that applying all 6 biases shifts up to 87% of preference. Publishers whose content naturally employs multiple biases (e.g., a review site that shows ratings + expert endorsement + spec comparison + delivery info) should receive R=5.

### `brand.md` Enhancements

**Current approach:** Category focus, competitor list, blocklist.

**Research-grounded upgrades:**

1. **Add "Primary Consumer Need States" Field:**
   ```markdown
   ## Primary Consumer Need States
   - Reassure Me (sensitive skin anxiety, ingredient safety)
   - Educate Me (routine building, product selection guides)
   - Help Me (compatibility with existing routines)
   ```
   This grounds the discovery search in the emotional drivers specific to the brand's category.

2. **Add "Confidence Cue Priority" Field:**
   ```markdown
   ## Confidence Cues (ranked for this category)
   1. Authority Bias (dermatologist endorsement)
   2. Social Proof (verified user reviews, before/after evidence)
   3. Category Heuristics (ingredient lists, SPF ratings, pH levels)
   ```

---

## 4. Evidence-Based Slide Content

For the slide-mode bookmarks between coding steps, here are research-backed talking points:

### After Phase 1 (Brand Context) → Before Phase 2 (EV Scoring)

**Recap slide content:**
> ✓ We locked our category to ONE vertical. Research shows 60% of searches are product-first, not retailer-first.

**Preview slide content:**
> ▸ Next: Build the scoring engine. We need objective math because fictional brands with the right signals beat real brands 87% of the time.

### After Phase 2 (EV Scoring) → Before Phase 3 (Discovery)

**Recap slide content:**
> ✓ The zero-knockout rule exists because 1 in 3 consumers ABANDON brands due to confidence anxiety. A partner that can't close the confidence gap scores zero — no matter how big they are.

**Preview slide content:**
> ▸ Next: Search like your customer searches. Not "find me affiliates for Boots" — instead, "best serum for dry skin over 40". That's where the undiscovered partners live.

### After Phase 3 (Discovery) → Before Phase 4 (SKILL.md)

**Recap slide content:**
> ✓ We reversed the search paradigm. Instead of looking for publishers who want to sell, we found publishers who help consumers DECIDE. Those 6 biases — social proof, authority, heuristics — they're the confidence cues that shift 43% of consumer preference.

**Preview slide content:**
> ▸ Next: Wire it all together. The SKILL.md file is the controller — boundaries, workflows, guardrails. One critical rule: the agent STOPS and waits for your exclusion list before it searches.

---

## 5. Key Statistics for Quick Reference

| Statistic | Source | Workshop Use |
|---|---|---|
| 60%+ of retail searches are for products, not retailers | Source 1 | Brand.md coaching — think product-first |
| 1 in 2 consumers switch second-choice **retailer** | Source 1 | Retailer fluidity = discovery opportunity |
| 1 in 4 switch second-choice **product brand** | Source 1 | Product loyalty = why we focus on category |
| 78% research products online | Source 1 | Justification for search-based discovery |
| Social proof = most powerful bias against discounting | Source 1 | Weight social-proof publishers higher in R score |
| 2 biases = equivalent to 10% discount | Source 1 | Partners delivering 2+ cues = high value |
| 5 biases = equivalent to 15% discount | Source 1 | Partners delivering all = R=5 |
| 87% preference shift with all 6 biases (car insurance) | Source 6 | Zero-knockout justification |
| 28% preference shift for fictional cereal brand | Source 6 | Even unknown publishers can win with right signals |
| 81% cite "too much info" as purchase difficulty | Source 4 | Partners that simplify = high Relevance |
| 1 in 3 abandon brand due to anxiety | Source 4 | Confidence gap = why C=0 knockout matters |
| 43% preference shift with behavioural science + 1P data | Source 5 | Data-informed discovery outperforms generic prompting |
| 17% increase in "best" queries YoY | Source 3 | Exploration query templates are growing in volume |
| 15% growth in "review" interest on YouTube | Source 3 | Evaluation content demand is rising |
| 67% of holiday shoppers open to new brands | Source 3 | Low loyalty = high opportunity for affiliate recruitment |
| 10 Exploration Question Stems | Source 9 | Cognitive driver query templates for unbranded discovery |
| 10 Evaluation Question Stems | Source 9 | Behavioural bias testing queries (social proof, authority, costly signalling) |
| 10 Purchase & Friction Stems | Source 9 | Last-mile commercial queries (stock, delivery speed, price match, warranty) |
| Unified Regex Classifier | Source 9 | Automated 3-stage query routing in agent controller |

---

## 6. Summary: The Research-Grounded Workshop Narrative

The workshop tells one unified story, and every source material supports it:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   DEFAULT AI APPROACH         OUR APPROACH              │
│   ─────────────────          ──────────────             │
│   "Find me affiliates        "What does my customer     │
│    for Boots"                  search when they're       │
│                                anxious about choosing    │
│   → Surfaces existing          the right moisturiser?"   │
│     partners, mass media,                                │
│     dead domains              → Surfaces undiscovered    │
│                                 niche publishers who     │
│   WHY IT FAILS:                 close the confidence     │
│   Searches brand-out            gap with social proof,   │
│                                 authority, and heuristics│
│   OUR FIX:                                               │
│   Search consumer-in          WHY IT WORKS:              │
│                               Mirrors the actual         │
│                               cognitive journey          │
│                               consumers take in the      │
│                               Messy Middle               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

The research gives us permission to make a bold claim in the room:

> **"We're not building a better prompt. We're building a search engine that thinks like your customer — and then recruiting the publishers who help that customer decide."**
