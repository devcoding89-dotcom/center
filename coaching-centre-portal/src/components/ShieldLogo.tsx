import React from "react";
import Link from "next/link";

interface ShieldLogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  showText?: boolean;
}

export function ShieldLogo({ size = "md", href = "/", showText = true }: ShieldLogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const content = (
    <div className="flex items-center gap-3 group">
      {/* Navy Shield with White Text & Gold Accents */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-sm transition-transform duration-200 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Shield Border (Gold) */}
          <path
            d="M50 5 L92 24 V65 C92 92 50 115 50 115 C50 115 8 92 8 65 V24 Z"
            fill="#0f172a"
            stroke="#d97706"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Inner Shield Inset (Navy) */}
          <path
            d="M50 13 L85 29 V64 C85 86 50 106 50 106 C50 106 15 86 15 64 V29 Z"
            fill="#0a192f"
            stroke="#eab308"
            strokeWidth="1.2"
            strokeOpacity="0.8"
          />
          {/* Gold Star / Laurel Accent */}
          <polygon
            points="50,22 53,29 60,30 55,35 56,42 50,38 44,42 45,35 40,30 47,29"
            fill="#f59e0b"
          />
          {/* Center Book / Quill Icon in Gold */}
          <path
            d="M36 50 C42 48 48 50 50 52 C52 50 58 48 64 50 V70 C58 68 52 70 50 72 C48 70 42 68 36 70 Z"
            fill="#d97706"
            opacity="0.9"
          />
          <path
            d="M50 52 V72"
            stroke="#0a192f"
            strokeWidth="1.5"
          />
          {/* White Shield Text */}
          <text
            x="50"
            y="84"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="9"
            fontWeight="900"
            letterSpacing="1.2"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            STOICS
          </text>
          <text
            x="50"
            y="94"
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize="6"
            fontWeight="700"
            letterSpacing="1"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            INSTITUTE
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 tracking-tight leading-none text-base sm:text-lg">
            Stoics Institute
          </span>
          <span className="text-[11px] font-semibold text-slate-500 tracking-normal mt-0.5">
            Educational Institute & Services
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
