// Maps a user profile to one of the 4 K-Means spending personas.
//
// The real clustering happens offline (ml/cluster.py → clusters.json). In the
// browser we don't re-run scikit-learn; we use a lightweight heuristic to pick
// the nearest persona, then read the real cluster sizes from clusters.json to
// power the "you match X% of users like you" social-proof chart.

import clustersData from "@/data/clusters.json";

export type PersonaMatch = {
  persona: string;
  confidence: number; // 0–100
  /** Share of the dataset in the matched persona's cluster (0–1). */
  matchedShare: number;
  /** All cluster sizes, for the persona chart. */
  clusterSizes: Record<string, number>;
};

type ProfileInput = {
  monthlyIncome: number;
  topCategories: { name: string; monthlySpend: number }[];
};

export function matchPersona(profile: ProfileInput): PersonaMatch {
  const income = profile.monthlyIncome;
  const totalSpend = profile.topCategories.reduce(
    (s, c) => s + c.monthlySpend,
    0,
  );
  const topSpend = profile.topCategories[0]?.monthlySpend ?? 0;

  // Behavioural signal: how much of spend is "essentials" (bills/fuel/groceries).
  const essentials = profile.topCategories
    .filter((c) => ["utilities", "fuel", "groceries"].includes(c.name))
    .reduce((s, c) => s + c.monthlySpend, 0);
  const essentialsShare = totalSpend > 0 ? essentials / totalSpend : 0;

  let persona: string;
  if (income < 30000) {
    persona = "First-Timer";
  } else if (income >= 150000 || (income >= 80000 && totalSpend >= 20000)) {
    persona = "On-the-Go Professional";
  } else if (essentialsShare >= 0.6) {
    persona = "Bill Payer";
  } else if (income >= 45000 && totalSpend >= 6000) {
    persona = "Digital Native";
  } else {
    persona = "Bill Payer";
  }

  const clusterSizes = clustersData.cluster_sizes as Record<string, number>;
  const matchedShare = clusterSizes[persona] ?? 0;

  // Confidence blends income fit and spend signal, capped at 95%.
  const confidence = Math.min(
    95,
    Math.round(
      62 + Math.min(income / 100000, 1) * 25 + Math.min(topSpend / 10000, 1) * 8,
    ),
  );

  return { persona, confidence, matchedShare, clusterSizes };
}
