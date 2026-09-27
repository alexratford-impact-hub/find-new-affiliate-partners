The question database below maps consumer enquiry stems to each stage of the messy middle, formalising how shoppers forage for information, resolve psychological barriers, evaluate competing propositions, and settle transaction friction.

## Exploration Questions

These queries capture the expansive mindset where consumers identify category rules, define essential specifications, and seek unbranded inspiration without committing to a single merchant or maker.

| Question Stem | Cognitive Driver | Dynamic Search Pattern |
| --- | --- | --- |
| `"what is the difference between"` | Category distinction & taxonomy clarification

 | `"what is the difference between" AND [SUB_CAT] AND [SUB_CAT] NOT ([BRAND_A] OR [RETAILER_A])`<br> |
| `"what is the standard"` | Default bias & baseline category heuristics

 | `"what is the standard" AND [HEURISTIC] AND ("for" OR "in") AND [CAT]`<br> |
| `"what is the best way to"` | Need-state education & practical setup

 | `"what is the best way to" AND ("choose" OR "calculate" OR "measure" OR "set up") AND [CAT] AND [CONTEXT]`<br> |
| `"what are the top"` | Unbranded market scan & exploratory sorting

 | `"what are the top" AND [SUB_CAT] AND ("trends" OR "options" OR "styles") AND [LIFECYCLE] NOT [BRAND_A]`<br> |
| `"how do I know"` | Uncertainty reduction & sizing/spec qualification

 | `"how do I know" AND ("what size" OR "which" OR "if I need") AND [CAT] AND [CONTEXT]`<br> |
| `"how do I choose"` | Paradox of choice mitigation

 | `"how do I choose" AND ("between" OR "the right") AND [SUB_CAT] AND ("guide" OR "checklist")`<br> |
| `"how should I"` | Mental accounting & budget framing

 | `"how should I" AND ("budget for" OR "plan for" OR "finance") AND [CAT] AND [LIFECYCLE]`<br> |
| `"how can I tell if"` | Quality benchmarking & fake detection

 | `"how can I tell if" AND [CAT] AND ("is good quality" OR "is genuine" OR "will fit") AND [CONTEXT]`<br> |
| `"when is the best time to"` | Purchase trigger timing & cyclical sales anticipation

 | `"when is the best time to" AND ("buy" OR "book" OR "upgrade") AND [CAT] AND (deal OR sale OR discount)`<br> |
| `"when is"` | Seasonal renewal & regulatory triggers

 | `"when is" AND [CAT] AND ("renewal due" OR "cheapest" OR "released" OR "black friday")`<br> |

---

## Evaluation Questions

These patterns structure the reductive mindset where shoppers test shortlisted options through head-to-head comparisons, social consensus, third-party validation, and risk checks.

| Question Stem | Behavioural Principle Tested | Dynamic Search Pattern |
| --- | --- | --- |
| `"what's the best"` | Social proof & category-leading heuristic benchmark

 | `"what's the best" AND [SUB_CAT] AND ("for" OR "with") AND ([HEURISTIC] OR [CONTEXT] OR [AUDIENCE]) NOT [RETAILER_A]`<br> |
| `"what's the best rated"` | Pure social proof aggregation

 | `"what's the best rated" AND [CAT] AND ("reviews" OR "customer satisfaction" OR "5 star")`<br> |
| `"should I buy"` | Stated preference validation & risk aversion

 | `"should I buy" AND ([BRAND_A] OR [BRAND_B]) AND [SUB_CAT] AND ("worth it" OR "problems" OR "regrets")`<br> |
| `"should I switch to"` | Brand defection & challenger consideration

 | `"should I switch" AND ("from" AND [BRAND_A]) AND ("to" AND [BRAND_B]) AND [SUB_CAT]`<br> |
| `"could I use"` | Boundary condition testing & compatibility

 | `"could I use" AND ([BRAND_A] OR [SUB_CAT]) AND ("instead of" OR "for") AND [CONTEXT]`<br> |
| `"could I get"` | Spec upgrade evaluation

 | `"could I get" AND [HEURISTIC] AND ("with" OR "on") AND ([BRAND_A] OR [BRAND_B]) AND [BUDGET]`<br> |
| `"who is the top"` | Authority bias & institutional endorsement

 | `"who is the top" AND ("rated" OR "recommended" OR "approved") AND [CAT] AND [AUTHORITY]`<br> |
| `"who makes the best"` | Provenance & costly signalling validation

 | `"who makes the best" AND [SUB_CAT] AND ("durability" OR "reliability" OR "luxury" OR "heritage")`<br> |
| `"who has the best"` | Category heuristic dominance

 | `"who has the best" AND [HEURISTIC] AND ("in the UK" OR "for" AND [AUDIENCE]) AND [CAT]`<br> |
| `"why is [BRAND_A] so"` | Pratfall analysis & price-to-value verification

 | `("why is" AND [BRAND_A]) AND ("so expensive" OR "so cheap" OR "better than" AND [BRAND_B])`<br> |

---

## Purchase and Friction Questions

These queries operate at the point of transaction where shoppers evaluate retailer reliability, bypass operational hurdles, hunt for discounts, and confirm fulfillment speed.

| Question Stem | Friction or Commercial Variable | Dynamic Search Pattern |
| --- | --- | --- |
| `"where can I buy"` | Retailer availability & stock discovery

 | `"where can I buy" AND [BRAND_A] AND [SUB_CAT] AND ("in stock" OR "authorised stockist")`<br> |
| `"where can I get the cheapest"` | Direct price minimization

 | `"where can I get the cheapest" AND ([BRAND_A] OR [SUB_CAT]) AND ("price match" OR "deal" OR "sale")`<br> |
| `"where's the nearest"` | Omnichannel physical fulfillment

 | `"where's the nearest" AND ([RETAILER_A] OR [BRAND_A]) AND ("click and collect" OR "store" OR [GEO])`<br> |
| `"where's the best place to buy"` | Retailer reputation & service preference

 | `"where's the best place to buy" AND [BRAND_A] AND ("warranty" OR "customer service" OR "returns")`<br> |
| `"how can I get free"` | Power of free extraction

 | `"how can I get free" AND ("delivery" OR "returns" OR "gift" OR "trial") AND ("from" AND [RETAILER_A] OR [BRAND_A])`<br> |
| `"how can I get a discount on"` | Last-mile code hunting

 | `"how can I get a discount on" AND ([BRAND_A] OR [RETAILER_A]) AND ("code" OR "voucher" OR "first order")`<br> |
| `"how do I cancel"` | Contractual risk & exit friction

 | `"how do I cancel" AND ([BRAND_A] OR [RETAILER_A]) AND ("cooling off period" OR "fee" OR "direct debit")`<br> |
| `"how fast does"` | Delivery friction & power of now

 | `"how fast does" AND ([RETAILER_A] OR [BRAND_A]) AND ("deliver" OR "dispatch" OR "next day")`<br> |
| `"who can deliver"` | Fulfillment constraint resolution

 | `"who can deliver" AND [SUB_CAT] AND ("tomorrow" OR "weekend" OR "same day") AND [GEO]`<br> |
| `"who can price match"` | Retailer margin arbitration

 | `"who can price match" AND [BRAND_A] AND ([RETAILER_A] OR [RETAILER_B])`<br> |

---

## Operational Regex Implementation

Use this standard regular expression pattern to identify, route, and classify incoming natural-language strings across these categories in search analytics pipelines:

```regex
^(who\s(is|can|makes|has)|what(\sis|\sare|'s)\sthe|how\s(can\si|do\si|should\si|fast\sdoes)|where(\scan\si|'s\sthe)|could\si|should\si|when\sis)(\s.*)

```

The capture pattern enforces three triage steps:

1. If matches start with `what is the difference`, `what are the top`, or `how do I choose`, tag as **Exploration**.


2. If matches contain `should I switch`, `what's the best`, or `who makes the best`, tag as **Evaluation**.


3. If matches contain `where can I get the cheapest`, `how can I get free`, or `where's the nearest`, tag as **Friction Resolution**.