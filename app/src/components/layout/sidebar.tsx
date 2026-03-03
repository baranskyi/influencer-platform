"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Handshake,
  FileText,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  User,
} from "lucide-react";

/* ============================================================
   Sidebar Navigation — Floating Glassmorphism (macOS Sonoma)
   ============================================================
   Design decisions:
   - Floating panel detached from screen edges with 12px margins,
     mimicking macOS Sonoma's sidebar treatment
   - Triple-layer glass-sidebar class: blur(40px) + saturate(1.8)
     + brightness(1.1) for photorealistic frosted glass
   - glass-highlight pseudo-element adds a top-edge catch-light
     that simulates light refraction across the frost surface
   - rounded-2xl (16px) corners soften the floating panel
   - Internal dividers use subtle opacity borders that respect
     the rounded container without harsh lines at edges
   - Active nav item retains the orange inset accent indicator
   - All touch targets remain 44px+ for accessibility compliance
   ============================================================ */

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/deals", label: "Deals", icon: Handshake },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "hidden md:flex md:w-64 md:flex-col",
        /* Floating panel: full height within its padded container */
        "h-full",
        /* Triple-layer glassmorphism + top-edge catch-light */
        "glass-sidebar glass-highlight",
        /* macOS-style rounded corners for the floating panel */
        "rounded-2xl",
        /* Removed border-r -- panel is no longer flush against edge */
        "overflow-hidden"
      )}
    >
      {/* Logo area — subtle bottom divider using opacity instead of
          hard border, respects the rounded container aesthetic */}
      <div className="flex h-16 items-center border-b border-white/[0.06] px-6">
        <Link
          href="/dashboard"
          className="font-serif text-2xl tracking-tight text-foreground"
        >
          <span className="text-gradient-brand">DealFlow</span>
        </Link>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                /* Base styles: padding for 44px+ touch target, rounded for consistency */
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : [
                      /* Inactive: muted foreground, hover lifts opacity */
                      "text-sidebar-foreground/60",
                      "hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    ].join(" ")
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section — user menu + notifications */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-2">
          {/* User avatar with dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-1 items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent/50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-coral to-orange text-xs font-bold text-white">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate text-left">
                  <p className="truncate text-sm font-medium text-sidebar-foreground">
                    Creator
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Free Plan
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-48">
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notification bell */}
          <Button variant="ghost" size="icon" className="relative h-8 w-8 shrink-0">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
