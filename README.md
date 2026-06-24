# Gereformeerde Kerk Buffelsfontein - Website POC

A simple GitHub Pages proof of concept for Gereformeerde Kerk Buffelsfontein.

Live site, once GitHub Pages has deployed:

`https://jan3dp.github.io/buffelsfontein/`

## Current direction

This site is intentionally simple and document-first:

- Afrikaans one-page church website
- Warm, Reformed tone
- No API keys
- No database
- No build step
- GitHub Pages hosting
- Google Doc used as the main content source
- YouTube streams linked directly without API integration

## Content principle

The Google Doc should carry as much church content as possible, including:

- About the church
- Reformed identity
- Service times
- Announcements
- Contact details
- Location information
- Any temporary notices

The HTML should remain mostly a stable frame around the Doc.

## Current external links

### Google Doc

Source document:

`https://docs.google.com/document/d/1fP17MR7py5kAE3WhLUhaP6Z211nt3pcZSzmYrytvLOk/edit?usp=drive_link`

Current site embed attempt:

`https://docs.google.com/document/d/1fP17MR7py5kAE3WhLUhaP6Z211nt3pcZSzmYrytvLOk/preview`

For this to display inside the site, the document must be visible to people with the link.

If the preview embed does not show reliably, use the stronger publishing route:

1. Open the Google Doc.
2. Go to **File > Share > Publish to web**.
3. Choose **Embed**.
4. Copy the published embed URL.
5. Replace `googleDocEmbedUrl` in `script.js`.

### YouTube

Streams page:

`https://www.youtube.com/@GKGobabis/streams`

Because we are not using API keys, the current POC links directly to the streams page.

Recommended later improvement: create a dedicated YouTube playlist called something like `Preke` or `Eredienste`, then embed the playlist using this format:

`https://www.youtube.com/embed/videoseries?list=PLAYLIST_ID`

Then paste that URL into `youtubeEmbedUrl` in `script.js`.

## Files

- `index.html` - stable one-page frame
- `styles.css` - design and layout
- `script.js` - external link configuration and small UI logic
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

## Design notes

The layout has been adjusted to make the Google Doc the main content area. The hero section is now more compact, and the document frame gets most of the page width.

## Next good improvements

1. Replace the Google Doc preview URL with a true published embed URL if needed.
2. Create a dedicated YouTube sermon playlist and embed it.
3. Add real contact details and map/location content into the Google Doc.
4. Decide whether the site should later have a custom domain.
5. Add a small logo or church photo once available.
