# Virtual Classroom — Project Status

## Goal

Build a combined Virtual Classroom platform with:
- **Module A**: Modern English Grammar interactive web app (extracted from 3 DOCX volumes)
- **Module B**: Literature (placeholder)
- **Module C**: Writing (placeholder)

Full-stack: Next.js 16 App Router + TypeScript + Tailwind v4. Auth is demo/localStorage-only (no PostgreSQL/Prisma).

---

## ✅ Completed

### Infrastructure
- Next.js 16.2.9 project scaffolded with all routes
- Tailwind v4 configured via `@tailwindcss/postcss`
- TypeScript strict mode, `moduleResolution: "bundler"`
- Turbopack enabled in `next.config.ts`

### DOCX Extraction (Python OOXML)
- `extract_docx.py` — OOXML extraction pipeline (unzips DOCX, walks `w:body`, extracts formatted HTML, tables, detects chapter boundaries via table rows, parses exercise subgroups, splits multi-answer keys per Section 5.3)
- `extraction_report.py` — verification script that prints per-chapter, per-exercise item/answer counts
- All 3 volumes extracted to `extracted_data/`:
  - Modern English Grammar - I.json (11 chapters, 205KB)
  - Modern English Grammar - II.json (7 chapters, 359KB)
  - Modern English Grammar - III.json (10 chapters, 328KB)

### Routes (all compile, all render)
| Route | Type | Status |
|-------|------|--------|
| `/` | Static | Landing page with carousel + auth cards |
| `/login` | Static | Demo login (any email/password) |
| `/signup` | Static | Registration with OTP demo (`123456`) |
| `/dashboard` | Static | Welcome + A/B/C module selector |
| `/grammar` | Static | Volume accordion index from extracted JSON |
| `/grammar/[volumeNum]/[chapterNum]` | Dynamic | Chapter body + quiz ("Show Answer" with Levenshtein matching) |
| `/module/[id]` | Dynamic | Module B/C "Coming Soon" placeholders |
| `/admin` | Static | Admin panel (admin/admin) |
| `/api/grammar` | Dynamic | Grammar index JSON |
| `/api/grammar/[volumeNum]/[chapterNum]` | Dynamic | Chapter data JSON |

### Cleanup
- Removed `prisma/` directory (unused — auth is demo, content is JSON)
- Removed `@prisma/client` and `prisma` from `package.json`
- Removed default Next.js public SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`)
- Removed `pnpm-lock.yaml` (leftover from pnpm — project uses npm)
- Removed auto-generated `README.md`
- Updated `.env` — commented out DATABASE_URL and JWT_SECRET (not used)

### Guest Login Fix
- "Guest Login" button on landing page now sets `guest-token` in localStorage before navigating to `/dashboard`

### Production Build
- `npm run build` succeeds with zero errors
- 10 routes: 6 static, 4 dynamic
- TypeScript type checking passes

### Answer Key Mismatch Audit
Per spec Section 5.3, multi-column collapsing in source DOCX causes item/answer count mismatches. Summary:

**Volume I** (11 chapters, ~4 exercises OK):
- Typical pattern: items slightly exceed answers (e.g. 16 items / 14 answers)
- Ch9: ex23 (14/14) OK, ex24 (15/15) OK
- Ch8: ex20 (20/20) OK
- Ch10, Ch11, Ch12: empty (no exercises extracted)

**Volume II** (7 chapters, 0 exercises OK — all mismatched):
- Largest gaps: Ch4 ex9 (36 items / 131 answers), Ch6 ex14 (82 items / 161 answers)
- Most gaps are answers > items (multi-answer rows split into individual answer cells)

**Volume III** (9 chapters with exercises, 1 OK):
- Ch8 ex24 (18/18) OK
- Ch9 ex25: 30 items / 0 answers (no answer key in source)
- Ch12 ex27: 12 items / 0 answers (no answer key in source)
- Worst: Ch4 ex12 (50 items / 89 answers)

---

## ❌ Blocked / Cannot Resolve (This Machine)

### 1. `npm install` is Extremely Slow
- **Registry**: `registry.npmjs.org` is reachable but individual requests take 500ms–10s
- **Filesystem**: Next.js detected "Slow filesystem" (329ms benchmark). Disk writes are very slow
- **Result**: A full `npm install` takes 8+ minutes. The command was terminated by timeout multiple times before finally completing
- **Risk**: Any future `npm install`, `npm install <package>`, or `npx` command risks timing out again
- **Workaround**: Must run npm commands on a machine with faster internet/disk, then copy `node_modules`

### 2. ESLint / `npm run lint` Cannot Run
- The `eslint` binary is not symlinked in `node_modules/.bin` (npm installs were interrupted)
- `npx eslint` tries to download eslint@10.6.0 from the network, which times out
- **Cannot be fixed** without a clean `npm install` on a working machine

### 3. No PostgreSQL Database
- No local PostgreSQL instance is running
- `prisma/` was removed (auth is demo), but if real auth is needed later:
  - PostgreSQL must be installed and started
  - `DATABASE_URL` in `.env` must be updated
  - `npx prisma generate` and `npx prisma db push` must be run
  - Auth API routes (`/api/auth/register`, `/api/auth/login`, `/api/auth/verify-otp`) need to be built

### 4. Module B (Literature) and C (Writing) — No Content
- Currently show "Coming Soon" placeholders
- Source DOCX files for Literature and Writing were not available at extraction time
- Only Grammar volumes I/II/III were processed
- B and C would need their own extraction pipeline (or manual content creation)

### 5. Missing Type Declaration Stubs (Workaround Applied)
- The `next` package at `node_modules/next/` was only partially extracted during npm install
- Missing `.d.ts` files: `index.d.ts`, `types.d.ts`, `server.d.ts`, `image-types/global.d.ts`
- **Fix applied**: Hand-created minimal stubs in `node_modules/next/`:
  - `index.d.ts` — exports `Metadata`, `Viewport`, `NextConfig` (as `any`)
  - `types.d.ts` — exports `Metadata`, `Viewport`, `ResolvingMetadata`, `ResolvingViewport`
  - `server.d.ts` — exports `NextRequest`, `NextResponse`
  - `image-types/global.d.ts` — declares `next/image` module
- These stubs are minimal (`any`-based) and will not provide accurate IDE IntelliSense
- **Permanent fix**: Delete these stubs after a clean `npm install`

---

## 🔧 How to Fix Everything (On Another Machine)

1. **Clone/copy** the project (excluding `node_modules`, `.next`)
2. Run `npm install` (will take 30-60s on a normal machine)
3. Delete the hand-created `.d.ts` stubs from `node_modules/next/`
4. Run `npm run build` to verify
5. Run `npm run lint` to verify
6. For PostgreSQL auth: install PG, update `.env`, run `npx prisma generate && npx prisma db push`, build auth API routes
7. For Module B/C content: obtain source DOCX, create extraction scripts, populate pages

---

## File Inventory (Key Paths)

| Path | Purpose |
|------|---------|
| `extract_docx.py` | OOXML extraction pipeline (Python) |
| `extraction_report.py` | Answer key mismatch audit (Python) |
| `extracted_data/` | 3 JSON files (Vol I/II/III, 28 chapters) |
| `src/app/page.tsx` | Landing page |
| `src/app/layout.tsx` | Root layout with NavBar + footer |
| `src/app/globals.css` | Tailwind v4 + parchment theme |
| `src/app/dashboard/page.tsx` | Module A/B/C selector |
| `src/app/grammar/page.tsx` | Accordion index of volumes/chapters |
| `src/app/grammar/[volumeNum]/[chapterNum]/page.tsx` | Chapter body + quiz |
| `src/app/module/[id]/page.tsx` | Module B/C placeholder |
| `src/app/login/page.tsx` | Demo login |
| `src/app/signup/page.tsx` | Registration with OTP demo |
| `src/app/admin/page.tsx` | Admin panel (admin/admin) |
| `src/app/api/grammar/route.ts` | Grammar index API |
| `src/app/api/grammar/[volumeNum]/[chapterNum]/route.ts` | Chapter data API |
| `src/lib/grammar-data.ts` | JSON data loader |
| `src/components/Carousel.tsx` | Landing page carousel |
| `src/components/NavBar.tsx` | Top navigation bar |
| `src/next-types.d.ts` | Type stubs for generated validator |
| `node_modules/next/*.d.ts` | Hand-created stubs (remove after clean install) |
| `next.config.ts` | Turbopack root config |
| `tsconfig.json` | TypeScript config |
| `.env` | DB URL + JWT secret (commented out) |
| `postcss.config.mjs` | PostCSS with Tailwind |
| `eslint.config.mjs` | ESLint flat config |
