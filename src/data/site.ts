// Single source of truth for the canonical origin. Consumed by src/data/profile.ts,
// src/components/PageMeta.tsx, scripts/sitemap.mjs and the index.html transform in
// vite.config.ts, so changing the domain is a one-line edit in site.config.json.

import site from '../../site.config.json';

export const SITE_URL = site.url.replace(/\/+$/, '');
