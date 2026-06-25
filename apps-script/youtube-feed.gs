// YouTube feed for Gereformeerde Kerk Gobabis
// Paste this file into a new Google Apps Script project.
// Then set Script property YOUTUBE_API_KEY to your YouTube Data API key.

const CHANNEL_ID = 'UCqYlRWltvAJaUrrbKyiIYsw';
const CACHE_SECONDS = 30 * 60;
const MAX_RESULTS = 24;

function doGet(e) {
  const output = getYouTubeFeed_();
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
    + '&maxResults=' + MAX_RESULTS
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

      return {
        videoId: resource.videoId || item.contentDetails.videoId,
        title: snippet.title || 'Preek',
        description: snippet.description || '',
        publishedAt: snippet.publishedAt || '',
        thumbnail: bestThumb.url || '',
        url: 'https://www.youtube.com/watch?v=' + (resource.videoId || item.contentDetails.videoId)
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

  if (code < 200 || code >= 300) {
    throw new Error('YouTube API error ' + code + ': ' + text);
  }

  return JSON.parse(text);
}
