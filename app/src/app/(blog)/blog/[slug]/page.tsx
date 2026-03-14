import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ARTICLES } from "../_articles";

/* Map slug → lazy component */
const ARTICLE_COMPONENTS: Record<string, React.ComponentType> = {
  "focus-on-creating": require("../_articles/focus-on-creating").default,
  "how-to-generate-invoice-pdf": require("../_articles/how-to-generate-invoice-pdf").default,
  "replace-your-assistant": require("../_articles/replace-your-assistant").default,
  "desktop-and-mobile": require("../_articles/desktop-and-mobile").default,
  "brandea-vs-competitors": require("../_articles/brandea-vs-competitors").default,
};

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const Content = ARTICLE_COMPONENTS[slug];
  if (!Content) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back link */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All articles
      </Link>

      {/* Cover */}
      <div
        className="mb-10 flex h-56 items-center justify-center rounded-2xl sm:h-72"
        style={{
          background: `linear-gradient(135deg, ${article.gradient.from}, ${article.gradient.to})`,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <rect x="10" y="10" width="100" height="100" rx="24" fill="white" fillOpacity="0.12" />
          <rect x="28" y="28" width="64" height="64" rx="16" fill="white" fillOpacity="0.18" />
          <circle cx="60" cy="60" r="18" fill="white" fillOpacity="0.25" />
        </svg>
      </div>

      {/* Meta */}
      <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
        <time dateTime={article.date}>
          {new Date(article.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        <span>&middot;</span>
        <span>{article.readTime}</span>
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
        {article.title}
      </h1>

      {/* Article body */}
      <div className="prose-blog mt-10">
        <Content />
      </div>

      {/* CTA */}
      <div className="mt-16 glass glass-highlight rounded-2xl p-8 text-center">
        <h2 className="font-serif text-2xl">Ready to try brandea.today?</h2>
        <p className="mt-2 text-muted-foreground">
          Free forever for up to 5 deals. No credit card required.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-coral to-orange px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-orange/30 hover:brightness-110"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  );
}
