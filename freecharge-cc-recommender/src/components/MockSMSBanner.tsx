import { Smartphone } from "lucide-react";

export default function MockSMSBanner({
  label,
  smsSamples,
}: {
  label: string;
  smsSamples: string[];
}) {
  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-700">
        <Smartphone className="h-4 w-4" />
        Demo Mode — simulated SMS analysed for {label}
      </div>
      <ul className="space-y-1.5">
        {smsSamples.map((s, i) => (
          <li
            key={i}
            className="rounded-lg bg-white px-3 py-2 text-sm text-slate-600 shadow-sm"
          >
            {s}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-brand-700/70">
        In the live product these signals are parsed on-device from your real
        transaction SMS.
      </p>
    </div>
  );
}
