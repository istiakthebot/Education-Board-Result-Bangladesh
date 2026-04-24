import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Education Board Results portal team.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <header>
        <p className="text-sm font-semibold text-[var(--brand)]">Contact</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Get in touch
        </h1>
        <p className="mt-2 font-bangla text-lg text-slate-600">যোগাযোগ করুন</p>
      </header>

      <div className="prose prose-slate mt-8 max-w-none">
        <p>
          Have a question, spotted a bug, or want to suggest a feature? We
          would love to hear from you.
        </p>

        <ul>
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:hello@edu-board-results.pages.dev">
              hello@edu-board-results.pages.dev
            </a>
          </li>
          <li>
            <strong>GitHub:</strong>{" "}
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open an issue on the repo
            </a>
          </li>
        </ul>

        <h2>Official board contacts</h2>
        <p>
          For issues with your actual result — missing marks, mark-sheet
          corrections, certificate reissuance — please contact the relevant
          education board directly.
        </p>
      </div>
    </article>
  );
}
