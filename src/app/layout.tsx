import type { Metadata } from "next";
import { Bodoni_Moda, EB_Garamond, Inter } from "next/font/google";
import "./globals.css";

// Bauer Bodoni is a commercial font; Bodoni Moda is the free MVP substitute.
const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Advisor Career Office",
  description: "Private Career & Branding Advisory workspace.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${ebGaramond.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
