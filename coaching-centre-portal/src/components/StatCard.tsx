import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <div className="zinc-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-zinc-950">
          {value}
        </div>

        {(subtitle || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
            {trend && (
              <span className="font-medium inline-flex items-center gap-1 text-zinc-700">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    trend.positive ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                {trend.value}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
