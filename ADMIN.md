# Admin notes for Gereformeerde Kerk Gobabis site

## Icon

The site icon is `favicon.svg`.

To replace it, upload a new SVG with the same filename, or update the SVG content directly in GitHub.

## Google Drive JSON

The site attempts to load structured site data from the Google Drive JSON file ID already configured in `script.js`.

The JSON file must be shared publicly enough for the website visitor's browser to fetch it. If the browser blocks the file because of Google Drive permissions or CORS, the site falls back to the local `site-data.json` in this repo.

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
    "googleDoc": "",
    "facebook": "",
    "googleBusiness": "",
    "youtubeStreams": "",
    "youtubeChannelId": "",
    "youtubeEmbed": ""
  }
}
```

## Newsletter folder

The site embeds the Google Drive folder ID already configured in `script.js`.

The folder must be public or shared with anyone who has the link.

## YouTube

Best no-access, no-API path:

1. Find the channel ID.
2. Put it in the Google Drive JSON at `links.youtubeChannelId`.
3. The site derives the uploads playlist automatically by changing the channel ID prefix from `UC` to `UU`.

Example:

```json
"youtubeChannelId": "UCxxxxxxxxxxxxxxxxxxxxxx"
```

The site will embed the matching uploads playlist.

If a real playlist is created later, put the full playlist embed URL in `links.youtubeEmbed` instead.
