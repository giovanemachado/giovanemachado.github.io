## giovanemachado.github.io

<li><a href="https://giovanemachado.github.io/">giovanemachado.github.io</a></li>

Static personal site built with Astro. The build output is plain HTML/CSS in `dist/` and is deployed to GitHub Pages.

### utils

- `npm install` — install dependencies.
- `npm run dev` — local dev server with hot reload.
- `npm run build` — generate the static site into `dist/`.
- `npm run preview` — serve the built `dist/` locally.
- You can also serve a build with anything, for example `python3 -m http.server` inside `dist/`.
- Tailwind is pinned to `3.4.18` and runs as a PostCSS plugin during the Astro build. There is no CDN script and no separate CSS build step.
- Autodeploy on merge with `main` via GitHub Actions (`.github/workflows/deploy.yml`). After the first deploy, set **Settings → Pages → Source: GitHub Actions** once.

### structure

- `src/pages/` — routes. Astro pre-renders every page at build time.
  - `/` — pt-BR home.
  - `/en/` — en-us home.
  - `/posts/` — pt-BR blog archive.
  - `/posts/<slug>/` — pt-BR posts.
  - `/en/posts/` — en-us blog archive.
  - `/en/posts/<slug>/` — en-us posts.
  - `/404.html` — static bilingual 404.
- `src/data/posts.ts` — the single source of truth for posts (games, books, archive). Each post holds both languages.
- `src/i18n.ts` — UI copy (`STRINGS`) and the `Lang` type.
- `src/components/` — `BaseLayout` (head, header, sidebar, footer), `Header`, `Sidebar`, `StarList`, `PostView`, `ArchiveContent`, `HomeContent`, `DogBanner`.
- `src/styles/global.css` — Tailwind directives plus the hand-editable body background.
- `public/assets/` — images, served at `/assets/...`.

The only client-side JavaScript is the small inline script in `DogBanner.astro` that rotates the dogs on the home pages. Everything else is static HTML. There are no Astro islands or framework runtimes.

### blog posts

The home pages have no posts list in the main column — posts live in the sidebar `blogs` box. The sidebar shows the 5 most recent posts and links to the archive.

- Each post is one entry in `src/data/posts.ts`:
  - `slug`, `date`
  - `title`, `intro` — one value per language (`'pt-br'`, `'en-us'`)
  - `items` — optional list of `[title, rating]` pairs, sorted by rating at build time
  - `body` — optional raw HTML per language, rendered between the intro and the star list
  - `archive: true` — marks the archive post (rendered at `/posts/` and `/en/posts/` instead of a slug page)
- Games and books are the lists shared with the home sidebar. Edit them in `src/data/posts.ts`, not in a component.

#### add a new blog post

1. Duplicate an existing entry in `src/data/posts.ts` and update `slug`, `date`, `title`, `intro`, and optionally `items` / `body`.
2. Build (`npm run build`) or run `npm run dev`. Astro generates `/posts/<slug>/` and `/en/posts/<slug>/` automatically — no HTML or manifest edits.

#### delete a blog post

1. Remove its entry from `src/data/posts.ts`.
2. Its generated routes disappear on the next build.

#### disable the blog

1. Remove the `blogs` box from `src/components/Sidebar.astro`.
2. Remove `src/pages/posts/` and `src/pages/en/posts/`.
3. Rebuild and check both languages.

### protect main — local pre-push hook

Direct pushes to `main` are blocked by a local `pre-push` hook. Work on a feature branch and open a PR instead. Local commits on any branch (including `main`) are still allowed — only the push to `main` is blocked.

One-time setup per clone (`.git/hooks/` is not versioned, so each fresh clone needs this):

```sh
cp hooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

Verify:

```sh
git checkout -b test-hook
git push origin test-hook:main  # should be blocked
git push --no-verify origin test-hook:main  # bypass, not recommended
```

Notes:

- The hook lives at `hooks/pre-push` in the repo; the installed copy at `.git/hooks/pre-push` is what git actually runs.
- Local hooks can be bypassed with `--no-verify` and only apply after the setup step above. For hard enforcement, also enable branch protection in GitHub settings (not configured here).
