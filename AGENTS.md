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
- `src/content.config.ts` — Astro content collection `posts`, loaded from `src/content/posts/**/*.md`. Schema: `title` (string), `date` (string), `items` (`[title, rating][]`, optional), `type` (`'post' | 'game'`, default `'post'`), `embed` (string, optional).
- `src/content/posts/<slug>/{pt,en}.md` — one Markdown file per post per language. `slug` and language are derived from the path (`games-i-ve-played/pt.md` → slug `games-i-ve-played`, lang `pt-br`). The Markdown body is the post content. `items` renders a star list below it. A post with `type: game` and `embed` renders a responsive iframe above the body.
- `src/lib/posts.ts` — `postsFor(lang)`, `recentPostsFor(lang)`, `postPath()`, `archivePath()`, `topItems()`, plus the game helpers `gamesFor()`, `recentGamesFor()`, `gamesArchivePath()` and the `GAMES_ENABLED` flag. No star sorting: `items` is displayed in file order and the sidebar takes the first 5.
- `src/data/archive.ts` — title/intro/date copy for the generated archive pages.
- `src/i18n.ts` — `Lang` (`'pt-br' | 'en-us'`), the `STRINGS` copy table, `t()`, `isEn()`, `otherLang()`.
- `src/components/` — `BaseLayout.astro` (head, header, sidebar, footer), `Header.astro`, `Sidebar.astro`, `StarList.astro`, `PostView.astro`, `ArchiveContent.astro`, `HomeContent.astro`, `DogBanner.astro`.
- `src/styles/global.css` — Tailwind directives + hand-editable body background. Never hand-edit generated CSS.
- `public/assets/` — images served at `/assets/...`.
- `.github/workflows/deploy.yml` — builds and deploys `dist/` to GitHub Pages on push to `main`.

## Routing and languages

- `/` is the Portuguese home. English is reached only by clicking `en-us` or sharing an `/en/` URL. There is no `/pt/` and no redirect page.
- Language links point to the counterpart route of the current page (e.g. `/posts/games-i-ve-played/` ↔ `/en/posts/games-i-ve-played/`).
- `hreflang` alternate links are emitted in `BaseLayout.astro`.
- Old `posts/blog.html?lang=…&post=…` URLs are gone and fall through to `404.html`.

## Games

- Games are regular posts under `src/content/posts/<slug>/` with `type: game` and an `embed` iframe URL. They keep the same routes and language toggles as any post.
- `PostView.astro` renders the embed in `.game-embed` (CSS aspect-ratio in `src/styles/global.css`), above the Markdown body.
- Games are currently hidden: `GAMES_ENABLED = false` in `src/lib/posts.ts` filters every `type: game` post out of the lists and skips its routes via `getStaticPaths`.
- The sidebar "my games" box only renders when `myGames.length > 0`, so it disappears while games are disabled.
- The `/my-games/` archive pages, `GameArchiveContent.astro`, and `src/data/games.ts` were removed while disabled. To re-enable: set `GAMES_ENABLED = true` and restore those files; the sidebar box and game post pages return automatically.

## Client JavaScript

- The only shipped JS is the inline `is:inline` script in `DogBanner.astro`, used on the two home pages to rotate the dog image via `localStorage.dogCounter`.
- No Astro islands, no framework integration, no hydrating components. Keep it that way unless the user explicitly asks.

## Tailwind

- Pinned to `3.4.18` via `postcss.config.cjs` + `tailwind.config.cjs`.
- Config content scans `./src/**/*.{astro,html,js,ts,jsx,tsx,md}`.
- Classes must be literal strings in `.astro` files so Tailwind can detect them.

## Daily usage

Dev commands, post authoring, blog removal, and deploy steps live in `readme.md`. Keep that file focused on usage; structural and architecture details belong here.

## Verify

```sh
npm install
npm run build
python3 -m http.server -d dist
```

Check `/`, `/en/`, `/posts/`, `/en/posts/`, one post in each language, both language toggles, and the dog rotation across reloads. `find dist -name '*.js'` should return nothing (the dog script is inline). While `GAMES_ENABLED` is false, confirm there are no game links, no `/my-games/` routes, and no `/posts/contact-at-6-oclock/` routes in `dist/`.

## Notes

- Assets use absolute `/assets/...` paths; this repo is the `giovanemachado.github.io` user site, so the base path is `/`.
- `hooks/pre-push` blocks direct pushes to `main`; feature branch + PR is required.
