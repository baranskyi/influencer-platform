"use client";

import { cn } from "@/lib/utils";
import type { Platform } from "@/types/database";
import { trackEvent } from "@/lib/analytics";

const FILTERS: { value: Platform | "all"; label: string; color: string }[] = [
  { value: "all", label: "All", color: "bg-white/20 text-foreground" },
  { value: "instagram", label: "Instagram", color: "bg-coral/20 text-coral" },
  { value: "tiktok", label: "TikTok", color: "bg-lavender/20 text-lavender" },
  { value: "youtube", label: "YouTube", color: "bg-mint/20 text-mint" },
  { value: "multi", label: "Multi", color: "bg-orange/20 text-orange" },
];

type PlatformFilterProps = {
  value: Platform | "all";
  onChange: (value: Platform | "all") => void;
};

export function PlatformFilter({ value, onChange }: PlatformFilterProps) {
  return (
    <div className="flex gap-1.5">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => { onChange(filter.value); trackEvent({ action: "calendar_platform_filter", label: filter.value }); }}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-all",
            value === filter.value
              ? cn(filter.color, "ring-1 ring-current/30")
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
