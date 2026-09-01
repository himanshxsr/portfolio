# Deployment & CMS setup

This document covers production setup. The public README stays concise; use this guide when deploying or bootstrapping a new environment.

## Prerequisites

- Node.js 20+
- A Supabase project
- A Vercel project connected to this repository

## 1. Supabase database

Run these SQL files in the Supabase SQL editor (in order):

1. [`supabase/migrations/0001_portfolio_cms.sql`](../supabase/migrations/0001_portfolio_cms.sql)
2. [`supabase/migrations/0002_fix_publish_content.sql`](../supabase/migrations/0002_fix_publish_content.sql)

## 2. Environment variables

Copy [`.env.example`](../.env.example) to `.env.local` for local development. On Vercel, set the same variables (Production + Preview):

| Variable | Scope |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` | Public (default: `portfolio-assets`) |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Public (browser contact email) |
| `WEB3FORMS_KEY` | Server fallback for contact config API (same UUID) |
| `CONTACT_HASH_SECRET` | Server only |
| `GOOGLE_APPS_SCRIPT_URL` | Server only (optional) |
| `ABSTRACT_EMAIL_API_KEY` | Server only (optional — deeper email verification) |

Never prefix the service role key with `NEXT_PUBLIC_`. Do not commit `.env` files.

### Contact email verification

Before a message is saved, the server checks:

1. **Format** (Zod)
2. **Domain typos** (e.g. `gmial.com` → suggests `gmail.com`)
3. **Disposable domains** blocked
4. **MX / mail records** — domain must accept email
5. **Optional:** [Abstract Email Reputation API](https://www.abstractapi.com/api/email-reputation-api) when `ABSTRACT_EMAIL_API_KEY` is set (use the **Email Reputation** primary key from your dashboard)

This is separate from the **Google Apps Script auto-reply** (confirmation email to the visitor). Verification runs **before** submit; Apps Script runs **after** a valid submission.

No API can reliably detect `wronguser@gmail.com` on a real domain. For that, only a confirmation-link flow proves inbox ownership.

Set `ABSTRACT_EMAIL_API_KEY` on Vercel (and `.env.local`), then **Redeploy**. Contact notifications (Web3Forms) and visitor confirmations (Apps Script) stay on your existing **himanshuaashish4@gmail.com** setup — no change required there.

The visitor confirmation email is sent by **Google Apps Script**. Template: [`scripts/google-apps-script-auto-reply.gs`](../scripts/google-apps-script-auto-reply.gs).

## 3. Bootstrap admin and content

```bash
# Temporary — remove ADMIN_PASSWORD after success
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=your-strong-password

npm run cms:create-admin
npm run cms:seed
```

Before seeding, place media in [`seed/assets/`](../seed/assets/) (gitignored):

- Project thumbnails: `elisium-space.svg`, `cobra.svg`, `chess.svg`, `genai.svg`, `3d-portfolio.svg`, `hrms.svg`
- Site OG image: `og.svg`
- Résumé: `resume.pdf`

The seed script uploads these to Supabase Storage and writes public URLs into CMS entries.

## 4. Supabase Auth hardening

In **Authentication → Providers → Email**, disable **Allow new users to sign up**. Only the bootstrapped admin account should exist.

## 5. Custom domain (GoDaddy → Vercel)

In Vercel **Settings → Domains**, add your apex and `www` domains. In GoDaddy DNS:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | Vercel apex IP (shown in dashboard) |
| CNAME | `www` | Project-specific `*.vercel-dns-*.com` target |

Turn off domain forwarding. Wait for **Valid Configuration** in Vercel.

Update **Site settings** in the admin CMS (`baseUrl`, `ogImage`) after the domain is live.

## 6. Publishing workflow

1. Edit content in `/admin` and **Save draft**
2. **Preview draft** to verify
3. **Publish draft** — public routes revalidate immediately

## 7. Updating media (résumé, project images)

1. **Admin → Media** — upload file, copy public URL
2. **Admin → Profile / Projects / Site** — paste URL into the relevant field
3. **Save draft → Publish**

Media is stored in Supabase Storage, not in the Git repository or Postgres blobs.
