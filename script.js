const requiredDefaults = {
  links: {
    youtubeChannelId: "UCqYlRWltvAJaUrrbKyiIYsw",
    youtubeStreams: "https://www.youtube.com/@GKGobabis/streams",
    youtubeEmbed: "",
    mapsEmbed: "https://www.google.com/maps?q=Gereformeerde%20Kerk%20Gobabis&output=embed",
    mapsOpen: "https://www.google.com/maps/search/?api=1&query=Gereformeerde%20Kerk%20Gobabis",
  },
  feeds: {
    youtube: "",
    newsletters: "",
  },
  newsletters: {
    folderId: "15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl",
    folderOpen: "https://drive.google.com/drive/folders/15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl?usp=drive_link",
    latest: { title: "Nuutste gemeentebrief", date: "", url: "", viewerUrl: "" },
    items: [],
  },
};

function getValue(data, path) {
  return path.split(".").reduce((current, key) => current?.[key], data);
}

function hasUsefulValue(value) {
  return Boolean(value && !String(value).toLowerCase().includes("nog te bevestig"));
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("af-ZA", { dateStyle: "medium", timeStyle: "short" });
}

function setFeedUpdated(elementId, updatedAt, fallbackText = "Laas opgedateer: nog nie beskikbaar nie") {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = updatedAt ? `Laas opgedateer: ${formatDate(updatedAt)}` : fallbackText;
}

function setTextFields(data) {
  document.querySelectorAll("[data-field]").forEach((element) => {
    const value = getValue(data, element.dataset.field || "");
    if (value) element.textContent = value;
  });
}

function setLink(linkId, url) {
  const link = document.getElementById(linkId);
  if (link && url) link.href = url;
}

function setContactActions(config) {
  const phone = config.church?.phone;
  const email = config.church?.email;
  const phoneLink = document.getElementById("phone-link");
  const emailLink = document.getElementById("email-link");

  if (phoneLink) {
    if (hasUsefulValue(phone)) {
      phoneLink.href = `tel:${String(phone).replace(/\s+/g, "")}`;
      phoneLink.classList.remove("disabled-link");
    } else {
      phoneLink.removeAttribute("href");
      phoneLink.classList.add("disabled-link");
    }
  }

  if (emailLink) {
    if (hasUsefulValue(email)) {
      emailLink.href = `mailto:${email}`;
      emailLink.classList.remove("disabled-link");
    } else {
      emailLink.removeAttribute("href");
      emailLink.classList.add("disabled-link");
    }
  }
}

function showDataError() {
  document.body.classList.add("data-load-failed");
  if (document.getElementById("data-alert")) return;

  const alert = document.createElement("div");
  alert.id = "data-alert";
  alert.className = "data-alert";
  alert.setAttribute("role", "status");
  alert.textContent = "Die site-data.json lêer kon nie gelaai word nie. Maak seker die JSON is geldig en in die repo beskikbaar.";

  const main = document.querySelector("main");
  if (main) main.prepend(alert);
}

function getGoogleDocPreviewUrl(url) {
  const match = url?.match(/\/document\/d\/([^/]+)/);
  return match ? `https://docs.google.com/document/d/${match[1]}/preview` : "";
}

function getDriveFilePreviewUrl(url) {
  if (!url) return "";
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  const idMatch = url.match(/[?&]id=([^&]+)/);
  if (idMatch) return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  return url;
}

function getDriveFolderEmbedUrl(folderId) {
  return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
}

function getUploadsEmbedUrl(channelId) {
  if (!channelId || !channelId.startsWith("UC")) return "";
  return `https://www.youtube.com/embed/videoseries?list=UU${channelId.slice(2)}`;
}

function getYouTubeEmbedUrl(videoId) {
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

function attachEmbed(frameId, placeholderId, url) {
  const frame = document.getElementById(frameId);
  const placeholder = document.getElementById(placeholderId);
  if (!frame || !placeholder || !url) return false;
  frame.src = url;
  frame.style.display = "block";
  placeholder.style.display = "none";
  return true;
}

function renderServices(services = []) {
  const container = document.getElementById("service-list");
  if (!container || !services.length) return;

  container.innerHTML = services
    .map((service, index) => `
      <p class="service-time${index > 0 ? " smaller" : ""}">${service.time}</p>
      <p>${service.name}</p>
    `)
    .join("");
}

function getNewsletterViewerUrl(newsletter) {
  return newsletter?.viewerUrl || getDriveFilePreviewUrl(newsletter?.url || "");
}

function normalizeNewsletterFeed(newsletters = {}) {
  const items = newsletters.items || [];
  const latest = newsletters.latest || items[0] || null;
  return {
    ...newsletters,
    latest,
    items: items.length ? items : latest ? [latest] : [],
  };
}

function renderLatestNewsletter(newsletters) {
  const feed = normalizeNewsletterFeed(newsletters);
  const latest = feed.latest;
  const title = document.getElementById("latest-newsletter-title");
  const date = document.getElementById("latest-newsletter-date");
  const description = document.getElementById("latest-newsletter-description");
  const link = document.getElementById("latest-newsletter-link");

  if (!title || !date || !description || !link) return;

  title.textContent = latest?.title || "Nuutste gemeentebrief";
  date.textContent = latest?.date || "Nuutste";
  setFeedUpdated("newsletter-updated", feed.updatedAt || latest?.updatedAt);

  if (latest?.url || latest?.viewerUrl) {
    description.textContent = latest.description || "Maak die nuutste gemeentebrief oop om dit te lees.";
    link.href = latest.viewerUrl || latest.url;
    link.target = "_blank";
    link.rel = "noopener";
  } else {
    description.textContent = "Die nuutste nuusbrief sal hier verskyn sodra 'n PDF in die Google Drive folder beskikbaar is.";
    link.href = "nuusbriewe.html";
    link.removeAttribute("target");
  }
}

function renderNewsletterArchive(newsletters) {
  const feed = normalizeNewsletterFeed(newsletters);
  const list = document.getElementById("newsletter-archive-list");
  const reader = document.getElementById("newsletter-reader-frame");
  const placeholder = document.getElementById("newsletter-reader-placeholder");
  const folderLink = document.getElementById("newsletter-folder-link");
  const folderFrame = document.getElementById("newsletter-folder-frame");
  const folderPlaceholder = document.getElementById("newsletter-folder-placeholder");

  if (folderLink) folderLink.href = feed.folderOpen || "#";

  const items = feed.items.filter((item) => item?.title);

  if (list) {
    list.innerHTML = items.length
      ? items.map((item, index) => `
          <button class="newsletter-list-button" type="button" data-newsletter-index="${index}">
            <span>${item.date || "Gemeentebrief"}</span>
            <strong>${item.title}</strong>
          </button>
        `).join("")
      : `<p class="muted">Laai PDF's in die Google Drive folder. Sodra die Drive feed gekoppel is, sal dit hier outomaties sorteer.</p>`;
  }

  if (reader && placeholder && items.length) {
    const firstUrl = getNewsletterViewerUrl(items[0]);
    if (firstUrl) {
      reader.src = firstUrl;
      reader.style.display = "block";
      placeholder.style.display = "none";
    }

    list?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-newsletter-index]");
      if (!button) return;
      const selected = items[Number(button.dataset.newsletterIndex)];
      const url = getNewsletterViewerUrl(selected);
      if (url) {
        reader.src = url;
        reader.style.display = "block";
        placeholder.style.display = "none";
      }
    });
  }

  if (folderFrame && folderPlaceholder && feed.folderId) {
    attachEmbed("newsletter-folder-frame", "newsletter-folder-placeholder", getDriveFolderEmbedUrl(feed.folderId));
  }
}

function renderLatestVideoPreview(videos = [], updatedAt = "") {
  const latest = videos.find((video) => video.videoId);
  const link = document.getElementById("latest-video-link");
  const thumb = document.getElementById("latest-video-thumb");
  const title = document.getElementById("latest-video-title");

  setFeedUpdated("youtube-updated", updatedAt || latest?.publishedAt);

  if (!latest || !link || !thumb || !title) return;

  link.href = "preke.html";
  title.textContent = latest.title || "Nuutste video";

  if (latest.thumbnail) {
    thumb.src = latest.thumbnail;
    thumb.style.display = "block";
  }
}

function renderVideos(videos = []) {
  const list = document.getElementById("video-list");
  const frame = document.getElementById("video-page-frame");
  const placeholder = document.getElementById("video-page-placeholder");
  if (!list || !frame || !placeholder) return;

  if (!videos.length) {
    list.innerHTML = `<p class="muted">Die outomatiese YouTube feed is nog nie gekoppel nie. Gebruik intussen die playlist hieronder.</p>`;
    return;
  }

  list.innerHTML = videos.map((video) => `
    <button class="video-list-button" type="button" data-video-id="${video.videoId}">
      ${video.thumbnail ? `<img src="${video.thumbnail}" alt="" loading="lazy" />` : ""}
      <span>${video.publishedAt ? new Date(video.publishedAt).toLocaleDateString("af-ZA") : "Video"}</span>
      <strong>${video.title}</strong>
    </button>
  `).join("");

  const firstVideo = videos.find((video) => video.videoId);
  if (firstVideo) {
    frame.src = getYouTubeEmbedUrl(firstVideo.videoId);
    frame.style.display = "block";
    placeholder.style.display = "none";
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-video-id]");
    if (!button) return;
    frame.src = getYouTubeEmbedUrl(button.dataset.videoId);
    frame.style.display = "block";
    placeholder.style.display = "none";
  });
}

async function loadYouTubeFeed(feedUrl) {
  if (!feedUrl) return;
  try {
    const response = await fetch(feedUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("YouTube feed could not load");
    const data = await response.json();
    renderLatestVideoPreview(data.videos || [], data.updatedAt);
    renderVideos(data.videos || []);
  } catch (error) {
    console.error("YouTube feed could not be loaded.", error);
  }
}

async function loadNewsletterFeed(feedUrl, fallbackNewsletters) {
  renderLatestNewsletter(fallbackNewsletters);
  renderNewsletterArchive(fallbackNewsletters);

  if (!feedUrl) return;

  try {
    const response = await fetch(feedUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Newsletter feed could not load");
    const data = await response.json();
    const merged = {
      ...fallbackNewsletters,
      ...data,
      folderOpen: fallbackNewsletters.folderOpen,
    };
    renderLatestNewsletter(merged);
    renderNewsletterArchive(merged);
  } catch (error) {
    console.error("Newsletter feed could not be loaded.", error);
  }
}

function applySiteData(data) {
  const config = {
    ...data,
    links: { ...requiredDefaults.links, ...(data.links || {}) },
    feeds: { ...requiredDefaults.feeds, ...(data.feeds || {}) },
    newsletters: { ...requiredDefaults.newsletters, ...(data.newsletters || {}) },
  };

  setTextFields(config);
  renderServices(config.services);
  setContactActions(config);
  loadNewsletterFeed(config.feeds.newsletters, config.newsletters);

  setLink("google-doc-link", config.links.googleDoc);
  setLink("facebook-link", config.links.facebook);
  setLink("google-business-link", config.links.googleBusiness);
  setLink("youtube-streams-link", config.links.youtubeStreams);
  setLink("maps-link", config.links.mapsOpen || config.links.mapsEmbed);

  attachEmbed("google-doc-frame", "google-doc-placeholder", getGoogleDocPreviewUrl(config.links.googleDoc));
  attachEmbed("youtube-frame", "youtube-placeholder", config.links.youtubeEmbed || getUploadsEmbedUrl(config.links.youtubeChannelId));
  attachEmbed("map-frame", "map-placeholder", config.links.mapsEmbed);
  loadYouTubeFeed(config.feeds.youtube || config.links.youtubeFeedUrl);
}

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

async function setupData() {
  try {
    const siteData = await loadJson("site-data.json");
    applySiteData(siteData);
    document.body.classList.add("data-loaded");
  } catch (error) {
    console.error("site-data.json could not be loaded. Check JSON validity.", error);
    showDataError();
  }
}

function setupMobileMenu() {
  const button = document.querySelector(".menu-button");
  const links = document.getElementById("nav-links");
  if (!button || !links) return;

  button.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });

  links.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      links.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    }
  });
}

function setupFooterYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

setupData();
setupMobileMenu();
setupFooterYear();
