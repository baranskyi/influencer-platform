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
            {/* Cover image */}
            <div className="h-48 w-full overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
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
