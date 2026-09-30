# Gonzalo Daniel Vega — Portfolio

Personal portfolio of **Gonzalo Daniel Vega**, Full Stack Developer with product sense. Bilingual (es/en), built as an SPA with per-route prerendering: projects, a field journal, an interactive credential badge with a scannable QR, and a contact form that delivers to the inbox.

**Live at [gonzalodanielvega.com](https://gonzalodanielvega.com)**

<p align="center">
  <img src="docs/preview.jpg" alt="Gonzalo Daniel Vega portfolio preview" width="720" />
</p>

## Highlights

- **Credential badge (`DevBadge`)** — a conference-style ID card that flips to show a QR code. Scanning it downloads the localized PDF CV, served as an attachment by a server header rather than an HTML attribute, so it works from a scanned QR in any browser.
- **Real SEO, not sprinkles** — every route gets its own canonical, `hreflang` es/en/x-default, Open Graph / Twitter cards, and JSON-LD (`Person`, `CreativeWork`, `Article`). Unknown URLs are labeled `noindex` and collapse onto the homepage, so the SPA catch-all never leaks soft 404s into the index.
- **One source of truth for the domain** — the canonical origin lives in a single `site.config.json`, consumed by the runtime, the sitemap generator, and the `index.html` transform. Changing the domain is a one-line edit.

## Stack

- **React 19** + **Vite 6** + **TypeScript**
- **Tailwind CSS 4** via the official Vite plugin
- **React Router 7** — bilingual routes under `/en` with a custom `LanguageContext`
- **Motion** — animations
- **Lucide** — icons
- **qrcode** — QR generation in the credential badge
- **@fontsource** — Fraunces, IBM Plex Mono, Plus Jakarta Sans
- **Resend** — serverless contact form (`/api/contact`)
- **Playwright + sharp** — build-time prerendering and deterministic image optimization

## Scripts

```bash
npm install           # installs dependencies + Playwright Chromium (postinstall)
npm run dev           # dev server at http://localhost:3000
npm run build         # sitemap -> optimize foto -> vite build -> prerender
npm run preview       # serve the built site locally
npm run lint          # ESLint + typecheck (tsc --noEmit)
npm run format        # Prettier over src
npm run screenshots   # (re)capture published project covers as 1280x800 jpg
npm run optimize:foto # optimize the profile photo to webp
```

The build is fully reproducible: it generates and validates `sitemap.xml` (**fails** if a project has no published cover and no explicit fallback declared), optimizes the profile photo, compiles with Vite, then prerenders all 48 URLs (24 pages × es/en) with Playwright so crawlers receive static HTML.

## Running the contact form locally

`/api/contact` needs a Resend API key:

```bash
cp .env.example .env.local   # then fill in RESEND_API_KEY
```

Messages go straight to the author's inbox; nothing is stored server-side. Note that the default `onboarding@resend.dev` sender only delivers to the account owner's own email until a domain is verified in Resend.

## Project structure

```
api/contact.ts            Serverless contact endpoint (Resend)
scripts/                  Build: sitemap with cover guard, prerender, image optimization
src/components/           DevBadge, Layout, PageMeta (per-route SEO), StudioTapes, details
src/data/                 Projects, journal, tapes (es/en), profile and site config
src/i18n/                 LanguageContext, translations, helpers
src/lib/                  safeStorage
src/pages/                Home, Portfolio, Journal, About, Contact, 404
site.config.json          Canonical origin (the only place the domain lives)
vercel.json               Rewrites, cache headers, conditional PDF download
```

## Deployment

Designed for **Vercel** — `vercel.json` defines the build command, the SPA rewrites, and long-lived asset caching; a small `/api/cv` serverless function streams the résumé PDF as an attachment (while the plain `/cv-{es,en}.pdf` URLs keep previewing inline).

1. Push to GitHub and import the repo in Vercel (framework preset: **Vite**).
2. Set the env variable `RESEND_API_KEY` for the contact form.
3. Delegate your domain's nameservers to Vercel and add it to the project.
4. Node 22+ is recommended to match the local toolchain exactly.

## License

All rights reserved — this is a personal portfolio meant to be read, not copied. No license is granted for reuse of the code or content without explicit permission.