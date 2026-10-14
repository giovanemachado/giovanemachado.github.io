# AGENTS.md

Static personal site served via GitHub Pages. No package.json, tests, lint, or CI in repo. Merge to `main` deploys.

## Structure
- `index.html` — shell: loads `assets/build.css`, `assets/custom.css`, shared list data (`posts/games.js`, `posts/books.js`), `stuff/home.js`; `#home-content` filled from inlined constants (no fragment files, so no direct fragment URLs exist).
- `stuff/home.js` — home markup lives here as `HOME_PT` / `HOME_EN` / `STACK_HTML` constants rendered by `showContent()`. Keep `HOME_PT` / `HOME_EN` in sync structurally. `firstLoad()` defaults to `pt-br`, persists `lang` + `dogCounter` in localStorage, rotates 3 dog imgs from `assets/`.
- `stuff/sidebar.js` — shared sidebar renders used by both pages (`renderContact`, `renderBlogsBox` top-5 recent + archive link, `renderGames`/`renderBooks` top-5 by stars, `renderSidebar` calling all four). Sidebar boxes (contact/blogs/games/books) exist with the same IDs on `index.html` and `posts/blog.html`.
- `posts/blog.html` — blog shell. Loads `stuff/sidebar.js`, `stuff/blog.js` plus one `<script>` per post file. Same two-column layout + 4-box sidebar as home; no main-column post list (sidebar covers it).
- `posts/*.js` — one JS file per post (`posts/<slug>.js`). Each pushes `{ slug, date, title, intro, items }` to `window.POSTS_DATA` (`items` is an array of arrays, `title`/`intro` are `{ 'pt-br', 'en-us' }`). A post with `archive: true` (see `posts/all.js`) renders a complete newest-first link list of all posts instead of star rows. `stuff/blog.js` generates both `POSTS['<slug>-pt']` / `POSTS['<slug>-en']` bodies + `POSTS_META` entries. Keep the `-pt` / `-en` key suffixes: `counterpartOf` depends on them. Lists shared with home (games/books) are the single source of truth — edit them in the post file, not in `home.js`.
- `stuff/blog.js` — blog logic only (`POSTS` + `POSTS_META` registries, `registerPost()`/`renderPostBody()`/`renderArchiveBody()`, `firstLoadBlog()`, `showBlogList()` (renders post + shared sidebar), `showPost()`, blogs-box click interception). No post bodies live here.
- `assets/` — all images (`tralha.jpeg`, `treco.png`, `tirulico.png`, `favicon.png`) and CSS. `assets/custom.css` is the only hand-editable CSS (body bg). `assets/build.css` is generated, never hand-edit.
- `tailwind.config.js` content: `./*.html`, `./posts/**/*.{html,js}`, `./stuff/*.js` (JS included because markup is inlined in JS).

## Tailwind workflow (non-obvious, from readme.md)
- Dev: uncomment `<!-- <script src="https://cdn.tailwindcss.com"></script> -->` in `index.html` for live classes.
- Ship: comment the CDN line back out, then rebuild: `npx tailwindcss -o assets/build.css --minify`
- `index.html` CDN is currently commented out (ship state) — keep it that way when merging to `main`.

## Verify (no test suite)
- `fetch()` fails on `file://`; serve over http: `python3 -m http.server` then check both `pt-br`/`en-us` toggles and dog-image rotation.
