# AGENTS.md

Static personal site served via GitHub Pages. No package.json, tests, lint, or CI in repo. Merge to `main` deploys.

## Structure
- `index.html` — mount point (`#shell`) + `bootHome()`. Loads `assets/build.css`, `assets/custom.css`, `posts/manifest.js` + `stuff/site.js` (auto-loads post data), `stuff/home.js`. (No fragment files, so no direct fragment URLs exist.)
- `stuff/site.js` — shared foundation: lang tags, `STRINGS` copy table, sort/star/post helpers, manifest loader (`ensureDataLoaded`), and the shared page shell (`renderShell()` + `bootNotFound()`). Page chrome (header, 4 sidebar boxes, footer) lives here once — edit layout here, not in the HTML files.
- `stuff/home.js` — home markup lives here as `homeTemplate()` rendered by `showContent()`. All UI copy for both languages lives in the `STRINGS` table in `stuff/site.js`. `firstLoad()` defaults to `pt-br`, persists `lang` + `dogCounter` in localStorage, rotates 3 dog imgs from `assets/`.
- `stuff/sidebar.js` — shared sidebar renders used by both pages (`renderContact`, `renderBlogsBox` top-5 recent + archive link, `renderStarList` top-5 by stars backing `renderGames`/`renderBooks`, `renderSidebar` calling all four). Sidebar boxes (contact/blogs/games/books) exist with the same IDs on `index.html` and `posts/blog.html`.
- `posts/blog.html` — mount point (`#shell`) + `bootBlog()`. Loads `manifest.js`, `stuff/site.js`, `stuff/sidebar.js`, `stuff/blog.js` (post files auto-load from the manifest; no per-post `<script>` tags). No main-column post list (sidebar covers it).
- `posts/*.js` — one JS file per post (`posts/<slug>.js`). Each pushes `{ slug, date, title, intro, body?, items? }` to `window.POSTS_DATA` (`items` is an array of arrays, `title`/`intro`/`body` are `{ 'pt-br', 'en-us' }`; `body` is raw HTML rendered verbatim between `intro` and the star list, omit it for list-only posts). A post with `archive: true` (see `posts/all.js`) renders a complete newest-first link list of all posts instead of body/star rows. `stuff/blog.js` generates both `POSTS['<slug>-pt']` / `POSTS['<slug>-en']` bodies from it. Keep the `-pt` / `-en` key suffixes: `counterpartOf` depends on them. Lists shared with home (games/books) are the single source of truth — edit them in the post file, not in `home.js`.
- `stuff/blog.js` — blog logic only (`POSTS` registry, `registerPost()`/`renderPostBody()`/`renderArchiveBody()`, `firstLoadBlog()`, `showBlogList()` (renders post + shared sidebar), `showPost()`, blogs-box click interception). No post bodies live here.
- `assets/` — all images (`tralha.jpeg`, `treco.png`, `tirulico.png`, `favicon.png`) and CSS. `assets/custom.css` is the only hand-editable CSS (body bg). `assets/build.css` is generated, never hand-edit.
- `tailwind.config.js` content: `./*.html`, `./posts/**/*.{html,js}`, `./stuff/*.js` (JS included because markup is inlined in JS).

## Tailwind workflow (non-obvious, from readme.md)
- Dev: uncomment `<!-- <script src="https://cdn.tailwindcss.com"></script> -->` in `index.html` for live classes.
- Ship: comment the CDN line back out, then rebuild: `npx tailwindcss@3.4.18 -o assets/build.css --minify` (pinned: `main` was built with 3.4.18; unpinned `npx tailwindcss` regressed it to 3.4.13 once)
- `index.html` CDN is currently commented out (ship state) — keep it that way when merging to `main`.

## Verify (no test suite)
- `fetch()` fails on `file://`; serve over http: `python3 -m http.server` then check both `pt-br`/`en-us` toggles and dog-image rotation.
