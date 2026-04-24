import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "FAQ — Education Board Results Bangladesh",
  description:
    "Common questions about checking SSC, HSC, JSC, Dakhil, Alim, Vocational and Technical results online in Bangladesh.",
  alternates: { canonical: "/faq/" },
};

const FAQS = [
  {
    q: "Is this the official education board website?",
    a: "No. This is an independent portal. We forward your request to the official education board servers at educationboardresults.gov.bd and show you the result in a cleaner, mobile-friendly interface. We have no affiliation with the Ministry of Education.",
  },
  {
    q: "Which exams are supported?",
    a: "All publicly published Bangladesh education board exams — SSC, HSC, JSC/JDC, Dakhil, Alim, Vocational (SSC & HSC), HSC (BM) and Diploma in Commerce.",
  },
  {
    q: "Which boards are supported?",
    a: "All 11 boards: Dhaka, Chittagong, Comilla, Rajshahi, Jessore, Barisal, Sylhet, Dinajpur, Mymensingh, Madrasah, Technical, and DIBS (Dhaka).",
  },
  {
    q: "Can I check old results?",
    a: "Yes. Results from 1996 onwards are available, subject to what the boards have digitised.",
  },
  {
    q: "Why is the result not showing?",
    a: "Double-check the roll, registration, year and board — a single wrong digit will block the result. On result-publication day, the official server can be slow; try again in a few minutes.",
  },
  {
    q: "Do I need to register or sign in?",
    a: "No. There is no account system. Just your roll and registration numbers from your admit card.",
  },
  {
    q: "Is my data safe?",
    a: "We do not store your roll or registration number. Each request is proxied directly to the official board and discarded after the response is returned to your browser.",
  },
  {
    q: "Can I print my result?",
    a: "Yes — once the result is displayed, use the Print button on the result card (or your browser's print shortcut Ctrl/Cmd+P).",
  },
  {
    q: "ফলাফল বাংলায় দেখা যাবে?",
    a: "ওয়েবসাইটের ইন্টারফেস বাংলা ও ইংরেজি উভয় ভাষায় রয়েছে। তবে ফলাফলের ডেটা সরাসরি সরকারি বোর্ড থেকে আসে — বোর্ড যেভাবে প্রকাশ করেছে সেভাবেই দেখা যাবে।",
  },
];

export default function FaqPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <Script
        id="ld-json-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <header>
        <p className="text-sm font-semibold text-[var(--brand)]">FAQ</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Frequently asked questions
        </h1>
        <p className="mt-2 font-bangla text-lg text-slate-600">
          প্রায়শই জিজ্ঞাসিত প্রশ্ন
        </p>
      </header>

      <div className="mt-8 space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-xl border border-slate-200 bg-white p-4 open:shadow-sm"
          >
            <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
              <span className="font-medium text-slate-900">{f.q}</span>
              <span className="ml-4 text-slate-400 group-open:rotate-45 transition">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </article>
  );
}
