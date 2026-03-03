import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

/* ============================================================
   Dashboard Layout — Floating Sidebar (macOS Sonoma style)
   ============================================================
   Structure:
   ┌─ bg-dashboard-gradient (full viewport) ──────────────────┐
   │ ┌──12px gap──┐                                           │
   │ │ ┌────────┐ │  ┌──────────────────────────────────────┐ │
   │ │ │ Float- │ │  │                                      │ │
   │ │ │  ing   │ │  │  Main content (scrollable)           │ │
   │ │ │ Side-  │ │  │                                      │ │
   │ │ │  bar   │ │  │                                      │ │
   │ │ └────────┘ │  └──────────────────────────────────────┘ │
   │ └──12px gap──┘                                           │
   └──────────────────────────────────────────────────────────┘
   │ Mobile Nav (bottom, md:hidden)                            │
   └───────────────────────────────────────────────────────────┘

   No header bar — user menu and notifications live in the
   sidebar bottom section (avatar dropdown).
   ============================================================ */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "flex h-screen overflow-hidden",
        /* The gradient background covers the full viewport so it
           shows through the gaps around the floating sidebar */
        "bg-dashboard-gradient dark:bg-mesh-gradient",
      ].join(" ")}
    >
      {/* Sidebar wrapper: padding creates the floating gap from edges.
          p-3 = 12px on all sides of the sidebar container. */}
      <div className="hidden md:flex md:p-3 md:pr-0">
        <Sidebar />
      </div>

      {/* Main content column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main
          className={[
            "flex-1 overflow-y-auto",
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
