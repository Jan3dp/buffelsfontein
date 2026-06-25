# Admin notes for Gereformeerde Kerk Gobabis site

## Source of truth

The structured source of truth is `site-data.json` in this GitHub repository.

Use `site-data.json` for:

- service times
- minister
- phone
- email
- address text
- Facebook link
- Google profile link
- YouTube streams link
- Google Maps open link
- Apps Script feed URLs
- Google Drive newsletter folder open link

Do not keep a second manual JSON file in Google Drive. That creates double updates and confusion.

## Current service times

- Oggenddiens: `09:00`
- Aanddiens: `18:00`

The homepage has hardcoded starter service times so something useful appears before `site-data.json` finishes loading. Keep those in sync with `site-data.json` when service times change.

## Dynamic feeds

The site uses Google Apps Script for both dynamic feeds.

Current web app base URL:

`https://script.google.com/macros/s/AKfycbyOIynQ98JQnm2b9MqDJ_8v-CG47EwdUxZKFHlOGMNaCrNyjSQJ_OIaK8qF2esK3yl6gQ/exec`

Routes:

- `?feed=youtube`
- `?feed=newsletters`

The Apps Script source in this repo is:

`apps-script/combined-feed.gs`

The live Apps Script project must be updated manually unless a future maintainer sets up `clasp`.

## Updating Apps Script

When `apps-script/combined-feed.gs` changes:

1. Open the Apps Script editor.
2. Paste the latest contents of `apps-script/combined-feed.gs`.
3. Keep only one `doGet(e)` function.
4. Deploy > Manage deployments.
5. Edit the existing web app deployment.
6. Choose New version.
7. Deploy.

Manual test functions:

- `testYouTubeFeed_()`
- `testNewsletterFeed_()`

The YouTube API key must stay in Apps Script Script Properties as `YOUTUBE_API_KEY`. Do not commit the key to GitHub.

## Frontend cache

`script.js` caches successful YouTube/newsletter feed responses in the visitor's browser `localStorage`.

Current refresh interval:

`FEED_REFRESH_MS = 60 * 60 * 1000`

That is one hour.

A visitor may therefore see a cached feed for up to an hour before the frontend asks Apps Script again. This is intentional.

## Newsletters

Google Drive folder:

`https://drive.google.com/drive/folders/15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl?usp=drive_link`

The Apps Script reads PDF and Google Docs files directly in that folder. It does not currently recurse through subfolders.

For public preview/open links to work, the folder/files should be shared as anyone with the link can view.

If newsletters do not show:

- open the Apps Script URL with `?feed=newsletters`
- check `scanned`
- check `count`
- if `scanned` is 0, Apps Script sees no files in the configured folder
- if `scanned` is greater than 0 but `count` is 0, the files are not currently recognised as PDF or Google Docs

## YouTube

YouTube channel ID in Apps Script:

`UCqYlRWltvAJaUrrbKyiIYsw`

YouTube streams link in `site-data.json`:

`https://www.youtube.com/@GKGobabis/streams`

If videos do not show:

- open the Apps Script URL with `?feed=youtube`
- confirm the output contains `videos`
- confirm the Apps Script property `YOUTUBE_API_KEY` still exists
- confirm YouTube Data API v3 is enabled in the Google Cloud project

## Maps

The visible address text is not the same as the Google Maps link.

Current Maps button URL:

`https://maps.app.goo.gl/xoGBmbYhC6gnPLHm9`

Update `links.mapsOpen` in `site-data.json` if the Maps destination changes.

## Icons

Current icon files:

- `favicon.svg`
- `assets/icon-facebook.svg`
- `assets/icon-google.svg`
- `assets/icon-maps.svg`

The favicon is referenced with `/buffelsfontein/favicon.svg?v=2` to help beat browser favicon cache.

## Things deliberately removed

These were removed to keep the site simple:

- Google Doc content embed
- Google Drive folder iframe fallback
- YouTube uploads playlist iframe fallback
- map iframe embed
- manual `newsletters.json`
- old `youtube-feed.gs` / `newsletter-feed.gs` split files

Do not re-add these unless there is a clear reason.

## When returning months later

Start here:

1. Open the live site in a private/incognito browser.
2. Test the two Apps Script feed URLs directly.
3. Check `site-data.json` for service times and links.
4. Check `apps-script/combined-feed.gs` against the live Apps Script project.
5. Review the browser console only if visible content is not loading.
