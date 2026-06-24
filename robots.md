# Robots / Agent Instructions

This repo is a simple GitHub Pages proof of concept for Gereformeerde Kerk Gobabis.

## Core constraints

- Keep the site static.
- Do not add API keys.
- Do not add a backend.
- Do not add a database.
- Do not add a JavaScript framework unless explicitly requested.
- Prefer plain HTML, CSS, and small vanilla JavaScript.
- Keep the language Afrikaans unless the user asks otherwise.
- Keep the tone warm and Reformed.

## Content strategy

Use a document/data split:

- Google Doc: longer human-written content, announcements, explanations, pastoral notes, and general information.
- `site-data.json`: structured assumptions and reusable values.
- `newsletters.json`: newsletter index.

Avoid hard-coding church details in HTML when they can live in JSON or the Google Doc.

## Current church

Name: Gereformeerde Kerk Gobabis
Short name: GK Gobabis
Identity: Gereformeerd
Language: Afrikaans

## Google Doc integration

Current document:

`https://docs.google.com/document/d/1fP17MR7py5kAE3WhLUhaP6Z211nt3pcZSzmYrytvLOk/edit?usp=drive_link`

The site currently converts the Doc link to:

`https://docs.google.com/document/d/1fP17MR7py5kAE3WhLUhaP6Z211nt3pcZSzmYrytvLOk/preview`

If preview embedding fails, instruct the user to publish the document to web and use the `/pub?embedded=true` URL.

## Facebook and Google profile

Facebook:

`https://www.facebook.com/gkgobabis/`

Google profile:

`https://share.google/ICmQsJ9kmqwWJQGmM`

Do not assume the current phone number or address from memory. Only add those details when the user provides them or when they are deliberately verified.

## YouTube integration

Current streams URL:

`https://www.youtube.com/@GKGobabis/streams`

No API keys are allowed. Do not use the YouTube Data API for this POC.

A YouTube handle/streams page is not a clean embeddable URL by itself. Preferred future improvement: ask the user for a dedicated YouTube playlist ID and use:

`https://www.youtube.com/embed/videoseries?list=PLAYLIST_ID`

Set that URL in `site-data.json` at `links.youtubeEmbed`.

## Newsletters

The site reads newsletters from `newsletters.json`.

Without a Google Drive API key or authenticated backend, do not promise automatic folder listing from Google Drive. Use a manifest file instead.

Preferred no-API options:

1. Public newsletter PDFs in Google Drive, manually listed in `newsletters.json`.
2. Newsletter PDFs committed into this repo, manually listed in `newsletters.json`.
3. Later GitHub Action to regenerate `newsletters.json` if a reliable source is provided.

## Deployment

GitHub Pages should deploy from:

- Branch: `main`
- Folder: `/root`

Avoid many unnecessary commits in quick succession because GitHub Pages may cancel queued duplicate deployments.

## Style direction

- Warm, calm, traditional but not old-fashioned.
- Reformed identity should be clear but not heavy-handed.
- Keep the layout mobile-friendly.
- The Google Doc should have large visual weight on the page.
- Structured JSON values may appear in the hero, service card, contact card, and social links.

## Editing guidance

- Change church assumptions in `site-data.json`.
- Change newsletter items in `newsletters.json`.
- Change layout in `styles.css`.
- Change structure in `index.html` only when needed.
- Keep `script.js` simple and vanilla.
