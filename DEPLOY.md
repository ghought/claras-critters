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
4. **Email to notify:** `clara.jean.418@gmail.com`.
5. Save.
6. Submit one more test from the live site and confirm Clara's inbox receives the email. (Tell Clara to check spam the first time.)

> Spam handling: there's already a honeypot field. Do **not** enable reCAPTCHA unless real spam shows up.

---

## 4. Enable Netlify Identity (admin login)

Netlify Identity is what gates `/admin/`. It supports as many users as you want — there are no per-seat costs on the free tier up to 5 active users, which is plenty.

1. **Site settings → Identity → Enable Identity.**
2. **Registration preferences → Invite only.** (Critical — do not leave this open, otherwise anyone on the internet can make an admin account.)
3. **External providers:** leave off. Email/password is all you need.
4. **Services → Git Gateway → Enable Git Gateway.** This is what lets Decap CMS commit edits back to the GitHub repo.
5. **Identity → Invite users → Invite.** Enter **both** emails, one per line:
   - Your own email (so you can test the admin portal and debug).
   - `clara.jean.418@gmail.com` (Clara).
6. Each person receives a separate invitation email. Clicking "Accept the invite" lands them on the homepage with `#invite_token=...` appended to the URL; the Netlify Identity widget baked into `base.njk` picks up that token, prompts them to set a password, and then redirects them into `/admin/`.
7. After the first login, visiting `/admin/` directly and entering email + password works normally.

Both accounts are full-access — there are no roles or permissions in Decap CMS. If Clara ever leaves or you want to rotate access, go to **Identity → Users**, hit the three-dot menu next to a user, and **Delete**.

### Testing the admin portal yourself (recommended before handing off to Clara)

1. Accept your own invite, set a password, and log in to `/admin/`.
2. Click through each section in the left sidebar (Site settings, About, Services, Rates, Gallery, Testimonials). Confirm the forms load with the current content.
3. Make a small, reversible edit — e.g., change the hero tagline to "Test edit" and publish.
4. Wait ~1 minute for Netlify to rebuild, refresh the live site, and confirm the change appears.
5. Change it back and publish again.
6. Do the same round-trip with an image upload on the Gallery collection to confirm Git Gateway handles `uploads/` correctly.

Once you've done this dry run, you can confidently send Clara her invite and the `HANDOFF.md` doc.

> **If invite emails don't arrive:** resend from **Identity → Users → [user] → Resend invitation**. Tell the recipient to check spam — Netlify's invitation emails come from `noreply@netlify.com` and Gmail sometimes filters them the first time.

> **If `/admin/` shows "Config Errors" after login:** Git Gateway probably isn't enabled yet. Go back to **Identity → Services → Git Gateway → Enable**.

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
  - The notification email arrives at `clara.jean.418@gmail.com`.
- [ ] Visit `/admin/`, log in as Clara's invited account, edit one piece of content (e.g., change the hero tagline), save.
- [ ] Within ~1 minute, the live site reflects the change.

---

## 7. Hand off to Clara

Send her `HANDOFF.md` and the URL to `/admin/`. That's it.

---

## Things you might want to do later (not for v1)

- **Plausible analytics:** add one `<script>` tag to `base.njk`. ~30 seconds.
- **Custom email forwarding** so the publicly-displayed contact email isn't `clara.jean.418@gmail.com`. Set up a forwarder at your registrar (e.g., `hello@clarascritters.com → clara.jean.418@gmail.com`), then update the displayed email through `/admin/` → Site settings.
- **Real photos:** as Clara uploads her own photos through the admin, the placeholder Unsplash URLs in the data files get replaced with `/uploads/...` paths automatically.
