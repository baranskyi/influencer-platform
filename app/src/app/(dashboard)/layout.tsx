import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

/* ============================================================
   Dashboard Layout
   ============================================================
   Structure:
   ┌──────┬───────────────────────────────────┐
   │      │  Header (sticky)                  │
   │ Side │─────────────────────────────────── │
   │ bar  │  Main content (scrollable)         │
   │      │  with gradient background          │
   │      │                                    │
   └──────┴───────────────────────────────────┘
   │ Mobile Nav (bottom, md:hidden)            │
   └───────────────────────────────────────────┘

   The main content area uses the dashboard gradient background.
   In dark mode this is the purple-to-orange mesh gradient that
   bleeds through the glassmorphism cards above it.
   ============================================================ */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main
          className={[
            "flex-1 overflow-y-auto",
            /* Gradient background for the content area */
            "bg-dashboard-gradient dark:bg-mesh-gradient",
            /* Bottom padding on mobile accounts for the fixed bottom nav */
            "pb-20 md:pb-0",
          ].join(" ")}
        >
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
