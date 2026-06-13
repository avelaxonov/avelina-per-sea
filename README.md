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
