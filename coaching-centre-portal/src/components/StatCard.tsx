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
  color?: "indigo" | "emerald" | "violet" | "amber" | "cyan" | "rose" | "blue" | "black" | "slate" | "gray";
}

const colorStyles: Record<string, { bg: string; icon: string; value: string; border: string }> = {
  indigo:  { bg: "bg-indigo-50",  icon: "bg-indigo-100 text-indigo-700 border border-indigo-200",  value: "text-indigo-700",  border: "border-indigo-100" },
  emerald: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-700 border border-emerald-200", value: "text-emerald-700", border: "border-emerald-100" },
  violet:  { bg: "bg-violet-50",  icon: "bg-violet-100 text-violet-700 border border-violet-200",  value: "text-violet-700",  border: "border-violet-100" },
  amber:   { bg: "bg-amber-50",   icon: "bg-amber-100 text-amber-700 border border-amber-200",     value: "text-amber-700",   border: "border-amber-100" },
  cyan:    { bg: "bg-cyan-50",    icon: "bg-cyan-100 text-cyan-700 border border-cyan-200",        value: "text-cyan-700",    border: "border-cyan-100" },
  rose:    { bg: "bg-rose-50",    icon: "bg-rose-100 text-rose-700 border border-rose-200",        value: "text-rose-700",    border: "border-rose-100" },
  blue:    { bg: "bg-blue-50",    icon: "bg-blue-100 text-blue-700 border border-blue-200",        value: "text-blue-700",    border: "border-blue-100" },
  black:   { bg: "bg-slate-900",  icon: "bg-white/10 text-white border border-white/20",           value: "text-white",       border: "border-slate-700" },
  slate:   { bg: "bg-slate-50",   icon: "bg-slate-100 text-slate-700 border border-slate-200",    value: "text-slate-700",   border: "border-slate-200" },
  gray:    { bg: "bg-slate-50",   icon: "bg-slate-100 text-slate-700 border border-slate-200",    value: "text-slate-700",   border: "border-slate-200" },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "indigo",
}: StatCardProps) {
  const style = colorStyles[color] || colorStyles.indigo;
  const isDark = color === "black";

  return (
    <div
      className={`relative rounded-2xl p-5 border overflow-hidden card-hover anim-count-up ${
        isDark
          ? "bg-slate-900 border-slate-700 text-white"
          : `bg-white border-slate-200`
      }`}
    >
      {/* Subtle tinted top-right orb */}
      <div
        className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20 blur-xl ${
          isDark ? "bg-indigo-400" : style.bg
        }`}
      />

      <div className="relative flex items-start justify-between">
        <span
          className={`text-[11px] font-bold uppercase tracking-widest ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {title}
        </span>
        <div className={`p-2 rounded-xl ${style.icon}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="relative mt-4">
        <div
          className={`text-2xl font-black tracking-tight ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {value}
        </div>

        {(subtitle || trend) && (
          <div className={`mt-1.5 flex items-center gap-2 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {trend && (
              <span
                className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-full text-[10px] ${
                  trend.positive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
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
