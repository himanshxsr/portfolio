# Himanshu Aashish Portfolio

Next.js portfolio with a Supabase-backed admin CMS. Once deployed, content,
SEO, media, messages, and analytics are managed at `/admin` without changing
code or pushing a new deployment.

## Admin CMS setup

1. Create a Supabase project.
2. Run `supabase/migrations/0001_portfolio_cms.sql` in the Supabase SQL editor
   (or with the Supabase CLI).
3. Copy `.env.example` to `.env.local` and fill the Supabase URL, publishable
   key, service-role key, storage bucket, and contact hash secret.
4. Temporarily set `ADMIN_EMAIL` and a 12+ character `ADMIN_PASSWORD`, then run:

```bash
npm run cms:create-admin
npm run cms:seed
```

5. Remove `ADMIN_PASSWORD` from local and deployment environments.
6. Configure the same non-setup variables in Vercel and deploy once.
7. Sign in at `/admin/login`.

Public signup should remain disabled in Supabase Auth. The service-role key must
never use a `NEXT_PUBLIC_` prefix.

## Publishing workflow

Admin edits are saved as private drafts. Preview validates the draft without
exposing it publicly. Publish copies the draft into the public snapshot and
revalidates affected routes immediately.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
