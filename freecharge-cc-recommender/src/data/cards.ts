// Axis Bank / Freecharge credit-card catalog.
//
// Card facts (fees, min income, benefits, reward structure) are sourced from the
// Axis Bank distributor feature sheet (Axis.pdf, valid May 2024) and the PRD's
// Freecharge co-branded notes. Reward RATES are expressed as an approximate
// "% value back" per spend category (EDGE/CV points converted to rupee value,
// e.g. 5 EDGE points = ₹1 per the source doc) so the scorer can estimate rewards.
// These are prototype estimates — verify against live Axis T&Cs before production.

export type SpendCategory =
  | "food"
  | "shopping"
  | "fuel"
  | "travel"
  | "dining"
  | "entertainment"
  | "utilities"
  | "groceries"
  | "general";

export type CardTier = "entry" | "premium" | "super-premium";

export type Card = {
  id: string;
  name: string;
  tier: CardTier;
  /** Headline benefit type, for the display badge (e.g. "Shopping", "Travel"). */
  benefitType: string;
  joiningFee: number; // INR
  annualFee: number; // INR
  /** Annual spend (INR) needed to waive the renewal fee. 0 = no waiver offered. */
  feeWaiverSpend: number;
  minIncome: number; // monthly, INR
  minCibil: number;
  topBenefits: string[];
  /** Categories this card rewards, most-rewarded first (index 0 = headline). */
  spendCategories: SpendCategory[];
  /** category -> approximate % value back. Always includes "general". */
  rewardRates: Record<string, number>;
  /** Tailwind gradient classes for the card art. */
  imageColor: string;
  applyUrl: string;
};

export const cards: Card[] = [
  // ───────────────────────── Freecharge co-branded (PRD) ─────────────────────────
  {
    id: "freecharge",
    name: "Axis Bank Freecharge Credit Card",
    tier: "entry",
    benefitType: "Everyday",
    joiningFee: 250,
    annualFee: 250,
    feeWaiverSpend: 50000,
    minIncome: 15000,
    minCibil: 650,
    topBenefits: [
      "EDGE Reward Points on all spends",
      "Benefits on Freecharge bill payments & recharges",
      "Instant virtual card on the app",
    ],
    spendCategories: ["shopping", "utilities", "general"],
    rewardRates: { shopping: 2, utilities: 2, general: 1 },
    imageColor: "from-orange-500 to-amber-600",
    applyUrl:
      "https://www.axisbank.com/retail/cards/credit-card/axis-bank-freecharge-credit-card",
  },
  {
    id: "freecharge-plus",
    name: "Axis Bank Freecharge Plus Credit Card",
    tier: "entry",
    benefitType: "Cashback",
    joiningFee: 0,
    annualFee: 350,
    feeWaiverSpend: 50000,
    minIncome: 20000,
    minCibil: 680,
    topBenefits: [
      "5% cashback on Freecharge spends",
      "2% cashback on Ola & Uber",
      "Cashback on utility & recharge payments",
    ],
    spendCategories: ["utilities", "travel", "general"],
    rewardRates: { utilities: 5, travel: 2, general: 1 },
    imageColor: "from-orange-600 to-red-600",
    applyUrl:
      "https://www.axisbank.com/retail/cards/credit-card/axis-bank-freecharge-plus-credit-card",
  },

  // ───────────────────────── Axis entry-level ─────────────────────────
  {
    id: "axis-neo",
    name: "Axis Bank Neo Credit Card",
    tier: "entry",
    benefitType: "Food & Lifestyle",
    joiningFee: 250,
    annualFee: 250,
    feeWaiverSpend: 0,
    minIncome: 15000,
    minCibil: 650,
    topBenefits: [
      "40% off up to ₹120 on Zomato (twice/month)",
      "10% off on Blinkit & BookMyShow",
      "100% cashback up to ₹300 on first utility bill",
    ],
    spendCategories: ["food", "entertainment", "utilities", "general"],
    rewardRates: { food: 5, entertainment: 5, utilities: 3, general: 1 },
    imageColor: "from-violet-500 to-fuchsia-600",
    applyUrl:
      "https://www.axisbank.com/retail/cards/credit-card/axis-bank-neo-credit-card",
  },
  {
    id: "axis-flipkart",
    name: "Flipkart Axis Bank Credit Card",
    tier: "entry",
    benefitType: "Shopping",
    joiningFee: 500,
    annualFee: 500,
    feeWaiverSpend: 350000,
    minIncome: 15000,
    minCibil: 670,
    topBenefits: [
      "5% cashback on Flipkart",
      "4% cashback on Swiggy, Uber, PVR, Cleartrip",
      "1.5% unlimited cashback on all other spends",
    ],
    spendCategories: ["shopping", "food", "travel", "general"],
    rewardRates: { shopping: 5, food: 4, travel: 4, general: 1.5 },
    imageColor: "from-blue-600 to-indigo-700",
    applyUrl:
      "https://www.axisbank.com/retail/cards/credit-card/flipkart-axis-bank-credit-card",
  },
  {
    id: "axis-indianoil",
    name: "IndianOil Axis Bank Credit Card",
    tier: "entry",
    benefitType: "Fuel",
    joiningFee: 500,
    annualFee: 500,
    feeWaiverSpend: 50000,
    minIncome: 15000,
    minCibil: 670,
    topBenefits: [
      "4% value back on fuel at IndianOil outlets",
      "1% fuel surcharge waiver (₹400–₹4,000)",
      "EDGE Reward Points on all other spends",
    ],
    spendCategories: ["fuel", "general"],
    rewardRates: { fuel: 4, general: 1 },
    imageColor: "from-amber-500 to-orange-700",
    applyUrl:
      "https://www.axisbank.com/retail/cards/credit-card/indianoil-axis-bank-credit-card",
  },
  {
    id: "axis-myzone",
    name: "Axis Bank My Zone Credit Card",
    tier: "entry",
    benefitType: "Entertainment",
    joiningFee: 500,
    annualFee: 500,
    feeWaiverSpend: 0,
    minIncome: 15000,
    minCibil: 690,
    topBenefits: [
      "Buy-one-get-one on movie tickets",
      "Up to 15% off dining at partner restaurants",
      "Discounts on Swiggy & OTT subscriptions",
    ],
    spendCategories: ["entertainment", "dining", "food", "general"],
    rewardRates: { entertainment: 5, dining: 4, food: 4, general: 1 },
    imageColor: "from-pink-500 to-rose-600",
    applyUrl:
      "https://www.axisbank.com/retail/cards/credit-card/my-zone-credit-card",
  },

  // ───────────────────────── Axis premium / super-premium ─────────────────────────
  {
    id: "axis-privilege",
    name: "Axis Bank Privilege Credit Card",
    tier: "premium",
    benefitType: "Rewards",
    joiningFee: 1500,
    annualFee: 1500,
    feeWaiverSpend: 250000,
    minIncome: 40000,
    minCibil: 720,
    topBenefits: [
      "12,500 EDGE Reward Points welcome benefit",
      "Accelerated EDGE points on retail shopping",
      "Complimentary domestic lounge access",
    ],
    spendCategories: ["shopping", "dining", "groceries", "general"],
    rewardRates: { shopping: 2, dining: 2, groceries: 2, general: 1.5 },
    imageColor: "from-slate-700 to-slate-900",
    applyUrl:
      "https://www.axisbank.com/retail/cards/credit-card/axis-bank-privilege-credit-card",
  },
  {
    id: "axis-vistara-signature",
    name: "Axis Bank Vistara Signature Credit Card",
    tier: "super-premium",
    benefitType: "Travel",
    joiningFee: 3000,
    annualFee: 3000,
    feeWaiverSpend: 0,
    minIncome: 50000,
    minCibil: 750,
    topBenefits: [
      "Complimentary Premium Economy ticket each year",
      "Club Vistara Silver membership + CV Points",
      "Up to 8 domestic lounge visits per year",
    ],
    spendCategories: ["travel", "dining", "general"],
    rewardRates: { travel: 6, dining: 3, general: 2 },
    imageColor: "from-purple-700 to-indigo-900",
    applyUrl:
      "https://www.axisbank.com/retail/cards/credit-card/axis-bank-vistara-signature-credit-card",
  },
];

export function getCardById(id: string): Card | undefined {
  return cards.find((c) => c.id === id);
}
