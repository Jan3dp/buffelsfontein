# Admin notes for Gereformeerde Kerk Gobabis site

## Source of truth

The only structured data source is `site-data.json` in this GitHub repository.

Do not keep a second JSON file in Google Drive. That creates double updates and confusion.

Google Drive is only used for:

- the long-form Google Doc content
- the newsletter folder/files

## Updating church details

Edit `site-data.json` for:

- service times
- minister
- phone
- email
- address
- Facebook link
- Google profile link
- YouTube settings
- Maps settings

Keep the JSON valid. One missing comma can break the dynamic content.

## Icon

The site icon is `favicon.svg`.

To replace it, upload a new SVG with the same filename, or update the SVG content directly in GitHub.

## Newsletter folder

The site embeds the Google Drive folder ID configured in `script.js`.

The folder must be public or shared with anyone who has the link.

## YouTube

Current channel ID:

`UCqYlRWltvAJaUrrbKyiIYsw`

The site derives the uploads playlist automatically by changing the channel ID prefix from `UC` to `UU`.

If a real playlist is created later, put the full playlist embed URL in `links.youtubeEmbed` in `site-data.json`.

## Maps

The map uses `links.mapsEmbed` from `site-data.json`.

Use a normal no-API Google Maps embed/search URL unless the project later deliberately adds an API-backed map.
