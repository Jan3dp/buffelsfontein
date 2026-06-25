// Combined feed for Gereformeerde Kerk Gobabis
// Use this if YouTube and newsletters live in one Apps Script project.
// Deploy this as a web app, then use:
//   /exec?feed=youtube
//   /exec?feed=newsletters

const CHANNEL_ID = 'UCqYlRWltvAJaUrrbKyiIYsw';
const NEWSLETTER_FOLDER_ID = '15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl';
const CACHE_SECONDS = 30 * 60;
const MAX_YOUTUBE_RESULTS = 24;
const MAX_NEWSLETTER_RESULTS = 50;

function doGet(e) {
  const feed = (e.parameter.feed || 'youtube').toLowerCase();
  const output = feed === 'newsletters'
    ? getNewsletterFeed_()
    : getYouTubeFeed_();

  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function getYouTubeFeed_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('youtube-feed');
  if (cached) return JSON.parse(cached);

  const apiKey = PropertiesService.getScriptProperties().getProperty('YOUTUBE_API_KEY');
  if (!apiKey) {
    return {
      updatedAt: new Date().toISOString(),
      videos: [],
      error: 'Missing YOUTUBE_API_KEY script property.'
    };
  }

  const uploadsPlaylistId = getUploadsPlaylistId_(apiKey);
  const videos = getPlaylistVideos_(apiKey, uploadsPlaylistId);

  const output = {
    updatedAt: new Date().toISOString(),
    channelId: CHANNEL_ID,
    uploadsPlaylistId: uploadsPlaylistId,
    videos: videos
  };

  cache.put('youtube-feed', JSON.stringify(output), CACHE_SECONDS);
  return output;
}

function getUploadsPlaylistId_(apiKey) {
  const url = 'https://www.googleapis.com/youtube/v3/channels'
    + '?part=contentDetails'
    + '&id=' + encodeURIComponent(CHANNEL_ID)
    + '&key=' + encodeURIComponent(apiKey);

  const data = fetchJson_(url);
  const item = data.items && data.items[0];
  if (!item) throw new Error('Could not find YouTube channel: ' + CHANNEL_ID);

  return item.contentDetails.relatedPlaylists.uploads;
}

function getPlaylistVideos_(apiKey, playlistId) {
  const url = 'https://www.googleapis.com/youtube/v3/playlistItems'
    + '?part=snippet,contentDetails'
    + '&maxResults=' + MAX_YOUTUBE_RESULTS
    + '&playlistId=' + encodeURIComponent(playlistId)
    + '&key=' + encodeURIComponent(apiKey);

  const data = fetchJson_(url);
  const items = data.items || [];

  return items
    .map(function(item) {
      const snippet = item.snippet || {};
      const resource = snippet.resourceId || {};
      const thumbnails = snippet.thumbnails || {};
      const bestThumb = thumbnails.maxres || thumbnails.high || thumbnails.medium || thumbnails.default || {};
      const videoId = resource.videoId || item.contentDetails.videoId;

      return {
        videoId: videoId,
        title: snippet.title || 'Preek',
        description: snippet.description || '',
        publishedAt: snippet.publishedAt || '',
        thumbnail: bestThumb.url || '',
        url: 'https://www.youtube.com/watch?v=' + videoId
      };
    })
    .filter(function(video) {
      return video.videoId && video.title !== 'Private video' && video.title !== 'Deleted video';
    });
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
    items: newsletters.slice(0, MAX_NEWSLETTER_RESULTS)
  };

  cache.put('newsletter-feed', JSON.stringify(output), CACHE_SECONDS);
  return output;
}

function cleanNewsletterTitle_(name) {
  return name
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function fetchJson_(url) {
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const code = response.getResponseCode();
  const text = response.getContentText();

  if (code < 200 || code >= 300) {
    throw new Error('YouTube API error ' + code + ': ' + text);
  }

  return JSON.parse(text);
}
