import type { Metadata } from "next";
import Link from "next/link";
import { BOARDS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Education Boards of Bangladesh",
  description:
    "A directory of all 11 education boards in Bangladesh — Dhaka, Chittagong, Rajshahi, Comilla, Barisal, Jessore, Sylhet, Dinajpur, Mymensingh, Madrasah and Technical — with jurisdiction and official websites.",
  alternates: { canonical: "/boards/" },
};

export default function BoardsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <header>
        <p className="text-sm font-semibold text-[var(--brand)]">Directory</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Education boards of Bangladesh
        </h1>
        <p className="mt-2 font-bangla text-lg text-slate-600">
          বাংলাদেশের শিক্ষা বোর্ডসমূহ
        </p>
        <p className="mt-4 text-slate-600 max-w-prose">
          Bangladesh has eleven education boards — nine general regional boards
          plus the Madrasah and Technical boards. Each sets and publishes its
          own exam results; all can be checked through this portal.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BOARDS.map((b) => (
          <div key={b.value} className="card">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {b.label}
              </h2>
              <span className="font-bangla text-sm text-slate-500">
                {b.bangla}
              </span>
            </div>
            <dl className="mt-3 text-sm text-slate-600 space-y-1">
              <div className="flex justify-between">
                <dt className="text-slate-500">Headquarters</dt>
                <dd className="font-medium text-slate-800">{b.city}</dd>
              </div>
              {b.established ? (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Established</dt>
                  <dd className="font-medium text-slate-800">
                    {b.established}
                  </dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-4 flex items-center gap-3">
              <Link
                href={`/?board=${b.value}`}
                className="text-sm font-medium text-[var(--brand)] hover:underline"
              >
                Check result →
              </Link>
              {b.website ? (
                <a
                  href={b.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Official site ↗
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
