import type { Metadata } from "next";
import Link from "next/link";
import ResultForm from "@/components/ResultForm";
import { BOARDS, EXAMS } from "@/lib/data";

export const metadata: Metadata = {
  title:
    "Education Board Results Bangladesh — SSC, HSC, JSC Result Online",
  description:
    "Check your SSC, HSC, JSC, Dakhil, Alim, Vocational and Technical results from all Bangladesh education boards. Fast, free, and mobile-friendly.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* Hero + Form */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#e8f5ef] via-white to-[#fdecee]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 pb-10">
          <div className="grid gap-8 lg:grid-cols-5 items-start">
            <div className="lg:col-span-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-[var(--brand-dark)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
                Live — all 11 education boards
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 text-balance">
                Bangladesh Education Board Results
              </h1>
              <p className="mt-2 font-bangla text-xl sm:text-2xl font-semibold text-slate-700">
                বাংলাদেশ শিক্ষা বোর্ডের ফলাফল
              </p>
              <p className="mt-4 text-base text-slate-600 max-w-prose">
                Check SSC, HSC, JSC, Dakhil, Alim, Vocational and Technical
                results from every Bangladesh education board — Dhaka,
                Chittagong, Rajshahi, Comilla, Barisal, Jessore, Sylhet,
                Dinajpur, Mymensingh, Madrasah and Technical.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                {[
                  { en: "Mobile-first, fast loading", bn: "মোবাইলের জন্য উপযোগী" },
                  { en: "Covers every board and exam", bn: "সকল বোর্ড ও পরীক্ষা" },
                  { en: "No ads, no signup, completely free", bn: "সম্পূর্ণ বিনামূল্যে" },
                  { en: "Print & save your marksheet", bn: "প্রিন্ট ও সংরক্ষণ" },
                ].map((i) => (
                  <li key={i.en} className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand)]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-4-4A1 1 0 015.7 8.3L9 11.6l6.3-6.3a1 1 0 011.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {i.en}{" "}
                      <span className="font-bangla text-slate-500">— {i.bn}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3" id="check">
              <ResultForm />
              <p className="mt-3 text-xs text-slate-500">
                Your roll and registration number are sent directly to the
                official education board and are not stored on our servers.{" "}
                <Link href="/privacy/" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exams */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <h2 className="section-title">Exams we cover</h2>
        <p className="section-subtitle">
          From Junior School Certificate to Higher Secondary — every public
          exam in Bangladesh.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMS.map((x) => (
            <div key={x.value + x.label} className="card hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{x.label}</h3>
                <span className="font-bangla text-sm text-slate-500">
                  {x.bangla}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{x.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Boards */}
      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="flex items-end justify-between flex-wrap gap-2">
            <div>
              <h2 className="section-title">All education boards</h2>
              <p className="section-subtitle">
                বাংলাদেশের সকল শিক্ষা বোর্ড এক জায়গায়।
              </p>
            </div>
            <Link
              href="/boards/"
              className="text-sm font-medium text-[var(--brand)] hover:underline"
            >
              View details →
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {BOARDS.map((b) => (
              <div
                key={b.value}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    {b.label}
                  </span>
                  <span className="font-bangla text-sm text-slate-500">
                    {b.bangla}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {b.city}
                  {b.established ? ` • Est. ${b.established}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <h2 className="section-title">How to check your result</h2>
        <p className="section-subtitle">
          কিভাবে ফলাফল দেখবেন — মাত্র ৪ ধাপে।
        </p>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              t: "Choose exam",
              bn: "পরীক্ষা বাছাই",
              d: "Pick SSC, HSC, JSC, Dakhil or whichever exam you sat.",
            },
            {
              t: "Select year & board",
              bn: "সাল ও বোর্ড",
              d: "Pick the year of your exam and your education board.",
            },
            {
              t: "Enter roll & registration",
              bn: "রোল ও রেজিস্ট্রেশন",
              d: "Numbers as printed on your admit card — no spaces.",
            },
            {
              t: "Hit Get Result",
              bn: "ফলাফল দেখুন",
              d: "Your marksheet loads in seconds — print or save it.",
            },
          ].map((s, i) => (
            <li key={s.t} className="card">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 font-bold text-[var(--brand-dark)]">
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900">{s.t}</h3>
              <p className="font-bangla text-sm text-slate-500">{s.bn}</p>
              <p className="mt-2 text-sm text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Link href="/how-to-check/" className="btn-secondary">
            Read the full guide →
          </Link>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
          <h2 className="section-title">Frequently asked questions</h2>
          <p className="section-subtitle">
            সাধারণ প্রশ্নের উত্তর এখানে।
          </p>
          <div className="mt-6 space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-slate-200 bg-white p-4 open:shadow-sm"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span className="font-medium text-slate-900">{f.q}</span>
                  <span className="ml-4 text-slate-400 group-open:rotate-45 transition">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/faq/" className="btn-secondary">
              See all FAQs →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const FAQS = [
  {
    q: "Is this the official education board website?",
    a: "No — this is an independent, ad-free portal built for a faster, mobile-first experience. Results are fetched directly from the official board servers at educationboardresults.gov.bd.",
  },
  {
    q: "Which exams are supported?",
    a: "SSC, HSC, JSC/JDC, Dakhil, Alim, Vocational (SSC & HSC), HSC (BM) and Diploma in Commerce — every public exam board results.",
  },
  {
    q: "Can I check results from older years?",
    a: "Yes. The archive goes back to 1996 for every board that published its results online.",
  },
  {
    q: "Do I need to register or log in?",
    a: "No account, no sign-up. Just your roll and registration number from your admit card.",
  },
];
