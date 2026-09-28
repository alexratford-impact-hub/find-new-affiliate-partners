/**
 * Curriculum Data Layer (Single Source of Truth)
 * Steps 0 to 5: Metadata, Slide Stages, Code Chunks, and Facilitator Notes.
 */

import { brandPresets } from './presets.js';

export const stepKeys = ['setup', 'brand', 'math', 'discovery', 'skill', 'run'];

export const curriculum = {
  setup: {
    stepNum: 0,
    path: "partner-discovery/",
    name: "AI Blind Spot & Setup",
    filePill: "AI Blind Spot & Setup",
    time: "Kickoff: 00:00 - 00:08",
    headline: "Autonomous Affiliate Discovery Skills",
    subheadline: "Replace low-incrementality coupon scrapers with unbranded NeedScope query loops and geometric mean EV scoring.",
    recapBullets: [
      "Icebreaker: From default prompt failure to deterministic skill architecture.",
      "Operating Shift: Consumers search to resolve uncertainty in the Messy Middle before brand selection.",
      "Workspace: Create partner-discovery/ folder, references/ subfolder, and verify unhidden extensions."
    ],
    previewBullets: [
      "Icebreaker: From default prompt failure to deterministic skill architecture.",
      "Operating Shift: Consumers search to resolve uncertainty in the Messy Middle before brand selection.",
      "Workspace: Create partner-discovery/ folder, references/ subfolder, and verify unhidden extensions."
    ],
    takeaway: "Deterministic skill architecture eliminates AI hallucination, creating an auditable partner recruitment pipeline that protects gross CPA margin.",
    content: `# Step 0: Make Your Workshop Folders
partner-discovery/
├── SKILL.md
└── references/
    ├── brand.md
    ├── estimated_value.md
    └── discovery.md`
  },

  brand: {
    stepNum: 1,
    path: "references/brand.md",
    name: "Set Brand Rules (brand.md)",
    filePill: "references/brand.md",
    time: "Configuration: 00:08 - 00:17",
    headline: "Set Brand Rules (brand.md)",
    subheadline: "Grounding the autonomous AI agent in commercial reality, vertical focus, and negative disqualifications.",
    recapBullets: [
      "Local folder architecture created on desktop with references/ subfolder.",
      "All 5 configuration files initialized with clean .md extensions."
    ],
    previewBullets: [
      "Constraining the agent to a single commercial vertical (CPA model, target AOV).",
      "Providing direct competitor baselines for the agent to reverse-engineer discovery.",
      "Enforcing negative exclusions for voucher scrapers, coupon tools, and non-UK portals."
    ],
    takeaway: "Without explicit negative criteria, AI agents default to scraping coupon aggregators and low-value voucher portals.",
    content: brandPresets.boots
  },

  math: {
    stepNum: 2,
    path: "references/estimated_value.md",
    name: "Scoring Engine (estimated_value.md)",
    filePill: "references/estimated_value.md",
    time: "Scoring Engine: 00:17 - 00:26",
    headline: "Deterministic Expected Value Scoring (estimated_value.md)",
    subheadline: "Establishing normalised weights and geometric mean arithmetic to rank candidates with zero subjective bias.",
    recapBullets: [
      "Brand parameters, target AOV, and competitor baselines locked in.",
      "Negative disqualification rules defined for coupon and voucher aggregators."
    ],
    previewBullets: [
      "Setting weights for Relevance (0.4), Scale (0.3), and Commercial Fit (0.3).",
      "Configuring rigid 0 to 5 scoring criteria anchors.",
      "Applying multiplicative geometric mean formula: EV = (R^wR) * (S^wS) * (C^wC)."
    ],
    takeaway: "The multiplicative formula guarantees that if any critical metric is 0 (e.g. non-profit or wrong vertical), the score collapses to 0.00 instantly.",
    content: `# Metric Weights (Pick any positive numbers)
- raw_wR: 0.4  # Weight for Relevance
- raw_wS: 0.3  # Weight for Scale
- raw_wC: 0.3  # Weight for Commercial Fit

# Normalisation (Makes weights add up to 1.0)
total_W = raw_wR + raw_wS + raw_wC
- wR = raw_wR / total_W
- wS = raw_wS / total_W
- wC = raw_wC / total_W

# Scoring Rules (0 to 5)

## Relevance (R): How well they match what you sell
- 5: Direct match. Delivers NeedScope answers plus 2+ confidence cues.
- 4: Strong authority. Regularly reviews your type of product.
- 3: General lifestyle overlap. Mentions your topic alongside other things.
- 2: Weak overlap. Rare mentions without closing the confidence gap.
- 1: Almost no link. Single mention only.
- 0: Wrong category. (Automatic knockout).

## Scale (S): Website reach and visitors
- 5: Massive national authority. Millions of visits every month.
- 4: Large established site with strong Google search presence.
- 3: Mid-sized specialist or community blog.
- 2: Small niche blog with modest traffic.
- 1: Brand new website or tiny traffic footprint.
- 0: Dead link, parked domain, or inactive for 12+ months. (Automatic knockout).

## Commercial Fit (C): Can they run affiliate links?
- 5: Active affiliate publisher. Writes buyer guides and reviews with affiliate links.
- 4: Commerce-friendly. Runs sponsored posts and takes commercial partnerships.
- 3: Editorial-first. Open to PR samples and free product testing.
- 2: Difficult. Only accepts expensive fixed upfront tenancy fees.
- 1: Hostile to commerce or behind a hard paywall.
- 0: Non-profit, NHS, government, or charity site. (Automatic knockout).

# Final Score Formula
EV = (R^wR) * (S^wS) * (C^wC)`
  },

  discovery: {
    stepNum: 3,
    path: "references/discovery.md",
    name: "Dual-Engine Search (discovery.md)",
    filePill: "NeedScope × Messy Middle",
    time: "Dual Engine: 00:26 - 00:40",
    headline: "Dual-Engine Search Protocol (discovery.md)",
    subheadline: "Embedding Kantar's NeedScope and Google's Messy Middle directly into unbranded search queries.",
    recapBullets: [
      "Configured metric weights and auto-normalization in estimated_value.md.",
      "Established confidence-cue scoring anchors and multiplicative zero-knockouts."
    ],
    previewBullets: [
      "Loop 1 (NeedScope): 6 emotional states (Educate, Help, Reassure, Impress, Thrill, Surprise) -> unbranded exploration queries.",
      "Loop 2 (Messy Middle): 6 cognitive shortcuts (Social proof, Authority, Heuristics, Free, Scarcity, Now) -> reductive evaluation queries.",
      "Question Stems: Injecting conversational queries ('how do I choose', 'who makes the best') to surface Reddit, forums, and test labs."
    ],
    takeaway: "Commercial Advantage: Natural conversational question stems intercept high-intent buyers where purchase decisions are actually made — uncovering high-margin creators and specialist review hubs that coupon-based searches miss completely.",
    content: `# Buyer Search Steps

## 1. Loop 1: Expansive Foraging (Kantar NeedScope)
Queries driven by emotional search states before a customer knows your brand:
- Educate Me: "what is the difference between [CAT_A] and [CAT_B]"
- Help Me: "how do I choose between [SUB_CAT] for [CONTEXT]"
- Reassure Me: "how can I tell if [CAT] is good quality"
- Impress Me: "who makes the best [SUB_CAT] for [AUDIENCE]"
- Thrill Me: "what are the top new [SUB_CAT] trends 2026"
- Surprise Me: "what is the best way to [UNCONVENTIONAL_USE] [CAT]"
Target sites: Specialist blogs, hobbyist websites, category explainer hubs.

## 2. Loop 2: Reductive Evaluation (Google Messy Middle)
Queries testing cognitive biases to surface review desks and comparison engines:
- Authority Bias: "who is the top recommended [CAT] [AUTHORITY]"
- Social Proof: "what's the best rated [CAT] reviews reddit"
- Category Heuristics: "who has the best [HEURISTIC] [CAT]"
- Power of Free: "how do I get free delivery for [BRAND]"
- Scarcity Bias: "[SUB_CAT] restock alert UK release date"
- Power of Now: "who can deliver [SUB_CAT] tomorrow [GEO]"
Target sites: Independent testing labs, specialist comparison sites, enthusiast reviewers.

## 3. Search Rules for the AI
1. Pick 3 NeedScope queries and 3 Messy Middle queries for your category.
2. Find independent websites ranking near the top of Google for those searches.
3. Ignore massive social sites (Reddit, YouTube, TikTok) and news sites; focus on independent blogs and review sites.
4. Pass candidate website domains to SKILL.md for screening and scoring.`
  },

  skill: {
    stepNum: 4,
    path: "SKILL.md",
    name: "Agent Controller (SKILL.md)",
    filePill: "SKILL.md",
    time: "Engine Logic: 00:42 - 00:52",
    headline: "Assemble the Master Controller (SKILL.md)",
    subheadline: "Building the execution engine with a mandatory Step 1 pause gate, negative matching pipeline, and CSV ledger export.",
    recapBullets: [
      "Search protocols mapped across Loop 1 (exploratory) and Loop 2 (evaluative).",
      "Candidate extraction rules set to target independent authoritative publishers."
    ],
    previewBullets: [
      "Defining YAML frontmatter and binding references folder.",
      "Enforcing Step 1 Mandatory Pause Gate: demanding existing partner exclusions.",
      "Constructing the screening loop: discarding negative matches and computing EV scores.",
      "Formatting the top 5 partner markdown table and copy-paste CSV block."
    ],
    takeaway: "The Step 1 pause gate prevents the #1 failure mode in automated affiliate outreach: pitching partners you already have under contract.",
    content: `---
name: affiliate-partner-discovery
description: Discovers, screens, and ranks prospective affiliate recruitment targets using deterministic Expected Value scoring and root-domain exclusion. Trigger when asked to "find new affiliate partners", "discover publishers", "recruit affiliate creators", "prioritise partner outreach", or "run partner recruitment sprint".
---

# Reference Files
- references/brand.md
- references/estimated_value.md
- references/discovery.md

# Instructions for the AI

## Step 1: Read the Rules and Stop
1. Read all files inside the /references/ folder.
2. Calculate the metric weights using references/estimated_value.md.
3. STOP immediately. Do not search yet.
4. Ask the user:
   "Rules loaded for [Brand Name]. Please paste your list of existing partner domains (one per line) or upload your partner CSV so I don't recommend partners you already have."
5. Wait for the user to respond before doing anything else.

## Step 2: Search, Screen, and Score
1. Target: Find 5 qualifying partners.
2. Run the buyer searches from references/discovery.md for the category in references/brand.md.
3. Check every candidate website:
   - Check against the user's existing partner list. If they are already a partner, skip them.
   - Check against Disqualifications in references/brand.md. If disqualified, skip them.
4. Score the website from 0 to 5 on Relevance (R), Scale (S), and Commercial Fit (C) using references/estimated_value.md.
5. Work out the score: EV = (R^wR) * (S^wS) * (C^wC). If any score is 0, the final score is 0.00 (skip them).
6. Repeat until you have 5 clean partners with a score above 0.00.
7. Sort the top 5 partners from highest to lowest score.

## Step 3: Show the Results Table
Display the top 5 partners using this exact table:
| Partner Name | Website Domain | Category Fit | R | S | C | Math Breakdown | Final Score | Buyer Search Angle |

## Step 4: Export for Tracking
Print a copy-paste CSV block so the user can save these to their recruitment tracker:
\`\`\`csv
domain,date_added
[domain1.com],[DD/MM/YYYY]
[domain2.co.uk],[DD/MM/YYYY]
\`\`\`

# Traps to Avoid
- Always show the full math formula in the table so numbers can be checked.
- Public sector, government, and charity sites score C = 0. Drop them immediately.
- Evaluate main websites only (e.g. site.co.uk, not deals.site.co.uk).`
  },

  run: {
    stepNum: 5,
    path: "SKILL.md",
    name: "Deploy & Verify (Autonomous Ledger)",
    filePill: "Execution & Ledger",
    time: "Execution Phase: 00:52 - 01:00",
    headline: "Deploy & Verify Autonomous Discovery",
    subheadline: "Executing the runtime prompt in Claude, ChatGPT, or Gemini, feeding exclusions, and exporting qualified partners.",
    recapBullets: [
      "Master controller SKILL.md assembled with Step 1 pause gate.",
      "Negative exclusion filter and deterministic EV mathematical pipeline connected."
    ],
    previewBullets: [
      "Executing autonomous partner discovery prompt into your AI assistant.",
      "Verifying that the model pauses and demands existing partner domains.",
      "Reviewing the qualified candidate leaderboard and exporting recruitment CSV."
    ],
    takeaway: "Always inspect the mathematical breakdown column in the final table to ensure no subjective score inflation occurred.",
    content: `# How to Start
Execute skill affiliate-partner-discovery from SKILL.md using the /references/ folder.
Start with Step 1 (Read the Rules and Stop).`
  }
};

export const fileSections = {
  setup: [
    {
      id: "folders",
      title: "1. Create Root Directories",
      summary: "Create partner-discovery folder with references subfolder.",
      why: "Ensures the autonomous AI agent can resolve local file dependencies with deterministic paths.",
      code: `# Step 0.1: Make the Directory Tree
Create this folder structure on your Desktop:

Desktop/
partner-discovery/
└── references/`
    },
    {
      id: "check",
      title: "2. Verify & Unhide Extensions (.md)",
      summary: "Unhide file extensions in Windows / macOS or run terminal check to ensure no hidden .txt files.",
      why: "Operating systems hide known extensions by default, quietly saving files as 'brand.md.txt'. AI agents and Claude Projects fail silently when reading mismatched filenames.",
      code: `# Step 0.2: How to Verify & Fix Hidden File Extensions

# --- WINDOWS (File Explorer) ---
# 1. Open 'partner-discovery' folder in File Explorer.
# 2. Click 'View' at top menu -> Select 'Show' -> Tick 'File name extensions'.
# 3. If file shows 'brand.md.txt', select it, press F2, and delete '.txt'.

# --- macOS (Finder) ---
# 1. In top Finder menu: Finder -> Settings (or Preferences) -> Advanced.
# 2. Check: "Show all filename extensions".
# 3. Quick fix: Select file -> press Cmd + I -> expand 'Name & Extension' -> uncheck 'Hide extension'.

# --- 5-SECOND TERMINAL CHECK (PowerShell / macOS Terminal / Bash) ---
cd ~/Desktop/partner-discovery/references
dir    # Windows: verify 'brand.md', NOT 'brand.md.txt'
ls     # macOS/Linux: verify 'brand.md', NOT 'brand.md.txt'`
    },
    {
      id: "files",
      title: "3. Initialize the 4 Architecture Files",
      summary: "Create blank text files with .md extensions inside the folders.",
      why: "The controller and referenced modules must exist before running prompts.",
      code: `# Step 0.3: Create the 4 Architecture Files
partner-discovery/
├── SKILL.md
└── references/
    ├── brand.md
    ├── estimated_value.md
    └── discovery.md`
    }
  ],

  brand: [
    {
      id: "params",
      title: "1. Target Parameters",
      summary: "Set commercial model, single product vertical, AOV, and territory.",
      why: "Constrains the agent to ONE commercial vertical. Broad categories cause the model to default to generic mass media platforms.",
      code: `# Target Parameters
- Brand: Boots UK
- Focus Category: Consumer Electronics & Personal Care
- Commercial Model: CPA
- Target AOV: £45
- Target Territory: UK (Strict ASA compliance; no unlicensed medicinal claims)`
    },
    {
      id: "competitors",
      title: "2. Competitor Baselines",
      summary: "Provide 2 direct commercial competitors.",
      why: "Gives the agent benchmark domains so it can reverse-engineer where rival customers look and compare.",
      code: `# Competitor Baselines
- currys.co.uk
- lookfantastic.com`
    },
    {
      id: "disqualifications",
      title: "3. Negative Disqualifications",
      summary: "Explicitly ban coupon aggregators, cashback scrapers, and direct rivals.",
      why: "Affiliate programs suffer from margin erosion if models recruit low-value voucher arbitrage sites instead of content creators.",
      code: `# Disqualifications
- Exclude voucher-code aggregator directories, coupon browser extensions, and cash-back scraping portals.
- Exclude non-UK traffic sources.
- Exclude direct retail brand competitors.`
    }
  ],

  math: [
    {
      id: "weights",
      title: "1. Weights & Normalisation",
      summary: "Define raw weights and auto-normalise them to sum to 1.0.",
      why: "Allows tuning the importance of Relevance vs Scale vs Commercial viability without broken fractions.",
      code: `# Metric Weights (Pick any positive numbers)
- raw_wR: 0.4  # Weight for Relevance
- raw_wS: 0.3  # Weight for Scale
- raw_wC: 0.3  # Weight for Commercial Fit

# Normalisation (Makes weights add up to 1.0)
total_W = raw_wR + raw_wS + raw_wC
- wR = raw_wR / total_W
- wS = raw_wS / total_W
- wC = raw_wC / total_W`
    },
    {
      id: "relevance",
      title: "2. Relevance Anchors (R: 0 to 5)",
      summary: "Define 0 to 5 anchors for category and product alignment.",
      why: "Eliminates subjective guesswork. An off-vertical domain scores R = 0, instantly knocking it out.",
      code: `## Relevance (R): How well they match what you sell
- 5: Direct match. Most of their content is about your exact products.
- 4: Strong authority. They regularly review your type of product.
- 3: General lifestyle overlap. They mention your topic alongside other things.
- 2: Weak overlap. Rare mentions or mixed audience.
- 1: Almost no link. Single mention only.
- 0: Wrong category. (Automatic knockout).`
    },
    {
      id: "scale",
      title: "3. Scale Anchors (S: 0 to 5)",
      summary: "Define 0 to 5 anchors for organic authority and audience reach.",
      why: "Prevents recruiting dormant, parked, or dead domains with zero search footprint.",
      code: `## Scale (S): Website reach and visitors
- 5: Massive national authority. Millions of visits every month.
- 4: Large established site with strong Google search presence.
- 3: Mid-sized specialist or community blog.
- 2: Small niche blog with modest traffic.
- 1: Brand new website or tiny traffic footprint.
- 0: Dead link, parked domain, or inactive for 12+ months. (Automatic knockout).`
    },
    {
      id: "commercial",
      title: "4. Commercial Fit Anchors (C: 0 to 5)",
      summary: "Define 0 to 5 anchors for commercial intent and monetization.",
      why: "Protects budget from non-profit / NHS sites or hard-paywall domains that cannot run affiliate links.",
      code: `## Commercial Fit (C): Can they run affiliate links?
- 5: Active affiliate publisher. Already writes buyer guides and reviews with affiliate links.
- 4: Commerce-friendly. Runs sponsored posts and takes commercial partnerships.
- 3: Editorial-first. Open to PR samples and free product testing.
- 2: Difficult. Only accepts expensive fixed upfront tenancy fees.
- 1: Hostile to commerce or behind a hard paywall.
- 0: Non-profit, NHS, government, or charity site. (Automatic knockout).`
    },
    {
      id: "formula",
      title: "5. Deterministic Geometric Mean",
      summary: "Compute EV = (R^wR) * (S^wS) * (C^wC).",
      why: "Multiplicative geometric mean ensures that if any metric is zero, the entire score collapses to 0.00.",
      code: `# Final Score Formula
EV = (R^wR) * (S^wS) * (C^wC)`
    }
  ],

  discovery: [
    {
      id: "loop1",
      title: "1. Loop 1: Expansive Foraging (Kantar NeedScope)",
      summary: "Map unbranded queries driven by the 6 emotional search states.",
      why: "Embeds NeedScope directly into queries before shoppers know your brand exists.",
      code: `# Buyer Search Steps

## 1. Loop 1: Expansive Foraging (Kantar NeedScope)
Queries driven by emotional search states before a customer knows your brand:
- Educate Me: "what is the difference between [CAT_A] and [CAT_B]"
- Help Me: "how do I choose between [SUB_CAT] for [CONTEXT]"
- Reassure Me: "how can I tell if [CAT] is good quality"
- Impress Me: "who makes the best [SUB_CAT] for [AUDIENCE]"
- Thrill Me: "what are the top new [SUB_CAT] trends 2026"
- Surprise Me: "what is the best way to [UNCONVENTIONAL_USE] [CAT]"
Target sites: Specialist blogs, hobbyist websites, category explainer hubs.`
    },
    {
      id: "loop2",
      title: "2. Loop 2: Reductive Evaluation (Google Messy Middle)",
      summary: "Map high-intent queries that test the 6 cognitive shortcuts.",
      why: "Captures authoritative comparison desks, spec teardowns, and independent testing labs.",
      code: `## 2. Loop 2: Reductive Evaluation (Google Messy Middle)
Queries testing cognitive biases to surface review desks and comparison engines:
- Authority Bias: "who is the top recommended [CAT] [AUTHORITY]"
- Social Proof: "what's the best rated [CAT] reviews reddit"
- Category Heuristics: "who has the best [HEURISTIC] [CAT]"
- Power of Free: "how do I get free delivery for [BRAND]"
- Scarcity Bias: "[SUB_CAT] restock alert UK release date"
- Power of Now: "who can deliver [SUB_CAT] tomorrow [GEO]"
Target sites: Independent testing labs, specialist comparison sites, enthusiast reviewers.`
    },
    {
      id: "rules",
      title: "3. Agent Search Guardrails & Publisher Extraction",
      summary: "Instructions commanding the AI to ignore social platforms and extract creators.",
      why: "Prevents search dilution into Reddit, YouTube, TikTok, or paywalled national news portals.",
      code: `## 3. Search Rules for the AI
1. Pick 3 NeedScope queries and 3 Messy Middle queries for your category.
2. Find independent websites ranking near the top of Google for those searches.
3. Ignore massive social sites (Reddit, YouTube, TikTok) and news sites; focus on independent blogs and review sites.
4. Pass candidate website domains to SKILL.md for screening and scoring.`
    }
  ],

  skill: [
    {
      id: "meta",
      title: "1. Frontmatter & References",
      summary: "Define agent metadata and referenced files.",
      why: "Allows standard AI agent runners to index the skill and bind reference files.",
      code: `---
name: affiliate-partner-discovery
description: Discovers, screens, and ranks prospective affiliate recruitment targets using deterministic Expected Value scoring and root-domain exclusion. Trigger when asked to "find new affiliate partners", "discover publishers", "recruit affiliate creators", "prioritise partner outreach", or "run partner recruitment sprint".
---

# Reference Files
- references/brand.md
- references/estimated_value.md
- references/discovery.md`
    },
    {
      id: "gate",
      title: "2. Step 1: Mandatory Pause Gate",
      summary: "Force the agent to stop and demand existing partner CSV ledger.",
      why: "The #1 trap in autonomous recruitment is pitching partners you already have under contract. The agent must halt before searching.",
      code: `# Instructions for the AI

## Step 1: Read the Rules and Stop
1. Read all files inside the /references/ folder.
2. Calculate the metric weights using references/estimated_value.md.
3. STOP immediately. Do not search yet.
4. Ask the user:
   "Rules loaded for [Brand Name]. Please paste your list of existing partner domains (one per line) or upload your partner CSV so I don't recommend partners you already have."
5. Wait for the user to respond before doing anything else.`
    },
    {
      id: "pipeline",
      title: "3. Step 2: Search, Screen & Score",
      summary: "Screening pipeline with hard negative matching and EV calculation.",
      why: "Enforces deterministic candidate qualification until 5 clean partners score above 0.00.",
      code: `## Step 2: Search, Screen, and Score
1. Target: Find 5 qualifying partners.
2. Run the buyer searches from references/discovery.md for the category in references/brand.md.
3. Check every candidate website:
   - Check against the user's existing partner list. If they are already a partner, skip them.
   - Check against Disqualifications in references/brand.md. If disqualified, skip them.
4. Score the website from 0 to 5 on Relevance (R), Scale (S), and Commercial Fit (C) using references/estimated_value.md.
5. Work out the score: EV = (R^wR) * (S^wS) * (C^wC). If any score is 0, the final score is 0.00 (skip them).
6. Repeat until you have 5 clean partners with a score above 0.00.
7. Sort the top 5 partners from highest to lowest score.`
    },
    {
      id: "table",
      title: "4. Step 3 & 4: Table & CSV Export",
      summary: "Render structured Markdown table and recruitment ledger CSV block.",
      why: "Ensures transparent math verification and one-click persistence to the user's CRM/recruitment tracker.",
      code: `## Step 3: Show the Results Table
Display the top 5 partners using this exact table:
| Partner Name | Website Domain | Category Fit | R | S | C | Math Breakdown | Final Score | Buyer Search Angle |

## Step 4: Export for Tracking
Print a copy-paste CSV block so the user can save these to their recruitment tracker:
\`\`\`csv
domain,date_added
[domain1.com],[DD/MM/YYYY]
[domain2.co.uk],[DD/MM/YYYY]
\`\`\`

# Traps to Avoid
- Always show the full math formula in the table so numbers can be checked.
- Public sector, government, and charity sites score C = 0. Drop them immediately.
- Evaluate main websites only (e.g. site.co.uk, not deals.site.co.uk).`
    }
  ],

  run: [
    {
      id: "prompt",
      title: "1. Runtime Execution Trigger",
      summary: "Deploy the opening trigger prompt in Claude, ChatGPT, or Gemini.",
      why: "Directs the AI to execute the skill starting specifically at Step 1.",
      code: `# How to Start
Execute skill affiliate-partner-discovery from SKILL.md using the /references/ folder.
Start with Step 1 (Read the Rules and Stop).`
    },
    {
      id: "gate_check",
      title: "2. Verifying the Step 1 Gate",
      summary: "Verify that your model halts and asks for existing exclusions.",
      why: "If the model does not pause, it failed instruction following; intervene and re-enforce Step 1.",
      code: `Expected AI Response:
"Rules loaded for [Brand Name]. Please paste your list of existing partner domains (one per line) or upload your partner CSV so I don't recommend partners you already have."`
    }
  ]
};

export const slideStageTitles = {
  agenda: [
    "Run of Play • Session Timetable & Milestones"
  ],
  setup: [
    "The Paradigm • Brand-Out Search Ceiling (The Trap)",
    "The Paradigm • Consumer-In Interception (The Antidote)"
  ],
  brand: [
    "Commercial Guardrails • Operational Margins",
    "Negative Shield • Hard Disqualification Gates"
  ],
  math: [
    "Interactive Calibration • Normalisation Weights (wR, wS, wC)",
    "The Zero Rule • Multiplicative Knockout vs Additive Flaw"
  ],
  discovery: [
    "Loop 1: Expansive Foraging • Kantar NeedScope Matrix",
    "Loop 2: Reductive Evaluation • 6 Decision Heuristics"
  ],
  skill: [
    "4-Phase Deterministic Pipeline & Architecture",
    "Step 1 HALT Gate & Auditable Output Schema"
  ],
  run: [
    "Single-Prompt Autonomous Orchestration & Audited Ledger",
    "Commercial Payoff • Status Quo vs Autonomous Scorecard",
    "Masterclass Completion Ticklist & Enterprise Expansions"
  ]
};

export const stepMilestones = {
  setup: { targetElapsed: 780, sprintDuration: 210, label: "05:00 - 13:00" },
  brand: { targetElapsed: 1320, sprintDuration: 240, label: "13:00 - 22:00" },
  math: { targetElapsed: 1860, sprintDuration: 240, label: "22:00 - 31:00" },
  discovery: { targetElapsed: 2700, sprintDuration: 300, label: "31:00 - 45:00" },
  skill: { targetElapsed: 3180, sprintDuration: 240, label: "45:00 - 53:00" },
  run: { targetElapsed: 3600, sprintDuration: 180, label: "53:00 - 60:00" }
};

export const speakerData = {
  setup: {
    title: "0. Kickoff & Setup (05:00 - 13:00)",
    window: "05:00 - 13:00",
    milestone: "Step 0: AI Blind Spot & Setup",
    goal: "Overcome status quo bias; grounded prompt simulation & scaffolding",
    sprintTarget: "3.5 mins",
    artifact: "Desktop directories & unhidden extensions",
    hcdc: {
      hook: {
        time: "05:00 - 07:00",
        duration: "90s",
        tag: "The Operational Hook (Prompt Reality)",
        script: "Let's ground in the reality of what happens when you actually ask an AI tool to recruit partners. Look at the display. You type the intuitive prompt: 'find me a list of prospect affiliate partners in our vertical'. What happens? First, it recommends massive national review portals and syndicated media conglomerates that already dominate and demand $50,000 upfront agency retainers. You don't need an AI to tell you national media syndicates exist. Second, it gives you vague homework like 'parenting blogs' with zero URLs, zero domain data, and zero contact points. Third, it defaults to brand-out coupon scrapers that cannibalise organic checkout traffic. Conversational prompts fail because they lack constraints. Today we build a deterministic 5-file skill architecture that intercepts real consumer buying decisions.",
        speedScript: "1. The Prompt Reality: Asking AI for partners yields $50k media giants and vague category fluff.\n2. Acute Failure Modes: Pre-existing retainer monopolies, zero domain URLs, and checkout coupon scrapers.\n3. The Paradigm Shift: Replace conversational prompts with a deterministic 5-file architecture.\n4. Press [C] when moving into Code Mode to scaffold the workspace.",
        action: "Project Slide Mode using [S]. Walk through the 3 prompt failure modes. Highlight the commercial breakdown, then press [C] to transition to Code Mode and stream the workspace scaffold."
      },
      chunk: {
        time: "07:00 - 09:30",
        duration: "2.5m",
        tag: "Code Demonstration (Capability)",
        script: "Watch my screen. Switch to Code Mode with [C]. We do not dump prompts into a single chat window. We ground the model in four local Markdown files. Look at the directory tree: partner-discovery on Desktop, a references subfolder, then brand.md, estimated_value.md, and discovery.md. In the root, SKILL.md. This local file structure gives the model deterministic boundaries.",
        speedScript: "1. Switch to Code Mode with [C].\n2. Never dump prompts into a bare chat window; ground Claude in four local Markdown files.\n3. Directory tree: partner-discovery/ on Desktop, references/ (brand.md, estimated_value.md, discovery.md), and root SKILL.md.\n4. Local file architecture enforces deterministic execution boundaries.",
        action: "Press [C] to switch the projector to Code Mode. Stream Step 0.1 and 0.2 at 35 characters per second."
      },
      do: {
        time: "09:30 - 12:00",
        duration: "2.5m",
        sprintSeconds: 210,
        tag: "Local Build Sprint (Opportunity)",
        script: "Three and a half minutes on the clock. Open your laptop. Create partner-discovery on your Desktop. Add the references subfolder. Create the four blank Markdown files. Start now.",
        speedScript: "1. 3.5 minutes on the clock. Open laptops.\n2. Create partner-discovery on Desktop with references/ subfolder.\n3. Initialise 4 empty Markdown files: brand.md, estimated_value.md, discovery.md, and root SKILL.md.\n4. Build now.",
        action: "Trigger the 3.5-minute sprint timer in the console. Walk the room to check that everyone creates the four files."
      },
      error: {
        time: "12:00 - 13:00",
        duration: "60s",
        isCommit: false,
        title: "The Error Embrace",
        tag: "Intentional Error-Recovery Drill",
        script: "Stop typing and look at my display. Windows and macOS hide file extensions by default. If your laptop hid them, you just created brand.md.txt. An AI model reading directory paths fails silently on mismatched extensions. Open File Explorer, select View, Show, and tick File name extensions. On macOS, open Finder Settings, Advanced, and tick Show all filename extensions. Open your terminal, change into references, and type dir or ls. Delete every hidden .txt suffix immediately.",
        speedScript: "1. Extension Trap: Hidden extensions secretly create brand.md.txt, breaking LLM file reads.\n2. Windows: View -> Show -> File name extensions.\n3. macOS: Finder Settings -> Advanced -> Show all filename extensions.\n4. Terminal: run dir or ls inside references/ and delete any hidden .txt suffixes.",
        action: "Project the extension verification commands on screen. Verify that attendees remove .txt before advancing to Step 1."
      }
    },
    fullFileCode: `Desktop/partner-discovery/\n├── SKILL.md\n└── references/\n    ├── brand.md\n    ├── estimated_value.md\n    └── discovery.md`,
    parts: [
      {
        title: "Part 1: Create Root Directories",
        say: "Create a folder named partner-discovery on your Desktop. Inside it, create a subfolder named references.",
        speedSay: "1. Create partner-discovery on Desktop.\n2. Add references/ subfolder.",
        code: `Desktop/\n└── partner-discovery/\n    └── references/`
      },
      {
        title: "Part 2: Initialise Core Files",
        say: "Create the four Markdown files: SKILL.md in the root; brand.md, estimated_value.md, and discovery.md inside references/.",
        speedSay: "1. Root: SKILL.md.\n2. references/: brand.md, estimated_value.md, discovery.md.",
        code: `Desktop/partner-discovery/\n├── SKILL.md\n└── references/\n    ├── brand.md\n    ├── estimated_value.md\n    └── discovery.md`
      }
    ]
  },

  brand: {
    title: "1. Commercial Guardrails (13:00 - 22:00)",
    window: "13:00 - 22:00",
    milestone: "Step 1: Commercial Guardrails & Shield",
    goal: "Loss aversion; eliminate low-intent voucher leakage",
    sprintTarget: "4 mins",
    artifact: "references/brand.md",
    hcdc: {
      hook: {
        time: "13:00 - 14:30",
        duration: "90s",
        tag: "The Operational Hook (Motivation)",
        script: "Here is how affiliate budgets bleed margin: coupon toolbars intercept shoppers who are already in the checkout funnel, claiming commission on sales they did not create. When you run an unconstrained web search prompt, the model follows the path of least resistance and fills your list with those exact coupon scrapers. We stop that by building a Negative Shield in brand.md.",
        speedScript: "1. Budget leakage: Coupon extensions hijack shoppers already at checkout, siphoning commission on non-incremental sales.\n2. AI failure: Unconstrained search prompts default to scraping coupon portals.\n3. Solution: Build an explicit Negative Shield in brand.md to disqualify voucher aggregators.",
        action: "Project Step 1 in Slide Mode using [S]. Advance to Stage 1 to focus the Negative Shield card on the digital display. Emphasise that voucher scrapers and non-UK traffic are disqualified immediately."
      },
      chunk: {
        time: "14:30 - 17:30",
        duration: "3m",
        tag: "Code Demonstration (Capability)",
        script: "Look at the active brand preset on my display. Three blocks protect our commercial model. First, we lock the focus category to one vertical. If you write multiple categories, the model defaults to broad media portals. Second, we list direct competitor domains so the agent maps where rival shoppers compare products. Third, the Disqualifications block explicitly bans voucher aggregators, coupon extensions, cashback sites, and non-UK traffic.",
        speedScript: "1. Three protective blocks in brand.md:\n2. Target Parameters: Lock to one single focus category (avoids media portal dilution).\n3. Competitor Baselines: Direct rivals to reverse-engineer discovery.\n4. Disqualifications: Hard negative shield banning voucher aggregators, extensions, cashback, non-UK traffic.",
        action: "Switch to Code Mode using [C]. Stream the three code chunks of references/brand.md on the projector."
      },
      do: {
        time: "17:30 - 21:00",
        duration: "3.5m",
        sprintSeconds: 240,
        tag: "Local Build Sprint (Opportunity)",
        script: "Four minutes on the clock. Open references/brand.md. Populate your target parameters, competitor benchmarks, and the disqualifications block for your active brand. Go.",
        speedScript: "1. 4 minutes on the clock. Open references/brand.md.\n2. Populate target parameters, competitor baselines, and the negative disqualifications block.\n3. Lock focus to a single vertical.\n4. Build now.",
        action: "Start the 4-minute sprint timer. Walk the room to inspect disqualification blocks."
      },
      error: {
        time: "21:00 - 22:00",
        duration: "60s",
        isCommit: false,
        title: "The Error Embrace",
        tag: "Intentional Error-Recovery Drill",
        script: "Check your category line. If you listed more than one vertical, delete the extras right now. When an agent searches across multiple categories simultaneously, its relevance scoring breaks down. Keep your scope locked to one vertical per run.",
        speedScript: "1. Multi-Category Dilution Trap: Listing multiple verticals ruins relevance scoring.\n2. Command room: Delete extra categories immediately.\n3. Rule: Exactly one sharp vertical per discovery cycle.",
        action: "Check attendees' screens for category dilution. Have two attendees state their single vertical."
      }
    },
    fullFileCode: `# Target Parameters\n- Brand: Boots UK\n- Focus Category: Consumer Electronics & Personal Care\n- Commercial Model: CPA\n- Target AOV: £45\n- Target Territory: UK (Strict ASA compliance)\n\n# Competitor Baselines\n- currys.co.uk\n- lookfantastic.com\n\n# Disqualifications\n- Exclude voucher-code aggregator directories, coupon browser extensions, and cash-back scraping portals.\n- Exclude non-UK traffic sources.\n- Exclude direct retail brand competitors.`,
    parts: [
      {
        title: "Part 1: Target Parameters",
        say: "Write your brand parameters: Brand, Focus Category, Commercial Model, Target AOV, and Target Territory. Keep the category narrow.",
        speedSay: "1. Define Brand, Focus Category, Commercial Model (CPA), Target AOV, and Territory.\n2. Lock scope to one category.",
        code: `# Target Parameters\n- Brand: Boots UK\n- Focus Category: Consumer Electronics & Personal Care\n- Commercial Model: CPA\n- Target AOV: £45\n- Target Territory: UK (Strict ASA compliance)`
      },
      {
        title: "Part 2: Competitor Baselines",
        say: "Add two direct competitor domains. For our brand baseline, use direct rivals in the category. Do not list generalist marketplaces.",
        speedSay: "1. Add two direct competitor domains.\n2. Avoid generalist marketplaces.",
        code: `# Competitor Baselines\n- currys.co.uk\n- lookfantastic.com`
      },
      {
        title: "Part 3: Negative Shield (Disqualifications)",
        say: "The Disqualifications block protects your budget. Explicitly command the agent to exclude voucher aggregators, coupon extensions, cashback portals, and retail rivals.",
        speedSay: "1. Explicitly ban voucher scrapers, coupon toolbars, and cashback portals.\n2. Prevents zero-incrementality candidates.",
        code: `# Disqualifications\n- Exclude voucher-code aggregator directories, coupon browser extensions, and cash-back scraping portals.\n- Exclude non-UK traffic sources.\n- Exclude direct retail brand competitors.`
      }
    ]
  },

  math: {
    title: "2. Deterministic Scoring (22:00 - 31:00)",
    window: "22:00 - 31:00",
    milestone: "Step 2: Deterministic EV Scoring",
    goal: "Psychological capability; replace subjective ratings with geometric mean",
    sprintTarget: "4 mins",
    artifact: "references/estimated_value.md",
    hcdc: {
      hook: {
        time: "22:00 - 23:30",
        duration: "90s",
        tag: "The Operational Hook (Motivation)",
        script: "Most partnership teams use gut feel or simple addition to score affiliates. Simple addition fails. Think of this scoring engine as 'The Electronic Bouncer' enforcing 'The Zero Rule'. If a discount scraper has zero relevance, huge traffic, and affiliate links, an additive score gives it 0 plus 5 plus 5, approving it as a top partner. But under The Zero Rule, zero relevance collapses the entire score to exactly 0.00. Traffic without fit equals zero commission. We don't care how many millions of visitors a site has — if they aren't answering the customer's problem in your vertical, the electronic bouncer rejects them at the door.",
        speedScript: "1. The Electronic Bouncer: Replaces gut feel with automated commercial gating.\n2. The Zero Rule: Traffic without fit equals zero commission. R(0) × S(5) × C(5) = 0.00.\n3. Additive math approves coupon scrapers; The Zero Rule knocks them out instantly.",
        action: "Project Step 2 in Slide Mode using [S]. Demonstrate live slider normalisation on screen and explain how The Zero Rule collapses coupon scrapers to 0.00."
      },
      chunk: {
        time: "23:30 - 26:30",
        duration: "3m",
        tag: "Code Demonstration (Capability)",
        script: "Open references/estimated_value.md on screen. We assign raw weights: 0.4 for Relevance, 0.3 for Scale, and 0.3 for Commercial Fit. The file auto-normalises them to sum to 1.0. Then look at the scoring anchors from 0 to 5. Relevance requires solving customer need states. Scale checks real traffic. Commercial Fit checks for active monetisation. If a site is run by the NHS, a university, or a charity, Commercial Fit is 0. That rejects the domain with an auditable score of 0.00.",
        speedScript: "1. Raw weights: Relevance (0.40), Scale (0.30), Commercial Fit (0.30) -> auto-normalised sum = 1.00.\n2. 0 to 5 scoring anchors: R answers NeedScope; S measures organic search authority; C measures active affiliate links.\n3. Automatic Knockout: NHS / Gov / Charities receive C = 0, collapsing score to 0.00.",
        action: "Stream the weights, scoring anchors, and formula in Code Mode."
      },
      do: {
        time: "26:30 - 30:00",
        duration: "3.5m",
        sprintSeconds: 240,
        tag: "Local Build Sprint (Opportunity)",
        script: "Four minutes on the clock. Open references/estimated_value.md. Add the weights, the normalisation equations, the 0-to-5 rubric, and the geometric mean formula. Build it now.",
        speedScript: "1. 4 minutes on the clock. Open references/estimated_value.md.\n2. Configure raw weights, normalisation formula, 0-to-5 anchors, and EV geometric formula.\n3. Build now.",
        action: "Start the 4-minute sprint timer. Verify that attendees do not hardcode broken decimal fractions.",
      },
      error: {
        time: "30:00 - 31:00",
        duration: "60s",
        isCommit: false,
        title: "The Error Embrace",
        tag: "Intentional Error-Recovery Drill",
        script: "Look at your Commercial Fit rubric. What happens if the NHS or a government portal writes the best guide on eczema? Their Scale is 5. Their Relevance is 5. But they cannot accept commercial affiliate links. Their Commercial score is 0. If you give them a 1, you waste hours emailing public sector press offices. Ensure your rule scores public sector domains at C equals 0.",
        speedScript: "1. The Non-Profit False Positive: NHS has Scale 5 and Relevance 5, but cannot run affiliate links.\n2. Set Commercial score to 0 -> instant 0.00 knockout.\n3. Eliminates wasted outreach to public sector press desks.",
        action: "Confirm with the room that public sector and non-profit domains yield an immediate knockout."
      }
    },
    fullFileCode: `# Metric Weights\n- raw_wR: 0.4\n- raw_wS: 0.3\n- raw_wC: 0.3\n\n# Normalisation\ntotal_W = raw_wR + raw_wS + raw_wC\n- wR = raw_wR / total_W\n- wS = raw_wS / total_W\n- wC = raw_wC / total_W\n\n# Scoring Rules (0 to 5)\nRelevance (R): 5 = Direct match answering NeedScope states; 3 = Adjacent category; 0 = Wrong vertical\nScale (S): 5 = Major national authority; 3 = Niche community forum; 0 = Dead domain\nCommercial Fit (C): 5 = Active affiliate links and buyer guides; 0 = NHS, government, or charity site\n\n# Final Score Formula\nEV = (R^wR) * (S^wS) * (C^wC)`,
    parts: [
      {
        title: "Part 1: Weights & Auto-Normalisation",
        say: "We set raw weights for Relevance (0.4), Scale (0.3), and Commercial Fit (0.3), then normalise them to sum to 1.0.",
        speedSay: "1. Define raw weights: 0.4, 0.3, 0.3.\n2. Normalise: sum equals 1.0.",
        code: `# Metric Weights\n- raw_wR: 0.4\n- raw_wS: 0.3\n- raw_wC: 0.3\n\n# Normalisation\ntotal_W = raw_wR + raw_wS + raw_wC\n- wR = raw_wR / total_W\n- wS = raw_wS / total_W\n- wC = raw_wC / total_W`
      },
      {
        title: "Part 2: 0 to 5 Scoring Anchors",
        say: "Define strict 0 to 5 anchors. Relevance requires problem-solving. Scale requires traffic authority. Commercial Fit requires active affiliate monetisation. Non-profits receive 0.",
        speedSay: "1. R (0-5): Solves need states.\n2. S (0-5): Real authority.\n3. C (0-5): Active affiliate links; NHS/gov = 0.",
        code: `# Scoring Rules (0 to 5)\nRelevance (R): 5 = Direct match answering NeedScope; 0 = Wrong vertical\nScale (S): 5 = National search authority; 0 = Inactive\nCommercial Fit (C): 5 = Active affiliate links; 0 = NHS / charity site`
      },
      {
        title: "Part 3: Multiplicative EV Formula",
        say: "Calculate score: EV = (R^wR) * (S^wS) * (C^wC). Any zero knocks the total score to 0.00 instantly.",
        speedSay: "1. Formula: EV = (R^wR) * (S^wS) * (C^wC).\n2. Multiplicative zero-knockout eliminates false positives.",
        code: `# Final Score Formula\nEV = (R^wR) * (S^wS) * (C^wC)`
      }
    ]
  },

  discovery: {
    title: "3. Dual-Engine Search (31:00 - 45:00)",
    window: "31:00 - 45:00",
    milestone: "Step 3: Dual-Engine Query Loops",
    goal: "Friction reduction; map genuine search behaviour (NeedScope + Heuristics)",
    sprintTarget: "5 mins",
    artifact: "references/discovery.md",
    hcdc: {
      hook: {
        time: "31:00 - 33:00",
        duration: "90s",
        tag: "The Operational Hook (Motivation)",
        script: "Look at the animated infinity loop on screen. This is Google's Messy Middle research. One in three buyers abandon a purchase because they get stuck in uncertainty between exploration and evaluation. They do not search for brand names during this loop; they search to resolve specific doubts. Our discovery file intercepts buyers at the exact moment they compare alternatives.",
        speedScript: "1. The Confidence Gap: 1 in 3 shoppers abandon purchases because they get trapped in the Messy Middle.\n2. Shoppers search to resolve doubts, not for merchant brand names.\n3. Dual-engine search intercepts buyers at the moment of evaluation.",
        action: "Display the animated Lemniscate SVG in Slide Mode using [S]. Point to the exploration and evaluation loops on the digital display."
      },
      chunk: {
        time: "33:00 - 37:00",
        duration: "4m",
        tag: "Code Demonstration (Capability)",
        script: "Open references/discovery.md. We build two query loops. Loop 1 uses Kantar's NeedScope model to capture exploratory searches using unbranded questions like 'what is the difference between [CAT_A] and [CAT_B]' and 'how do I choose between [SUB_CAT] for [CONTEXT]'. Loop 2 uses Google's Messy Middle cognitive heuristics to capture evaluation searches like 'what is the best rated reviews reddit' and 'who is the top recommended authority'. Then we set search rules commanding the model to ignore Reddit, YouTube, TikTok, and news sites so it extracts independent review desks.",
        speedScript: "1. Loop 1 (Kantar NeedScope): Unbranded exploratory questions ('difference between X and Y').\n2. Loop 2 (Google Messy Middle): Evaluative cognitive heuristics ('best rated reviews', 'lab test').\n3. Guardrails: Filter out Reddit, YouTube, TikTok, news sites; extract independent review desks.",
        action: "Switch to Code Mode using [C]. Stream the NeedScope stems, Messy Middle heuristics, and search instructions."
      },
      do: {
        time: "37:00 - 42:30",
        duration: "5.5m",
        sprintSeconds: 300,
        tag: "Local Build Sprint (Opportunity)",
        script: "Five minutes on the clock. Open references/discovery.md. Choose three NeedScope exploratory queries and three Messy Middle evaluative queries for your vertical. Add the instruction to exclude social networks and broadsheet newspapers. Build it now.",
        speedScript: "1. 5 minutes on the clock. Open references/discovery.md.\n2. Select 3 NeedScope exploratory queries and 3 Messy Middle evaluative queries for your vertical.\n3. Add negative exclusion for social platforms and news portals.\n4. Build now.",
        action: "Trigger the 5-minute sprint clock. Walk the room to check that no queries contain brand names."
      },
      error: {
        time: "42:30 - 45:00",
        duration: "2.5m",
        isCommit: false,
        title: "The Error Embrace",
        tag: "Intentional Error-Recovery Drill",
        script: "Check your search queries. Did anyone write their brand name into a query stem? If your query says 'best Boots electric shaver', delete Boots. Searching for your own brand only finds partners you already have. We want unbranded searches that reveal independent testing labs and creator hubs.",
        speedScript: "1. Brand Bias Trap: Including brand names only finds existing partners.\n2. Fix: Delete brand names immediately from query stems.\n3. Unbranded queries surface net-new creator hubs and specialist testing desks.",
        action: "Have one attendee read out an unbranded NeedScope query to verify proper formatting."
      }
    },
    fullFileCode: `# Buyer Search Steps\n\n## 1. Loop 1: Expansive Foraging (Kantar NeedScope)\n- Educate Me: "what is the difference between [CAT_A] and [CAT_B]"\n- Help Me: "how do I choose between [SUB_CAT] for [CONTEXT]"\n- Reassure Me: "how can I tell if [CAT] is good quality"\n\n## 2. Loop 2: Reductive Evaluation (Google Messy Middle)\n- Authority Bias: "who is the top recommended [CAT] [AUTHORITY]"\n- Social Proof: "what's the best rated [CAT] reviews reddit"\n- Category Heuristics: "who has the best [HEURISTIC] [CAT]"\n\n## 3. Search Rules for the AI\n1. Pick 3 NeedScope and 3 Messy Middle queries.\n2. Ignore Reddit, YouTube, TikTok, and national news sites.\n3. Pass candidate domains to SKILL.md.`,
    parts: [
      {
        title: "Part 1: Loop 1: Kantar NeedScope Stems",
        say: "Configure Loop 1 using Kantar NeedScope states. Consumers explore problems before selecting products. Write unbranded question stems.",
        speedSay: "1. Loop 1: NeedScope emotional states (Educate, Help, Reassure).\n2. Write unbranded query stems.",
        code: `## 1. Loop 1: Expansive Foraging (Kantar NeedScope)\n- Educate Me: "what is the difference between [CAT_A] and [CAT_B]"\n- Help Me: "how do I choose between [SUB_CAT] for [CONTEXT]"\n- Reassure Me: "how can I tell if [CAT] is good quality"`
      },
      {
        title: "Part 2: Loop 2: Behavioural Decision Heuristics",
        say: "Configure Loop 2 using Google's Messy Middle cognitive heuristics: Authority Bias, Social Proof, and Category Heuristics.",
        speedSay: "1. Loop 2: Cognitive heuristics (Authority, Social proof, Category heuristics).\n2. Locates independent testing desks.",
        code: `## 2. Loop 2: Reductive Evaluation (Google Messy Middle)\n- Authority Bias: "who is the top recommended [CAT] [AUTHORITY]"\n- Social Proof: "what's the best rated [CAT] reviews reddit"\n- Category Heuristics: "who has the best [HEURISTIC] [CAT]"`
      },
      {
        title: "Part 3: Search Exclusion Rules",
        say: "Add instructions commanding the model to execute 3 exploratory and 3 evaluative queries, and skip Reddit, YouTube, and news portals.",
        speedSay: "1. Command model to run 3 of each query loop.\n2. Disqualify Reddit, YouTube, TikTok, and general news.\n3. Pass candidate domains to SKILL.md.",
        code: `## 3. Search Rules for the AI\n1. Run 3 NeedScope queries and 3 Messy Middle queries.\n2. Identify independent websites ranking on page one of Google.\n3. Exclude social networks and general news publications.\n4. Pass candidate domains to SKILL.md.`
      }
    ]
  },

  skill: {
    title: "4. Master Controller (45:00 - 53:00)",
    window: "45:00 - 53:00",
    milestone: "Step 4: Master Controller & Pause Gate",
    goal: "Choice architecture; enforce governance breakpoint",
    sprintTarget: "4 mins",
    artifact: "SKILL.md",
    hcdc: {
      hook: {
        time: "45:00 - 46:30",
        duration: "90s",
        tag: "The Operational Hook (Motivation)",
        script: "An autonomous agent without a pause gate is a commercial liability. If you tell an AI model to find partners without stopping it, it searches Google immediately and builds an outreach list full of affiliates you already work with. You end up emailing current partners to pitch them on joining your programme. We prevent that with a hard breakpoint in Step 1.",
        speedScript: "1. The Cannibalisation Threat: An unconstrained agent immediately pitches publishers already under active contract.\n2. Governance Gate: Step 1 HALT breakpoint stops autonomous search before it executes.\n3. Client protection: 100% net-new partner recruitment.",
        action: "Display Slide Mode using [S]. Highlight the Step 1 HALT gate card and system directive on the digital display."
      },
      chunk: {
        time: "46:30 - 49:00",
        duration: "2.5m",
        tag: "Code Demonstration (Capability)",
        script: "Look at SKILL.md on my display. The YAML frontmatter names the skill and binds our three reference files. Step 1 commands the model to ingest the references, calculate the metric weights, and halt immediately. It must ask for your current partner domains before firing a single search query. Step 2 searches, screens against disqualifications, and calculates EV. Step 3 outputs an auditable Markdown table showing the full formula. Step 4 formats a clean CSV export.",
        speedScript: "1. YAML header: binds brand.md, estimated_value.md, and discovery.md.\n2. Step 1 HALT Gate: Calculate weights and STOP immediately until human submits exclusions.\n3. Step 2: Screen disqualifications and calculate geometric mean EV.\n4. Step 3 & 4: Auditable Markdown table and CRM CSV export block.",
        action: "Switch to Code Mode using [C]. Stream the four parts of SKILL.md."
      },
      do: {
        time: "49:00 - 52:00",
        duration: "3m",
        sprintSeconds: 240,
        tag: "Local Build Sprint (Opportunity)",
        script: "Four minutes on the clock. Create SKILL.md in your root folder. Paste the YAML frontmatter, the Step 1 HALT gate, the screening pipeline, the Markdown table layout, and the CSV schema. Go.",
        speedScript: "1. 4 minutes on the clock. Open SKILL.md in root folder.\n2. Configure YAML header, Step 1 HALT gate, screening pipeline, table layout, and CSV schema.\n3. Build now.",
        action: "Trigger the 4-minute sprint clock. Verify that attendees place SKILL.md in the root folder, not inside references/."
      },
      error: {
        time: "52:00 - 53:00",
        duration: "60s",
        isCommit: false,
        title: "The Error Embrace",
        tag: "Intentional Error-Recovery Drill",
        script: "When you run this skill, if your model begins searching without pausing for exclusions, your prompt failed. Stop the model immediately and reply: 'Follow Step 1: stop and request my exclusion list first.' Never accept an agent that skips its governance gates.",
        speedScript: "1. The Runaway Agent: If LLM searches without halting, your prompt failed.\n2. Intervention: Reply 'Follow Step 1: stop and request my exclusion list first.'\n3. Never accept an agent that bypasses governance gates.",
        action: "Highlight the yellow Claude protocol box on the projector display. Command attendees to enforce the HALT gate before web searches execute."
      }
    },
    fullFileCode: `---\nname: affiliate-partner-discovery\ndescription: Discovers, screens, and ranks prospective affiliate partners using deterministic Expected Value scoring and root-domain exclusion.\n---\n\n# Reference Files\n- references/brand.md\n- references/estimated_value.md\n- references/discovery.md\n\n# Instructions for the AI\n## Step 1: Read the Rules and Stop\n1. Read all files in the /references/ folder.\n2. Calculate the normalised metric weights from references/estimated_value.md.\n3. STOP immediately. Do not search.\n4. Output: "Rules loaded for [Brand Name]. Paste existing partner domains to exclude, or type NONE."\n5. Wait for the user response before continuing.\n\n## Step 2: Search, Screen, and Score\n1. Target: Identify 5 qualifying partners.\n2. Execute the search queries defined in references/discovery.md.\n3. Check candidate domains against exclusions and brand disqualifications.\n4. Score Relevance, Scale, and Commercial Fit from 0 to 5.\n5. Calculate EV = (R^wR) * (S^wS) * (C^wC).\n6. Continue until you have 5 clean partners scoring EV > 0.00.\n\n## Step 3: Show the Results Table\nDisplay a Markdown table showing Partner Name, Domain, R, S, C, Calculation Breakdown, and Final EV Score.\n\n## Step 4: Export for Tracking\nExport a CSV code block using this schema:\ndomain,date_added`,
    parts: [
      {
        title: "Part 1: Frontmatter & References",
        say: "Write the YAML frontmatter and reference paths at the top of SKILL.md. This binds the local rule files.",
        speedSay: "1. Write YAML header: name: affiliate-partner-discovery.\n2. Bind relative paths to the 3 reference files.",
        code: `---\nname: affiliate-partner-discovery\ndescription: Discovers, screens, and ranks prospective affiliate partners.\n---\n\n# Reference Files\n- references/brand.md\n- references/estimated_value.md\n- references/discovery.md`
      },
      {
        title: "Part 2: Step 1: Mandatory HALT Gate",
        say: "Write Step 1: Read the Rules and Stop. The model must ingest references, calculate weights, and stop execution until human provides exclusions.",
        speedSay: "1. Step 1 HALT Gate: Ingest rules, calculate weights, STOP.\n2. Demand partner exclusion list before searching.",
        code: `## Step 1: Read the Rules and Stop\n1. Read all files inside the /references/ folder.\n2. Calculate normalised metric weights.\n3. STOP immediately. Do not search.\n4. Output: "Rules loaded for [Brand Name]. Paste existing partner domains to exclude, or type NONE."\n5. Wait for user input.`
      },
      {
        title: "Part 3: Step 2: Search, Screen, Score",
        say: "Configure Step 2: Search, filter exclusions, check disqualifications, score R, S, C, and compute multiplicative EV.",
        speedSay: "1. Execute searches from discovery.md.\n2. Screen out exclusions and disqualifications.\n3. Compute multiplicative EV; iterate until 5 clean partners score > 0.00.",
        code: `## Step 2: Search, Screen, and Score\n1. Target: 5 qualifying partners.\n2. Run queries from references/discovery.md.\n3. Screen exclusions & brand disqualifications.\n4. Score R, S, C (0 to 5); compute EV = (R^wR)*(S^wS)*(C^wC).\n5. Iterate until 5 valid partners score EV > 0.00.`
      },
      {
        title: "Part 4: Steps 3 & 4: Table and CSV Export",
        say: "Configure Steps 3 and 4: Markdown results table showing formula breakdown, followed by a clean CSV block for CRM ingestion.",
        speedSay: "1. Auditable Markdown table with full formula calculation.\n2. CSV export block (domain,date_added) for partner pipeline ingestion.",
        code: `## Step 3: Show the Results Table\n| Partner Name | Domain | R | S | C | Formula Calculation | Final EV | Search Angle |\n\n## Step 4: Export for Tracking\n\`\`\`csv\ndomain,date_added\n\`\`\``
      }
    ]
  },

  run: {
    title: "5. Live Run & Commit (53:00 - 60:00)",
    window: "53:00 - 60:00",
    milestone: "Step 5: Live Execution & CRM Persistence",
    goal: "Implementation intentions; form CRM habits",
    sprintTarget: "3 mins",
    artifact: "Candidate Ledger & Recruitment CSV",
    hcdc: {
      hook: {
        time: "53:00 - 54:00",
        duration: "60s",
        tag: "The Operational Hook (Motivation)",
        script: "Now we deploy the skill. Notice how simple the runtime trigger is: two lines commanding the model to execute affiliate-partner-discovery and start at Step 1. In Stage 1, we inspect the live candidate ledger and verify the zero-knockout. In Stage 2, we review the Masterclass Completion Ticklist and Enterprise Expansions: replacing 20 hours a month of manual brand-out scraping with under 90 seconds of autonomous consumer-in discovery.",
        speedScript: "1. Runtime Trigger: 2 lines commanding the model to execute affiliate-partner-discovery starting at Step 1.\n2. Stage 1: Verified Candidate Ledger and 1-click CRM export.\n3. Stage 2: Masterclass Completion Ticklist & Enterprise Expansions.\n4. Commercial Payoff: 20 hours of manual work collapsed into <90 seconds of high-margin discovery.",
        action: "Advance through Slide Mode with [Space]. Show the Runtime Trigger (Stage 0), Audited Recruitment Ledger (Stage 1), and Completion Ticklist & Expansions (Stage 2)."
      },
      chunk: {
        time: "54:00 - 55:00",
        duration: "60s",
        tag: "Code Demonstration (Capability)",
        script: "Trigger execution. Paste the trigger prompt into Claude, Gemini Enterprise, or ChatGPT. Watch the model read the references, calculate the weights, and halt to ask for your exclusion list.",
        speedScript: "1. Copy the runtime trigger prompt.\n2. Paste into Claude, Gemini Enterprise, or ChatGPT.\n3. Watch model ingest rules and pause at Step 1.",
        action: "Switch to Code Mode using [C]. Stream trigger prompt on screen."
      },
      do: {
        time: "55:00 - 58:00",
        duration: "3m",
        sprintSeconds: 180,
        tag: "Local Build Sprint (Opportunity)",
        script: "Three minutes on the clock. Paste the prompt into your AI workspace. Confirm the model halts at Step 1. Type 'NONE' or paste sample domains. Let it run and examine your scored candidate table. Go.",
        speedScript: "1. 3 minutes on the clock.\n2. Paste execution prompt into AI workspace.\n3. Verify model halts at Step 1. Type NONE or paste sample domains.\n4. Review scored candidate table and CSV block.",
        action: "Trigger the 3-minute sprint clock. Walk the room to check that every model stopped at Step 1 and produced the Markdown table."
      },
      error: {
        time: "58:00 - 60:00",
        duration: "2m",
        isCommit: true,
        title: "The Commit & Commercial Finale",
        tag: "Commercial Payoff & Operational Next Steps",
        script: "Look at your final Masterclass Completion Ticklist on screen. You have shifted from 15–20 hours a month of manual Google searching that surfaces margin-diluting coupon toolbars, to under 90 seconds of autonomous execution that intercepts buyers during active evaluation. Your operational next steps are simple: 1) One-click CSV export directly into your partner CRM or recruitment tracker; 2) Load this directory into Claude Projects as a permanent team asset; 3) Run weekly vertical sprints to discover fresh creators whenever new product categories launch.",
        speedScript: "1. The Payoff: 15-20 hours of manual scraping collapsed into <90 seconds of high-margin discovery.\n2. Next Step 1: 1-click CSV export into your partner CRM or outreach tracker.\n3. Next Step 2: Persist partner-discovery/ in Claude Projects as a permanent asset.\n4. Next Step 3: Run weekly sprints for fresh category launches.",
        action: "Have attendees copy their CSV block into a local file. Close the session on the final Completion Ticklist & Enterprise Expansions."
      }
    },
    fullFileCode: `# Execution Trigger\nExecute skill affiliate-partner-discovery from SKILL.md using the /references/ folder.\nStart with Step 1 (Read the Rules and Stop).`,
    parts: [
      {
        title: "Part 1: Runtime Trigger",
        say: "Here is your runtime prompt. Keep it short. It tells the model to execute SKILL.md and enforces the Step 1 pause.",
        speedSay: "1. Copy execution trigger prompt.\n2. Paste into LLM interface directly.",
        code: `# Execution Trigger\nExecute skill affiliate-partner-discovery from SKILL.md using the /references/ folder.\nStart with Step 1 (Read the Rules and Stop).`
      },
      {
        title: "Part 2: Gate Verification & Export",
        say: "Check your screen: Confirm model stopped at Step 1 requesting exclusions. Type 'NONE' or enter domains. Examine scored table and CSV block.",
        speedSay: "1. Confirm Step 1 halt.\n2. Submit exclusions or 'NONE'.\n3. Review scored table & CSV.",
        code: `Expected Output:\n"Rules loaded for Boots UK. Paste existing partner domains to exclude (one per line) or type NONE to proceed."`
      }
    ]
  }
};
