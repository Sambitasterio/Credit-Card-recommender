# 💳 FreechargeBiz × Axis Bank — AI Credit Card Recommendation Engine

> Match any user to their **perfect** Axis Bank / Freecharge credit card from how they actually spend — with a personalised, spend-linked rationale — in under 60 seconds.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white" />
  <img alt="OpenAI" src="https://img.shields.io/badge/OpenAI-gpt--4o--mini-412991?logo=openai&logoColor=white" />
  <img alt="scikit-learn" src="https://img.shields.io/badge/scikit--learn-KMeans-f7931e?logo=scikitlearn&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel" />
</p>

### 🔗 **[Live demo → credit-card-recommender-zeta.vercel.app](https://credit-card-recommender-zeta.vercel.app/)**

---

## 📖 The problem

When someone wants a credit card, they hit **information overload** — 50+ variants with jargon-heavy benefits — and **generic recommendations** ranked by issuer commission, not personal fit. The result: 63–68% drop-off on fintech onboarding forms, and post-selection regret (a travel card for someone who never flies).

## 💡 The solution

This engine reads a user's **financial footprint** (spending categories, income proxy) and maps it to the best-fit Axis Bank card, then explains *why it fits you* using your real numbers:

> *"With ₹6,000/month on food, enjoy 40% off on Zomato twice a month — saving ₹2,880 a year."*

The recommendation itself is made by a **transparent, rule-based engine** (explainable — important in fintech). AI is used only to turn the winning card + your numbers into friendly, personalised copy.

---

## ✨ Key features

- **Two elegant data-collection paths** — a 4-step visual profiler *or* a one-tap "sample profile" demo that loads simulated SMS data (the prototype stand-in for on-device SMS parsing).
- **Transparent consent screen** — clearly states what's read vs. never shared, and that the check doesn't affect your CIBIL score.
- **Explainable scoring** — every card gets a 0–100 match score across 5 weighted factors.
- **Personalised rationale** — 3 spend-linked reasons per recommendation (OpenAI `gpt-4o-mini`), with a **template fallback** so it never breaks even without an API key.
- **Net-benefit math** — estimated yearly rewards − annual fee, shown transparently.
- **Social-proof persona chart** — built from **real K-Means clustering** of an 8,950-customer credit-card dataset.
- **First-timer path** — thin-file users are routed to entry-level cards with encouraging, never rejection-framed, copy.
- **Mobile-first, orange/white** FreechargeBiz theme.

---

## 🧭 How it works

```
                 ┌─────────────────────────────┐
   Path A ──────▶│  4-step Profiler            │──┐
 (manual)        │  income · categories · etc. │  │  builds a UserProfile
                 └─────────────────────────────┘  │  { income, topCategories,
   Path B ──────▶  Demo Mode (simulated SMS)  ────┤    employment, hasCard }
 (sample)                                          │
                                                   ▼
                                   POST /api/recommend  (server)
                                                   │
                 ┌─────────────────┬───────────────┼──────────────────┐
                 ▼                 ▼                                   ▼
        scoreCards()        OpenAI gpt-4o-mini              template fallback
     rule-based 0–100      3 spend-linked reasons          (if key missing/fails)
     + recommend()
                 └─────────────────┴───────────────┬──────────────────┘
                                                   ▼
                            Recommendation page (client)
                  primary card · match score · 3 reasons ·
                  reward breakdown · persona chart · alternates · Apply
```

**Offline, one-time pre-compute** (never runs on a request):

```
ml/cluster.py  →  K-Means on CC GENERAL.csv (or synthetic fallback)
               →  src/data/clusters.json  (cluster sizes + profiles, baked into the app)
```

---

## 🧮 The recommendation engine

Each eligible card is scored 0–100:

| Factor | Weight | What it measures |
|--------|:------:|------------------|
| Spend-category match | 35% | Overlap between the user's top spends and the card's reward categories |
| Income headroom | 25% | How comfortably the user clears the card's minimum income |
| Estimated reward | 20% | Rupee value earned per month given the user's spends |
| Fee-to-benefit | 12% | Whether the fee is waived or out-earned by rewards |
| Lifestyle bonus | 8% | Card's headline category = the user's #1 spend |

The top score becomes the **primary** card; the next two with **distinct headline categories** become alternates. Thin-file users are restricted to entry-level cards.

---

## 👥 Demo personas

| Persona | Profile | Typical match |
|---------|---------|---------------|
| **Riya** — Digital Millennial | ₹85K/mo · food, shopping, OTT | Axis Neo |
| **Ramesh** — Salaried Professional | ₹90K/mo · groceries, fuel, bills | Freecharge Plus / IndianOil |
| **Ananya** — First-Timer | ₹28K/mo · light online spends | Flipkart (entry-level path) |
| **Vivek** — Business Traveler | ₹2.5L/mo · flights, hotels, dining | Vistara Signature |

---

## 🛠️ Tech stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| AI rationale | OpenAI `gpt-4o-mini` (JSON mode) + deterministic fallback |
| ML clustering | Python · scikit-learn (K-Means), offline → static JSON |
| Hosting | Vercel |

---

## 📂 Project structure

```
freecharge-cc-recommender/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing (hero + demo picker)
│   │   ├── profiler/page.tsx        # 4-step data collection
│   │   ├── recommendation/page.tsx  # Result: card, reasons, chart, alternates
│   │   └── api/recommend/route.ts   # Scoring + OpenAI rationale + fallback
│   ├── components/
│   │   ├── ConsentScreen.tsx
│   │   ├── CardDisplay.tsx
│   │   ├── PersonaChart.tsx
│   │   └── MockSMSBanner.tsx
│   ├── data/
│   │   ├── cards.ts                 # 8-card catalog (real Axis data + Freecharge)
│   │   ├── mockSMS.ts               # 4 demo persona profiles
│   │   └── clusters.json            # K-Means output (baked in)
│   └── lib/
│       ├── scorer.ts                # Rule-based engine + recommend()
│       ├── personaMatcher.ts        # Profile → nearest persona
│       └── session.ts               # State passing between screens
└── ml/
    ├── cluster.py                   # One-time K-Means script
    └── requirements.txt
```

---

## 🚀 Getting started (local)

```bash
git clone https://github.com/<your-username>/freechargebiz-card-recommender.git
cd freechargebiz-card-recommender/freecharge-cc-recommender

npm install
cp .env.local.example .env.local      # then paste your OpenAI key (optional)
npm run dev
```

Open **http://localhost:3000**.

> Without an `OPENAI_API_KEY` the app still works — it generates the rationale from a deterministic template instead of the LLM.

### Environment variables

| Variable | Required | Notes |
|----------|:--------:|-------|
| `OPENAI_API_KEY` | No | If unset, the `/api/recommend` route uses a template fallback |

### Regenerate the persona clusters (optional)

```bash
pip install -r ml/requirements.txt
python ml/cluster.py      # reads ml/CC GENERAL.csv, or synthesises data if absent
```

Source dataset: *Credit Card Dataset for Clustering* (Kaggle, ~8,950 rows).

---

## ☁️ Deployment (Vercel)

This app lives in a subfolder of the repo, so in Vercel:

1. Import the GitHub repo.
2. **Set Root Directory to `freecharge-cc-recommender`** (so Next.js is detected).
3. Add the `OPENAI_API_KEY` environment variable.
4. Deploy. Every `git push` to `main` auto-redeploys.

---

## 🗺️ Roadmap

- **v2** — DistilBERT/TF-IDF SMS classifier · XGBoost conversion model (`P(apply)`) · live Axis card-catalog API · save & return · card comparison.
- **v3** — cross-issuer recommendations · Account Aggregator (AA) integration · progressive profiling · real-time offer injection.

---

## ⚠️ Disclaimer

A prototype built for a product assignment. Card details are drawn from a public Axis Bank distributor sheet (May 2024) and the PRD; reward rates are **approximate estimates** for demonstration. Verify against live Axis Bank T&Cs before any real use. Not affiliated with or endorsed by Axis Bank or Freecharge.
