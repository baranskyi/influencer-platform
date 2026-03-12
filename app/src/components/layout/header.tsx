"use client";

import { useRouter } from "next/navigation";
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
import { LogOut, Settings, User, Bell } from "lucide-react";

/* ============================================================
   Header — Glassmorphism top bar
   ============================================================
   Design notes:
   - Uses glass-subtle for the frosted backdrop, letting the
     gradient background subtly show through
   - Sticky positioning so it stays visible during scroll
   - Bell icon for notifications (Mockup 2 shows notification badge)
   - Avatar with gradient background matching brand colors
   - z-30 keeps it below modals/popovers but above content
   - Border uses white opacity for consistency with the floating
     sidebar's internal divider treatment
   ============================================================ */

export function Header() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header
      className={[
        "sticky top-0 z-30",
        "flex h-16 items-center justify-between px-4 md:px-6",
        /* Glass effect header — frosts the gradient background */
        "glass-subtle",
        "border-b border-white/[0.06]",
      ].join(" ")}
    >
      {/* Mobile logo — only visible below md breakpoint */}
      <div className="md:hidden">
        <span className="font-serif text-xl">
          <span className="text-gradient-brand">brandea.today</span>
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {/* Notification dot — visible when there are unread notifications */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-gradient-to-br from-coral to-orange text-sm font-bold text-white">
                  U
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
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
      </div>
    </header>
  );
}
