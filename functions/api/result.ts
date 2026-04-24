// Cloudflare Pages Function: /api/result
// Proxies a result lookup to educationboardresults.gov.bd.

type PagesFunction<Env = unknown> = (ctx: {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil: (p: Promise<unknown>) => void;
}) => Response | Promise<Response>;

// Flow:
//   1. GET the board home page to obtain a PHPSESSID cookie + the numeric captcha.
//   2. Evaluate the captcha ("A + B") to produce the expected answer.
//   3. POST to /result.php with the same cookie + user-submitted fields.
//   4. Parse the response HTML into structured JSON (student info + grades).
//      If upstream redirects to `index.php?err=NNN` we return { ok:false, errorCode }.

export interface Grade {
  code: string;
  subject: string;
  grade: string;
}

export interface ResultPayload {
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
}

export const onRequestPost: PagesFunction = async (ctx) => {
  let body: Record<string, string>;
  try {
    body = (await ctx.request.json()) as Record<string, string>;
  } catch {
    return json({ ok: false, error: "Invalid JSON body." }, 400);
  }

  const { exam, year, board, roll, reg } = body;
  const err = validate({ exam, year, board, roll, reg });
  if (err) return json({ ok: false, error: err }, 400);

  const UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36";
  const UPSTREAM = "http://www.educationboardresults.gov.bd";

  // Step 1 — get session + captcha
  const homeRes = await fetch(`${UPSTREAM}/index.php`, {
    headers: { "User-Agent": UA, Accept: "text/html" },
    // @ts-expect-error - cf is available in Workers
    cf: { cacheTtl: 0, cacheEverything: false },
  });
  if (!homeRes.ok) {
    return json(
      { ok: false, error: "Upstream board server is not responding." },
      502
    );
  }
  const setCookie = homeRes.headers.get("set-cookie") || "";
  const sessionMatch = /PHPSESSID=([^;]+)/.exec(setCookie);
  const sessionId = sessionMatch ? sessionMatch[1] : "";
  if (!sessionId) {
    return json(
      { ok: false, error: "Could not establish a session with the upstream." },
      502
    );
  }

  const homeHtml = await homeRes.text();
  const captchaMatch = /(\d+)\s*\+\s*(\d+)/.exec(homeHtml);
  if (!captchaMatch) {
    return json(
      { ok: false, error: "Captcha not found on upstream page." },
      502
    );
  }
  const captchaAnswer = String(
    Number(captchaMatch[1]) + Number(captchaMatch[2])
  );

  // Step 2 — submit the form
  const form = new URLSearchParams({
    sr: "3",
    et: "2",
    exam,
    year,
    board,
    roll,
    reg,
    button2: "Submit",
    value_s: captchaAnswer,
  });

  const resultRes = await fetch(`${UPSTREAM}/result.php`, {
    method: "POST",
    headers: {
      "User-Agent": UA,
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: `PHPSESSID=${sessionId}`,
      Referer: `${UPSTREAM}/index.php`,
      Accept: "text/html",
    },
    body: form.toString(),
    // @ts-expect-error - cf only present on Workers fetch
    cf: { cacheTtl: 0, cacheEverything: false },
    redirect: "follow",
  });

  if (!resultRes.ok) {
    return json(
      { ok: false, error: "Upstream returned an error. Please try again." },
      502
    );
  }

  const raw = await resultRes.text();

  // Upstream uses JS redirects for errors:
  //   <script language='javascript'>window.location.href="index.php?err=105"; </script>
  const redirect = /window\.location\.href\s*=\s*["']index\.php\?err=(\d+)/.exec(
    raw
  );
  if (redirect) {
    return json({ ok: false, errorCode: redirect[1] });
  }

  const parsed = parseResult(raw, { roll, reg });
  if (!parsed) {
    return json(
      {
        ok: false,
        error:
          "Result could not be parsed from the upstream response. The page format may have changed.",
      },
      502
    );
  }

  return json({ ok: true, result: parsed });
};

export const onRequestGet: PagesFunction = async () =>
  json({ ok: false, error: "Use POST with JSON." }, 405);

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function validate(v: Record<string, string | undefined>): string | null {
  const allowedExams = [
    "jsc",
    "ssc",
    "ssc_voc",
    "hsc",
    "hsc_voc",
    "hsc_hbm",
    "hsc_dic",
  ];
  const allowedBoards = [
    "barisal",
    "chittagong",
    "comilla",
    "dhaka",
    "dinajpur",
    "jessore",
    "mymensingh",
    "rajshahi",
    "sylhet",
    "madrasah",
    "tec",
    "dibs",
  ];
  if (!v.exam || !allowedExams.includes(v.exam)) return "Pick a valid exam.";
  if (!v.board || !allowedBoards.includes(v.board))
    return "Pick a valid board.";
  if (!v.year || !/^\d{4}$/.test(v.year)) return "Enter a valid 4-digit year.";
  if (!v.roll || !/^\d{1,10}$/.test(v.roll))
    return "Enter a valid roll number (digits only).";
  if (!v.reg || !/^\d{1,15}$/.test(v.reg))
    return "Enter a valid registration number (digits only).";
  return null;
}

// Strip tags around a chunk of HTML and collapse whitespace.
function textOf(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#039;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// Parse the upstream marksheet page into structured data.
//
// Upstream renders a flat sequence of <td>Label</td><td>Value</td> cells for
// student info, followed by a Grade Sheet table with Code/Subject/Grade rows.
function parseResult(
  html: string,
  fallback: { roll: string; reg: string }
): ResultPayload | null {
  // Capture all <td>...</td> cells in document order.
  const cells: string[] = [];
  const tdRe = /<td\b[^>]*>([\s\S]*?)<\/td>/gi;
  let m: RegExpExecArray | null;
  while ((m = tdRe.exec(html))) {
    cells.push(textOf(m[1]));
  }
  if (cells.length === 0) return null;

  // Build a label -> value map (case-insensitive; first occurrence wins).
  const info: Record<string, string> = {};
  for (let i = 0; i < cells.length - 1; i++) {
    const label = cells[i].toLowerCase();
    const value = cells[i + 1];
    if (!value) continue;
    if (!info[label]) info[label] = value;
  }

  const pick = (...labels: string[]): string => {
    for (const l of labels) {
      const v = info[l.toLowerCase()];
      if (v && v.length < 200) return v;
    }
    return "";
  };

  const name = pick("name");
  const roll = pick("roll no", "roll no.", "roll");
  const board = pick("board");
  const fatherName = pick("father's name", "fathers name", "father name");
  const motherName = pick("mother's name", "mothers name", "mother name");
  const group = pick("group");
  const examType = pick("type", "exam type");
  const dob = pick("date of birth", "dob");
  const institute = pick("institute", "institution");
  const result = pick("result");
  const gpa = pick("gpa");

  // Grades: look for rows with exactly Code / Subject / Grade triples.
  // The grade-sheet table's data rows have 3 td's in order: code (digits),
  // subject (letters), grade (A+, A, A-, B, C, D, F).
  const grades: Grade[] = [];
  const rowRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let r: RegExpExecArray | null;
  while ((r = rowRe.exec(html))) {
    const rowHtml = r[1];
    const rowCells: string[] = [];
    const ctdRe = /<td\b[^>]*>([\s\S]*?)<\/td>/gi;
    let c: RegExpExecArray | null;
    while ((c = ctdRe.exec(rowHtml))) rowCells.push(textOf(c[1]));
    if (rowCells.length !== 3) continue;
    const [code, subject, grade] = rowCells;
    if (!/^\d{2,4}$/.test(code)) continue;
    if (!/^[A-F][+\-]?$/i.test(grade)) continue;
    if (!subject) continue;
    grades.push({ code, subject, grade: grade.toUpperCase() });
  }

  // If we have no name and no grades, upstream didn't give us a real result.
  if (!name && grades.length === 0) return null;

  return {
    roll: roll || fallback.roll,
    reg: fallback.reg,
    name,
    fatherName,
    motherName,
    board,
    group,
    examType,
    dob,
    institute,
    result,
    gpa,
    grades,
  };
}
