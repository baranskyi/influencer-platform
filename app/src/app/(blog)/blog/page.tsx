import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "./_articles";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, tutorials, and insights for influencers and content creators managing their business with brandea.today.",
};

export default function BlogIndex() {
  return (
    <>
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange">
          Blog
        </p>
        <h1 className="font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
          Insights for{" "}
          <span className="text-gradient-brand">creator businesses</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tips, tutorials, and strategies to help you earn more and stress less.
        </p>
      </div>

      {/* Article grid */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ARTICLES.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="glass glass-highlight group rounded-2xl overflow-hidden transition-all duration-300 hover:glow-purple hover:-translate-y-0.5"
          >
            {/* Gradient cover */}
            <div
              className="h-48 w-full"
              style={{
                background: `linear-gradient(135deg, ${article.gradient.from}, ${article.gradient.to})`,
              }}
            >
              <div className="flex h-full items-center justify-center">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                  <rect
                    x="10"
                    y="10"
                    width="60"
                    height="60"
                    rx="16"
                    fill="white"
                    fillOpacity="0.15"
                  />
                  <rect
                    x="22"
                    y="22"
                    width="36"
                    height="36"
                    rx="10"
                    fill="white"
                    fillOpacity="0.2"
                  />
                  <circle cx="40" cy="40" r="10" fill="white" fillOpacity="0.3" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h2 className="font-serif text-lg leading-snug group-hover:text-orange transition-colors">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {article.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span>&middot;</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
