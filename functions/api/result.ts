// Cloudflare Pages Function: /api/result
// Proxies a result lookup to educationboardresults.gov.bd.

type PagesFunction<Env = unknown> = (ctx: {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil: (p: Promise<unknown>) => void;
}) => Response | Promise<Response>;
//
// Flow:
//   1. GET the board home page to obtain a PHPSESSID cookie + the numeric captcha.
//   2. Evaluate the captcha ("A + B") to produce the expected answer.
//   3. POST to /result.php with the same cookie + user-submitted fields.
//   4. Parse the response HTML: if it's a JS redirect to `index.php?err=NNN`
//      we return { ok:false, errorCode }. Otherwise we extract the result
//      fragment and return it as sanitized HTML.

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
  const captchaAnswer = String(Number(captchaMatch[1]) + Number(captchaMatch[2]));

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
  const redirect = /window\.location\.href\s*=\s*["']index\.php\?err=(\d+)/.exec(raw);
  if (redirect) {
    return json({ ok: false, errorCode: redirect[1] });
  }

  const cleaned = extractResult(raw);
  if (!cleaned) {
    return json(
      { ok: false, error: "Result could not be parsed from the upstream response." },
      502
    );
  }

  return json({ ok: true, html: cleaned });
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
  if (!v.board || !allowedBoards.includes(v.board)) return "Pick a valid board.";
  if (!v.year || !/^\d{4}$/.test(v.year)) return "Enter a valid 4-digit year.";
  if (!v.roll || !/^\d{4,6}$/.test(v.roll)) return "Enter a valid roll number.";
  if (!v.reg || !/^\d{4,10}$/.test(v.reg))
    return "Enter a valid registration number.";
  return null;
}

// Keep only the result section and scrub scripts/styles/event handlers.
function extractResult(html: string): string {
  // The gov page puts the result inside a <table> within the main content.
  // Try to extract everything after "Result" header to the footer.
  let slice = html;
  const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
  if (bodyMatch) slice = bodyMatch[1];

  // Try to narrow down to the primary content table.
  const tableMatch = /<table[\s\S]*?<\/table>/gi.exec(slice);
  let content = tableMatch ? slice.match(/<table[\s\S]*?<\/table>/gi)!.join("\n") : slice;

  // Prefer the largest table (usually the result grid).
  const tables = slice.match(/<table[\s\S]*?<\/table>/gi);
  if (tables && tables.length) {
    content = tables.reduce((a, b) => (b.length > a.length ? b : a));
  }

  content = sanitize(content);
  const text = content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return content;
}

function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\son[a-z]+='[^']*'/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sclass="[^"]*"/gi, "")
    .replace(/<img[^>]*>/gi, "");
}
