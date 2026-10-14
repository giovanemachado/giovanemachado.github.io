## giovanemachado.github.io

<li><a href="https://giovanemachado.github.io/">giovanemachado.github.io</a></li>

### utils
- you can run the server with anything (it is just html and js), for example: `python3 -m http.server`, which will make it work on localhost:8000
- autodeploy on merge with main (see actions)
- uncomment `<!-- <script src="https://cdn.tailwindcss.com"></script> -->` for dev
- run `npx tailwindcss -o assets/build.css --minify` to build tailwind css

### blog posts (enabled)

home has no posts list in the main column — posts live only in the sidebar `blogs` box, and `posts/blog.html` renders them. direct urls like `/posts/blog.html?lang=pt-br&post=games-pt` work; bare `posts/blog.html` shows the list. when `lang=` and the post suffix disagree, the post suffix wins (page shows that language and syncs `lang=` to it).

how it works:
- home section lives as `homeTemplate()` in `stuff/home.js` (rendered into `#home-content` by `showContent()` — no `fetch()`, no fragment files; copy lives in the `STRINGS` table in `stuff/site.js`). the sidebar (`#sidebar-column`, shared with `posts/blog.html` via `stuff/sidebar.js`) holds contact/blogs/games/books boxes: blogs shows the 5 most recent post titles + archive link, games + books show top 5 by stars (`top5ByStars`) with a `ver lista completa / see full list` link to their post.
- each post lives in a single file in `posts/`: `posts/<slug>.js` pushes `{ slug, date, title, intro, items }` to `window.POSTS_DATA` (`items` is an array of arrays, `title`/`intro` hold both languages). a post with `archive: true` (see `posts/all.js`) renders a complete newest-first link list of all posts instead of star rows. `stuff/blog.js` generates both `POSTS['<slug>-pt']` / `POSTS['<slug>-en']` bodies from it. lists shared with home (games/books) live in their post file and are also loaded by `index.html`.
- post pages are rendered by `firstLoadBlog()` in `stuff/blog.js` via `posts/blog.html`, which loads `manifest.js` (post file list) plus `../stuff/site.js` / `../stuff/sidebar.js` / `../stuff/blog.js`. `ensureDataLoaded()` in `stuff/site.js` fetches the listed post files, so neither page needs one `<script>` tag per post.
- note: there are no fragment files, so direct urls like `/posts/games.html` don't exist and fall through to `/404.html`. only the `blog.html` entry point redirects via JS.

#### disable the blog

1. `stuff/sidebar.js` (`renderSidebar`): drop the `renderBlogsBox(lang)` call.
2. `stuff/blog.js` (`firstLoadBlog`): add `goNotFound(); return;` at the top.
3. serve with `python3 -m http.server` and check both `pt-br`/`en-us` toggles still work and post urls redirect to `/404.html`.

#### add a new blog post

1. duplicate `posts/games.js` to `posts/<slug>.js`. update `slug`, `date`, `title`/`intro` (both languages), and `items` (array of arrays, omit or leave empty for a text-only post; set `archive: true` instead for a full posts index like `posts/all.js`). the `-pt` / `-en` post keys are generated from the slug: language switching (`counterpartOf`) depends on the slug staying the same in both.
2. list it — append `'<slug>'` to `window.POSTS_FILES` in `posts/manifest.js`. no HTML edits needed (`stuff/site.js` loads the files automatically, resolving `posts/` from the manifest tag).
3. serve with `python3 -m http.server` and check the new entry appears in both languages and opens via `blog.html`.

#### delete a blog post

1. remove its entry from `window.POSTS_FILES` in `posts/manifest.js`.
2. delete its file (`posts/<slug>.js`). old `blog.html?post=<slug>-*` urls then redirect to `/404.html`.

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
