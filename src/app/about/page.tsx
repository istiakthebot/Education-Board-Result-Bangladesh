import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About the Education Board Results portal — our mission and what makes this site different.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <header>
        <p className="text-sm font-semibold text-[var(--brand)]">About</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          A faster way to check your board result
        </h1>
        <p className="mt-2 font-bangla text-lg text-slate-600">
          একটি দ্রুত, আধুনিক ফলাফল পোর্টাল
        </p>
      </header>

      <div className="prose prose-slate mt-8 max-w-none">
        <p>
          Every year, millions of Bangladeshi students refresh the official
          education board website on result day — and every year the server
          buckles under the load. This portal is an independent, modern
          alternative: mobile-first, ad-free, works on slow connections, and
          presents results in a clean, readable layout.
        </p>

        <h2>What we do</h2>
        <ul>
          <li>Forward your request to the official board servers</li>
          <li>Parse the response and show you a clean marksheet</li>
          <li>Never store your personal data</li>
          <li>Offer the same experience in Bangla and English</li>
        </ul>

        <h2>What we don&rsquo;t do</h2>
        <ul>
          <li>We are not affiliated with the Ministry of Education</li>
          <li>We do not issue certificates or publish official results</li>
          <li>We never sell or share your data (see our Privacy Policy)</li>
        </ul>

        <h2 className="font-bangla">আমাদের সম্পর্কে</h2>
        <p className="font-bangla">
          প্রতিবছর ফলাফল প্রকাশের দিন সরকারি ওয়েবসাইটে তীব্র চাপ পড়ে — আমরা
          তৈরি করেছি একটি দ্রুত, মোবাইল-বান্ধব ও বিজ্ঞাপনমুক্ত বিকল্প। আপনার
          তথ্য আমরা সংরক্ষণ করি না — সরাসরি বোর্ডের সার্ভার থেকে ফলাফল এনে
          দেখাই।
        </p>
      </div>
    </article>
  );
}
