"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Clock } from "lucide-react";
import ConsentScreen from "@/components/ConsentScreen";
import { demoProfileList } from "@/data/mockSMS";
import { saveProfile } from "@/lib/session";
import type { UserProfile } from "@/lib/scorer";

export default function Home() {
  const router = useRouter();
  const [showConsent, setShowConsent] = useState(false);

  function startDemo(key: string) {
    const sms = demoProfileList.find((p) => p.key === key);
    if (!sms) return;
    const profile: UserProfile = {
      monthlyIncome: sms.monthlyIncome,
      topCategories: sms.topCategories,
      hasExistingCard: sms.hasExistingCard,
      employmentType: sms.employmentType,
    };
    saveProfile(profile, sms.key);
    router.push("/recommendation");
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Zap className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-slate-900">
            Freecharge<span className="text-brand-600">Biz</span>
          </span>
        </div>
        <span className="text-sm font-medium text-slate-400">
          in partnership with{" "}
          <span className="font-semibold text-slate-500">Axis Bank</span>
        </span>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
          <Sparkles className="h-4 w-4" /> AI-powered card matching
        </span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Find your <span className="text-brand-600">perfect</span> credit card
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          We read how you actually spend and match you to the right Axis Bank
          card — with the reasons why, in under 60 seconds.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => setShowConsent(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:w-auto"
          >
            Get my card match <ArrowRight className="h-5 w-5" />
          </button>
          <a
            href="#demo"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            Try a sample profile
          </a>
        </div>

        <div className="mt-6 flex items-center justify-center gap-5 text-sm text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> ~60 seconds
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> No impact on credit score
          </span>
        </div>
      </section>

      {/* Demo personas */}
      <section id="demo" className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Or explore a sample profile
          </h2>
          <p className="mt-1 text-slate-500">
            See an instant recommendation from simulated SMS data.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demoProfileList.map((p) => (
            <button
              key={p.key}
              onClick={() => startDemo(p.key)}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-brand-300 hover:shadow-md"
            >
              <p className="font-semibold text-slate-900">
                {p.label.split(" — ")[0]}
              </p>
              <p className="text-sm text-brand-600">
                {p.label.split(" — ")[1]}
              </p>
              <p className="mt-2 text-sm text-slate-500">{p.blurb}</p>
              <p className="mt-3 text-sm text-slate-400">
                ₹{p.monthlyIncome.toLocaleString("en-IN")}/mo
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2">
                See match <ArrowRight className="h-4 w-4 transition-all" />
              </span>
            </button>
          ))}
        </div>
      </section>

      <ConsentScreen
        open={showConsent}
        onProceed={() => router.push("/profiler")}
        onClose={() => setShowConsent(false)}
      />
    </main>
  );
}
