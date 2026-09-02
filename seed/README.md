# Seed assets (local only)

This folder is **gitignored**. Place media here before running `npm run cms:seed`.

Required for a full seed:

- `og.svg`
- `resume.pdf`
- Project thumbnails: `elisium-space.svg`, `cobra.svg`, `chess.svg`, `genai.svg`, `3d-portfolio.svg`, `hrms.svg`

Optional:

- `hero-sketch.webp` — pencil-style portrait for the home hero background (see below)

Files are uploaded to Supabase Storage during seeding; they are not stored in the Git repository.

**Re-running seed:** `npm run cms:seed` updates projects and other CMS entries. It **preserves your existing resume URL** and **hero sketch URL** if already set in Admin. To force-replace, use `SEED_FORCE_RESUME=true` or `SEED_FORCE_HERO_SKETCH=true`.

### Hero sketch image (lightweight print animation)

1. Export your portrait as a **sketch** (white/light strokes on transparent background works best).
2. Save as **WebP**, width ~800–1000px, target **under 150 KB** (use [Squoosh](https://squoosh.app) or similar).
3. Upload via **Admin → Media**, then set `heroSketchUrl` on the **Home** page entry and publish — or place `hero-sketch.webp` in this folder before seeding.

The site animates it with a CSS mask only (no canvas, no runtime filters), and **skips the image on mobile** to save bandwidth.
