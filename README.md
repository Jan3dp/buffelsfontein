# Gereformeerde Kerk Gobabis - Website POC

A simple GitHub Pages proof of concept for Gereformeerde Kerk Gobabis.

Live site, once GitHub Pages has deployed:

`https://jan3dp.github.io/buffelsfontein/`

## Current direction

This site is intentionally simple and document/data-first:

- Afrikaans one-page church website
- Warm, Reformed tone
- No API keys
- No database
- No build step
- GitHub Pages hosting
- Google Doc used for longer page content
- `site-data.json` used for structured assumptions such as service times, minister, links, contact details, and address
- `newsletters.json` used as a simple no-API newsletter index
- YouTube stream link included; playlist embed supported once a playlist ID is available

## Why JSON as well as Google Docs?

The Google Doc is good for human-friendly content such as announcements, longer paragraphs, and church information.

The JSON file is better for structured content such as:

- Church name
- Service times
- Minister
- Phone number
- Email address
- Physical address
- Facebook link
- Google Business/Profile link
- YouTube links

This keeps the Google Doc shorter and lets the website reuse structured values in different places.

## Current external links

### Google Doc

Source document:

`https://docs.google.com/document/d/1fP17MR7py5kAE3WhLUhaP6Z211nt3pcZSzmYrytvLOk/edit?usp=drive_link`

The site converts that link to a preview embed:

`https://docs.google.com/document/d/1fP17MR7py5kAE3WhLUhaP6Z211nt3pcZSzmYrytvLOk/preview`

For this to display inside the site, the document must be visible to people with the link.

If the preview embed does not show reliably, use the stronger publishing route:

1. Open the Google Doc.
2. Go to **File > Share > Publish to web**.
3. Choose **Embed**.
4. Copy the published embed URL.
5. Update the Google Doc link handling in `script.js` or add the published URL to `site-data.json`.

### Facebook

Current link in `site-data.json`:

`https://www.facebook.com/gkgobabis/`

The `?locale=af_ZA` part was removed because it is not needed for a normal public link.

### Google profile

Current link in `site-data.json`:

`https://share.google/ICmQsJ9kmqwWJQGmM`

### YouTube

Streams page:

`https://www.youtube.com/@GKGobabis/streams`

Because we are not using API keys, the reliable current approach is a direct link plus optional playlist embed support.

Recommended next step: create a dedicated YouTube playlist called something like `Preke` or `Eredienste`, then embed the playlist using this format:

`https://www.youtube.com/embed/videoseries?list=PLAYLIST_ID`

Paste that URL into `links.youtubeEmbed` in `site-data.json`.

## Newsletters

The site reads newsletters from `newsletters.json`.

Example item:

```json
{
  "title": "Nuusbrief voorbeeld",
  "date": "2026-06-24",
  "url": "https://example.com/newsletter.pdf",
  "description": "Kort beskrywing van die nuusbrief."
}
```

### Why not list a Google Drive folder directly?

Without a Google Drive API key or authenticated backend, a static GitHub Pages site cannot reliably list all files in a Google Drive folder.

No-API options:

1. Keep newsletter PDFs in Google Drive and manually list their public links in `newsletters.json`.
2. Upload newsletter PDFs into this repo and manually list them in `newsletters.json`.
3. Later add a GitHub Action that updates `newsletters.json` from a known source.

## Files

- `index.html` - stable one-page frame
- `styles.css` - design and layout
- `script.js` - reads JSON, embeds Google Doc, renders links and newsletters
- `site-data.json` - structured church assumptions and links
- `newsletters.json` - simple newsletter index
- `.nojekyll` - tells GitHub Pages not to process the site with Jekyll
- `robots.md` - guidance for future AI/code agents working on the repo

## GitHub Pages setup

In GitHub:

1. Go to this repo's **Settings**.
2. Open **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch: `main`.
5. Select folder: `/root`.
6. Save.

The first deployment can take a few minutes. Multiple quick commits can cause older Pages jobs to be cancelled while the newest one continues.

## Next good improvements

1. Fill in the minister, phone, email, and address in `site-data.json`.
2. Add real newsletter links to `newsletters.json`.
3. Create a YouTube playlist and add its embed URL to `site-data.json`.
4. Decide whether the site should later have a custom domain.
5. Add a small logo or church photo once available.
