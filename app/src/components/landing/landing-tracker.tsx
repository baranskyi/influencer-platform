"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function LandingTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("[data-track]");
      if (!target) return;
      const track = (target as HTMLElement).dataset.track!;
      const label = (target as HTMLElement).dataset.trackLabel ?? track;

      switch (track) {
        case "nav":
          trackEvent({ action: "landing_nav_click", label });
          break;
        case "cta":
          trackEvent({ action: "landing_cta_click", label });
          break;
        case "pricing":
          trackEvent({ action: "landing_pricing_click", label });
          break;
        case "faq":
          trackEvent({ action: "landing_faq_toggle", label });
          break;
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
