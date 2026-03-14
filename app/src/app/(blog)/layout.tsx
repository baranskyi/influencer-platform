import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mesh-gradient text-foreground font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass-subtle" role="navigation" aria-label="Blog navigation">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="brandea.today home">
            <span className="text-gradient-brand font-serif text-2xl tracking-tight">
              brandea.today
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-8 sm:px-6 lg:px-8" role="contentinfo">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} brandea.today. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
