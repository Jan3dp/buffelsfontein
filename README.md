# Gereformeerde Kerk Gobabis - Website POC

A simple GitHub Pages proof of concept for Gereformeerde Kerk Gobabis.

Live site, once GitHub Pages has deployed:

`https://jan3dp.github.io/buffelsfontein/`

## Current direction

This site is intentionally simple and Google-Drive-first:

- Afrikaans one-page church website
- Warm, Reformed tone
- No API keys
- No database
- No build step
- GitHub Pages hosting
- Google Doc used for longer page content
- Google Drive JSON used as the only structured content source
- Google Drive folder embedded for newsletters
- YouTube uploads embedded from the channel ID
- Google Maps embedded without an API key

## Single source of truth

The live site now tries to load structured data only from the configured Google Drive JSON file.

There is no runtime backup to `site-data.json`, because that creates double updates and stale data risk. If the Drive JSON is not shared publicly enough, or if the JSON is invalid, the dynamic content will not update correctly.

## Google Drive JSON

The JSON file ID is configured in `script.js`:

`1KyC0bqMOTAOw9ptWBYLLKSEz9aFvbd_e`

The file should be shared as:

`Anyone with the link -> Viewer`

Recommended JSON shape:

```json
{
  "church": {
    "name": "Gereformeerde Kerk Gobabis",
    "shortName": "GK Gobabis",
    "language": "Afrikaans",
    "identity": "Gereformeerd",
    "tagline": "'n Warm, gereformeerde gemeente waar ons saam onder God se Woord leef en Christus as Koning bely.",
    "minister": "",
    "location": "Gobabis, Namibie",
    "phone": "",
    "email": "",
    "address": ""
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
    "mapsEmbed": "https://www.google.com/maps?q=Gereformeerde%20Kerk%20Gobabis&output=embed"
  }
}
```

## Google Doc

The site converts the configured Google Doc edit link into a preview embed.

If the preview embed does not show reliably, use the stronger publishing route:

1. Open the Google Doc.
2. Go to **File > Share > Publish to web**.
3. Choose **Embed**.
4. Copy the published embed URL.
5. Update the data model if we later add a separate published embed field.

## YouTube

The channel ID is:

`UCqYlRWltvAJaUrrbKyiIYsw`

The site derives the uploads playlist automatically by changing the `UC` prefix to `UU`, then embeds that playlist.

A custom playlist can still be used later by adding a full embed URL to `links.youtubeEmbed` in the Drive JSON.

## Newsletters

The site embeds the configured Google Drive newsletter folder directly.

This avoids a duplicate `newsletters.json` workflow for now.

The folder must be public or shared with anyone who has the link.

## Maps

The site embeds Google Maps without an API key by using a normal query embed URL. The default is:

`https://www.google.com/maps?q=Gereformeerde%20Kerk%20Gobabis&output=embed`

For a more precise map, replace `links.mapsEmbed` in the Drive JSON with a more specific Google Maps embed/search URL.

## Files

- `index.html` - stable one-page frame
- `styles.css` - design and layout
- `script.js` - reads Drive JSON and renders embeds/links
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
5. Select folder: `/root`.
6. Save.

The first deployment can take a few minutes. Multiple quick commits can cause older Pages jobs to be cancelled while the newest one continues.
