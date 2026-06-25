# Gereformeerde Kerk Gobabis - Website POC

A simple GitHub Pages proof of concept for Gereformeerde Kerk Gobabis.

Live site:

`https://jan3dp.github.io/buffelsfontein/`

## Current direction

This site is intentionally simple and GitHub-first, but dynamic feeds are allowed where they prevent weekly manual updates:

- Afrikaans church website
- Warm, Reformed tone
- GitHub Pages hosting
- No build step
- Static church information in `site-data.json`
- Dynamic YouTube data from Google Apps Script
- Newsletter folder/files in Google Drive
- Google Maps embedded without a Maps API key

## Static vs dynamic data

Keep these two ideas separate:

### Static data

Static content lives in `site-data.json` in this repository.

Use `site-data.json` for:

- church name
- tagline
- service times
- minister
- phone
- email
- address
- Facebook link
- Google profile link
- YouTube channel ID
- YouTube feed URL
- Google Drive folder IDs/links
- Maps settings

### Dynamic data

Dynamic content should come from Google Apps Script feeds.

Use Apps Script for:

- latest YouTube videos
- later: latest newsletters from Google Drive
- later: sorted newsletter archive

Do not put API keys in this GitHub repo.

## Important links

### Apps Script

Project name:

`Buffelsfontein YT Script`

Apps Script edit page:

`https://script.google.com/u/1/home/projects/1k5PeYe0OArGx7Bln2M3Ns-c8c42d7Jk7TgtWdkGh1JbssOej84Lqheby/edit`

Current web app `/exec` URL:

`https://script.google.com/macros/s/AKfycbyOIynQ98JQnm2b9MqDJ_8v-CG47EwdUxZKFHlOGMNaCrNyjSQJ_OIaK8qF2esK3yl6gQ/exec`

Deployment ID:

`AKfycbyOIynQ98JQnm2b9MqDJ_8v-CG47EwdUxZKFHlOGMNaCrNyjSQJ_OIaK8qF2esK3yl6gQ`

### Google Cloud

Project:

`buffelsfontein`

Console link:

`https://console.cloud.google.com/welcome?authuser=1&project=buffelsfontein`

API used:

`YouTube Data API v3`

API key name:

`Buffelsfontein_YT_Key`

The key value must be stored only in Apps Script **Script Properties** as:

`YOUTUBE_API_KEY`

## `site-data.json` shape

```json
{
  "church": {
    "name": "Gereformeerde Kerk Gobabis",
    "shortName": "GK Gobabis",
    "language": "Afrikaans",
    "identity": "Gereformeerd",
    "tagline": "'n Warm, gereformeerde gemeente waar ons saam onder God se Woord leef en Christus as Koning bely.",
    "minister": "Ds. Chris Botha",
    "location": "Gobabis, Namibie",
    "phone": "+264 62 562 789",
    "email": "gerfgbs@iway.na",
    "address": "H.v. Kerk- en Quinto Cuanavalestraat, Gobabis"
  },
  "services": [
    { "name": "Oggenddiens", "time": "09:30" },
    { "name": "Aanddiens", "time": "18:00" }
  ],
  "links": {
    "googleDoc": "https://docs.google.com/document/d/1fP17MR7py5kAE3WhLUhaP6Z211nt3pcZSzmYrytvLOk/edit?usp=drive_link",
    "facebook": "https://www.facebook.com/gkgobabis/",
    "googleBusiness": "https://share.google/ICmQsJ9kmqwWJQGmM",
    "youtubeStreams": "https://www.youtube.com/@GKGobabis/streams",
    "youtubeChannelId": "UCqYlRWltvAJaUrrbKyiIYsw",
    "youtubeEmbed": "",
    "youtubeFeedUrl": "https://script.google.com/macros/s/AKfycbyOIynQ98JQnm2b9MqDJ_8v-CG47EwdUxZKFHlOGMNaCrNyjSQJ_OIaK8qF2esK3yl6gQ/exec",
    "mapsEmbed": "https://www.google.com/maps?q=H.v.%20Kerk-%20en%20Quinto%20Cuanavalestraat%2C%20Gobabis&output=embed",
    "mapsOpen": "https://www.google.com/maps/search/?api=1&query=H.v.%20Kerk-%20en%20Quinto%20Cuanavalestraat%2C%20Gobabis"
  },
  "newsletters": {
    "folderId": "15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl",
    "folderOpen": "https://drive.google.com/drive/folders/15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl?usp=drive_link"
  }
}
```

## Apps Script workflow

The Apps Script code lives in this repo under:

`apps-script/youtube-feed.gs`

The live Apps Script project is edited in Google's Apps Script editor. This repo does not automatically deploy Apps Script changes by itself.

### Can Apps Script be linked to GitHub?

Yes, but not directly through GitHub Pages.

Options:

1. **Manual copy/paste** - simplest for now. Keep the latest source in `apps-script/youtube-feed.gs`, then paste it into Apps Script when it changes.
2. **clasp** - Google's command-line tool for Apps Script projects. This can pull/push Apps Script code from a local folder and can be used with GitHub, but it requires extra setup and local tooling.
3. **GitHub Actions + clasp** - possible later, but more complex. It needs stored credentials/secrets and should only be added once the script stabilises.

Current recommendation: use manual copy/paste until the script is stable.

## YouTube

The channel ID is:

`UCqYlRWltvAJaUrrbKyiIYsw`

The site has two YouTube modes:

1. **Fallback, no API:** embed the uploads playlist by changing the channel ID prefix from `UC` to `UU`.
2. **Dynamic, Apps Script:** read the YouTube Data API via Apps Script and show a video page with selectable video cards.

The Apps Script uses:

- `channels.list` to get the uploads playlist ID
- `playlistItems.list` to list videos in that playlist

## Newsletters

Current newsletter folder:

`https://drive.google.com/drive/folders/15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl?usp=drive_link`

The site currently has:

- homepage latest-newsletter card
- `nuusbriewe.html` archive/reader page
- Google Drive folder fallback embed

Later, add a Google Drive Apps Script feed so uploaded PDFs are listed and sorted automatically.

## Google Doc

The site converts the configured Google Doc edit link into a preview embed.

If the preview embed does not show reliably, use the stronger publishing route:

1. Open the Google Doc.
2. Go to **File > Share > Publish to web**.
3. Choose **Embed**.
4. Copy the published embed URL.
5. Add a new field later if a dedicated published embed URL is needed.

## Maps

The site embeds Google Maps without an API key by using a normal query embed URL.

For a more precise map, replace `links.mapsEmbed` in `site-data.json` with a more specific Google Maps embed/search URL.

## Files

- `index.html` - homepage
- `preke.html` - sermons/videos page
- `nuusbriewe.html` - newsletter archive/reader page
- `styles.css` - design and layout
- `script.js` - reads `site-data.json`, Apps Script feeds and renders embeds/links
- `site-data.json` - static config and feed URLs
- `apps-script/youtube-feed.gs` - YouTube Apps Script source template
- `favicon.svg` - current icon
- `.nojekyll` - tells GitHub Pages not to process the site with Jekyll
- `robots.md` - guidance for future AI/code agents working on the repo
- `ADMIN.md` - admin notes

## GitHub Pages setup

In GitHub:

1. Go to this repo's **Settings**.
2. Open **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch: `main`.
5. Select folder: `/ (root)`.
6. Save.

Multiple quick commits can cause older Pages jobs to be cancelled while the newest one continues.
