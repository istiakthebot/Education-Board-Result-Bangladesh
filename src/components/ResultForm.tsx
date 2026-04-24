"use client";

import { useMemo, useRef, useState } from "react";
import { BOARDS, EXAMS, getYears } from "@/lib/data";

type Grade = { code: string; subject: string; grade: string };

type ResultPayload = {
  roll: string;
  reg: string;
  name: string;
  fatherName: string;
  motherName: string;
  board: string;
  group: string;
  examType: string;
  dob: string;
  institute: string;
  result: string;
  gpa: string;
  grades: Grade[];
};

type ResultResponse = {
  ok: boolean;
  result?: ResultPayload;
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
  year: "2024",
  board: "dhaka",
  roll: "",
  reg: "",
};

const ERR_HINTS: Record<string, string> = {
  "101": "Session expired. Please try again.",
  "102": "Verification failed. Please try again.",
  "103":
    "Invalid input. Please double-check exam, year, board and your roll / registration number.",
  "104":
    "Invalid input. Please double-check your roll and registration number.",
  "105":
    "No result found. Please verify exam, year, board, roll, and registration are correct.",
};

export default function ResultForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [downloading, setDownloading] = useState(false);
  const years = useMemo(() => getYears(), []);
  const marksheetRef = useRef<HTMLDivElement>(null!);

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

  async function onDownloadPdf() {
    if (!marksheetRef.current || !result?.result) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, jspdfMod] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const jsPDF = jspdfMod.jsPDF || jspdfMod.default;
      const canvas = await html2canvas(marksheetRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = canvas.height / canvas.width;
      const imgWidth = pageWidth - 40;
      const imgHeight = imgWidth * ratio;

      if (imgHeight <= pageHeight - 40) {
        pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
      } else {
        // Split into multiple pages if taller than one A4.
        const pageContentHeight = pageHeight - 40;
        let y = 0;
        while (y < canvas.height) {
          const sliceHeight = Math.min(
            canvas.height - y,
            (pageContentHeight / imgWidth) * canvas.width
          );
          const slice = document.createElement("canvas");
          slice.width = canvas.width;
          slice.height = sliceHeight;
          const ctx = slice.getContext("2d");
          if (!ctx) break;
          ctx.drawImage(
            canvas,
            0,
            y,
            canvas.width,
            sliceHeight,
            0,
            0,
            canvas.width,
            sliceHeight
          );
          const sliceData = slice.toDataURL("image/png");
          if (y > 0) pdf.addPage();
          pdf.addImage(
            sliceData,
            "PNG",
            20,
            20,
            imgWidth,
            (sliceHeight / canvas.width) * imgWidth
          );
          y += sliceHeight;
        }
      }

      const fileName = [
        "marksheet",
        result.result.name?.replace(/\s+/g, "_").toLowerCase() || "result",
        result.result.roll || "",
      ]
        .filter(Boolean)
        .join("_");
      pdf.save(`${fileName}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  function onPrint() {
    window.print();
  }

  const errorMessage =
    result && !result.ok
      ? result.error ||
        (result.errorCode && ERR_HINTS[result.errorCode]) ||
        "Could not fetch result. Please try again."
      : null;

  const payload = result?.ok ? result.result : null;

  return (
    <div className="card" id="result-form-card">
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
              update("roll", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            inputMode="numeric"
            placeholder="e.g. 123456"
            minLength={1}
            maxLength={10}
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
              update("reg", e.target.value.replace(/\D/g, "").slice(0, 15))
            }
            inputMode="numeric"
            placeholder="e.g. 1234567890"
            minLength={1}
            maxLength={15}
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

      {payload && <Marksheet innerRef={marksheetRef} payload={payload} />}

      {payload && (
        <div className="mt-4 flex flex-col sm:flex-row gap-2 no-print">
          <button onClick={onPrint} className="btn-secondary w-full sm:w-auto">
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z"
              />
            </svg>
            Print
          </button>
          <button
            onClick={onDownloadPdf}
            className="btn-primary w-full sm:flex-1"
            disabled={downloading}
          >
            {downloading ? "Preparing PDF…" : "Download as PDF"}
          </button>
        </div>
      )}
    </div>
  );
}

const Marksheet = ({
  payload,
  innerRef,
}: {
  payload: ResultPayload;
  innerRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div
      ref={innerRef}
      className="mt-6 rounded-xl border border-slate-200 bg-white overflow-hidden print-area"
    >
      <div
        className="text-white px-5 py-4"
        style={{ backgroundColor: "var(--brand)" }}
      >
        <div className="text-xs uppercase tracking-wider opacity-80">
          Education Board Bangladesh
        </div>
        <div className="mt-1 text-lg font-semibold">
          {payload.examType || "Result"}
          {payload.board ? ` · ${payload.board}` : ""}
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500">
              Student
            </div>
            <div className="text-xl font-semibold text-slate-900 mt-0.5">
              {payload.name || "—"}
            </div>
            <div className="text-sm text-slate-600">
              {payload.institute || ""}
            </div>
          </div>
          <div className="flex items-baseline gap-3 sm:gap-4">
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Result
              </div>
              <div
                className="text-base font-semibold"
                style={{
                  color: /pass/i.test(payload.result)
                    ? "var(--brand)"
                    : /fail/i.test(payload.result)
                      ? "var(--brand-accent)"
                      : "#334155",
                }}
              >
                {payload.result || "—"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                GPA
              </div>
              <div className="text-2xl font-semibold text-slate-900">
                {payload.gpa || "—"}
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
          <InfoRow label="Roll No." value={payload.roll} />
          <InfoRow label="Registration No." value={payload.reg} />
          <InfoRow label="Father's Name" value={payload.fatherName} />
          <InfoRow label="Mother's Name" value={payload.motherName} />
          <InfoRow label="Group" value={payload.group} />
          <InfoRow label="Date of Birth" value={payload.dob} />
        </dl>

        {payload.grades.length > 0 && (
          <div className="mt-6">
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
              Grade Sheet
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="text-left px-3 py-2 font-medium w-20">
                      Code
                    </th>
                    <th className="text-left px-3 py-2 font-medium">
                      Subject
                    </th>
                    <th className="text-right px-3 py-2 font-medium w-20">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payload.grades.map((g, i) => (
                    <tr
                      key={`${g.code}-${i}`}
                      className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                    >
                      <td className="px-3 py-2 text-slate-500 tabular-nums">
                        {g.code}
                      </td>
                      <td className="px-3 py-2 text-slate-900">{g.subject}</td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums text-slate-900">
                        {g.grade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-slate-500">
          Source: educationboardresults.gov.bd — this portal proxies the
          official server and does not modify the result.
        </div>
      </div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-2 sm:border-0 sm:pb-0">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-900 font-medium text-right">{value || "—"}</dd>
    </div>
  );
}
