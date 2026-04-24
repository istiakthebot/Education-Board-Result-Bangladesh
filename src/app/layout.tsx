import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

const SITE_URL = "https://edu-board-results.pages.dev";
const SITE_NAME = "Education Board Results Bangladesh";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Education Board Results Bangladesh — SSC, HSC, JSC Result (বাংলাদেশ শিক্ষা বোর্ড ফলাফল)",
    template: "%s | Education Board Results BD",
  },
  description:
    "Check SSC, HSC, JSC, Dakhil, Alim and all education board results of Bangladesh online. Fast, mobile-friendly, and free. বাংলাদেশ শিক্ষা বোর্ডের ফলাফল দেখুন সহজে।",
  keywords: [
    "education board results",
    "SSC result",
    "HSC result",
    "JSC result",
    "Dakhil result",
    "Alim result",
    "Bangladesh education board",
    "educationboardresults",
    "শিক্ষা বোর্ড ফলাফল",
    "এসএসসি রেজাল্ট",
    "এইচএসসি রেজাল্ট",
    "dhaka board result",
    "comilla board result",
    "rajshahi board result",
    "madrasah board result",
    "technical board result",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Education Board Results Bangladesh — SSC, HSC, JSC Results",
    description:
      "Check all Bangladesh education board results online. Mobile-first, fast, and always free.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Education Board Results Bangladesh",
    description:
      "Check SSC, HSC, JSC, Dakhil, Alim results of all Bangladesh education boards online.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: { icon: "/favicon.ico" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: ["en", "bn"],
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?roll={roll}`,
        "query-input": "required name=roll",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Independent results portal for Bangladesh education boards. Not affiliated with the Ministry of Education.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${hindSiliguri.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Script
          id="ld-json-site"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Skip to top on mobile */}
        <a
          href="#top"
          className="sr-only focus:not-sr-only fixed bottom-4 right-4 bg-[var(--brand)] text-white rounded-full px-3 py-2 text-xs"
        >
          Top
        </a>
      </body>
    </html>
  );
}

export { Link };
