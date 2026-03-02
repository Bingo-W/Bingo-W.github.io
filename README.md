# Personal Academic Website

A clean, responsive, single-page academic website built with **plain HTML + CSS + vanilla JS** — no frameworks, no build step, no dependencies. Hosted on GitHub Pages.

🌐 **Live site:** `https://bingo-w.github.io/`

---

## File Structure

```
.
├── index.html          ← All content lives here (6 sections)
├── assets/
│   ├── style.css       ← All styles (CSS variables, dark mode, responsive)
│   ├── main.js         ← Nav highlighting, toggles, animations
│   ├── favicon.svg     ← SVG favicon (edit colours/initials freely)
│   └── cv.pdf          ← ⚠️  Add your actual CV here
└── README.md
```

---

## How to Edit Content

All content is in **`index.html`**. Each section is clearly delimited with an HTML comment like `<!-- § 1 HOME -->`. Find the section you need and edit the text directly.

### ✏️ Personal Info (Home section)

Search for `§ 1  HOME` in `index.html`. Update:

| Field | Where |
|---|---|
| Your name | `<h1 class="home-name">` |
| Title & affiliation | `.home-title` and `.home-affiliation` |
| Research identity line | `.home-identity` |
| Credibility chips | `.cred-chip` elements inside `.home-cred` |
| CV, Scholar, GitHub, Email links | `.home-buttons` — update `href` attributes |
| Bio paragraphs | `.home-bio` elements |

**To add a profile photo**, find the `.home-photo-placeholder` div and replace the inner `<svg>` with:
```html
<img src="/assets/photo.jpg" alt="Bin Wu" width="150" height="150" />
```
Then remove `aria-hidden="true"` from the parent `.home-photo-wrap`.

---

### 📰 Adding a News Item

Find `§ 5  NEWS`. Copy an existing `<li class="news-item">` and paste it at the **top** of the `#news-visible` list:

```html
<li class="news-item">
  <time class="news-date" datetime="2026-03">2026-03</time>
  <span class="news-text">Your news text here.</span>
</li>
```

To move older items out of the default view, cut them from `#news-visible` and paste them into `#news-hidden` (revealed by the "Show older news" button).

---

### 📄 Adding a Publication

Find `§ 3  PUBLICATIONS`. Copy an existing `<li class="pub-entry">` block. Update:

- **Title:** `<div class="pub-title">`
- **Authors:** `<div class="pub-authors">` — wrap your name in `<strong>Bin Wu</strong>`
- **Venue badge:** `<span class="venue-badge">NeurIPS 2025</span>`
- **Links:** update `href="#"` to real URLs
- **BibTeX:** give `data-bibtex="pubN"` a unique ID and add a matching `<pre class="bibtex-block" id="bibtex-pubN" hidden>…</pre>`

For preprints, use `<span class="venue-badge preprint-badge">arXiv 2025</span>`.

---

### 🗂 Adding a Project Card

Find `§ 4  PROJECTS`. Copy an `<article class="project-card">` block. Update:

- **Name:** `<h3 class="project-name">`
- **Tags:** add/remove `<span class="tag">` elements (Optimization / Search / Evaluation / QA / Systems)
- **Summary:** `<p class="project-summary">`
- **Bullets:** `<ul class="project-bullets">` items
- **Links:** `<div class="project-links">` — update `href` values

---

### 🎨 Changing Colours / Fonts

Open `assets/style.css` and edit the CSS variables at the top (Section 1):

```css
:root {
  --clr-accent:  #2563eb;  /* Main accent colour */
  --clr-bg:      #ffffff;  /* Page background */
  --clr-text:    #111827;  /* Body text */
}
```

Dark mode overrides live in Section 16 (`@media (prefers-color-scheme: dark)`).

To use Google Fonts, add a `<link>` in `<head>` and set `--font-sans` in `:root`.

---

### 🔖 Updating Metadata / SEO

In `index.html` `<head>`, update the `<title>`, `<meta name="description">`, and Open Graph tags. Add `assets/og-image.png` (1200×630 px) for social card previews.

---

## Deploying to GitHub Pages

1. Push this repo to GitHub as `<your-username>.github.io`.
2. Go to **Settings → Pages → Source**: `Deploy from a branch` → `main` → `/ (root)`.
3. Save. Site goes live at `https://<your-username>.github.io/` within ~1 minute.

**To update:** just push to `main` — GitHub Pages redeploys automatically.

**Custom domain:** add a `CNAME` file containing your domain, configure DNS per the [GitHub Pages docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), then enable HTTPS under Settings → Pages.

---

## Pre-Launch Checklist

- [ ] Replace all `[placeholder]` text (name, university, advisor, email)
- [ ] Add real URLs: CV PDF, Google Scholar, GitHub, email
- [ ] Replace `href="#"` placeholders with real links in publications & projects
- [ ] Add profile photo (`/assets/photo.jpg`) and update the HTML
- [ ] Update Open Graph `og:url` and `og:image` in `<head>`
- [ ] Test on mobile (Chrome DevTools → Toggle device toolbar)
- [ ] Test keyboard navigation (Tab through the page; all links reachable)
- [ ] Check dark mode (System Preferences → Appearance → Dark)

---

## Tech Notes

- No framework, no build step — edit and push.
- CSS custom properties make retheme trivial (~5 variable changes).
- `IntersectionObserver` (native) drives nav section highlighting and scroll animations.
- `prefers-reduced-motion` is respected — all animations disable automatically.
- `prefers-color-scheme: dark` is respected automatically.
- Semantic HTML + ARIA attributes ensure screen-reader compatibility.
