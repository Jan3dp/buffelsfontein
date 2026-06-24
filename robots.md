# Robots / Agent Instructions

This repo is a simple GitHub Pages proof of concept for Gereformeerde Kerk Buffelsfontein.

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

The Google Doc is the main content source. Avoid hard-coding church details in HTML when they can live in the Doc.

Good content for the Google Doc:

- About the church
- Reformed identity
- Service times
- Announcements
- Contact details
- Location information
- Temporary notices

The HTML should act mostly as the frame: header, hero, embedded Doc, YouTube section, contact wrapper, and footer.

## Google Doc integration

Current document:

`https://docs.google.com/document/d/1fP17MR7py5kAE3WhLUhaP6Z211nt3pcZSzmYrytvLOk/edit?usp=drive_link`

Current preview embed:

`https://docs.google.com/document/d/1fP17MR7py5kAE3WhLUhaP6Z211nt3pcZSzmYrytvLOk/preview`

If preview embedding fails, instruct the user to publish the document to web and use the `/pub?embedded=true` URL.

## YouTube integration

Current streams URL:

`https://www.youtube.com/@GKGobabis/streams`

No API keys are allowed. Do not use the YouTube Data API for this POC.

Preferred future improvement: ask the user for a dedicated YouTube playlist ID and use:

`https://www.youtube.com/embed/videoseries?list=PLAYLIST_ID`

## Deployment

GitHub Pages should deploy from:

- Branch: `main`
- Folder: `/root`

Avoid many unnecessary commits in quick succession because GitHub Pages may cancel queued duplicate deployments.

## Style direction

- Warm, calm, traditional but not old-fashioned.
- Reformed identity should be clear but not heavy-handed.
- Keep the layout mobile-friendly.
- The Google Doc should have the largest visual weight on the page.

## Editing guidance

When changing config, prefer editing `script.js`.
When changing layout, prefer editing `styles.css`.
When changing structure, edit `index.html` carefully and keep it simple.
