# Fundación Tierra Pura - Website

Static website for [Fundación Tierra Pura](https://tierrapura.com/), a nonprofit foundation promoting nature-based solutions to climate change.

## Hosting

The site is hosted on **GitHub Pages** at https://tierrapura.github.io/. Pushing to the `main` branch automatically deploys the site.

## Structure

```
/
├── index.html                    # Homepage (Spanish)
├── observatorio.html             # Observatory page
├── arr-galicia.html              # Project pages...
├── agricultura-regenerativa.html
├── ...
├── en/                           # English translations (same structure)
│   ├── index.html
│   ├── observatorio.html
│   └── ...
├── observatorio/                 # Observatory subpages
│   ├── mapa.html
│   └── lineamientos.html
├── proyectos-observatorio/       # Observatory project pages (43 pages)
│   └── ...
└── assets/
    ├── lang-switcher.js          # Language toggle (ES/EN)
    ├── 60edb1a84e4f6adeebb0bc74/ # Main site assets
    │   ├── css/                  # Webflow CSS
    │   ├── js/                   # Webflow JS (animations)
    │   └── *.webp                # Images (WebP optimized)
    └── 60ede0e039ec9dc737c6c5bb/ # Team photos
```

## Making changes

Edit HTML files directly. The site uses Webflow's CSS classes for styling — the stylesheet is at `assets/.../css/tierrapura.webflow.shared.aa059ec0c.css`.

**To add a new image:** convert it to WebP first (`cwebp -q 80 image.jpg -o image.webp`) and place it in the assets directory.

**To edit text or content:** modify the relevant `.html` file. Spanish pages are at the root, English translations are under `/en/`.

**To deploy:** commit and push to `main`. GitHub Pages will auto-deploy within a few minutes.

## Custom domain

To point `tierrapura.com` to this site:

1. In your DNS provider, add these records:
   - `A` record for `tierrapura.com` → `185.199.108.153`
   - `A` record for `tierrapura.com` → `185.199.109.153`
   - `A` record for `tierrapura.com` → `185.199.110.153`
   - `A` record for `tierrapura.com` → `185.199.111.153`
   - `CNAME` record for `www` → `tierrapura.github.io`

2. Add a `CNAME` file to the repo root containing `tierrapura.com`

3. In repo Settings > Pages, set the custom domain to `tierrapura.com`

## History

This site was migrated from Webflow + Weglot (which cost ~$700/year) to a static site hosted for free on GitHub Pages in March 2026. The migration preserved all content, styling, and translations.

### What was removed
- Webflow tracking scripts
- Weglot translation widget (replaced with static language switcher)
- Google Tag Manager (can be re-added if needed)
- Twitter and Instagram social links

### What was kept
- All Webflow CSS and animation JS
- All page content and images
- English translations (under `/en/`)
