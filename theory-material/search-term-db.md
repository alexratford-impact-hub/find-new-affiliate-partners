This expanded database translates the complete cognitive mechanics of the messy middle into executable Boolean search syntax, mapping the interaction between information foraging, consumer need states, behavioral biases, and transaction friction.

## Parameter Taxonomy

The database operates through fifteen modular parameters that represent specific cognitive, physical, or commercial entities:

| Placeholder | Parameter Scope | Valid Values |
| --- | --- | --- |
| `[CAT]` | Primary product category or vertical

 | `sofa`, `broadband`, `car insurance`, `laptop`, `trainers`, `whisky`<br> |
| `[SUB_CAT]` | Narrow category classification, style, or form factor

 | `corner sofa`, `fibre optic`, `SUV`, `ultrabook`, `running shoes`, `single malt`<br> |
| `[BRAND_A]` | Stated first-choice brand or entrenched incumbent

 | `Apple`, `British Airways`, `Samsung`, `Dyson`, `Nike`<br> |
| `[BRAND_B]` | Stated second-choice brand or challenger

 | `Opal Air`, `Stay Inn`, `Gem Mobile`, `Intergo`, `Maka`, `Honey C's`<br> |
| `[RETAILER_A]` | Stated first-choice retailer or default distributor

 | `Amazon`, `John Lewis`, `Argos`, `Currys`, `Boots`<br> |
| `[RETAILER_B]` | Competitor merchant, stockist, or broker

 | `TechHub`, `Skin Co`, `Spirit Shed`, `Jetsetgo`, `Secondhandcars`<br> |
| `[HEURISTIC]` | Primary product specification, technical standard, or key claim

 | `battery life`, `no claims discount`, `unlimited data`, `megapixels`, `100% natural`<br> |
| `[AUTHORITY]` | Independent review body, professional organisation, or publication

 | `Which?`, `TechRadar`, `British Dental Association`, `auto express`<br> |
| `[CONTEXT]` | Functional constraint, use-case environment, or physical setting

 | `three car seats`, `small living room`, `marathon training`, `remote work`<br> |
| `[AUDIENCE]` | Demographic cohort, persona, or life stage

 | `over 50s`, `students`, `beginners`, `families with dogs`, `flat sharers`<br> |
| `[GEO]` | Physical location, store identifier, or radius modifier

 | `near me`, `London`, `Manchester`, `in store`, `local branch`<br> |
| `[BUDGET]` | Price ceiling, payment denomination, or financial constraint

 | `under £500`, `under £30000`, `low monthly cost`, `affordable`<br> |
| `[LIFECYCLE]` | Trigger event, occasion, or time marker

 | `first time buyer`, `wedding guest`, `baby on the way`, `annual renewal`<br> |
| `[VALUE_SYSTEM]` | Ethical, cultural, or lifestyle priority

 | `sustainable`, `eco friendly`, `vegan`, `cruelty free`, `fair trade`<br> |
| `[FRICTION_TERM]` | Contractual risk, operational friction, or delivery constraint

 | `cancellation fee`, `cooling off period`, `returns policy`, `dispatch time`<br> |

---

## Need States and Micro-Moments

Search behaviour stems from six fundamental psychological need states and five commercial micro-moments. The queries below capture this foundational mindset layer:

| Consumer Need Vector | Research Objective | Dynamic Search Pattern |
| --- | --- | --- |
| Educate Me (Competence)

 | Building baseline domain knowledge

 | `([CAT] OR [SUB_CAT]) AND ("guide for beginners" OR "how to choose" OR "specs explained" OR "what is") NOT ([BRAND_A] OR [RETAILER_A])`<br> |
| Reassure Me (Simplicity & Trust)

 | Reducing anxiety and decision uncertainty

 | `([CAT] OR [SUB_CAT] OR [BRAND_A]) AND ("is it worth it" OR "common problems" OR "safe to buy" OR "legit")`<br> |
| Help Me (Practicality)

 | Solving concrete operational constraints

 | `([CAT] OR [SUB_CAT]) AND ("how to" OR "works with" OR "compatible with" OR "setup") AND [CONTEXT]`<br> |
| Impress Me (Status & Prestige)

 | Validating taste and social standing

 | `("best luxury" OR "highest quality" OR "premium" OR "award winning") AND ([CAT] OR [SUB_CAT]) NOT "cheap"`<br> |
| Thrill Me (Adventure & Novelty)

 | Chasing emergent market trends

 | `("latest" OR "new releases" OR "next generation" OR "top trends") AND ([CAT] OR [SUB_CAT])`<br> |
| Surprise Me (Entertainment)

 | Unconstrained discovery without predefined specs

 | `([CAT] OR [SUB_CAT]) AND ("unique" OR "unusual" OR "clever" OR "gift ideas") NOT [BRAND_A]`<br> |
| Which-Car-Is-Best Moment

 | Broad competitive scanning across options

 | `("best" OR "top rated") AND ([CAT] OR [SUB_CAT]) AND ([CONTEXT] OR [AUDIENCE]) NOT [RETAILER_A]`<br> |
| Is-It-Right-For-Me Moment

 | Spec-sheet validation against exact constraints

 | `([BRAND_A] OR [BRAND_B] OR [SUB_CAT]) AND ("how many" OR "fits" OR "dimensions" OR [HEURISTIC]) AND [CONTEXT]`<br> |
| Can-I-Afford-It Moment

 | Total cost of ownership and structure analysis

 | `([BRAND_A] OR [SUB_CAT]) AND ("price" OR "monthly cost" OR "lease vs buy" OR "pcp deals" OR [BUDGET])`<br> |
| Where-Should-I-Buy-It Moment

 | Merchant comparison and stock location

 | `([BRAND_A] OR [SUB_CAT]) AND ("dealers near me" OR "stockists" OR "authorised retailer" OR [GEO])`<br> |
| Am-I-Getting-A-Deal Moment

 | Verifying pricing equity against market baselines

 | `([BRAND_A] OR [BRAND_B]) AND ("best lease deals" OR "price match" OR "below market average" OR "invoice price")`<br> |

---

## Exploration Mindset (Expansive Foraging)

Exploration expands consideration sets by unearthing new categories, alternative designs, and unbranded solutions. Queries operate across three structural keyword tiers:

| Search Vector | Keyword Tiering Level | Dynamic Search Pattern |
| --- | --- | --- |
| Unbranded Inspiration

 | Tier 1: Broad Short-Tail

 | `([CAT] OR [SUB_CAT]) AND (ideas OR inspiration OR styles OR lookbook OR gallery) NOT ([BRAND_A] OR [RETAILER_A])`<br> |
| Macro Value Alignment

 | Tier 2: Mid-Tail Specific

 | `[VALUE_SYSTEM] AND ([CAT] OR [SUB_CAT]) AND (materials OR sourcing OR ethics OR certifications)`<br> |
| Audience Tailoring

 | Tier 2: Mid-Tail Specific

 | `([CAT] OR [SUB_CAT]) AND ("for" OR "designed for" OR "suitable for") AND [AUDIENCE] NOT [BRAND_A]`<br> |
| Situational Accommodation

 | Tier 2: Mid-Tail Specific

 | `([CAT] OR [SUB_CAT]) AND ("fits" OR "for use in" OR "space saving" OR "portable") AND [CONTEXT]`<br> |
| Category Distinction

 | Tier 3: Ontological Question

 | `("difference between" OR "what makes a good" OR "vs") AND [SUB_CAT] AND [SUB_CAT] NOT [BRAND_A]`<br> |
| Feature Scoping

 | Tier 3: Ontological Question

 | `("what is a good" OR "how much do I need") AND [HEURISTIC] AND "for" AND [CAT]`<br> |
| Market Leader Discovery

 | Tier 1: Broad Short-Tail

 | `("best" OR "highest rated" OR "top") AND ([CAT] OR [SUB_CAT]) NOT ([BRAND_A] OR [BRAND_B])`<br> |
| Occasion Triggers

 | Tier 2: Mid-Tail Specific

 | `([CAT] OR [SUB_CAT]) AND ("outfits for" OR "gifts for" OR "buying guide") AND [LIFECYCLE]`<br> |

---

## Evaluation Mindset (Reductive Behavioral Filtering)

Evaluation narrows alternatives down to a final brand, product, and configuration using cognitive shortcuts. These formulas represent explicit behavioral bias checks:

| Behavioral Principle Tested | Verification Mechanism | Dynamic Search Pattern |
| --- | --- | --- |
| Bilateral Trade-Off

 | Direct Head-to-Head Comparison

 | `([BRAND_A] AND [BRAND_B]) AND [SUB_CAT] AND ("vs" OR "versus" OR "or" OR "which is better")`<br> |
| Social Proof (Volume & Sentiment)

 | Consumer Consensus & Field Reports

 | `([BRAND_A] OR [BRAND_B]) AND [SUB_CAT] AND (reviews OR rating OR "real user experience" OR "forum" OR reddit)`<br> |
| Authority Bias (Impartial Review)

 | Institutional & Professional Endorsement

 | `([BRAND_A] OR [BRAND_B]) AND (tested OR award OR certified OR approved OR recommended) AND [AUTHORITY]`<br> |
| Category Heuristic Verification

 | Metric & Specification Thresholding

 | `([BRAND_A] OR [BRAND_B]) AND [SUB_CAT] AND ([HEURISTIC] OR "spec sheet" OR "benchmarks")`<br> |
| Pratfall Detection & Risk Aversion

 | Identifying Flaws, Failure Rates, & Limits

 | `([BRAND_A] OR [BRAND_B]) AND ("flaws" OR "drawbacks" OR "problems" OR "issues" OR "don't buy")`<br> |
| Anchoring & Framing Assessment

 | Verifying Price Tiers and Standard Baselines

 | `([BRAND_A] OR [SUB_CAT]) AND ("average cost" OR "price breakdown" OR "worth the extra" OR "price tier")`<br> |
| Mental Accounting & Financing

 | Monthly Outlay & Budget Attribution

 | `([BRAND_A] OR [BRAND_B]) AND ("0% finance" OR "monthly payment" OR "spread the cost" OR "klarna")`<br> |
| Default Bias & Category Norms

 | Industry Standard & Standard Package Terms

 | `([BRAND_A] OR [CAT]) AND ("standard warranty" OR "included as standard" OR "default options")`<br> |
| Scarcity Pressure

 | Checking Stock Levels & Time Limits

 | `([BRAND_A] OR [SUB_CAT]) AND ("in stock" OR "limited edition" OR "discontinued" OR "waiting list")`<br> |
| Costly Signalling & Provenance

 | Manufacturing Origin & Brand Investment

 | `([BRAND_A] OR [BRAND_B]) AND ("made in" OR "heritage" OR "handcrafted" OR "official partner")`<br> |
| Endowment Effect

 | Pre-Purchase Trial & Visualisation

 | `([BRAND_A] OR [BRAND_B]) AND ("free sample" OR "home trial" OR "augmented reality" OR "swatch")`<br> |
| Paradox of Choice Reduction

 | Range Aggregation & Product Filtering

 | `([BRAND_A] OR [BRAND_B]) AND ("product selector" OR "quiz" OR "comparison chart" OR "model guide")`<br> |

---

## Retailer Switching, Omnichannel, and Friction Minimisation

Consumers demonstrate weak retailer loyalty relative to product brand loyalty. Once product selection stabilizes, they switch focus to transaction friction, price, and channel mechanics:

| Commercial Friction Variable | Operational Vector | Dynamic Search Pattern |
| --- | --- | --- |
| Retailer Arbitrage

 | Identifying Alternative Stockists

 | `[BRAND_A] AND [SUB_CAT] AND ([RETAILER_A] OR [RETAILER_B] OR "stockists" OR "authorised dealers")`<br> |
| D2C vs Reseller Trade-Off

 | Manufacturer Direct vs Multi-Brand Stores

 | `[BRAND_A] AND ("buy direct" OR "official site" OR "factory outlet") AND ("warranty" OR "price match")`<br> |
| Price Minimisation & Bargain Seeking

 | Baseline Cost Reduction

 | `([BRAND_A] OR [SUB_CAT]) AND (cheap OR "lowest price" OR deal OR deals OR offers OR sale)`<br> |
| Last-Mile Code Hunting

 | Checkout Coupon Scavenging

 | `([RETAILER_A] OR [RETAILER_B] OR [BRAND_A]) AND ("discount code" OR "promo code" OR voucher OR coupon)`<br> |
| Power of Free Activation

 | Non-Monetary Value Extraction

 | `([BRAND_A] OR [RETAILER_A]) AND ("free delivery" OR "free gift" OR "free returns" OR "free trial" OR BOGOF)`<br> |
| Power of Now / Delivery Friction

 | Dispatch Velocity & Fulfillment Speed

 | `([BRAND_A] OR [SUB_CAT]) AND ("next day delivery" OR "same day dispatch" OR "express delivery" OR "lead time")`<br> |
| Omnichannel / Physical Inventory

 | Real-Time Local Stock Confirmation

 | `([BRAND_A] OR [RETAILER_A]) AND ("in stock near me" OR "check store stock" OR "click and collect" OR [GEO])`<br> |
| Contractual & Service Friction

 | Commitment Risk & Termination Clauses

 | `([BRAND_A] OR [RETAILER_A]) AND ("cancellation policy" OR "cancellation fee" OR "cooling off period" OR "hassle free returns")`<br> |
| Bundle Construction & Unbundling

 | Package Deals vs Component Splitting

 | `([BRAND_A] OR [SUB_CAT]) AND ("bundle deal" OR "starter pack" OR "sim only" OR "body only" OR "package offer")`<br> |

---

## Dynamic Query Parsing Rules

Automated classification pipelines must route search strings based on three syntactic triggers:

1. Classification as Expansive Exploration: When queries contain `ideas`, `best`, `trends`, or ontological clauses (`difference between`), but lack both `[BRAND_A]` and `[RETAILER_A]`, route traffic to discovery content and category heuristic guides.


2. Retailer Fluidity Trigger: When queries contain `[BRAND_A]` paired with `[RETAILER_B]` or search terms like `cheap`, `deals`, or `discount code`, product preference is locked; optimize for price, delivery friction, and power of free to capture market share.


3. Supercharging Trigger: When an evaluation query contains `[BRAND_A]` along with `reviews` or `[AUTHORITY]`, display ads with verified social proof scores and impartial third-party certifications to shift choice away from market incumbents.