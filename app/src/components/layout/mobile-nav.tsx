"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Handshake,
  FileText,
  CalendarDays,
  BarChart3,
} from "lucide-react";

/* ============================================================
   Mobile Bottom Navigation — Glassmorphism
   ============================================================
   Design decisions:
   - Fixed at bottom, uses heavy glassmorphism for depth
   - 5 items max to maintain touch target sizes (44x44px min)
   - Active state uses orange accent color with a dot indicator
   - Icons are 20x20, labels are 10px for compact vertical space
   - Safe area padding for devices with home indicators
   ============================================================ */

const mobileNavItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/deals", label: "Deals", icon: Handshake },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/analytics", label: "Stats", icon: BarChart3 },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden",
        /* Glassmorphism bottom bar */
        "glass-heavy",
        "border-t border-border",
        /* Safe area for modern mobile devices */
        "pb-[env(safe-area-inset-bottom)]"
      )}
    >
      <div className="flex items-center justify-around py-1.5">
        {mobileNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                /* 44x44px minimum touch target */
                "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] transition-colors",
                isActive
                  ? "text-orange font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute -top-0.5 h-0.5 w-5 rounded-full bg-orange" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
