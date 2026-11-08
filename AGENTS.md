# AGENTS.md

Static personal site built with Astro and deployed to GitHub Pages. The build output is plain HTML/CSS in `dist/`. There are no tests or lint scripts; `astro build` is the verification step.

## Structure

- `src/pages/` — all routes. Every page is pre-rendered.
  - `index.astro` — pt-BR home (`/`).
  - `en/index.astro` — en-us home (`/en/`).
  - `posts/index.astro` — pt-BR archive (`/posts/`).
  - `posts/[slug].astro` — pt-BR posts (`/posts/<slug>/`).
  - `en/posts/index.astro` — en-us archive (`/en/posts/`).
  - `en/posts/[slug].astro` — en-us posts (`/en/posts/<slug>/`).
  - `404.astro` — static bilingual 404.
- `src/data/posts.ts` — single source of truth for posts. `Post` shape: `slug`, `date`, `title`, `intro` (both languages), optional `body`, optional `items` (`[title, rating][]`), optional `archive: true`. Also exports `getItems`, `recentPosts`, `sortByStars`, `top5ByStars`, `archivePost`.
- `src/i18n.ts` — `Lang` (`'pt-br' | 'en-us'`), the `STRINGS` copy table, `t()`, `isEn()`, `otherLang()`.
- `src/components/` — `BaseLayout.astro` (head, header, sidebar, footer), `Header.astro`, `Sidebar.astro`, `StarList.astro`, `PostView.astro`, `ArchiveContent.astro`, `HomeContent.astro`, `DogBanner.astro`.
- `src/styles/global.css` — Tailwind directives + hand-editable body background. Never hand-edit generated CSS.
- `public/assets/` — images served at `/assets/...`.
- `.github/workflows/deploy.yml` — builds and deploys `dist/` to GitHub Pages on push to `main`.

## Routing and languages

- `/` is the Portuguese home. English is reached only by clicking `en-us` or sharing an `/en/` URL. There is no `/pt/` and no redirect page.
- Language links point to the counterpart route of the current page (e.g. `/posts/games/` ↔ `/en/posts/games/`).
- `hreflang` alternate links are emitted in `BaseLayout.astro`.
- Old `posts/blog.html?lang=…&post=…` URLs are gone and fall through to `404.html`.

## Client JavaScript

- The only shipped JS is the inline `is:inline` script in `DogBanner.astro`, used on the two home pages to rotate the dog image via `localStorage.dogCounter`.
- No Astro islands, no framework integration, no hydrating components. Keep it that way unless the user explicitly asks.

## Tailwind

- Pinned to `3.4.18` via `postcss.config.cjs` + `tailwind.config.cjs`.
- Config content scans `./src/**/*.{astro,html,js,ts,jsx,tsx,md}`.
- Classes must be literal strings in `.astro` files so Tailwind can detect them.

## Common tasks

### Add a post

1. Add an entry to `src/data/posts.ts` with both languages.
2. Astro generates `/posts/<slug>/` and `/en/posts/<slug>/` automatically.

### Delete a post

Remove the entry from `src/data/posts.ts`; its routes disappear on the next build.

### Disable the blog

1. Remove the `blogs` box from `src/components/Sidebar.astro`.
2. Remove `src/pages/posts/` and `src/pages/en/posts/`.
3. Rebuild and check both languages.

## Verify

```sh
npm install
npm run build
python3 -m http.server -d dist
```

Check `/`, `/en/`, `/posts/`, `/en/posts/`, one post in each language, both language toggles, and the dog rotation across reloads. `find dist -name '*.js'` should return nothing (the dog script is inline).

## Notes

- Assets use absolute `/assets/...` paths; this repo is the `giovanemachado.github.io` user site, so the base path is `/`.
- `hooks/pre-push` blocks direct pushes to `main`; feature branch + PR is required.
