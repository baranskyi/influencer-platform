import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
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
  title: "DealFlow — Influencer Business Platform",
  description:
    "Stop doing admin. Get paid faster. Deal tracking, invoicing, and analytics for micro-influencers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${dmSerif.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
