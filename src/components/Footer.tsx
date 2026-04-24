import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand)] text-white font-bold">
              EB
            </span>
            <span className="font-bold text-slate-900">
              Education Board Results
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-600 max-w-md">
            A modern, mobile-friendly portal to check results from all
            Bangladesh education boards. আমরা বাংলাদেশের সকল শিক্ষা বোর্ডের
            ফলাফল দ্রুত ও সহজে দেখার সুবিধা প্রদান করি।
          </p>
          <p className="mt-3 text-xs text-slate-500">
            This site is an independent portal and is not affiliated with the
            Ministry of Education, Bangladesh. Official source:{" "}
            <a
              href="http://www.educationboardresults.gov.bd/"
              rel="noopener noreferrer"
              target="_blank"
              className="underline hover:text-[var(--brand)]"
            >
              educationboardresults.gov.bd
            </a>
            .
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/" className="hover:text-[var(--brand)]">
                Check Result
              </Link>
            </li>
            <li>
              <Link href="/how-to-check/" className="hover:text-[var(--brand)]">
                How to Check
              </Link>
            </li>
            <li>
              <Link href="/boards/" className="hover:text-[var(--brand)]">
                All Boards
              </Link>
            </li>
            <li>
              <Link href="/faq/" className="hover:text-[var(--brand)]">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Info</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/about/" className="hover:text-[var(--brand)]">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact/" className="hover:text-[var(--brand)]">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy/" className="hover:text-[var(--brand)]">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} Education Board Results Portal. All
            rights reserved.
          </span>
          <span className="font-bangla">সকল অধিকার সংরক্ষিত।</span>
        </div>
      </div>
    </footer>
  );
}
