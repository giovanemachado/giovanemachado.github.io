## giovanemachado.github.io

<li><a href="https://giovanemachado.github.io/">giovanemachado.github.io</a></li>

### utils
- you can run the server with anything (it is just html and js), for example: `python3 - m http.server`, which will make it work on localhost:8000
- autodeploy on merge with main (see actions)
- uncomment `<!-- <script src="https://cdn.tailwindcss.com"></script> -->` for dev
- run `npx tailwindcss -o stuff/build.css --minify` to build tailwind css

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
