import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { recommend, ScoredCard, UserProfile } from "@/lib/scorer";

// The OpenAI SDK needs the Node runtime; force dynamic so it never gets cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gpt-4o-mini";
const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

/** Basic shape guard for the incoming profile. */
function isValidProfile(p: unknown): p is UserProfile {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  return (
    typeof o.monthlyIncome === "number" &&
    Array.isArray(o.topCategories) &&
    typeof o.hasExistingCard === "boolean"
  );
}

/** Deterministic, spend-linked reasons used when OpenAI is unavailable. */
function fallbackReasons(primary: ScoredCard, profile: UserProfile): string[] {
  const { card } = primary;
  const top = profile.topCategories[0];
  const reasons: string[] = [];

  if (top) {
    const rate = card.rewardRates[top.name] ?? card.rewardRates["general"] ?? 1;
    const back = (top.monthlySpend * rate) / 100;
    reasons.push(
      `You spend about ${inr(top.monthlySpend)}/month on ${top.name} — ${card.name} rewards that at ~${rate}%, roughly ${inr(back)} back a month.`,
    );
  }

  if (primary.effectiveAnnualFee === 0) {
    reasons.push(
      `The ${inr(card.annualFee)} annual fee is effectively waived at your spend level, so your ≈${inr(primary.estimatedAnnualReward)} of yearly rewards is pure upside.`,
    );
  } else {
    reasons.push(
      `You'd earn ≈${inr(primary.estimatedAnnualReward)} in rewards a year against a ${inr(card.annualFee)} fee — a net ${inr(primary.netAnnualBenefit)} in your favour.`,
    );
  }

  reasons.push(`Best perk for you: ${card.topBenefits[0]}.`);
  return reasons.slice(0, 3);
}

async function openAIReasons(
  primary: ScoredCard,
  profile: UserProfile,
): Promise<string[] | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  const spends = profile.topCategories
    .map((c) => `${inr(c.monthlySpend)}/month on ${c.name}`)
    .join(", ");

  const client = new OpenAI();
  const completion = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 320,
    temperature: 0.6,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a credit-card recommendation assistant for FreechargeBiz in India. " +
          "Write warm, concrete reasons that cite the user's real spend figures and rupee amounts. " +
          'Respond ONLY as JSON: {"reasons": ["...", "...", "..."]} with exactly 3 short strings (max ~160 chars each). No markdown.',
      },
      {
        role: "user",
        content: `Recommend and justify the "${primary.card.name}" (${primary.score}% match) for this user.
Monthly income: ${inr(profile.monthlyIncome)}
Top spends: ${spends}
Employment: ${profile.employmentType}
Estimated reward with this card: ${inr(primary.estimatedMonthlyReward)}/month (≈${inr(primary.estimatedAnnualReward)}/year)
Annual fee: ${inr(primary.card.annualFee)}${primary.effectiveAnnualFee === 0 ? " (waived at this spend)" : ""}
Card highlights: ${primary.card.topBenefits.join("; ")}

Each reason must reference a specific spend figure or benefit. Keep it concrete and encouraging.`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);
  const reasons = parsed?.reasons;
  if (
    Array.isArray(reasons) &&
    reasons.length >= 3 &&
    reasons.slice(0, 3).every((r) => typeof r === "string" && r.trim())
  ) {
    return reasons.slice(0, 3).map((r: string) => r.trim());
  }
  return null;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidProfile(body)) {
    return NextResponse.json(
      { error: "Invalid profile payload" },
      { status: 400 },
    );
  }
  const profile = body;

  const rec = recommend(profile);
  if (!rec) {
    return NextResponse.json(
      { error: "No eligible cards found for this profile" },
      { status: 404 },
    );
  }

  // Personalised copy with a guaranteed fallback.
  let reasons: string[];
  let reasonsSource: "openai" | "fallback";
  try {
    const ai = await openAIReasons(rec.primary, profile);
    if (ai) {
      reasons = ai;
      reasonsSource = "openai";
    } else {
      reasons = fallbackReasons(rec.primary, profile);
      reasonsSource = "fallback";
    }
  } catch (err) {
    console.error("OpenAI rationale failed, using fallback:", err);
    reasons = fallbackReasons(rec.primary, profile);
    reasonsSource = "fallback";
  }

  return NextResponse.json({
    primary: { ...rec.primary, reasons },
    alternatives: rec.alternatives,
    thinFile: rec.thinFile,
    reasonsSource,
  });
}
