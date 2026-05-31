// Rule-based card scoring engine.
//
// Deterministic and explainable (no AI picks the card — the LLM only writes the
// rationale copy later). Produces a 0–100 match score per eligible card plus an
// estimated reward, then selects a primary card and up to 2 alternates with
// distinct headline categories. Thin-file users are routed to entry-level cards.

import { Card, cards } from "@/data/cards";

export type UserProfile = {
  monthlyIncome: number; // INR
  topCategories: { name: string; monthlySpend: number }[];
  hasExistingCard: boolean;
  employmentType: "salaried" | "self-employed" | "student";
};

export type ScoredCard = {
  card: Card;
  score: number; // 0–100 match score
  estimatedMonthlyReward: number; // INR
  estimatedAnnualReward: number; // INR
  effectiveAnnualFee: number; // INR (0 if waived by spend)
  netAnnualBenefit: number; // annual reward − effective fee
  reasons: string[]; // 3 spend-linked reasons (filled by the API route)
};

export type Recommendation = {
  primary: ScoredCard;
  alternatives: ScoredCard[];
  thinFile: boolean;
};

const rewardRate = (card: Card, category: string): number =>
  card.rewardRates[category] ?? card.rewardRates["general"] ?? 1;

/** Total estimated monthly reward (INR) for a card given the user's spends. */
function monthlyReward(card: Card, profile: UserProfile): number {
  return profile.topCategories.reduce(
    (sum, c) => sum + (c.monthlySpend * rewardRate(card, c.name)) / 100,
    0,
  );
}

/**
 * A "thin file" is someone with no existing card and modest income — the
 * prototype's stand-in for the PRD's thin-bureau path. They are routed to
 * entry-level cards and never shown rejection-framed copy.
 */
export function isThinFile(profile: UserProfile): boolean {
  return !profile.hasExistingCard && profile.monthlyIncome < 30000;
}

export function scoreCards(profile: UserProfile): ScoredCard[] {
  const userCategories = profile.topCategories.map((c) => c.name);
  const topCategory = profile.topCategories[0]?.name;
  const annualSpend =
    profile.topCategories.reduce((s, c) => s + c.monthlySpend, 0) * 12;

  const eligible = cards.filter((c) => profile.monthlyIncome >= c.minIncome);

  return eligible
    .map((card) => {
      // 1. Spend-category match (35%)
      const matchCount = userCategories.filter((cat) =>
        card.spendCategories.includes(cat as Card["spendCategories"][number]),
      ).length;
      const matchScore =
        (matchCount / Math.max(userCategories.length, 1)) * 35;

      // 2. Income headroom (25%) — comfortably above the minimum is good
      const headroom = Math.min(profile.monthlyIncome / card.minIncome - 1, 1);
      const headroomScore = Math.max(headroom, 0) * 25;

      // 3. Estimated reward (20%) — ₹500/mo reward = full marks
      const reward = monthlyReward(card, profile);
      const rewardScore = Math.min(reward / 500, 1) * 20;

      // 4. Fee-to-benefit (12%) — reward the fee being waived or out-earned
      const waived = card.feeWaiverSpend > 0 && annualSpend >= card.feeWaiverSpend;
      const effectiveAnnualFee = waived ? 0 : card.annualFee;
      const annualReward = reward * 12;
      let feeScore: number;
      if (effectiveAnnualFee === 0) feeScore = 12;
      else if (annualReward > 2 * card.annualFee) feeScore = 10;
      else if (annualReward > card.annualFee) feeScore = 7;
      else feeScore = 2;

      // 5. Lifestyle bonus (8%) — card's headline category is the user's #1 spend
      const lifestyleBonus =
        topCategory && card.spendCategories[0] === topCategory ? 8 : 0;

      const score = Math.min(
        Math.round(
          matchScore + headroomScore + rewardScore + feeScore + lifestyleBonus,
        ),
        100,
      );

      return {
        card,
        score,
        estimatedMonthlyReward: Math.round(reward),
        estimatedAnnualReward: Math.round(annualReward),
        effectiveAnnualFee,
        netAnnualBenefit: Math.round(annualReward - effectiveAnnualFee),
        reasons: [],
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Pick the primary card + up to 2 alternates. Alternates must have a different
 * headline category from the primary and from each other; if not enough distinct
 * options exist, fall back to the next best by score.
 */
export function recommend(profile: UserProfile): Recommendation | null {
  const scored = scoreCards(profile);
  if (scored.length === 0) return null;

  const thinFile = isThinFile(profile);
  const pool = thinFile
    ? scored.filter((s) => s.card.tier === "entry")
    : scored;
  const ranked = pool.length > 0 ? pool : scored;

  const primary = ranked[0];
  const usedCategories = new Set([primary.card.spendCategories[0]]);
  const alternatives: ScoredCard[] = [];

  for (const s of ranked.slice(1)) {
    const lead = s.card.spendCategories[0];
    if (!usedCategories.has(lead)) {
      alternatives.push(s);
      usedCategories.add(lead);
    }
    if (alternatives.length === 2) break;
  }

  // Top up if we couldn't find 2 distinct-category alternates.
  if (alternatives.length < 2) {
    for (const s of ranked.slice(1)) {
      if (!alternatives.includes(s)) alternatives.push(s);
      if (alternatives.length === 2) break;
    }
  }

  return { primary, alternatives, thinFile };
}
