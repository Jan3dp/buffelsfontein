// Newsletter feed for Gereformeerde Kerk Gobabis
// Paste this into Google Apps Script, or combine it with the YouTube feed script.
// This version uses DriveApp, so it does not require a Google Drive API key.
// It runs as the script owner and reads the configured Google Drive folder.

const NEWSLETTER_FOLDER_ID = '15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl';
const NEWSLETTER_CACHE_SECONDS = 30 * 60;
const NEWSLETTER_MAX_RESULTS = 50;

function doGet(e) {
  const output = getNewsletterFeed_();
  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function getNewsletterFeed_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('newsletter-feed');
  if (cached) return JSON.parse(cached);

  const folder = DriveApp.getFolderById(NEWSLETTER_FOLDER_ID);
  const files = folder.getFiles();
  const newsletters = [];

  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() !== MimeType.PDF) continue;

    const id = file.getId();
    const name = file.getName();
    const updated = file.getLastUpdated();

    newsletters.push({
      id: id,
      title: cleanNewsletterTitle_(name),
      fileName: name,
      date: Utilities.formatDate(updated, 'Africa/Johannesburg', 'yyyy-MM-dd'),
      updatedAt: updated.toISOString(),
      url: 'https://drive.google.com/file/d/' + id + '/view?usp=drive_link',
      viewerUrl: 'https://drive.google.com/file/d/' + id + '/preview'
    });
  }

  newsletters.sort(function(a, b) {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const output = {
    updatedAt: new Date().toISOString(),
    folderId: NEWSLETTER_FOLDER_ID,
    latest: newsletters[0] || null,
    items: newsletters.slice(0, NEWSLETTER_MAX_RESULTS)
  };

  cache.put('newsletter-feed', JSON.stringify(output), NEWSLETTER_CACHE_SECONDS);
  return output;
}

function cleanNewsletterTitle_(name) {
  return name
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
