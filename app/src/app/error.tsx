"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dashboard-gradient flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <p className="text-5xl font-bold text-orange">500</p>
          <h1 className="font-serif text-2xl text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-sm">
            Something went wrong. Please try again.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg bg-orange px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
