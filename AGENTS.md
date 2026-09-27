# AGENTS.md

Static personal site served via GitHub Pages. No package.json, tests, lint, or CI in repo. Merge to `main` deploys.

## Structure
- `index.html` — shell: loads `assets/build.css`, `assets/custom.css`, `stuff/home.js`; `#home-content` filled from inlined constants (no fragment files, so no direct fragment URLs exist).
- `stuff/home.js` — home/stack/links markup lives here as `HOME_PT` / `HOME_EN` / `STACK_HTML` / `LINKS_HTML` constants rendered by `showContent()`. Keep `HOME_PT` / `HOME_EN` in sync structurally. `firstLoad()` defaults to `pt-br`, persists `lang` + `dogCounter` in localStorage, rotates 3 dog imgs from `assets/`.
- `posts/blog.html` — blog shell (full page, redirects to 404 while blog disabled). Loads `stuff/blog.js` plus one `<script>` per post file.
- `posts/*.js` — one JS file per post per language (`posts/<slug>-pt.js`, `posts/<slug>-en.js`). Each registers `POSTS['<slug>-pt']` markup + a `POSTS_META` entry (`key`, `lang`, `title`, `date`). Keep `<slug>-pt` / `<slug>-en` naming: `counterpartOf` depends on it.
- `stuff/blog.js` — blog logic only (`POSTS` + `POSTS_META` registries, `renderPostsList()`, `firstLoadBlog()`, `showBlogList()`, `showPost()`). No post bodies live here.
- `assets/` — all images (`tralha.jpeg`, `treco.png`, `tirulico.png`, `favicon.png`) and CSS. `assets/custom.css` is the only hand-editable CSS (body bg). `assets/build.css` is generated, never hand-edit.
- `tailwind.config.js` content: `./*.html`, `./posts/**/*.{html,js}`, `./stuff/*.js` (JS included because markup is inlined in JS).

## Tailwind workflow (non-obvious, from readme.md)
- Dev: uncomment `<!-- <script src="https://cdn.tailwindcss.com"></script> -->` in `index.html` for live classes.
- Ship: comment the CDN line back out, then rebuild: `npx tailwindcss -o assets/build.css --minify`
- `index.html` currently has CDN enabled — disable + rebuild before merging to `main`.

## Verify (no test suite)
- `fetch()` fails on `file://`; serve over http: `python3 -m http.server` then check both `pt-br`/`en-us` toggles and dog-image rotation.
