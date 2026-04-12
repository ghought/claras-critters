# Clara's Critters — website

Marketing site for Clara's Critters, a pet-sitting business in Bozeman, Montana.

- **Stack:** [Eleventy (11ty)](https://www.11ty.dev/) static site generator + hand-written CSS
- **Hosting:** Netlify (free tier)
- **Forms:** Netlify Forms (no backend code)
- **Admin:** [Decap CMS](https://decapcms.org/) at `/admin/`, gated behind Netlify Identity
- **Cost to run:** $0/month, plus the domain

> **Design principle:** simple over clever. Boring tech is feature-complete and easy to maintain.

---

## Run it locally

```bash
npm install
npm start
```

Then open http://localhost:8080.

The admin UI at http://localhost:8080/admin/ requires Netlify Identity, which only works against the deployed site. To preview content changes locally, edit the JSON files under `src/_data/` directly.

To produce a production build:

```bash
npm run build
```

The output goes to `_site/`.

---

## Project layout

```
├── .eleventy.js               # 11ty config + image shortcode
├── netlify.toml               # Netlify build + cache headers
├── package.json
├── uploads/                   # Decap CMS image uploads (committed to git)
├── src/
│   ├── index.njk              # Homepage (single-page site)
│   ├── thanks.njk             # Form submission thank-you page
│   ├── 404.njk
│   ├── sitemap.njk            # → /sitemap.xml
│   ├── robots.txt
│   ├── _includes/
│   │   └── layouts/base.njk   # HTML shell, fonts, OpenGraph, JSON-LD
│   ├── _data/                 # All editable site content
│   │   ├── site.json
│   │   ├── about.json
│   │   ├── services.json
│   │   ├── rates.json
│   │   ├── gallery.json
│   │   └── testimonials.json
│   ├── admin/
│   │   ├── index.html         # Decap CMS shell
│   │   └── config.yml         # Decap CMS field schema
│   └── assets/
│       ├── css/main.css
│       └── js/main.js
```

The site is intentionally **single-page with anchor navigation**. All sections live in `src/index.njk`. There are no per-section template partials because there is no section reuse.

---

## Adding or editing content

### The normal way (recommended)

Once the site is deployed, Clara should use the admin portal at **`/admin/`**. See `HANDOFF.md` for the non-technical walkthrough.

### The developer way

Every editable field lives in a JSON file under `src/_data/`. Edit those files directly, save, and 11ty will rebuild.

| Section       | File                       |
|---------------|----------------------------|
| Site settings | `src/_data/site.json`      |
| About         | `src/_data/about.json`     |
| Services      | `src/_data/services.json`  |
| Rates         | `src/_data/rates.json`     |
| Gallery       | `src/_data/gallery.json`   |
| Testimonials  | `src/_data/testimonials.json` |

### Adding a new service

1. Open `src/_data/services.json`.
2. Add a new object to the `items` array:
   ```json
   {
     "title": "Pet taxi",
     "description": "Rides to and from the vet, groomer, or daycare.",
     "emoji": "🚗"
   }
   ```
3. Save. The new service appears on the homepage **and** as an option in the contact form's "service interest" dropdown automatically.

### Adding a new rate

1. Open `src/_data/rates.json` and add to `items`:
   ```json
   {
     "service": "Holiday surcharge",
     "duration": "Per visit",
     "price": "+$10",
     "notes": "Thanksgiving, Christmas Eve, Christmas Day, New Year's Day."
   }
   ```

### Adding gallery photos

1. Drop the image into `uploads/` (or upload via the admin portal).
2. Add an entry to `src/_data/gallery.json`:
   ```json
   {
     "image": "/uploads/cooper-on-the-trail.jpg",
     "alt": "A black lab smiling on a snowy trail",
     "caption": "Cooper, January regular."
   }
   ```

---

## Images

The 11ty image plugin (`@11ty/eleventy-img`) auto-compresses images at build time and emits responsive `<picture>` markup with WebP + JPEG fallbacks. It works with both:

- **Repo files** under `/uploads/...` (Clara's CMS uploads)
- **Remote URLs** (the placeholder Unsplash photos shipped with v1)

If you swap a remote URL for a local upload, no template changes are needed.

---

## Common troubleshooting

**The build is slow on first run.** That's eleventy-img fetching and resizing the placeholder Unsplash photos. Subsequent builds are cached in `.cache/`.

**The contact form doesn't show up in Netlify Forms.** Netlify scans deployed HTML for `<form data-netlify="true">` elements. Make sure you've deployed at least once and that "Form detection" is enabled in **Netlify → Site settings → Forms**.

**`/admin/` shows a blank page or "Config Errors".** Double-check `src/admin/config.yml` is valid YAML and that Git Gateway is enabled in **Netlify → Identity → Services**.

**Clara can't log in to `/admin/`.** Confirm her Identity invitation was sent and accepted. In **Netlify → Identity**, registration must be set to **Invite only**.

**JSON file edited via the admin won't parse.** Decap writes valid JSON, but if a JSON file in `src/_data/` is hand-edited and broken, 11ty will fail loudly with the file path. Fix the syntax and save.

---

## What v1 explicitly does NOT include

Per the spec: no online booking, no payments, no client logins, no blog, no analytics, no multi-language. Don't add these without re-opening the requirements doc.

---

## Companion docs

- `DEPLOY.md` — step-by-step Netlify setup for Garrett.
- `HANDOFF.md` — plain-English how-to for Clara.
