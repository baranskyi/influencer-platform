import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import "./globals.css";

/* ============================================================
   Root Layout
   ============================================================
   Font system:
   - DM Serif Display: Display/heading font (font-serif)
     Used for page titles, card headings, brand name
   - Inter: Body/UI font (font-sans)
     Used for all body text, labels, inputs, navigation

   Theme:
   - The "dark" class on <html> activates the primary dark theme
     with glassmorphism and purple/orange gradient background
   - Remove "dark" class for the light "Creator Hub" theme
   - next-themes can toggle this dynamically when needed
   ============================================================ */

const dmSerif = DM_Serif_Display({
  weight: "400",
  variable: "--font-dm-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "brandea.today — Influencer Business Platform",
    template: "%s | brandea.today",
  },
  description:
    "Stop doing admin. Get paid faster. Deal tracking, invoicing, and analytics for micro-influencers.",
  keywords: ["influencer", "creator", "deals", "invoicing", "analytics", "content calendar"],
  authors: [{ name: "brandea.today" }],
  openGraph: {
    title: "brandea.today — Influencer Business Platform",
    description: "Deal tracking, invoicing, and analytics for micro-influencers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Google Ads tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-1039954261"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-1039954261');
          `}
        </Script>
      </head>
      <body
        className={`${dmSerif.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
