// src/components/CompanyLogo.tsx
import React from "react";

interface Props {
  name: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap: Record<NonNullable<Props["size"]>, string> = {
  sm: "w-8 h-8 text-[10px]",
  md: "w-11 h-11 text-xs",
  lg: "w-14 h-14 text-sm",
};

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

export const CompanyLogo: React.FC<Props> = ({
  name,
  logoUrl,
  size = "sm",
  className = "",
}) => {
  const [hasError, setHasError] = React.useState(false);

  const showFallback = !logoUrl || hasError;

  if (showFallback) {
    return (
      <div
        className={`
          ${sizeMap[size]}
          rounded-xl
          bg-slate-100
          border border-slate-200
          flex items-center justify-center
          font-semibold text-slate-600
          shrink-0
          ${className}
        `}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizeMap[size]}
        rounded-xl
        bg-white
        border border-slate-200
        flex items-center justify-center
        overflow-hidden
        shrink-0
        ${className}
      `}
    >
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="w-full h-full object-contain p-1.5"
        loading="lazy"
        onError={() => setHasError(true)} // 👈 switch to initials if logo fails
      />
    </div>
  );
};
