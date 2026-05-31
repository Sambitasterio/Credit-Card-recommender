# FreechargeBiz × Axis Bank — AI Credit Card Recommendation Engine

A pitch-ready prototype that matches a user to the best-fit Axis Bank / Freecharge
credit card based on their spending profile, with a personalised, spend-linked
rationale.

## How it works

1. **Collect signals** — either a 4-step profiler or a "Demo Mode" that loads
   simulated SMS transaction data (the prototype stand-in for the on-device SMS
   parser described in the PRD).
2. **Score cards** — a transparent, rule-based engine ranks every eligible card
   on spend-category overlap, income headroom, estimated reward, and fees.
3. **Explain the match** — the OpenAI API turns the winning card + the user's real
   numbers into 3 short reasons (with a template fallback if no API key is set).
4. **Show social proof** — a persona chart built from offline K-Means clustering
   of a real 8,950-customer credit-card dataset.

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling, **Recharts** for the persona chart
- **OpenAI API** (`gpt-4o-mini`) for recommendation copy
- **Python + scikit-learn** (K-Means, offline) → `src/data/clusters.json`

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then paste your OpenAI key (optional)
npm run dev
```

Open http://localhost:3000.

## Regenerate persona clusters (optional)

```bash
pip install -r ml/requirements.txt
python ml/cluster.py   # reads ml/CC GENERAL.csv, or synthesises data if absent
```

## Environment

| Variable | Required | Notes |
|----------|----------|-------|
| `OPENAI_API_KEY` | No | If unset, the recommendation API uses a template fallback |
