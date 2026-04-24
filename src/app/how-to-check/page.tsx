import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Check Your Education Board Result",
  description:
    "Step-by-step guide to check SSC, HSC, JSC, Dakhil, Alim and Vocational results online from any Bangladesh education board.",
  alternates: { canonical: "/how-to-check/" },
};

export default function HowToCheckPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <header>
        <p className="text-sm font-semibold text-[var(--brand)]">Guide</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          How to check your result
        </h1>
        <p className="mt-2 font-bangla text-lg text-slate-600">
          কীভাবে আপনার ফলাফল দেখবেন
        </p>
      </header>

      <div className="prose prose-slate mt-8 max-w-none prose-headings:scroll-mt-20">
        <h2>What you need</h2>
        <ul>
          <li>Your <strong>Roll Number</strong> — printed on your admit card.</li>
          <li>Your <strong>Registration Number</strong> — also on the admit card.</li>
          <li>The <strong>year</strong> you sat the exam.</li>
          <li>Your <strong>education board</strong> (Dhaka, Chittagong, etc.).</li>
        </ul>

        <h2>Step 1 — Open the result page</h2>
        <p>
          Go to our <Link href="/">homepage</Link>. The result form is visible
          right on top — no navigation needed on mobile.
        </p>
        <p className="font-bangla text-slate-600">
          আমাদের হোমপেজে গিয়ে শুরুতেই ফলাফল ফর্ম পাবেন।
        </p>

        <h2>Step 2 — Pick your exam, year and board</h2>
        <p>
          Use the dropdowns. Each option shows both the English name (SSC, HSC,
          JSC, Dakhil, Alim…) and the Bangla name for clarity.
        </p>

        <h2>Step 3 — Enter Roll and Registration</h2>
        <p>
          Both numbers must be entered exactly as on your admit card. No
          spaces, no letters. The input accepts digits only.
        </p>

        <h2>Step 4 — Tap &ldquo;Get Result&rdquo;</h2>
        <p>
          The result appears in seconds. You can print or save it using your
          browser&rsquo;s print feature.
        </p>

        <h2>Troubleshooting</h2>
        <ul>
          <li>
            <strong>No result found</strong> — double-check your roll,
            registration, year and board. A single digit off will prevent your
            result from showing.
          </li>
          <li>
            <strong>Server busy on result day</strong> — the official board
            servers can be slow on result-publication day. Try again in a few
            minutes.
          </li>
          <li>
            <strong>Old results (before 2003)</strong> — coverage varies by
            board. Some older results were never digitised.
          </li>
        </ul>
      </div>

      <div className="mt-10 flex gap-3">
        <Link href="/" className="btn-primary">
          Check my result
        </Link>
        <Link href="/faq/" className="btn-secondary">
          FAQ
        </Link>
      </div>
    </article>
  );
}
