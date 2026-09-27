# AGENTS.md

Static personal site served via GitHub Pages. No package.json, tests, lint, or CI in repo. Merge to `main` deploys.

## Structure
- `index.html` — shell: loads `stuff/build.css`, `stuff/custom.css`, `stuff/lang.js`; `#home-content` filled by fetch.
- `home-pt.html` / `home-en.html` — language fragments fetched by `showContent()` in `stuff/lang.js`. Keep in sync structurally.
- `stuff/lang.js` — `firstLoad()` defaults to `pt-br`, persists `lang` + `dogCounter` in localStorage, rotates 3 dog imgs.
- `stuff/custom.css` — only hand-editable CSS (body bg). `stuff/build.css` is generated, never hand-edit.
- `tailwind.config.js` content: `./index.html`, `./posts/**` (`posts/` absent; keep glob).

## Tailwind workflow (non-obvious, from readme.md)
- Dev: uncomment `<!-- <script src="https://cdn.tailwindcss.com"></script> -->` in `index.html` for live classes.
- Ship: comment the CDN line back out, then rebuild: `npx tailwindcss -o stuff/build.css --minify`
- `index.html` currently has CDN enabled — disable + rebuild before merging to `main`.

## Verify (no test suite)
- `fetch()` fails on `file://`; serve over http: `python3 -m http.server` then check both `pt-br`/`en-us` toggles and dog-image rotation.
