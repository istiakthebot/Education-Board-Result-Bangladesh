"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home", bn: "হোম" },
  { href: "/how-to-check/", label: "How to Check", bn: "নিয়ম" },
  { href: "/boards/", label: "Boards", bn: "বোর্ড" },
  { href: "/faq/", label: "FAQ", bn: "প্রশ্নোত্তর" },
  { href: "/about/", label: "About", bn: "পরিচিতি" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header id="top" className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand)] text-white font-bold">
              EB
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-bold text-slate-900 text-[15px]">
                Education Board Results
              </span>
              <span className="font-bangla text-[12px] text-slate-500">
                শিক্ষা বোর্ড ফলাফল
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              {open ? (
                <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <span>{n.label}</span>
                <span className="font-bangla text-xs text-slate-500">
                  {n.bn}
                </span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
