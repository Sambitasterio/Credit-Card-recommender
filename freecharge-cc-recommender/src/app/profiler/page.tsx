"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Utensils,
  ShoppingBag,
  Fuel,
  Plane,
  UtensilsCrossed,
  Film,
  Zap,
  ShoppingCart,
  ChevronLeft,
  ArrowRight,
  Briefcase,
  User,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { saveProfile } from "@/lib/session";
import type { UserProfile } from "@/lib/scorer";

type EmploymentType = UserProfile["employmentType"];

const CATEGORY_OPTIONS: { name: string; label: string; Icon: LucideIcon }[] = [
  { name: "food", label: "Food delivery", Icon: Utensils },
  { name: "shopping", label: "Shopping", Icon: ShoppingBag },
  { name: "fuel", label: "Fuel", Icon: Fuel },
  { name: "travel", label: "Travel", Icon: Plane },
  { name: "dining", label: "Dining out", Icon: UtensilsCrossed },
  { name: "entertainment", label: "Entertainment", Icon: Film },
  { name: "utilities", label: "Bills & utilities", Icon: Zap },
  { name: "groceries", label: "Groceries", Icon: ShoppingCart },
];

const EMPLOYMENT_OPTIONS: { value: EmploymentType; label: string; Icon: LucideIcon }[] =
  [
    { value: "salaried", label: "Salaried", Icon: Briefcase },
    { value: "self-employed", label: "Self-employed", Icon: User },
    { value: "student", label: "Student", Icon: GraduationCap },
  ];

const TOTAL_STEPS = 4;

export default function Profiler() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [income, setIncome] = useState(50000);
  const [categories, setCategories] = useState<string[]>([]);
  const [employment, setEmployment] = useState<EmploymentType | null>(null);
  const [hasCard, setHasCard] = useState<boolean | null>(null);

  function toggleCategory(name: string) {
    setCategories((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : prev.length < 3
          ? [...prev, name]
          : prev,
    );
  }

  const canAdvance =
    (step === 1) ||
    (step === 2 && categories.length >= 1) ||
    (step === 3 && employment !== null) ||
    (step === 4 && hasCard !== null);

  function submit() {
    // Manual users don't type amounts — estimate spend per category as a share
    // of income (≈30% discretionary, split across chosen categories).
    const perCategory = Math.round((income * 0.3) / categories.length);
    const profile: UserProfile = {
      monthlyIncome: income,
      topCategories: categories.map((name) => ({
        name,
        monthlySpend: perCategory,
      })),
      hasExistingCard: hasCard ?? false,
      employmentType: employment ?? "salaried",
    };
    saveProfile(profile);
    router.push("/recommendation");
  }

  function next() {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else submit();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col px-6 py-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
          <button
            onClick={() => (step > 1 ? setStep((s) => s - 1) : router.push("/"))}
            className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-slate-700"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <span>
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-brand-500 transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div key={step} className="flex-1 animate-fade-in-up">
        {/* Step 1 — income */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              What's your monthly income?
            </h2>
            <p className="mt-1 text-slate-500">
              Helps us show cards you'll actually qualify for.
            </p>
            <div className="mt-10 text-center">
              <span className="text-4xl font-extrabold text-brand-600">
                ₹{income.toLocaleString("en-IN")}
              </span>
              <span className="text-slate-400">/month</span>
            </div>
            <input
              type="range"
              min={15000}
              max={300000}
              step={5000}
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="mt-8 w-full accent-brand-600"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>₹15K</span>
              <span>₹3L+</span>
            </div>
          </div>
        )}

        {/* Step 2 — categories */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Where do you spend most?
            </h2>
            <p className="mt-1 text-slate-500">Pick up to 3 categories.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {CATEGORY_OPTIONS.map(({ name, label, Icon }) => {
                const active = categories.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleCategory(name)}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${active ? "text-brand-600" : "text-slate-400"}`}
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3 — employment */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              How do you earn?
            </h2>
            <p className="mt-1 text-slate-500">Used for eligibility checks.</p>
            <div className="mt-6 space-y-3">
              {EMPLOYMENT_OPTIONS.map(({ value, label, Icon }) => {
                const active = employment === value;
                return (
                  <button
                    key={value}
                    onClick={() => setEmployment(value)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${active ? "text-brand-600" : "text-slate-400"}`}
                    />
                    <span className="font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4 — existing card */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Do you already have a credit card?
            </h2>
            <p className="mt-1 text-slate-500">
              First-timers get cards built for new credit journeys.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { v: true, label: "Yes, I do" },
                { v: false, label: "No, this is my first" },
              ].map(({ v, label }) => {
                const active = hasCard === v;
                return (
                  <button
                    key={String(v)}
                    onClick={() => setHasCard(v)}
                    className={`rounded-xl border p-5 text-center font-medium transition ${
                      active
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={next}
        disabled={!canAdvance}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {step === TOTAL_STEPS ? "See my recommendation" : "Continue"}
        <ArrowRight className="h-5 w-5" />
      </button>
    </main>
  );
}
