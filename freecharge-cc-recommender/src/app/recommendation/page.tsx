"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sparkles,
  Check,
  ArrowRight,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Award,
  RotateCcw,
} from "lucide-react";
import CardDisplay from "@/components/CardDisplay";
import PersonaChart from "@/components/PersonaChart";
import MockSMSBanner from "@/components/MockSMSBanner";
import { matchPersona, type PersonaMatch } from "@/lib/personaMatcher";
import { loadProfile } from "@/lib/session";
import { demoProfiles } from "@/data/mockSMS";
import type { ScoredCard, UserProfile } from "@/lib/scorer";

type RecResponse = {
  primary: ScoredCard;
  alternatives: ScoredCard[];
  thinFile: boolean;
  reasonsSource: "openai" | "fallback";
};

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

function matchLabel(score: number): string {
  if (score >= 85) return "Strong match";
  if (score >= 70) return "Great match";
  if (score >= 50) return "Good match";
  return "Fair match";
}

export default function Recommendation() {
  const router = useRouter();
  const [data, setData] = useState<RecResponse | null>(null);
  const [persona, setPersona] = useState<PersonaMatch | null>(null);
  const [demoKey, setDemoKey] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { profile, demoKey } = loadProfile();
    if (!profile) {
      router.replace("/");
      return;
    }
    setProfile(profile);
    setDemoKey(demoKey);
    setPersona(matchPersona(profile));

    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "Request failed");
        return res.json();
      })
      .then((json: RecResponse) => setData(json))
      .catch((e) => setError(e.message));
  }, [router]);

  // ---- Loading / error states ----
  if (error) {
    return (
      <Centered>
        <p className="text-slate-700">Something went wrong: {error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white"
        >
          Start over
        </button>
      </Centered>
    );
  }

  if (!data || !persona) {
    return (
      <Centered>
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        <p className="mt-4 font-medium text-slate-600">
          Analysing your spending…
        </p>
      </Centered>
    );
  }

  const { primary, alternatives, thinFile, reasonsSource } = data;
  const demo = demoKey ? demoProfiles[demoKey] : null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Zap className="h-4 w-4" />
          </span>
          <span className="font-bold text-slate-900">
            Freecharge<span className="text-brand-600">Biz</span>
          </span>
        </div>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <RotateCcw className="h-4 w-4" /> Start over
        </button>
      </div>

      {demo && (
        <div className="mb-6">
          <MockSMSBanner label={demo.label.split(" — ")[0]} smsSamples={demo.smsSamples} />
        </div>
      )}

      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
        Your best match
      </p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">
        {primary.card.name}
      </h1>

      {/* Primary card */}
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <div>
          <CardDisplay card={primary.card} />
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-brand-600 px-3 py-1 text-sm font-bold text-white">
              {primary.score}% · {matchLabel(primary.score)}
            </span>
            {reasonsSource === "openai" && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                <Sparkles className="h-3.5 w-3.5" /> Personalised by AI
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-brand-50 p-5">
          <p className="text-sm text-slate-500">You could earn about</p>
          <p className="text-3xl font-extrabold text-brand-600">
            {inr(primary.estimatedMonthlyReward)}
            <span className="text-base font-semibold text-slate-400">
              /month
            </span>
          </p>
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <p className="flex items-center justify-between">
              <span>Est. yearly rewards</span>
              <span className="font-semibold tabular-nums">
                {inr(primary.estimatedAnnualReward)}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span>Annual fee</span>
              <span className="font-semibold tabular-nums">
                {primary.effectiveAnnualFee === 0
                  ? "Waived"
                  : inr(primary.card.annualFee)}
              </span>
            </p>
            <p className="flex items-center justify-between border-t border-brand-200 pt-1 text-slate-900">
              <span className="font-semibold">Net benefit / year</span>
              <span className="font-bold tabular-nums text-brand-700">
                {inr(primary.netAnnualBenefit)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Why this card */}
      <div className="mt-6 rounded-2xl border border-slate-200 p-5">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <Award className="h-5 w-5 text-brand-600" /> Why this card for you
        </h2>
        <ul className="mt-3 space-y-2.5">
          {primary.reasons.map((r, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-slate-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {thinFile && (
        <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm text-green-800">
          <span className="font-semibold">Great starting point.</span> This card
          is built for first-time users — use it well and you'll be eligible for
          premium cards within a year.
        </div>
      )}

      <a
        href={primary.card.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 font-semibold text-white transition hover:bg-brand-700"
      >
        Apply on Axis Bank <ArrowUpRight className="h-5 w-5" />
      </a>
      <p className="mt-2 text-center text-xs text-slate-400">
        You'll be taken to the official Axis Bank application.
      </p>

      {/* Persona chart */}
      <div className="mt-8 rounded-2xl border border-slate-200 p-5">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <TrendingUp className="h-5 w-5 text-brand-600" /> Where you fit
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          You're a{" "}
          <span className="font-semibold text-slate-900">{persona.persona}</span>{" "}
          — matching {(persona.matchedShare * 100).toFixed(1)}% of users with
          similar spending.
        </p>
        <div className="mt-4">
          <PersonaChart
            clusterSizes={persona.clusterSizes}
            matchedPersona={persona.persona}
          />
        </div>
      </div>

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-slate-900">Other options for you</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {alternatives.map((alt) => (
              <div
                key={alt.card.id}
                className="flex flex-col rounded-2xl border border-slate-200 p-4"
              >
                <CardDisplay card={alt.card} compact />
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    {alt.card.name
                      .replace("Axis Bank ", "")
                      .replace(" Credit Card", "")}
                  </p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    {alt.score}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {alt.card.topBenefits[0]}
                </p>
                <a
                  href={alt.card.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2"
                >
                  Apply <ArrowRight className="h-4 w-4 transition-all" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {children}
    </main>
  );
}
