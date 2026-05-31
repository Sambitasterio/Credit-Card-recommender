"use client";

import { ShieldCheck, Check, X, Smartphone } from "lucide-react";

export default function ConsentScreen({
  open,
  onProceed,
  onClose,
}: {
  open: boolean;
  onProceed: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center">
      <div className="w-full max-w-md animate-scale-in rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              We read your spends, not your secrets
            </h2>
            <p className="text-sm text-slate-500">
              Takes ~10 seconds. You stay in control.
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
          <div className="flex gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <p className="text-slate-700">
              <span className="font-semibold">What we use:</span> your last 90
              days of UPI &amp; card transaction patterns to spot spending
              categories.
            </p>
          </div>
          <div className="flex gap-3">
            <X className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <p className="text-slate-700">
              <span className="font-semibold">What we never do:</span> store raw
              messages or share them. Only spend categories leave your device.
            </p>
          </div>
          <div className="flex gap-3">
            <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <p className="text-slate-700">
              <span className="font-semibold">Soft check only:</span> no impact
              on your CIBIL score.
            </p>
          </div>
        </div>

        <button
          onClick={onProceed}
          className="mt-5 w-full rounded-xl bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700"
        >
          Allow &amp; Continue
        </button>
        <button
          onClick={onClose}
          className="mt-2 w-full rounded-xl py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
