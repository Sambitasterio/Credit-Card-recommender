<div align="center">

# 💳 AI-Powered Credit Card Recommendation Engine
### FreechargeBiz × Axis Bank

**Match any user to their _perfect_ credit card from how they actually spend — with a personalised, explainable reason — in under 60 seconds.**

<br/>

### 🔗 [**▶ LIVE DEMO**](https://credit-card-recommender-zeta.vercel.app/)

<br/>

<img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
<img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white" />
<img alt="OpenAI" src="https://img.shields.io/badge/OpenAI-gpt--4o--mini-412991?logo=openai&logoColor=white" />
<img alt="scikit-learn" src="https://img.shields.io/badge/scikit--learn-KMeans-f7931e?logo=scikitlearn&logoColor=white" />
<img alt="Deployed on Vercel" src="https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel" />

</div>

---

## 📑 Table of contents

- [The problem](#-the-problem)
- [The solution](#-the-solution)
- [Try it in 30 seconds](#-try-it-in-30-seconds)
- [Key features](#-key-features)
- [How it works](#-how-it-works)
- [The recommendation engine](#-the-recommendation-engine)
- [Tech stack](#-tech-stack)
- [Project structure](#-project-structure)
- [Run it locally](#-run-it-locally)
- [Roadmap](#-roadmap)
- [Disclaimer](#-disclaimer)

---

## 🎯 The problem

India has **118.63M active credit cards** and **₹23.62T** in annual card spend — yet card *discovery* is broken:

- **Information overload** — 50+ variants with jargon-heavy, overlapping benefits.
- **Generic recommendations** — ranked by issuer commission, not personal fit.
- **63–68% drop-off** on fintech onboarding forms.
- **Post-selection regret** — e.g., a travel card for someone who never flies.

## 💡 The solution

An engine that reads a user's **financial footprint** (spending categories + income proxy) and maps it to the best-fit Axis Bank / Freecharge card — then explains *why it fits you* using your real numbers:

> _"With ₹6,000/month on food, enjoy 40% off on Zomato twice a month — saving ₹2,880 a year."_

The recommendation is made by a **transparent, rule-based engine** (explainable — essential in regulated fintech). AI is used **only** to turn the winning card + your numbers into friendly copy, with a deterministic fallback so it never breaks.

---

## ⚡ Try it in 30 seconds

1. Open the **[live demo](https://credit-card-recommender-zeta.vercel.app/)**.
2. Click a **sample profile** for an instant recommendation:

| Persona | Profile | Gets matched to |
|---------|---------|-----------------|
| **Riya** — Digital Millennial | ₹85K/mo · food, shopping, OTT | Axis Neo |
| **Ramesh** — Salaried Professional | ₹90K/mo · groceries, fuel, bills | Freecharge Plus / IndianOil |
| **Ananya** — First-Timer | ₹28K/mo · light online spends | Flipkart _(entry-level path)_ |
| **Vivek** — Business Traveler | ₹2.5L/mo · flights, hotels, dining | Vistara Signature |

3. Or hit **"Get my card match"** to walk the guided 4-step profiler.

---

## ✨ Key features

- **Two elegant data-collection paths** — a 4-step visual profiler *or* a one-tap sample-profile demo (the prototype stand-in for on-device SMS parsing).
- **Transparent consent screen** — states what's read vs. never shared, and that the check doesn't affect your CIBIL score.
- **Explainable scoring** — every card gets a 0–100 match score across 5 weighted factors.
- **Personalised AI rationale** — 3 spend-linked reasons per recommendation, with a template fallback.
- **Net-benefit math** — estimated yearly rewards − annual fee, shown transparently.
- **Social-proof persona chart** — from **real K-Means clustering** of an 8,950-customer dataset.
- **First-timer path** — thin-file users routed to entry-level cards with encouraging, never rejection-framed, copy.
- **Mobile-first**, orange/white FreechargeBiz theme.

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
                                   POST /api/recommend  (serverless)
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
               →  src/data/clusters.json  (baked into the app)
```

---

## 🧮 The recommendation engine

Each eligible card is scored **0–100**:

| Factor | Weight | What it measures |
|--------|:------:|------------------|
| Spend-category match | 35% | Overlap between the user's top spends and the card's reward categories |
| Income headroom | 25% | How comfortably the user clears the minimum income |
| Estimated reward | 20% | Rupee value earned per month given the user's spends |
| Fee-to-benefit | 12% | Whether the fee is waived or out-earned by rewards |
| Lifestyle bonus | 8% | Card's headline category = the user's #1 spend |

The top score becomes the **primary** card; the next two with **distinct headline categories** become alternates. Thin-file users are restricted to entry-level cards.

> **Net Benefit Score = Estimated Annual Rewards − Annual Fee** — powers the "you'd earn ₹X" line.

---

## 🛠️ Tech stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| AI rationale | OpenAI `gpt-4o-mini` (JSON mode) + deterministic fallback |
| ML clustering | Python · scikit-learn (K-Means), offline → static JSON |
| Hosting | Vercel (auto-deploys on push) |

---

## 📂 Project structure

```
freecharge-cc-recommender/          # the Next.js app (Vercel root directory)
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing (hero + demo picker)
│   │   ├── profiler/page.tsx        # 4-step data collection
│   │   ├── recommendation/page.tsx  # Result: card, reasons, chart, alternates
│   │   └── api/recommend/route.ts   # Scoring + OpenAI rationale + fallback
│   ├── components/                  # ConsentScreen, CardDisplay, PersonaChart, MockSMSBanner
│   ├── data/                        # cards.ts (real Axis data) · mockSMS.ts · clusters.json
│   └── lib/                         # scorer.ts · personaMatcher.ts · session.ts
└── ml/
    ├── cluster.py                   # one-time K-Means script
    └── requirements.txt
```

---

## 🚀 Run it locally

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>/freecharge-cc-recommender

npm install
cp .env.local.example .env.local      # then paste your OpenAI key (optional)
npm run dev
```

Open **http://localhost:3000**.

> Without an `OPENAI_API_KEY` the app still works — it generates the rationale from a deterministic template instead of the LLM.

**Regenerate the persona clusters (optional):**

```bash
pip install -r freecharge-cc-recommender/ml/requirements.txt
python freecharge-cc-recommender/ml/cluster.py   # reads CC GENERAL.csv, or synthesises data
```

Source dataset: *Credit Card Dataset for Clustering* (Kaggle, ~8,950 rows).

---

## 🗺️ Roadmap

- **v2** — DistilBERT/TF-IDF SMS classifier · XGBoost conversion model `P(apply | profile, card)` · live Axis card-catalog API · save & return · card comparison.
- **v3** — cross-issuer recommendations · Account Aggregator (AA) integration · progressive profiling · real-time offer injection.

---

## ⚠️ Disclaimer

A prototype built for a product assignment. Card details are drawn from a public Axis Bank distributor sheet (May 2024) and the PRD; reward rates are **approximate estimates** for demonstration. Verify against live Axis Bank T&Cs before any real use. Not affiliated with or endorsed by Axis Bank or Freecharge.

<div align="center">
<br/>

**[▶ Launch the live demo](https://credit-card-recommender-zeta.vercel.app/)**

</div>
