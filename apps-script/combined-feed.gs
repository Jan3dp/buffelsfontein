// Gereformeerde Kerk Gobabis combined feed
// Keep this as the only Apps Script file with doGet(e).
// Web app routes:
//   /exec?feed=youtube
//   /exec?feed=newsletters
//
// Manual testing:
//   Run testYouTubeFeed_()
//   Run testNewsletterFeed_()

const CHANNEL_ID = 'UCqYlRWltvAJaUrrbKyiIYsw';
const NEWSLETTER_FOLDER_ID = '15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl';
const CACHE_SECONDS = 30 * 60;
const MAX_YOUTUBE_RESULTS = 24;
const MAX_NEWSLETTER_RESULTS = 50;

function doGet(e) {
  const feed = String((e && e.parameter && e.parameter.feed) || 'youtube').toLowerCase();
  const data = feed === 'newsletters' ? getNewsletterFeed_(false) : getYouTubeFeed_(false);

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

    if (!isNewsletterFile_(mimeType, name)) continue;
    items.push(toNewsletterItem_(file));
  }

  items.sort(function(a, b) {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

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

function isNewsletterFile_(mimeType, name) {
  const lowerName = String(name || '').toLowerCase();
  return mimeType === MimeType.PDF
    || mimeType === MimeType.GOOGLE_DOCS
    || lowerName.endsWith('.pdf');
}

function toNewsletterItem_(file) {
  const id = file.getId();
  const name = file.getName();
  const mimeType = file.getMimeType();
  const updated = file.getLastUpdated();
  const isPdf = mimeType === MimeType.PDF || name.toLowerCase().endsWith('.pdf');

  return {
    id: id,
    title: cleanTitle_(name),
    fileName: name,
    mimeType: mimeType,
    date: Utilities.formatDate(updated, 'Africa/Johannesburg', 'yyyy-MM-dd'),
    updatedAt: updated.toISOString(),
    url: file.getUrl(),
    viewerUrl: isPdf ? 'https://drive.google.com/file/d/' + id + '/preview' : file.getUrl()
  };
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
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
