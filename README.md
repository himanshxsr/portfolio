# Himanshu Aashish — Portfolio

Production portfolio for a Full-Stack and Generative AI engineer. Built with Next.js App Router, a Supabase-backed CMS, and a draft → preview → publish workflow so content, media, SEO, and analytics can be updated without redeploying code.

**Live:** [himansh.co.in](https://himansh.co.in)

## Highlights

- Server-rendered App Router architecture with typed content loaders and cache revalidation on publish
- Admin CMS at `/admin` for projects, profile, pages, navigation, blog, media, messages, and analytics
- Supabase Postgres for structured content; Supabase Storage for images and PDFs (not binary blobs in Postgres)
- Hardened contact pipeline with validation, honeypot, rate limiting, and inbox persistence
- Motion-rich UI (Framer Motion, Anime.js, React Three Fiber) with reduced-motion support

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| CMS | Supabase (Postgres + Auth + Storage + RLS) |
| Animation | Framer Motion, Anime.js, Three.js |
| Deployment | Vercel |

## Architecture

```text
Public site ──► lib/content/loaders ──► published_content (Postgres)
Admin /admin ──► draft edits ──► publish ──► revalidatePath
Media uploads ──► Supabase Storage ──► public URLs referenced in CMS JSON
Contact form ──► /api/contact ──► Web3Forms + contact_messages table
```

Content lives in Postgres. Binary assets (project images, résumé PDF, OG image) live in **Supabase Storage** and are referenced by URL in CMS entries.

## Project structure

```text
app/              Routes (public pages, admin dashboard, API)
components/       UI, layout, animations, admin editors
lib/content/      CMS loaders, schemas, publish queries
lib/supabase/     Browser, server, and service clients
supabase/         SQL migrations (schema, RLS, storage policies)
scripts/          Admin bootstrap and CMS seed utilities
seed/assets/      Local-only seed media (gitignored; uploaded to Storage)
docs/             Deployment and CMS setup guide
```

## Local development

```bash
git clone https://github.com/himanshxsr/portfolio.git
cd portfolio
npm install
cp .env.example .env.local
```

Fill `.env.local`, run Supabase migrations, then:

```bash
npm run cms:create-admin   # one-time
npm run cms:seed           # uploads seed/assets/* to Storage + seeds CMS
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin sign-in: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Place seed media files in `seed/assets/` before running `cms:seed` (project SVGs, `og.svg`, `resume.pdf`). That folder is intentionally **not** committed to Git.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run cms:create-admin` | Create single admin user |
| `npm run cms:seed` | Upload seed assets + seed published CMS content |

## Deployment

Deploy on Vercel with environment variables from [`.env.example`](.env.example). Full Supabase, DNS, and CMS setup: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## License

Private portfolio project. All rights reserved.
