## giovanemachado.github.io

<li><a href="https://giovanemachado.github.io/">giovanemachado.github.io</a></li>

### utils
- you can run the server with anything (it is just html and js), for example: `python3 - m http.server`, which will make it work on localhost:8000
- autodeploy on merge with main (see actions)
- uncomment `<!-- <script src="https://cdn.tailwindcss.com"></script> -->` for dev
- run `npx tailwindcss -o stuff/build.css --minify` to build tailwind css

### blog posts (currently disabled)

the blog is hidden on purpose: no `blog:` section on home, and direct urls like `/posts/blog.html?lang=pt-br&post=hello-pt.html` redirect to `/404.html`.

how it works:
- home section lives in `home-pt.html` / `home-en.html` (`#posts-list`), filled by `showContent()` in `stuff/lang.js` fetching `posts/posts-pt.html` / `posts/posts-en.html`.
- post pages are rendered by `firstLoadBlog()` in `stuff/blog.js` via `posts/blog.html`.
- note: raw fragment files (e.g. `/posts/hello-pt.html`) are still servable as static files; only the `blog.html` entry point redirects. for hard blocking, delete or `git mv` the fragment files.

#### re-enable the blog

1. `home-pt.html` + `home-en.html`: uncomment the `<!-- BLOG DISABLED ... -->` block (restores the `blog:` + `#posts-list` div).
2. `stuff/lang.js` (`showContent`): uncomment all `// BLOG DISABLED` lines (restores `postsFileName`, `fetch(postsFileName)`, `postsResponse`, and the `document.getElementById("posts-list")` assignment). both must be restored together, otherwise home redirects to 404.
3. `stuff/blog.js` (`firstLoadBlog`): delete the 2 `// BLOG DISABLED` lines (`goNotFound(); return;`) at the top.
4. serve with `python3 -m http.server` and check both `pt-br`/`en-us` toggles show the list, and a post url loads.

#### add a new blog post

1. duplicate `posts/hello-pt.html` to `posts/<slug>-pt.html`, and `posts/hello-en.html` to `posts/<slug>-en.html`. keep the `<slug>-pt.html` / `<slug>-en.html` naming: language switching in `stuff/blog.js` (`counterpartOf`) depends on it.
2. edit the title/date/body inside each new file.
3. list them — add one line in each list file (keep both in sync structurally):
   - `posts/posts-pt.html`: `<li>* <a class="underline" href="/posts/blog.html?lang=pt-br&post=<slug>-pt.html">title (YYYY-MM-DD)</a></li>`
   - `posts/posts-en.html`: `<li>* <a class="underline" href="/posts/blog.html?lang=en-us&post=<slug>-en.html">title (YYYY-MM-DD)</a></li>`
4. serve with `python3 -m http.server` and check the new entry appears in both languages and opens via `blog.html`.

#### delete a blog post

1. remove its `<li>` line from `posts/posts-pt.html` and `posts/posts-en.html`.
2. delete its fragment files (`posts/<slug>-pt.html`, `posts/<slug>-en.html`). old `blog.html?post=<slug>-*.html` urls then redirect to `/404.html`.

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
