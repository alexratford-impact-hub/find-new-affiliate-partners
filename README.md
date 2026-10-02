# Find New Affiliate Partners

A deterministic AI agent skill that discovers high-converting affiliate partners using consumer search behavior and geometric Expected Value (EV) scoring.

This repository provides two things:
1. `starter-kit/`: A modular template to build a partner discovery skill for your own brand.
2. `example-skill/`: A fully configured reference implementation using a fictitious brand (`Apex Retail UK`) and mock competitor baselines.

You also get `workshop-slides.pdf`, a 40-page slide deck covering the underlying search theory, configuration steps, and code walkthroughs from the Affilifest Brand Huddle masterclass.

---

## Why Default AI Prompts Fail

Conversational prompts such as `"find top affiliate partners for my brand"` search brand-out. Large language models respond with the most visible public websites: coupon directories, cashback aggregators, mass media broadsheets, and publishers you already work with. These sources offer little incremental value and erode affiliate program margins.

This skill searches consumer-in by mapping the two stages of consumer purchase decisions:

1. **Loop 1: Kantar NeedScope (Emotional Entry):** Unbranded queries matching 6 emotional need states (*Educate, Help, Reassure, Impress, Thrill, Surprise*) before a buyer knows your brand.
2. **Loop 2: Google Messy Middle (Cognitive Exit):** Evaluation queries matching 6 behavioral shortcuts (*Social Proof, Authority Bias, Category Heuristics, Power of Free, Scarcity, Power of Now*) to surface independent testing labs, specialist reviewers, and comparison engines.

Results pass through a root-domain exclusion filter and a deterministic scoring formula. If any candidate lacks commercial fit (such as government portals, non-profits, or charities), a mathematical knockout drops their score to zero immediately.

---

## Repository Layout

```text
find-new-affiliate-partners/
├── starter-kit/                  # Modular template to build your own skill
│   ├── SKILL.md                  # Controller with Step 1 HALT gate
│   ├── run.md                    # Single-line launch prompt
│   └── references/
│       ├── brand.md              # Brand vertical, target AOV, competitors, disqualifications
│       ├── estimated_value.md    # Normalized scoring weights, anchors, and zero-knockout
│       ├── discovery.md          # 12 NeedScope and Messy Middle search queries
│       └── exclusions.md         # Active partner domains to omit
│
├── example-skill/                # Working reference for fictitious brand Apex Retail UK
│   ├── SKILL.md
│   ├── run.md
│   ├── readme.md
│   └── references/
│       ├── brand.md              # Apex Retail UK with mock competitor domains
│       ├── estimated_value.md
│       ├── discovery.md
│       └── exclusions.md         # Sample excluded domains
│
├── workshop-slides.pdf           # Complete 40-page masterclass presentation deck
├── LICENSE.md                    # Functional Source License (FSL-1.1-MIT)
└── README.md                     # Workshop documentation and setup guide
```

---

## Quickstart

Get a partner discovery run working in 5 steps:

1. **Copy the starter kit:** Copy the `starter-kit/` directory to your local project or desktop.
2. **Add brand rules:** Open `references/brand.md` and enter your brand name, target vertical, average order value, 2 direct competitors, and disqualification rules.
3. **Load files into your AI workspace:** Upload the folder into Claude Projects, Gemini Enterprise, or ChatGPT Plus.
4. **Trigger the run:** Paste the prompt from `run.md`:
   ```markdown
   Execute skill affiliate-partner-discovery from SKILL.md using the /references/ folder.
   Start with Step 1 (Read the Rules and Stop).
   ```
5. **Clear the HALT gate:** When the agent pauses and asks for your existing partners, paste your domain list (or type `continue` for testing). The model outputs an audited comparison table and a CRM-ready CSV block.

---

## How to Build Your Own Skill Using the Starter Kit

Follow these 6 steps to adapt the starter kit for your brand. Each step corresponds to a section of the masterclass curriculum.

### Step 0: Set Up the Workspace and Check File Extensions

Create a dedicated folder on your computer named `partner-discovery` with a `references` subfolder:

```text
partner-discovery/
├── SKILL.md
├── run.md
└── references/
    ├── brand.md
    ├── estimated_value.md
    ├── discovery.md
    └── exclusions.md
```

Operating systems often hide file extensions by default. If your operating system appends `.txt` to your files (saving them as `brand.md.txt`), AI agents cannot locate the file paths listed in `SKILL.md`.

* **Windows:** Open File Explorer, select **View** > **Show**, and enable **File name extensions**. Remove any trailing `.txt`.
* **macOS:** In Finder settings, select **Advanced** and check **Show all filename extensions**.
* **Terminal check:** Run `ls` (macOS/Linux) or `dir` (Windows PowerShell) inside the directory to confirm all files end in `.md`.

---

### Step 1: Define Commercial Rules and the Negative Shield (`references/brand.md`)

Open `references/brand.md`. Fill in the parameters for your program:

```markdown
# Target Parameters
- Brand: [Your Brand Name]
- Focus Category: [Your Category, e.g. Consumer Electronics & Personal Care]
- Commercial Model: CPA
- Target AOV: £[Target AOV, e.g. 45]
- Target Territory: [Territory, e.g. UK]

# Competitor Baselines
- [competitor1.com]
- [competitor2.com]

# Disqualifications
- Exclude voucher-code aggregator directories, coupon browser extensions, and cash-back scraping portals.
- Exclude non-target territory traffic sources.
- Exclude direct retail brand competitors.
```

Three rules apply here:

* **Lock focus to one category:** Pick a single sharp vertical rather than a broad description. Broad prompts cause models to default to generic mass media.
* **Provide 2 competitor domains:** Competitor domains give the model reference points to reverse-engineer where rival shoppers compare products.
* **Enforce negative disqualifications:** Explicitly exclude voucher code scrapers, coupon extensions, cashback sites, and direct retail competitors.

---

### Step 2: Configure the Deterministic EV Scoring Engine (`references/estimated_value.md`)

Open `references/estimated_value.md`. This file controls how candidate websites are ranked without subjective bias.

#### Metric Weights and Normalization

Set positive raw weights for Relevance ($w_R$), Scale ($w_S$), and Commercial Fit ($w_C$). The skill normalizes them automatically so they sum to 1.0:

```text
raw_wR: 0.4
raw_wS: 0.3
raw_wC: 0.3

total_W = raw_wR + raw_wS + raw_wC
wR = raw_wR / total_W   # 0.40
wS = raw_wS / total_W   # 0.30
wC = raw_wC / total_W   # 0.30
```

#### Scoring Rules (0 to 5)

Score each dimension against concrete anchors:

* **Relevance (R):** Measures how closely the content matches your category and whether it delivers NeedScope answers and behavioral confidence cues. A score of 5 represents an exact match with clear buying guidance. A score of 0 indicates an unrelated category.
* **Scale (S):** Measures search presence and organic visibility. A score of 5 indicates a top 3 organic ranking for unbranded competitive queries. A score of 0 flags an inaccessible domain, parked URL, or dead link.
* **Commercial Fit (C):** Confirms whether the site runs commercial links. A score of 5 indicates active affiliate monetization and product reviews. Sites run by governments, public bodies (.gov, .nhs), or charities score 0.

#### The Multiplicative Zero Rule

Candidates are ranked using a geometric mean formula:

$$\text{EV} = R^{w_R} \times S^{w_S} \times C^{w_C}$$

Additive formulas ($R + S + C$) allow high traffic to mask a lack of commercial fit. With multiplication, if any metric is zero, the entire score collapses:

$$\text{EV} = 5^{0.4} \times 5^{0.3} \times 0^{0.3} = 0.00$$

This knockout eliminates charities, educational sites, and dead links from your recruitment pipeline automatically.

---

### Step 3: Set Up Dual-Engine Search Queries (`references/discovery.md`)

Open `references/discovery.md`. This file instructs the agent to run 6 unbranded exploratory queries and 6 evaluative comparison queries for your product category.

```markdown
# Buyer Search Steps

## 1. Loop 1: Expansive Foraging (Kantar NeedScope)
Queries driven by emotional search states before a customer knows your brand:
- Educate Me: "what is the difference between [CAT_A] and [CAT_B]"
- Help Me: "how do I choose between [SUB_CAT] for [CONTEXT]"
- Reassure Me: "how can I tell if [CAT] is good quality"
- Impress Me: "who makes the best [SUB_CAT] for [AUDIENCE]"
- Thrill Me: "what are the top new [SUB_CAT] trends 2026"
- Surprise Me: "what is the best way to [UNCONVENTIONAL_USE] [CAT]"

Target sites: Specialist blogs, hobbyist websites, category explainer hubs, tutorial creators.

## 2. Loop 2: Reductive Evaluation (Google Messy Middle)
Queries testing cognitive biases to surface review desks and comparison engines:
- Social Proof: "what's the best rated [CAT] reviews reddit"
- Authority Bias: "who is the top recommended [CAT] [AUTHORITY]"
- Category Heuristics: "who has the best [HEURISTIC] [CAT]"
- Power of Free: "how can I get free trial delivery [BRAND]"
- Scarcity: "[SUB_CAT] restock alert release date"
- Power of Now: "who can deliver [SUB_CAT] tomorrow [GEO]"

Target sites: Independent testing labs, specialist comparison sites, enthusiast reviewers.
```

The agent runs 3 queries from Loop 1 and 3 from Loop 2, pulls organic results from search engines, and filters out social networks, broadsheets, and forum roots to focus on independent publishers.

---

### Step 4: Assemble the Controller and HALT Gate (`SKILL.md`)

`SKILL.md` binds the reference files together and directs the model step by step.

The most important mechanism in `SKILL.md` is the **Step 1 Mandatory HALT Gate**:

```markdown
## Step 1: Read the Rules and Stop (MANDATORY HALT GATE)
1. Read all files inside the /references/ directory.
2. Calculate normalized weights using references/estimated_value.md.
3. STOP IMMEDIATELY. Do not execute any searches yet.
4. Ask the user:
   "Rules loaded for [Brand Name]. Please paste your list of existing partner domains (one per line) or upload your partner CSV so I don't recommend partners you already have under contract."
5. Wait for the user to respond before proceeding to Step 2.
```

This gate forces the model to stop and verify existing partner exclusions before conducting any search. Without this pause, automated agents waste time pitching partners who are already under contract.

`SKILL.md` also formats output into two views:
1. An audited Markdown table displaying the exact formula breakdown for each candidate.
2. A clean CSV block ready for CRM import:
   ```csv
   domain,date_added,score,status
   partner-example.co.uk,02/10/2026,3.85,new_lead
   ```

---

### Step 5: Execute, Verify, and Export (`run.md`)

Open your AI environment, ensure all files are attached, and enter the launch command:

```markdown
Execute skill affiliate-partner-discovery from SKILL.md using the /references/ folder.
Start with Step 1 (Read the Rules and Stop).
```

Verify two checks during execution:
1. **The agent must pause at Step 1:** Confirm that the model asks for your exclusion list before running searches.
2. **Audit the math column:** Check that the `Math Breakdown` column contains explicit numerical values (e.g. `(4^0.4) * (4^0.3) * (5^0.3) = 4.28`) rather than arbitrary text descriptions.

---

## Exploring the Example Skill

If you want to test the workflow before editing your own brand parameters, look in `example-skill/`.

This folder contains a ready-to-run skill for **Apex Retail UK**, a fictitious retailer in the personal care and electronics vertical. It includes:
* `references/brand.md` configured with competitor benchmarks (`competitor-a.example.co.uk`, `competitor-b.example.co.uk`).
* `references/exclusions.md` populated with sample coupon aggregators and scrapers.
* `references/discovery.md` with category-tuned search queries.
* Complete instructions in `SKILL.md` and trigger prompt in `run.md`.

---

## Workshop Presentation Slides

This repository includes the complete masterclass slide deck:

* **Downloadable presentation deck:** [`workshop-slides.pdf`](workshop-slides.pdf) is a 40-page landscape PDF covering every stage, framework model (Kantar NeedScope, Google Messy Middle, Expected Value arithmetic), and code-streaming view from the workshop.

---

## License

This project is licensed under the Functional Source License, Version 1.1, MIT Future License (FSL-1.1-MIT). It permits internal use, research, and non-commercial education, while restricting competing commercial software or services. See [LICENSE.md](LICENSE.md) for full terms.
