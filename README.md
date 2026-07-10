# Gereformeerde Kerk Gobabis - Website

A simple GitHub Pages website for Gereformeerde Kerk Gobabis.

Live site:

`https://jan3dp.github.io/buffelsfontein/`

## Current architecture

This site is intentionally small and static:

- plain HTML, CSS and vanilla JavaScript
- hosted on GitHub Pages from the `main` branch and repository root
- no build step
- no JavaScript framework
- no backend/database in this repository
- static church information in `site-data.json`
- dynamic YouTube, newsletter and leesstof feeds from Google Apps Script
- browser-side feed cache in `localStorage` for faster repeat loads

## Main files

- `index.html` - homepage
- `preke.html` - sermons/video page
- `nuusbriewe.html` - newsletter archive/reader page
- `leesstof.html` - themed reading-material library page
- `styles.css` - base layout and design
- `extras.css` - compact homepage and small override styles
- `script.js` - reads `site-data.json`, loads feeds, renders content, handles mobile menu
- `site-data.json` - church details, links, service times and feed URLs
- `apps-script/combined-feed.gs` - source for the Google Apps Script web app
- `favicon.svg` - site favicon
- `assets/icon-facebook.svg` - simple Facebook icon
- `assets/icon-google.svg` - simple Google profile icon
- `assets/icon-maps.svg` - simple Google Maps icon
- `.nojekyll` - tells GitHub Pages not to process the site with Jekyll
- `ADMIN.md` - admin notes for future maintenance
- `robots.md` - instructions for future AI/code agents

## Data model

`site-data.json` is the source of truth for stable church information.

Use it for:

- church name and location
- minister
- service times
- phone and email
- physical address text
- Facebook link
- Google profile link
- YouTube streams link
- Google Maps link
- Apps Script feed URLs
- Google Drive newsletter folder open link
- Google Drive leesstof folder open link

Do not put API keys in this repository.

Current feed fields:

```json
{
  "feeds": {
    "youtube": "https://script.google.com/macros/s/.../exec?feed=youtube",
    "newsletters": "https://script.google.com/macros/s/.../exec?feed=newsletters",
    "leesstof": "https://script.google.com/macros/s/.../exec?feed=leesstof"
  },
  "newsletters": {
    "folderOpen": "https://drive.google.com/drive/folders/15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl?usp=drive_link"
  },
  "leesstof": {
    "folderOpen": "https://drive.google.com/drive/folders/1BPUuMvxQSjrc_zviu24URLujCOZwCv2A?usp=sharing"
  }
}
```

## Feed loading

The site loads the page first, then JavaScript loads data.

`script.js` does this:

1. Fetches `site-data.json`.
2. Renders static details such as service times, contact details and links.
3. Loads cached YouTube/newsletter/leesstof JSON from browser `localStorage` immediately, if available.
4. Refreshes each feed from Apps Script only if that cached copy is older than one hour.
5. Saves successful feed responses back to `localStorage`.

The one-hour browser cache is controlled in `script.js`:

```js
const FEED_REFRESH_MS = 60 * 60 * 1000;
```

Apps Script also has its own cache:

```js
const CACHE_SECONDS = 30 * 60;
```

The HTML files reference CSS and JavaScript with cache-busting query strings, for example:

```html
<link rel="stylesheet" href="styles.css?v=5" />
<link rel="stylesheet" href="extras.css?v=5" />
<script src="script.js?v=5"></script>
```

Increase the version number after frontend CSS/JS changes if browsers keep showing stale files.

## Apps Script

The Apps Script source lives in:

`apps-script/combined-feed.gs`

Keep it as the only Apps Script file with `doGet(e)`.

Routes:

- `/exec?feed=youtube`
- `/exec?feed=newsletters`
- `/exec?feed=leesstof`

Manual test functions in Apps Script:

- `testYouTubeFeed_()`
- `testNewsletterFeed_()`
- `testLeesstofFeed_()`

### Apps Script project

Project name:

`Buffelsfontein YT Script`

Apps Script edit page:

`https://script.google.com/u/1/home/projects/1k5PeYe0OArGx7Bln2M3Ns-c8c42d7Jk7TgtWdkGh1JbssOej84Lqheby/edit`

Current web app `/exec` URL:

`https://script.google.com/macros/s/AKfycbyOIynQ98JQnm2b9MqDJ_8v-CG47EwdUxZKFHlOGMNaCrNyjSQJ_OIaK8qF2esK3yl6gQ/exec`

Deployment ID:

`AKfycbyOIynQ98JQnm2b9MqDJ_8v-CG47EwdUxZKFHlOGMNaCrNyjSQJ_OIaK8qF2esK3yl6gQ`

### Deploying Apps Script changes

This repo does not automatically deploy Apps Script changes.

After editing `apps-script/combined-feed.gs`, copy it into Apps Script and redeploy:

1. Open Apps Script.
2. Replace the code with the latest `apps-script/combined-feed.gs`.
3. Deploy > Manage deployments.
4. Edit the existing web app deployment.
5. Version: New version.
6. Deploy.

Keep the same web app URL unless `site-data.json` is also updated.

### Google Cloud / YouTube API

Google Cloud project:

`buffelsfontein`

API used:

`YouTube Data API v3`

API key name:

`Buffelsfontein_YT_Key`

The key value must be stored only in Apps Script Script Properties as:

`YOUTUBE_API_KEY`

## Newsletters

Current Google Drive folder:

`https://drive.google.com/drive/folders/15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl?usp=drive_link`

The Apps Script reads PDF, Google Docs and Word files directly in that folder, sorts them by last updated date and returns:

- `updatedAt`
- `count`
- `latest`
- `items[]`

The website opens newsletters inside the `nuusbriewe.html` reader first. The Google Drive link is shown only as a small fallback under the reader.

For visitors to preview/open files reliably, the folder/files should be shared as anyone with the link can view.

## Leesstof

Current Google Drive folder:

`https://drive.google.com/drive/folders/1BPUuMvxQSjrc_zviu24URLujCOZwCv2A?usp=sharing`

Drive structure:

```text
Leesstof
├── Jona
│   ├── dokument1.pdf
│   └── dokument2.pdf
├── Filippense
│   └── dokument.pdf
```

The folder names become visible themes on `leesstof.html`. Files inside each theme folder become leesstof cards. Empty themes are hidden on the website.

Supported first-pass file types:

- PDF
- Google Docs
- Word documents

For public preview/open links to work, the root folder, theme folders and files should be shared as anyone with the link can view.

## Maps

The visible address text is kept separately from the actual Google Maps link.

Current Maps link:

`https://maps.app.goo.gl/xoGBmbYhC6gnPLHm9`

## Housekeeping status

Completed housekeeping:

- removed old Google Doc embed references from the live frontend
- removed old map/folder iframe fallback styling
- removed old YouTube playlist fallback section
- removed old newsletter folder fallback embed
- removed unused `site-data.json` fields such as `googleDoc`, `youtubeEmbed`, `mapsEmbed`, `youtubeChannelId` and `folderId`
- simplified social icons into small SVG files under `assets/`
- added one-hour browser cache for feeds
- updated favicon link with cache-busting query string
- added cache-busting query strings for CSS and JavaScript
- added a Drive-powered `leesstof.html` page using themes from Google Drive subfolders

Potential future improvements:

- switch Apps Script deployment from manual copy/paste to `clasp` only if maintenance becomes frequent
- add a single combined `feed=all` endpoint only if network requests become a real problem
- replace placeholder SVG social icons with official approved assets if needed
- add a short `CHANGELOG.md` if more people start editing the repo

## GitHub Pages setup

In GitHub:

1. Go to this repo's Settings.
2. Open Pages.
3. Under Build and deployment, choose Deploy from a branch.
4. Select branch: `main`.
5. Select folder: `/ (root)`.
6. Save.

Multiple quick commits can cause older Pages jobs to be cancelled while the newest one continues.
