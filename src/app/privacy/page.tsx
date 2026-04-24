import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How we handle your data on the Education Board Results portal — we don't store roll numbers, registration numbers, or results.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <header>
        <p className="text-sm font-semibold text-[var(--brand)]">Privacy</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="mt-2 font-bangla text-lg text-slate-600">
          গোপনীয়তা নীতিমালা
        </p>
      </header>

      <div className="prose prose-slate mt-8 max-w-none">
        <p>
          <em>Last updated: {new Date().toLocaleDateString("en-GB")}</em>
        </p>

        <h2>Data we do not collect</h2>
        <p>
          We do not store your Roll Number, Registration Number, name, or
          result. Each result request is forwarded to the official education
          board server and the response is returned directly to your browser.
          We do not save it.
        </p>

        <h2>Cookies</h2>
        <p>
          Our proxy endpoint temporarily uses the session cookie of the
          official education board server only for the duration of a single
          request. We do not set persistent cookies on your browser.
        </p>

        <h2>Analytics</h2>
        <p>
          We may use privacy-preserving, aggregated analytics (e.g. Cloudflare
          Web Analytics) to understand traffic patterns. These do not set
          cookies and do not collect personal data.
        </p>

        <h2>Third parties</h2>
        <p>
          When you request a result, the request is forwarded to{" "}
          <a
            href="http://www.educationboardresults.gov.bd/"
            target="_blank"
            rel="noopener noreferrer"
          >
            educationboardresults.gov.bd
          </a>
          . Their privacy practices apply to that exchange.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy?{" "}
          <a href="mailto:hello@edu-board-results.pages.dev">Email us</a>.
        </p>
      </div>
    </article>
  );
}
