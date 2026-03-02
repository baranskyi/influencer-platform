import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh-gradient p-4">
      <Card variant="glass" className="w-full max-w-md text-center">
        <CardContent className="py-12">
          {/* Large 404 number */}
          <p className="font-serif text-8xl font-bold leading-none tracking-tight text-white/90 md:text-9xl">
            404
          </p>

          {/* Divider */}
          <div className="mx-auto my-6 h-px w-16 bg-white/20" />

          {/* Subtext */}
          <h1 className="mb-2 text-xl font-semibold text-white">
            Page not found
          </h1>
          <p className="mb-8 text-sm text-white/60">
            The page you are looking for does not exist or has been moved.
          </p>

          {/* CTA button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-2.5 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Back to Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
