# Gereformeerde Kerk Buffelsfontein - Website POC

A simple GitHub Pages proof of concept for Gereformeerde Kerk Buffelsfontein.

## What this POC does

- One-page Afrikaans church website
- Warm, Reformed tone
- No API keys
- Content area designed for a published Google Doc embed
- Sermons area designed for a YouTube channel or playlist embed
- Static files only: HTML, CSS, and JavaScript

## Files

- `index.html` - main page
- `styles.css` - design and layout
- `script.js` - small helper logic and configuration notes

## Setup needed

### 1. Publish the Google Doc

In Google Docs:

1. Open the church content document.
2. Go to **File > Share > Publish to web**.
3. Choose **Embed**.
4. Copy the iframe URL or embed code.
5. Replace the placeholder Google Doc URL in `script.js`.

### 2. Add the YouTube embed

Use a YouTube playlist or channel embed URL and replace the placeholder in `script.js`.

Recommended: create a sermon playlist in YouTube, then embed that playlist.

### 3. Enable GitHub Pages

In GitHub:

1. Go to this repo's **Settings**.
2. Open **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch: `main`.
5. Select folder: `/root`.
6. Save.

The site should then be available at something like:

`https://jan3dp.github.io/buffelsfontein/`
