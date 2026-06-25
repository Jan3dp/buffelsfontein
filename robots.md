# Robots / Agent Instructions

This repo is a simple GitHub Pages site for Gereformeerde Kerk Gobabis.

## Core constraints

- Keep the site static.
- Do not add API keys.
- Do not add a backend or database to this repo.
- Do not add a JavaScript framework unless explicitly requested.
- Prefer plain HTML, CSS and small vanilla JavaScript.
- Keep the language Afrikaans unless the user asks otherwise.
- Keep the tone warm, calm and Reformed.

## Current architecture

The site uses:

- `site-data.json` for stable structured church data and links
- `apps-script/combined-feed.gs` for YouTube and newsletter feeds
- `script.js` for rendering, mobile menu and browser-side feed caching
- `styles.css` for base layout
- `extras.css` for compact homepage and small overrides

There is no build step.

## Source of truth

Use `site-data.json` for:

- church information
- service times
- contact details
- Maps/Facebook/Google/YouTube links
- Apps Script feed URLs
- Google Drive newsletter folder link

Do not create a second manual JSON manifest unless the user explicitly asks for that.

## Dynamic feeds

Current Apps Script base URL:

`https://script.google.com/macros/s/AKfycbyOIynQ98JQnm2b9MqDJ_8v-CG47EwdUxZKFHlOGMNaCrNyjSQJ_OIaK8qF2esK3yl6gQ/exec`

Routes:

- `?feed=youtube`
- `?feed=newsletters`

The frontend caches successful feed responses in browser `localStorage` for one hour.

Do not remove this cache unless there is a clear reason. It makes repeat visits much faster and reduces Apps Script requests.

## Apps Script

The current Apps Script source file is:

`apps-script/combined-feed.gs`

Keep it as the only Apps Script source file with `doGet(e)`.

Do not reintroduce old split files like:

- `apps-script/youtube-feed.gs`
- `apps-script/newsletter-feed.gs`

The live Apps Script project is not automatically deployed from GitHub. If the source changes, remind the user to paste it into Apps Script and redeploy a new version.

## API keys

The YouTube API key must not be committed.

It belongs only in Apps Script Script Properties as:

`YOUTUBE_API_KEY`

## Current church details

Name: Gereformeerde Kerk Gobabis
Short name: GK Gobabis
Identity: Gereformeerd
Language: Afrikaans
Minister: Ds. Chris Botha
Phone: +264 62 562 789
Email: gerfgbs@iway.na

Service times:

- Oggenddiens: 09:00
- Aanddiens: 18:00

## Links

Facebook:

`https://www.facebook.com/gkgobabis/`

Google profile:

`https://share.google/ICmQsJ9kmqwWJQGmM`

YouTube streams:

`https://www.youtube.com/@GKGobabis/streams`

Google Maps:

`https://maps.app.goo.gl/xoGBmbYhC6gnPLHm9`

Newsletter Drive folder:

`https://drive.google.com/drive/folders/15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl?usp=drive_link`

## Things deliberately removed

Do not casually re-add these old ideas:

- Google Doc preview/embed as main content
- Google Drive folder iframe fallback
- YouTube playlist iframe fallback
- Google Maps iframe embed
- manual `newsletters.json`
- old `googleDoc`, `youtubeEmbed`, `mapsEmbed`, `youtubeChannelId` and `folderId` fields in `site-data.json`

The current direction is cleaner: static pages + two Apps Script JSON feeds.

## Editing guidance

- Change church assumptions in `site-data.json`.
- Change frontend behavior in `script.js`.
- Change base styling in `styles.css`.
- Change homepage compact styling in `extras.css`.
- Change page structure in the HTML files only when needed.
- Keep repeated head/nav/footer markup manually aligned across `index.html`, `preke.html` and `nuusbriewe.html` unless a build step is deliberately introduced later.

## Testing checklist

After edits, test:

1. `https://jan3dp.github.io/buffelsfontein/`
2. `preke.html`
3. `nuusbriewe.html`
4. mobile menu
5. Facebook, Google profile and Maps links
6. `?feed=youtube`
7. `?feed=newsletters`
8. favicon in a private/incognito window

## Deployment

GitHub Pages should deploy from:

- Branch: `main`
- Folder: `/ (root)`

Avoid unnecessary rapid commits because GitHub Pages may cancel queued duplicate deployments.
