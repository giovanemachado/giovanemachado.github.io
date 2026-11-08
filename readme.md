## giovanemachado.github.io

<li><a href="https://giovanemachado.github.io/">giovanemachado.github.io</a></li>

Static personal site built with Astro and deployed to GitHub Pages. The build output is plain HTML/CSS in `dist/`.

### utils

- `npm install` — install dependencies.
- `npm run dev` — local dev server with hot reload.
- `npm run build` — generate the static site into `dist/`.
- `npm run preview` — serve the built `dist/` locally.
- You can also serve a build with anything, for example `python3 -m http.server` inside `dist/`.
- Tailwind is pinned to `3.4.18` and runs during the Astro build. There is no CDN script and no separate CSS build step.
- Autodeploy on merge with `main` via GitHub Actions (`.github/workflows/deploy.yml`). After the first deploy, set **Settings → Pages → Source: GitHub Actions** once.

### blog

The home pages have no posts list in the main column — posts live in the sidebar `blogs` box. The sidebar shows the 5 most recent posts and links to the archive. Portuguese lives at `/posts/` and English at `/en/posts/`.

Each post is a folder under `src/content/posts/<slug>/` with two Markdown files, one per language:

```
src/content/posts/my-post/
  pt.md
  en.md
```

Frontmatter:

```md
---
title: meu post
date: "2026-11-08"
items:
  - ["some game", 5]
---

Text of the post in Markdown.
```

- `title`, `date` are required.
- `items` is optional. It renders the star list below the Markdown body. **Items are shown in file order** — there is no automatic sorting. The sidebar shows the first 5 items, so put your highest-rated entries first.
- `slug` and language come from the path: `my-post/pt.md` → `/posts/my-post/`, `my-post/en.md` → `/en/posts/my-post/`.
- Games and books are regular posts: `src/content/posts/games/` and `src/content/posts/books/`.

#### add a new blog post

1. Create `src/content/posts/<slug>/pt.md` and `src/content/posts/<slug>/en.md` with the frontmatter and Markdown body.
2. Build (`npm run build`) or run `npm run dev`. Astro generates both language routes automatically.

#### delete a blog post

1. Delete the `src/content/posts/<slug>/` folder.
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
