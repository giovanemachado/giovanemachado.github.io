## giovanemachado.github.io

<li><a href="https://giovanemachado.github.io/">giovanemachado.github.io</a></li>

### utils
- you can run the server with anything (it is just html and js), for example: `python3 - m http.server`, which will make it work on localhost:8000
- autodeploy on merge with main (see actions)
- uncomment `<!-- <script src="https://cdn.tailwindcss.com"></script> -->` for dev
- run `npx tailwindcss -o assets/build.css --minify` to build tailwind css

### blog posts (currently disabled)

the blog is hidden on purpose: no `blog:` section on home, and direct urls like `/posts/blog.html?lang=pt-br&post=hello-pt` redirect to `/404.html`.

how it works:
- home section lives as `HOME_PT` / `HOME_EN` constants in `stuff/home.js` (rendered into `#home-content` by `showContent()` — no `fetch()`, no fragment files).
- each post lives in its own file in `posts/`: `posts/<slug>-pt.js` and `posts/<slug>-en.js` register `POSTS['<slug>-pt']` + a `POSTS_META` entry. the list is rendered by `renderPostsList()` in `stuff/blog.js`, keyed by slug (`hello-pt`), not file paths.
- post pages are rendered by `firstLoadBlog()` in `stuff/blog.js` via `posts/blog.html`, which loads `../stuff/blog.js` plus one `<script>` tag per post file.
- note: there are no fragment files, so direct urls like `/posts/hello-pt.html` don't exist and fall through to `/404.html`. only the `blog.html` entry point redirects via JS.

#### re-enable the blog

1. `stuff/home.js` (`HOME_PT` + `HOME_EN`): restore the `blog:` + `#posts-list` div in both constants, and in `showContent()` set `#posts-list` from the blog list renderer. both must be restored together, otherwise home redirects to 404.
2. `stuff/blog.js` (`firstLoadBlog`): delete the 2 lines (`goNotFound(); return;`) at the top.
3. serve with `python3 -m http.server` and check both `pt-br`/`en-us` toggles show the list, and a post url loads.

#### add a new blog post

1. duplicate `posts/hello-pt.js` to `posts/<slug>-pt.js` and `posts/hello-en.js` to `posts/<slug>-en.js`. update the `POSTS['<slug>-pt']` key, the `POSTS_META.push({ key, lang, title, date })` entry, and the markup inside. keep the `<slug>-pt` / `<slug>-en` naming: language switching (`counterpartOf`) depends on it.
2. list them — add one `<script>` line per file in `posts/blog.html` (after `../stuff/blog.js`):
   - `<script src="<slug>-pt.js"></script>`
   - `<script src="<slug>-en.js"></script>`
3. serve with `python3 -m http.server` and check the new entry appears in both languages and opens via `blog.html`.

#### delete a blog post

1. remove its 2 `<script>` lines from `posts/blog.html`.
2. delete its files (`posts/<slug>-pt.js`, `posts/<slug>-en.js`). old `blog.html?post=<slug>-*` urls then redirect to `/404.html`.

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
