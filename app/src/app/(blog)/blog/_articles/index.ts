export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  gradient: { from: string; to: string };
};

export const ARTICLES: Article[] = [
  {
    slug: "focus-on-creating",
    title: "Focus on Creating, Not Accounting",
    description:
      "Creators should focus on content, not spreadsheets. Let brandea.today handle the boring stuff.",
    date: "2025-03-10",
    readTime: "4 min read",
    gradient: { from: "#E8788A", to: "#F5A623" },
  },
  {
    slug: "how-to-generate-invoice-pdf",
    title: "How to Generate a PDF Invoice in 60 Seconds",
    description:
      "A step-by-step tutorial on creating professional invoices with brandea.today — in under a minute.",
    date: "2025-03-06",
    readTime: "3 min read",
    gradient: { from: "#7ECFB3", to: "#3B82F6" },
  },
  {
    slug: "replace-your-assistant",
    title: "Replace Your $500/Month Assistant for $29",
    description:
      "Everything a virtual assistant does for your creator business — deal tracking, invoices, reminders — for a fraction of the cost.",
    date: "2025-02-28",
    readTime: "5 min read",
    gradient: { from: "#F5A623", to: "#E8788A" },
  },
  {
    slug: "desktop-and-mobile",
    title: "Your Business Dashboard, Anywhere",
    description:
      "Manage deals on the subway, check invoices from a café, update your pipeline from set. Fully responsive.",
    date: "2025-02-20",
    readTime: "3 min read",
    gradient: { from: "#B8A9E8", to: "#7C3AED" },
  },
  {
    slug: "brandea-vs-competitors",
    title: "brandea.today vs HoneyBook vs Bonsai vs Notion",
    description:
      "A real comparison with pricing, features, and who each tool is actually built for.",
    date: "2025-02-14",
    readTime: "6 min read",
    gradient: { from: "#7C3AED", to: "#E8788A" },
  },
];
