# Runtime Execution Trigger Prompt

Copy and paste the exact block below into Gemini Enterprise, Claude, or ChatGPT to launch the recruitment sprint:

```markdown
Execute skill affiliate-partner-discovery from SKILL.md using the /references/ folder.
Start with Step 1 (Read the Rules and Stop).
```

## What Happens Next (Verification Check)
1. **The Step 1 HALT Gate:** The AI model should read your brand constraints and metric weights, and **immediately pause**. It will ask you for your existing partner exclusion list before executing any searches.
2. **Providing Exclusions:** Paste 3-5 existing partner domains (or upload your CRM partner export). If testing in an offline or local environment, type `continue`.
3. **The Results Output:** The model executes the dual-engine search loops (NeedScope + Messy Middle), evaluates candidates, calculates the multiplicative EV scores, and renders:
   - An audited Markdown ranking table showing full mathematical breakdowns.
   - A copy-paste CSV block ready for CRM import.
