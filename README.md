# Education Board Results — Bangladesh

A fast, modern, mobile-first portal to check all Bangladesh education board
results (SSC, HSC, JSC, Dakhil, Alim, Vocational, Technical). Built with
Next.js + Tailwind CSS and deployed as a static site on **Cloudflare Pages**
with a **Cloudflare Pages Function** proxying the official education board
server.

> এটি একটি স্বাধীন ফলাফল পোর্টাল — শিক্ষা মন্ত্রণালয়ের সাথে সম্পৃক্ত নয়।
> ফলাফল সরাসরি সরকারি সার্ভার থেকে আনা হয়।

## Features

- 🇧🇩 Covers all 11 Bangladesh education boards
- 📱 Mobile-first, fast, zero-JavaScript for most pages
- 🌐 Bangla + English mixed content (Hind Siliguri + Inter)
- 🔍 Proper SEO — metadata, Open Graph, JSON-LD (FAQ + WebSite), sitemap, robots
- 🛡️ No tracking, no ads, no account — we do not store your roll/reg
- ⚡ Cloudflare Pages Functions proxy auto-solves the upstream math captcha

## Stack

| Layer        | Tech                                   |
| ------------ | -------------------------------------- |
| Frontend     | Next.js 14 (App Router, static export) |
| Styling      | Tailwind CSS                           |
| Backend/API  | Cloudflare Pages Functions             |
| Hosting      | Cloudflare Pages + GitHub integration  |
| Fonts        | Inter + Hind Siliguri (Bangla)         |

## Local development

```bash
npm install
npm run dev        # Next.js dev server on http://localhost:3000
```

The `/api/result` endpoint only runs on Cloudflare Pages — for local testing
of the function, use Wrangler:

```bash
npm run build      # produces ./out
npx wrangler pages dev ./out --compatibility-date=2024-10-01
# Site served with functions on http://localhost:8788
```

## Production build

```bash
npm run build      # static export into ./out
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard → **Pages → Create a project → Connect to Git**.
3. Pick this repository.
4. Build settings:
   - **Framework preset:** Next.js (Static HTML Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Root directory:** _(leave empty)_
   - **Environment variables:** none required
5. Save & Deploy. The `functions/` folder is auto-detected by Cloudflare Pages
   and deployed as a Pages Function at `/api/result`.

On every push to `main`, Cloudflare Pages will rebuild and deploy automatically.
Preview deployments are generated for every PR.

## Project structure

```
├── functions/
│   └── api/
│       └── result.ts          Cloudflare Pages Function — proxy to gov site
├── public/
│   └── _headers               Security + cache headers
├── src/
│   ├── app/                   Next.js App Router pages
│   │   ├── page.tsx           Home (result lookup)
│   │   ├── how-to-check/
│   │   ├── boards/
│   │   ├── faq/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── privacy/
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/            Header, Footer, ResultForm
│   └── lib/data.ts            Boards + exams catalog
├── next.config.mjs
├── tailwind.config.ts
└── README.md
```

## How the proxy works

The official site (`educationboardresults.gov.bd`) issues a PHP session
cookie and embeds a simple math captcha ("A + B") in the home page HTML.
Our Pages Function:

1. `GET` the home page, capture `PHPSESSID` + extract the captcha operands.
2. Compute the sum.
3. `POST /result.php` with `{ sr, et, exam, year, board, roll, reg, value_s, button2 }`
   and the same session cookie.
4. If upstream returns a JS redirect (`window.location.href="index.php?err=NNN"`),
   surface the error code. Otherwise, return the sanitized result HTML.

## Legal

This project is an independent, community portal. It is not affiliated with
the Ministry of Education of Bangladesh. Official source of truth remains
<http://www.educationboardresults.gov.bd/>. Users are responsible for using
this site in accordance with their local laws and the upstream site's
terms of use.
