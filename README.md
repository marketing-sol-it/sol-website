# oikos-solar.com

The website of oikos Solar, the energy project of oikos St. Gallen at the University of St. Gallen.

- **Framework:** [Astro](https://astro.build) 5, static output. Every public page is prerendered.
- **Admin:** [Keystatic](https://keystatic.com) at `/keystatic`. Content lives as YAML files in `src/content/`; images and PDFs in `public/`.
- **Hosting:** Cloudflare Pages (free). The admin runs as a Pages Function. Vercel or Netlify work too by swapping the adapter.
- **Forms:** none on the site. Event sign-up, the contact form and applications are links to Notion forms and to the oikos St. Gallen application page, set in the admin.

## Run it locally

```bash
npm install
npm run dev
```

Site: http://localhost:4321 · Admin: http://localhost:4321/keystatic

In development the admin reads and writes the files in this folder directly. Save an entry, and the page updates.

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Editing content (Marketing & Events)

Everything editable lives in the admin. Nothing else needs touching for day-to-day work.

| Admin section | What it controls |
|---|---|
| **Events** | Upcoming and past events. Date, time, place, format, language, description, partner, cover image, sign-up form URL, hidden switch, recap and photos. Events move from Upcoming to Past by date. Tick *Hidden* to take an event off the site. |
| **Open positions** | Roles on the About page. Untick *Open* when a role is filled; it stays listed as "Filled". Attach the one-pager PDF. As long as at least one role is open, the homepage shows the yellow "we are looking for new team members" strip. |
| **Partners** | Logos in the banner on the homepage and under the reference projects. A logo goes live **only** when *Permission confirmed* is ticked. Kind "client" also shows on the Consulting page. |
| **Team** | Leadership team and advisory board with photo and LinkedIn. |
| **About page** | Headline, story (blank line between paragraphs, `**bold**` allowed), vision, group photo. |
| **Site settings** | Emails, contact form URL, application page URL, social links, address, analytics token. |

There are no application rounds or deadlines. Applications are open whenever a role is marked *Open*; with no open role, the About page invites spontaneous applications.

### Rules of thumb

- Images: partner logos as PNG or SVG with transparent background; team photos square, 600 px or more; event covers landscape, 1200 px or more.
- Keep the two sample paths in mind: consulting prospects should always reach `partnerships-sol@` in one click, students should always reach the application link in one click.
- The address `oikos-solar.com/join` and `/careers` redirect to the join section. Use them on posters.

## Admin in production (Data team, once)

The admin commits to GitHub, so the repository must be on GitHub and the site must be deployed from it.

1. The repository is `marketing-sol-it/sol-website` on GitHub. `GITHUB_OWNER` and `GITHUB_REPO` in `keystatic.config.ts` match it; change both if the repository moves.
2. Deploy to Cloudflare Pages from that repository. Build command `npm run build`, output directory `dist`. Add the environment variable `NODE_VERSION=20`.
3. Open `https://oikos-solar.com/keystatic` once. Keystatic guides you through creating a GitHub App for the repository and shows four environment variables. Add them to the Cloudflare Pages project (Settings → Environment variables) and redeploy:
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET`
   - `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
4. Editors sign in to `/keystatic` with GitHub and need write access to the repository. Every save is a commit; Cloudflare rebuilds the site in about a minute.
5. Optional: create a deploy hook in Cloudflare Pages and store its URL as the repository secret `CF_DEPLOY_HOOK_URL`. The workflow in `.github/workflows/daily-rebuild.yml` then rebuilds the site every night so date-driven content stays correct even when nobody edits. Without it, the site still corrects the events split in the browser, but search engines see the state of the last build.

The admin is protected by the GitHub login: only accounts with write access to the repository can edit. Review collaborators at every handover.

Editors without a GitHub account: Keystatic Cloud (free for small teams) replaces the GitHub login. Change `storage` in `keystatic.config.ts` to `{ kind: 'cloud' }` and add `cloud: { project: '<team>/<project>' }` following the Keystatic docs.

## Domain and redirects

- Canonical domain: `oikos-solar.com`. Point `oikos-solar.ch` and `oikos-solar.org` at it with a Cloudflare redirect rule (301, preserve path).
- Old Squarespace paths are covered: `/home`, `/contact-us`, `/join`, `/careers` redirect in `astro.config.mjs`.

## Analytics

Cloudflare Web Analytics needs no cookie banner. Create a site in the Cloudflare dashboard, paste the token into *Site settings → Cloudflare Web Analytics token* in the admin, and the privacy notice updates itself.

## Project layout

```
astro.config.mjs        site config, adapter, redirects
keystatic.config.ts     admin schema: collections and singletons
src/content/            content files edited by the admin
src/layouts/Base.astro  header, footer, strip, metadata, small client script
src/components/         EventCard
src/pages/              index, consulting, events, about, contact, impressum, privacy
src/lib/content.ts      reads content and computes upcoming/past, deadline, etc.
src/styles/global.css   brand tokens and all styles
public/                 logo, favicon, images, PDFs
```

## Handover checklist for a new Data team member

- [ ] Access to the GitHub repository and the Cloudflare Pages project
- [ ] `npm install && npm run dev` works
- [ ] Knows where the four Keystatic environment variables live
- [ ] Knows that content is YAML in `src/content/` and can be fixed by hand in an emergency
