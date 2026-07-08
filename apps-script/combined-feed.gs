// Gereformeerde Kerk Gobabis combined feed
// Keep this as the only Apps Script file with doGet(e).
// Web app routes:
//   /exec?feed=youtube
//   /exec?feed=newsletters
//   /exec?feed=leesstof
//
// Manual testing:
//   Run testYouTubeFeed_()
//   Run testNewsletterFeed_()
//   Run testLeesstofFeed_()

const CHANNEL_ID = 'UCqYlRWltvAJaUrrbKyiIYsw';
const NEWSLETTER_FOLDER_ID = '15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl';
const LEESSTOF_FOLDER_ID = '1BPUuMvxQSjrc_zviu24URLujCOZwCv2A';
const CACHE_SECONDS = 30 * 60;
const MAX_YOUTUBE_RESULTS = 24;
const MAX_NEWSLETTER_RESULTS = 50;
const MAX_LEESSTOF_ITEMS_PER_CATEGORY = 80;

function doGet(e) {
  const feed = String((e && e.parameter && e.parameter.feed) || 'youtube').toLowerCase();
  let data;

  if (feed === 'newsletters') {
    data = getNewsletterFeed_(false);
  } else if (feed === 'leesstof') {
    data = getLeesstofFeed_(false);
  } else {
    data = getYouTubeFeed_(false);
  }

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function testYouTubeFeed_() {
  console.log(JSON.stringify(getYouTubeFeed_(true), null, 2));
}

function testNewsletterFeed_() {
  console.log(JSON.stringify(getNewsletterFeed_(true), null, 2));
}

function testLeesstofFeed_() {
  console.log(JSON.stringify(getLeesstofFeed_(true), null, 2));
}

function getYouTubeFeed_(skipCache) {
  const cached = getCached_('youtube-feed', skipCache);
  if (cached) return cached;

  const apiKey = PropertiesService.getScriptProperties().getProperty('YOUTUBE_API_KEY');
  if (!apiKey) return { updatedAt: now_(), videos: [], error: 'Missing YOUTUBE_API_KEY script property.' };

  const uploadsPlaylistId = getUploadsPlaylistId_(apiKey);
  const videos = getPlaylistVideos_(apiKey, uploadsPlaylistId);

  const output = {
    updatedAt: now_(),
    channelId: CHANNEL_ID,
    uploadsPlaylistId: uploadsPlaylistId,
    count: videos.length,
    videos: videos
  };

  putCached_('youtube-feed', output);
  return output;
}

function getNewsletterFeed_(skipCache) {
  const cached = getCached_('newsletter-feed', skipCache);
  if (cached) return cached;

  const folder = DriveApp.getFolderById(NEWSLETTER_FOLDER_ID);
  const files = folder.getFiles();
  const items = [];
  let scanned = 0;

  while (files.hasNext()) {
    const file = files.next();
    scanned++;

    const mimeType = file.getMimeType();
    const name = file.getName();

    if (!isReadableDocument_(mimeType, name)) continue;
    items.push(toDriveItem_(file));
  }

  items.sort(sortByUpdatedDesc_);

  const output = {
    updatedAt: now_(),
    folderId: NEWSLETTER_FOLDER_ID,
    scanned: scanned,
    count: items.length,
    latest: items[0] || null,
    items: items.slice(0, MAX_NEWSLETTER_RESULTS)
  };

  putCached_('newsletter-feed', output);
  return output;
}

function getLeesstofFeed_(skipCache) {
  const cached = getCached_('leesstof-feed', skipCache);
  if (cached) return cached;

  const root = DriveApp.getFolderById(LEESSTOF_FOLDER_ID);
  const folders = root.getFolders();
  const categories = [];
  let categoryCount = 0;
  let itemCount = 0;
  let scanned = 0;

  while (folders.hasNext()) {
    const folder = folders.next();
    categoryCount++;

    const items = getReadableItemsInFolder_(folder);
    scanned += items.scanned;
    itemCount += items.items.length;

    categories.push({
      id: folder.getId(),
      title: folder.getName(),
      slug: slugify_(folder.getName()),
      url: folder.getUrl(),
      count: items.items.length,
      items: items.items.slice(0, MAX_LEESSTOF_ITEMS_PER_CATEGORY)
    });
  }

  categories.sort(function(a, b) {
    return a.title.localeCompare(b.title);
  });

  const output = {
    updatedAt: now_(),
    folderId: LEESSTOF_FOLDER_ID,
    folderUrl: root.getUrl(),
    scanned: scanned,
    categoryCount: categoryCount,
    itemCount: itemCount,
    categories: categories
  };

  putCached_('leesstof-feed', output);
  return output;
}

function getReadableItemsInFolder_(folder) {
  const files = folder.getFiles();
  const items = [];
  let scanned = 0;

  while (files.hasNext()) {
    const file = files.next();
    scanned++;

    const mimeType = file.getMimeType();
    const name = file.getName();

    if (!isReadableDocument_(mimeType, name)) continue;
    items.push(toDriveItem_(file));
  }

  items.sort(sortByTitleAsc_);
  return { scanned: scanned, items: items };
}

function isReadableDocument_(mimeType, name) {
  const lowerName = String(name || '').toLowerCase();
  return mimeType === MimeType.PDF
    || mimeType === MimeType.GOOGLE_DOCS
    || mimeType === MimeType.MICROSOFT_WORD
    || lowerName.endsWith('.pdf')
    || lowerName.endsWith('.doc')
    || lowerName.endsWith('.docx');
}

function toDriveItem_(file) {
  const id = file.getId();
  const name = file.getName();
  const mimeType = file.getMimeType();
  const updated = file.getLastUpdated();
  const lowerName = name.toLowerCase();
  const isPdf = mimeType === MimeType.PDF || lowerName.endsWith('.pdf');
  const isGoogleDoc = mimeType === MimeType.GOOGLE_DOCS;

  return {
    id: id,
    title: cleanTitle_(name),
    fileName: name,
    mimeType: mimeType,
    fileType: getFileTypeLabel_(mimeType, name),
    date: Utilities.formatDate(updated, 'Africa/Johannesburg', 'yyyy-MM-dd'),
    updatedAt: updated.toISOString(),
    url: file.getUrl(),
    viewerUrl: isPdf ? 'https://drive.google.com/file/d/' + id + '/preview' : file.getUrl(),
    canPreview: isPdf || isGoogleDoc
  };
}

function getFileTypeLabel_(mimeType, name) {
  const lowerName = String(name || '').toLowerCase();
  if (mimeType === MimeType.PDF || lowerName.endsWith('.pdf')) return 'PDF';
  if (mimeType === MimeType.GOOGLE_DOCS) return 'Google Doc';
  if (mimeType === MimeType.MICROSOFT_WORD || lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) return 'Word';
  return 'Dokument';
}

function sortByUpdatedDesc_(a, b) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

function sortByTitleAsc_(a, b) {
  return a.title.localeCompare(b.title);
}

function getUploadsPlaylistId_(apiKey) {
  const data = fetchJson_('https://www.googleapis.com/youtube/v3/channels'
    + '?part=contentDetails'
    + '&id=' + encodeURIComponent(CHANNEL_ID)
    + '&key=' + encodeURIComponent(apiKey));

  if (!data.items || !data.items[0]) throw new Error('Could not find YouTube channel: ' + CHANNEL_ID);
  return data.items[0].contentDetails.relatedPlaylists.uploads;
}

function getPlaylistVideos_(apiKey, playlistId) {
  const data = fetchJson_('https://www.googleapis.com/youtube/v3/playlistItems'
    + '?part=snippet,contentDetails'
    + '&maxResults=' + MAX_YOUTUBE_RESULTS
    + '&playlistId=' + encodeURIComponent(playlistId)
    + '&key=' + encodeURIComponent(apiKey));

  return (data.items || [])
    .map(function(item) {
      const snippet = item.snippet || {};
      const thumbnails = snippet.thumbnails || {};
      const thumb = thumbnails.maxres || thumbnails.high || thumbnails.medium || thumbnails.default || {};
      const videoId = (snippet.resourceId && snippet.resourceId.videoId) || (item.contentDetails && item.contentDetails.videoId);

      return {
        videoId: videoId,
        title: snippet.title || 'Preek',
        description: snippet.description || '',
        publishedAt: snippet.publishedAt || '',
        thumbnail: thumb.url || '',
        url: 'https://www.youtube.com/watch?v=' + videoId
      };
    })
    .filter(function(video) {
      return video.videoId && video.title !== 'Private video' && video.title !== 'Deleted video';
    });
}

function fetchJson_(url) {
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const code = response.getResponseCode();
  const text = response.getContentText();
  if (code < 200 || code >= 300) throw new Error('API error ' + code + ': ' + text);
  return JSON.parse(text);
}

function cleanTitle_(name) {
  return String(name || '')
    .replace(/\.pdf$/i, '')
    .replace(/\.docx?$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify_(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'leesstof';
}

function now_() {
  return new Date().toISOString();
}

function getCached_(key, skipCache) {
  if (skipCache) return null;
  const cached = CacheService.getScriptCache().get(key);
  return cached ? JSON.parse(cached) : null;
}

function putCached_(key, value) {
  CacheService.getScriptCache().put(key, JSON.stringify(value), CACHE_SECONDS);
}
