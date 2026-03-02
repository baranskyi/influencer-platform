import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="font-serif text-5xl font-bold text-foreground">
          DealFlow
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Stop doing admin. Get paid faster.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="rounded-full bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-border px-6 py-3 text-foreground font-medium hover:bg-accent/10 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
