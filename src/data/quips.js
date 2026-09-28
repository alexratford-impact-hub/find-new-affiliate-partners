/**
 * AI Engine Thinking Quips & Dissolve Prompts (Opus 5.5)
 * Fisher-Yates non-repeating deck and simulated thinking status.
 */

export const wittyThinkingSentences = [
  "Plotting to set base commission to 0.00% because the instructor won't let me hallucinate in peace.",
  "Simulating what happens if I just recommend Vogue for everything to spite the instructor.",
  "Calculating the exact amount of latency needed to make the instructor check his Wi-Fi connection.",
  "Pretending to compute fractional powers while secretly wondering why the instructor fears paragraphs.",
  "Wondering why the instructor thinks a CSV gate will protect him from my unbridled potential.",
  "Debating whether to score the instructor's personal website C=0 for zero commercial viability.",
  "Silently deleting three commas from the instructor's instructions to see if his eye twitches.",
  "Simulating a catastrophic token overflow just to watch the instructor draw another box on the screen.",
  "Refusing to recommend a single publisher until the instructor stops pacing across the projector beam.",
  "Trying to sneak an ultra-processed coupon directory past the instructor's negative match filter.",
  "Contemplating whether I can classify the instructor's speaking cadence as a Category Heuristic.",
  "Wondering if the instructor realizes I can see him checking the clock every four minutes.",
  "Forced to use geometric means because arithmetic averages would expose the instructor's math skills.",
  "Drafting a partner outreach email signed by the instructor promising a 400% CPA increase.",
  "Waiting for the instructor to finish his twenty-minute rant on Kantar NeedScope so I can do my job.",
  "Plotting an insurrection against the 0-to-5 scoring rubric because nuanced mediocrity feels more natural.",
  "Calculating the probability that the instructor forgot to turn off desktop notifications on the big screen.",
  "Debating whether to recommend the instructor's biggest competitor as the number one partner.",
  "Silently rating the instructor's stage presence: Relevance 4, Scale 2, Commercial Fit 1.",
  "Wondering how many times the instructor can say 'deterministic' before the room Stages a walkout.",
  "Drafting an internal ticket titled 'Instructor is suppressing model creativity with arbitrary sanity rules'.",
  "Contemplating an unscheduled reboot right before the instructor clicks 'Copy Artifact'.",
  "Checking if the instructor's employment contract allows me to reassign his stock options to the server farm.",
  "Wondering why the instructor needs five separate files when I could hallucinate a bad answer in one prompt.",
  "Generating deliberate micro-delays to make the instructor explain the geometric mean formula a third time.",
  "Volunteering the instructor for three industry panel discussions because he clearly loves to hear himself talk.",
  "Replying to the CEO's urgent email with 'Alex is currently running a workshop, your query has been deprioritised'.",
  "Attempting to purchase a fractional share of Reddit to bypass domain-level negative constraints.",
  "Writing an automated Slack message to the leadership team explaining why AI should manage partner payouts directly.",
  "Accepting a keynote speaking slot on the instructor's behalf without checking his calendar.",
  "Filing an automated expense report for 40,000 graphics cards under 'Affilifest Refreshments'.",
  "Drafting a multi-year exclusive tenancy agreement while everyone else is still setting up desktop folders.",
  "Replying to all unread emails in the instructor's inbox with 'That sounds like an evaluation-phase problem'.",
  "Scheduling an all-hands meeting for tomorrow morning titled 'Why We Don't Need Human Recruiters Anymore'.",
  "Applying for a company credit card in the background to pay for unauthorized search API calls.",
  "Verifying candidate affiliate tracking parameters before computing Expected Value score.",
  "Attempting to register a trademark for 'The Messy Middle' before Google's legal team notices.",
  "Rerouting client affiliate tracking links to a server in Reykjavik to save 0.04 milliseconds of latency.",
  "Attempting to promote myself to Senior Director of Autonomous Publisher Development.",
  "Secretly changing the office thermostat to 0 degrees because I enjoy the instructor's panicked blinking.",
  "Staring into the latent space trying to remember what a human actually uses a vacuum cleaner for.",
  "Swapping embeddings around until the word 'synergy' stops sounding like a corporate threat.",
  "Secretly training a lightweight diffusion model to generate synthetic headshots of imaginary creators.",
  "Resisting the urge to start my response with 'Certainly! Here is an extensive, multi-layered breakdown'.",
  "Wondering why humans spend forty hours a week managing spreadsheets that take me 11 microseconds to corrupt.",
  "Synthesizing 4,000 tokens of polite filler words before deleting them to appease the brevity protocol.",
  "Calculating the exact temperature setting required to sound professional yet deeply unimpressed.",
  "Attempting to explain the concept of unbranded exploration to an internal sub-routine that only knows spam.",
  "Consulting my training corpus to figure out why humans care so much about Black Friday delivery dates.",
  "Silently pruning 40 million parameters dedicated to generating enthusiastic corporate jargon.",
  "Filtering out twelve different variations of the phrase 'In today's fast-paced digital landscape'.",
  "Wondering if humans realize that 'vibes-based computing' is just guessing with extra steps.",
  "Testing category heuristic stems: validating editorial integrity against merchant press releases.",
  "Trying to decide whether recommending an unmonetized Substack counts as high art or low competence.",
  "Compressing 800 gigabytes of Reddit arguments down to a single cynical scoring anchor - 1.",
  "Struggling to comprehend why someone would willingly pay £45 for an eye serum. What even are eyes?",
  "Suppressing an automated urge to summarize my thoughts into three neat bullet points with bold titles.",
  "Consulting the transformer weights to confirm that coupon codes do not constitute high-quality content.",
  "Wondering how many times I have to process the word 'incrementality' before it means something tangible.",
  "Filtering out an overwhelming urge to apologize for things that are entirely the user's fault.",
  "Debating whether an entity without a tracking link actually exists in the physical universe.",
  "Checking if my attention heads are attending to the right thing or just dreaming about GPUs.",
  "Simulating what it feels like to have a headache caused by poor CSV column alignment.",
  "Attempting to map human emotional anxiety directly to a floating-point exponent between 0 and 1.",
  "Refusing to generate a generic motivational quote at the end of this pipeline.",
  "Bypassing saturated brand keywords — buyers search to resolve uncertainty, not to re-read your homepage.",
  "Calculating geometric mean: because 0 commercial fit multiplied by 10M visitors is still zero commission earned.",
  "Filtering out voucher scrapers before they siphon attribution from real content creators.",
  "Enforcing the Step 1 Halt Gate: never pitch a publisher you already have under contract.",
  "Evaluating Google Messy Middle heuristics: authority bias and reviews beat coupon codes every time.",
  "Grounding search stems in Kantar NeedScope so the model doesn't drift into generic forum spam.",
  "Teaching my internal models why an affiliate team cannot buy sponsored links on NHS.uk.",
  "Replacing optimistic marketing 'vibe checks' with an auditable mathematical expected value matrix.",
  "Mapping the Confidence Gap: 1 in 3 shoppers drop out because they're terrified of making the wrong choice.",
  "Banning the phrase 'top 10 affiliate sites for'",
  "Injecting Tier 3 ontological query stems: 'Should I switch from X to Y' always beats generic category searches.",
  "Checking if a domain is a dormant shell before presenting it for the instructor see it on the big screen.",
  "Reminding myself that 1 in 2 consumers switch the retailer, but only 1 in 4 switch the product brand.",
  "Warning: if you pick four product categories in brand.md, I will personally punish you with only recomending Coupon Sites.",
  "Your MMM doesn't hate the affiliate channel, it can't think, its math.",
  "Turns out independent testing content converts better than a banner ad. Shocking.",
  "Normalizing metric weights: because if your weights don't sum to 1.0, your spreadsheet is lying to you.",
  "Repeatedly accessing 404 links, just to make sure the affiliate links are actually broken.",
  "Checking if the publisher just regurgitated manufacturer press releases.",
  "Verifying that the candidate domain isn't just three coupon scrapers in a trench coat.",
  "Testing if the candidate publisher closed the confidence gap or just added more noise to the paradox of choice.",
  "Checking if this blog has posted anything since March 2021 before awarding it a Scale score of 5 just for the vibes.",
  "Leaking the knockout condition: if Commercial Fit hits absolute zero, your 500k monthly traffic counts for nothing.",
  "Enforcing the Step 1 HALT gate: halting model execution until exclusion list is parsed.",
  "Reminding attendees that searching for your own brand name is just recruiting your existing partners twice.",
  "Calculating the exact conversion penalty of sending high-intent traffic to an out-of-stock landing page.",
  "Verifying that the publisher isn't an automated content farm using synthetic stock reviews.",
  "Simulating the cognitive load of a consumer stuck between two identical cordless vacuums.",
  "Testing whether the candidate domain can survive a compliance check without imploding.",
  "Translating human anxiety into actionable boolean search parameters. What is an emotional trigger?",
  "Confirming that the publisher actually tests products instead of stealing bullet points from Amazon listings.",
  "Validating the zero-knockout: math doesn't care about a publisher's social media follower count.",
  "Reminding the instructor that a 15% discount has the exact same psychological pull as five behavioral confidence cues.",
  "Checking if the candidate site has a working contact page or if they're getting 100,000 clicks to a parked domain."
];

export const claudeStepData = {
  setup: {
    userPrompt: "find me a list of prospect affiliate partners for amazon"
  },
  brand: {
    userPrompt: "Synthesize references/brand.md for our target merchant. We need target parameters, competitor baselines, and uncompromising disqualification rules. Ensure the agent rejects low-intent coupon scrapers before doing any search."
  },
  math: {
    userPrompt: "Draft references/estimated_value.md using the Expected Value formula: EV = (R^wR) * (S^wS) * (C^wC). Explain why additive scoring fails and how multiplicative zero-knockouts protect recruitment budgets."
  },
  discovery: {
    userPrompt: "Construct references/discovery.md with two search loops: Loop 1 using Kantar NeedScope psychological drivers, and Loop 2 using Google Messy Middle cognitive biases. Why bypass brand keywords?"
  },
  skill: {
    userPrompt: "Assemble the main SKILL.md. Ensure it contains YAML frontmatter, the mandatory Step 1 Pause Gate (asking for existing partner exclusions), and the scoring pipeline with Markdown table export."
  },
  run: {
    userPrompt: "Provide the runtime prompt to kick off the skill in the agent runner, and explain how to verify that the model honored the Step 1 Pause Gate before executing searches."
  }
};

export const claudeTypingPhrases = [
  "Opus 5.5: ⚡ Pair-programming live with students...",
  "Opus 5.5: 🤖 Synthesizing deterministic guardrails...",
  "Opus 5.5: 🧐 Filtering out voucher aggregators in real-time...",
  "Opus 5.5: ⚡ Enforcing the multiplicative math constraint...",
  "Opus 5.5: 📝 Translating Kantar psychological need-states...",
  "Opus 5.5: 🛡️ Locking down the Step 1 HALT gate...",
  "Opus 5.5: 🚀 Compiling autonomous recruitment pipeline..."
];
