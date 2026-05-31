import { CreditCard, Wifi } from "lucide-react";
import type { Card } from "@/data/cards";

export default function CardDisplay({
  card,
  compact = false,
}: {
  card: Card;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative flex w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${card.imageColor} text-white shadow-lg ${
        compact ? "aspect-[16/9] p-4" : "aspect-[16/10] p-5"
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest opacity-90">
          Axis Bank
        </span>
        <Wifi className="h-5 w-5 rotate-90 opacity-80" />
      </div>

      <div className="h-7 w-10 rounded-md bg-white/30 ring-1 ring-white/40" />

      <div>
        <p className={`font-semibold ${compact ? "text-sm" : "text-lg"}`}>
          {card.name.replace("Axis Bank ", "").replace(" Credit Card", "")}
        </p>
        <p className="text-xs opacity-90">{card.benefitType}</p>
      </div>

      <CreditCard className="absolute -bottom-6 -right-6 h-24 w-24 opacity-10" />
    </div>
  );
}
