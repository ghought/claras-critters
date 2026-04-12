# Deploying Clara's Critters to Netlify

For Garrett. One-time setup, ~20 minutes end-to-end.

---

## 0. Prerequisites

- A GitHub account that owns (or can push to) the repo.
- A Netlify account (free tier is fine).
- The domain `clarascritters.com` purchased from a registrar (Namecheap, Cloudflare, Porkbun, etc.).

---

## 1. Push the repo to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Clara's Critters site"
git branch -M main
git remote add origin git@github.com:<your-username>/claras-critters.git
git push -u origin main
```

---

## 2. Connect the repo to Netlify

1. Log in to https://app.netlify.com.
2. **Add new site → Import an existing project → GitHub.**
3. Pick the `claras-critters` repo.
4. Build settings should auto-fill from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `_site`
5. Click **Deploy site**.

The first deploy will take 1–3 minutes. When it's done, Netlify will give you a `*.netlify.app` URL. Open it and verify the site loads.

---

## 3. Enable Netlify Forms

Netlify auto-detects the `<form data-netlify="true">` in `index.njk`, so this should already be working after the first deploy. Verify:

1. **Site settings → Forms.** You should see a `contact` form listed.
2. Submit a test message from the live site.
3. Confirm the submission appears in **Forms → contact → Submissions**.

### Forward submissions to Clara's email

1. **Forms → Settings & usage → Form notifications → Add notification → Email notification.**
2. **Event:** New form submission.
3. **Form:** `contact`.
4. **Email to notify:** `horselvr.849@gmail.com`.
5. Save.
6. Submit one more test from the live site and confirm Clara's inbox receives the email. (Tell Clara to check spam the first time.)

> Spam handling: there's already a honeypot field. Do **not** enable reCAPTCHA unless real spam shows up.

---

## 4. Enable Netlify Identity (admin login)

1. **Site settings → Identity → Enable Identity.**
2. **Registration preferences → Invite only.** (Critical — do not leave this open.)
3. **External providers:** leave off. Email/password is enough for one user.
4. **Services → Git Gateway → Enable Git Gateway.** This is what lets Decap CMS commit edits back to the repo.
5. **Identity → Invite users → Invite.** Enter `horselvr.849@gmail.com`.
6. Clara will receive an invitation email. The link in that email lands her on the homepage with `#invite_token=...` appended; the Netlify Identity widget on the page picks that up, prompts her to set a password, and then redirects her into `/admin/`.

> If the invite email doesn't arrive: resend from **Identity → Users**, and tell her to check spam.

---

## 5. Configure the custom domain

1. **Domain management → Add a domain → `clarascritters.com`.**
2. Netlify will give you DNS records to point at. You have two options:

   **Option A — Netlify DNS (easiest).** Change the nameservers at your registrar to the four `dns*.p*.nsone.net` servers Netlify shows you. Netlify then manages everything.

   **Option B — Keep your registrar's DNS.** Add these records at your registrar:
   - An `A` record on the apex (`@`) pointing to `75.2.60.5`.
   - A `CNAME` record on `www` pointing to `<your-site>.netlify.app`.

3. Wait for DNS to propagate (minutes to a few hours).
4. **Domain management → HTTPS → Verify DNS configuration → Provision certificate.** Netlify auto-issues a Let's Encrypt cert.
5. **Force HTTPS redirect** — turn it on.

Once the domain is live, update `src/_data/site.json` → `url` to `https://clarascritters.com` and push.

---

## 6. Smoke test (do this every time you deploy)

- [ ] Homepage loads at the live URL.
- [ ] Hero photo and gallery photos render.
- [ ] Hamburger nav opens and closes on mobile.
- [ ] Submit the contact form and confirm:
  - You land on `/thanks/`.
  - The submission appears in Netlify → Forms.
  - The notification email arrives at `horselvr.849@gmail.com`.
- [ ] Visit `/admin/`, log in as Clara's invited account, edit one piece of content (e.g., change the hero tagline), save.
- [ ] Within ~1 minute, the live site reflects the change.

---

## 7. Hand off to Clara

Send her `HANDOFF.md` and the URL to `/admin/`. That's it.

---

## Things you might want to do later (not for v1)

- **Plausible analytics:** add one `<script>` tag to `base.njk`. ~30 seconds.
- **Custom email forwarding** so the publicly-displayed contact email isn't `horselvr.849@gmail.com`. Set up a forwarder at your registrar (e.g., `hello@clarascritters.com → horselvr.849@gmail.com`), then update the displayed email through `/admin/` → Site settings.
- **Real photos:** as Clara uploads her own photos through the admin, the placeholder Unsplash URLs in the data files get replaced with `/uploads/...` paths automatically.
