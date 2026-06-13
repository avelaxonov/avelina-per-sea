# Avelina, per sea

Personal website of **Avelina Axonov** — marine ecologist, engineer, and writer.
A static, multi-page site: a portrait homepage, an engineering portfolio, a
literary section (*Weaver's Cradle*), a photo gallery, and an about page.

## Structure

```
.
├── index.html          # Homepage / hero
├── about.html          # About
├── portfolio.html      # Engineering portfolio (index)
├── project.html        # Individual project view (?p=<id>)
├── writer.html         # Weaver's Cradle — writing
├── poem.html           # Individual poem view
├── gallery.html        # Photography
├── tweaks-panel.jsx    # Editor-only UI (inert when deployed)
└── assets/
    ├── site.css        # Global styles
    ├── site.js         # Shared behavior (nav, reveals, lightbox)
    ├── poems.js        # Poetry data
    ├── tweaks-app.jsx  # Editor-only UI (inert when deployed)
    ├── logo.png
    ├── code/           # MATLAB sources linked from projects
    └── img/            # Photography + headshots
```

No build step. It's plain HTML, CSS, and JS — open `index.html` in a browser,
or serve the folder with any static host.

## Run locally

Just open `index.html`, or run a tiny static server so relative paths and the
`?p=` query routes behave exactly like production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy with GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*,
   pick your branch (e.g. `main`) and the `/ (root)` folder, and **Save**.
4. Your site goes live at `https://<username>.github.io/<repo>/` in a minute or two.

The included `.nojekyll` file tells Pages to serve everything as-is.

## Notes

- The Tweaks panel (`tweaks-panel.jsx`, `assets/tweaks-app.jsx`) only appears
  inside the design editor. On a deployed site it stays hidden — safe to keep.
- Fonts load from Google Fonts; an internet connection is needed for them.
