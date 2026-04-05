"use client";

interface CreditsBadgeProps {
  remaining: number;
  total: number;
}

export default function CreditsBadge({ remaining, total }: CreditsBadgeProps) {
  const percentage = (remaining / total) * 100;
  const isLow = percentage < 20;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-surface-light rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isLow ? "bg-error" : "bg-gold"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`text-sm font-medium ${isLow ? "text-error" : "text-muted"}`}>
        {remaining}/{total}
      </span>
    </div>
  );
}
