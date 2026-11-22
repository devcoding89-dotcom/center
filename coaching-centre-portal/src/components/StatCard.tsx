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
  color?: "navy" | "blue" | "emerald" | "slate" | "amber";
}

const colorStyles: Record<string, { iconBg: string; iconColor: string }> = {
  navy:    { iconBg: "bg-slate-900 text-white",     iconColor: "text-white" },
  blue:    { iconBg: "bg-blue-50 text-blue-700",    iconColor: "text-blue-700" },
  emerald: { iconBg: "bg-emerald-50 text-emerald-700", iconColor: "text-emerald-700" },
  slate:   { iconBg: "bg-slate-100 text-slate-700", iconColor: "text-slate-700" },
  amber:   { iconBg: "bg-amber-50 text-amber-700",   iconColor: "text-amber-700" },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
}: StatCardProps) {
  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs card-lift">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-extrabold tracking-tight text-slate-900">
          {value}
        </div>

        {(subtitle || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            {trend && (
              <span
                className={`font-semibold inline-flex items-center gap-0.5 ${
                  trend.positive ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {trend.positive ? "↑" : "↓"} {trend.value}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
