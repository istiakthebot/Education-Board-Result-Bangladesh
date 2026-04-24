"use client";

import { useState, useMemo } from "react";
import { BOARDS, EXAMS, getYears } from "@/lib/data";

type ResultResponse = {
  ok: boolean;
  html?: string;
  text?: string;
  error?: string;
  errorCode?: string;
};

type FormState = {
  exam: string;
  year: string;
  board: string;
  roll: string;
  reg: string;
};

const INITIAL: FormState = {
  exam: "ssc",
  year: String(new Date().getFullYear()),
  board: "dhaka",
  roll: "",
  reg: "",
};

const ERR_HINTS: Record<string, string> = {
  "101": "Session expired. Please try again.",
  "102": "Verification failed. Please try again.",
  "103": "Invalid input. Please double-check your roll and registration number.",
  "104": "Invalid input. Please double-check your roll and registration number.",
  "105":
    "No result found. Please verify exam, year, board, roll, and registration are correct.",
};

export default function ResultForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultResponse | null>(null);
  const years = useMemo(() => getYears(), []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: ResultResponse = await res.json();
      setResult(data);
    } catch {
      setResult({
        ok: false,
        error:
          "Could not reach the result service. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function onReset() {
    setForm(INITIAL);
    setResult(null);
  }

  const errorMessage =
    result && !result.ok
      ? result.error ||
        (result.errorCode && ERR_HINTS[result.errorCode]) ||
        "Could not fetch result. Please try again."
      : null;

  return (
    <div className="card">
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="exam">
            Examination <span className="font-bangla text-slate-500">(পরীক্ষা)</span>
          </label>
          <select
            id="exam"
            className="field-input"
            value={form.exam}
            onChange={(e) => update("exam", e.target.value)}
            required
          >
            {EXAMS.map((x) => (
              <option key={x.value} value={x.value}>
                {x.label} — {x.bangla}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="year">
            Year <span className="font-bangla text-slate-500">(সাল)</span>
          </label>
          <select
            id="year"
            className="field-input"
            value={form.year}
            onChange={(e) => update("year", e.target.value)}
            required
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="board">
            Board <span className="font-bangla text-slate-500">(বোর্ড)</span>
          </label>
          <select
            id="board"
            className="field-input"
            value={form.board}
            onChange={(e) => update("board", e.target.value)}
            required
          >
            {BOARDS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label} — {b.bangla}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="roll">
            Roll No. <span className="font-bangla text-slate-500">(রোল)</span>
          </label>
          <input
            id="roll"
            className="field-input tracking-wider"
            value={form.roll}
            onChange={(e) =>
              update("roll", e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            inputMode="numeric"
            pattern="[0-9]{5,6}"
            placeholder="e.g. 123456"
            maxLength={6}
            required
            autoComplete="off"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="reg">
            Registration No.{" "}
            <span className="font-bangla text-slate-500">(রেজিস্ট্রেশন)</span>
          </label>
          <input
            id="reg"
            className="field-input tracking-wider"
            value={form.reg}
            onChange={(e) =>
              update("reg", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            inputMode="numeric"
            pattern="[0-9]{7,10}"
            placeholder="e.g. 1234567890"
            maxLength={10}
            required
            autoComplete="off"
          />
        </div>

        <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row gap-3 pt-2 sticky bottom-0 sm:static bg-white sm:bg-transparent -mx-5 sm:mx-0 -mb-5 sm:mb-0 px-5 sm:px-0 pb-5 sm:pb-0 border-t sm:border-t-0 border-slate-100">
          <button
            type="button"
            onClick={onReset}
            className="btn-secondary w-full sm:w-auto"
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn-primary w-full sm:flex-1"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Fetching result…
              </>
            ) : (
              "Get Result"
            )}
          </button>
        </div>
      </form>

      {errorMessage && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <p className="font-semibold">Couldn&apos;t retrieve result</p>
          <p className="mt-1">{errorMessage}</p>
        </div>
      )}

      {result?.ok && result.html && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">Result</h2>
            <button
              className="text-xs text-slate-500 hover:text-slate-800"
              onClick={() => window.print()}
            >
              Print
            </button>
          </div>
          <div
            className="prose prose-sm max-w-none rounded-lg border border-slate-200 bg-slate-50 p-4 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: result.html }}
          />
        </div>
      )}
    </div>
  );
}
