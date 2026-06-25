const requiredDefaults = {
  links: {
    youtubeChannelId: "UCqYlRWltvAJaUrrbKyiIYsw",
    youtubeStreams: "https://www.youtube.com/@GKGobabis/streams",
    youtubeEmbed: "",
    youtubeFeedUrl: "",
    mapsEmbed: "https://www.google.com/maps?q=Gereformeerde%20Kerk%20Gobabis&output=embed",
    mapsOpen: "https://www.google.com/maps/search/?api=1&query=Gereformeerde%20Kerk%20Gobabis",
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

function renderLatestNewsletter(newsletters) {
  const latest = newsletters?.latest;
  const title = document.getElementById("latest-newsletter-title");
  const date = document.getElementById("latest-newsletter-date");
  const description = document.getElementById("latest-newsletter-description");
  const link = document.getElementById("latest-newsletter-link");

  if (!title || !date || !description || !link) return;

  title.textContent = latest?.title || "Nuutste gemeentebrief";
  date.textContent = latest?.date || "Nuutste";

  if (latest?.url || latest?.viewerUrl) {
    description.textContent = latest.description || "Maak die nuutste gemeentebrief oop om dit te lees.";
    link.href = latest.url || latest.viewerUrl;
    link.target = "_blank";
    link.rel = "noopener";
  } else {
    description.textContent = "Die nuutste nuusbrief sal hier verskyn sodra die PDF-skakel in site-data.json ingevul is.";
    link.href = "nuusbriewe.html";
  }
}

function renderNewsletterArchive(newsletters) {
  const list = document.getElementById("newsletter-archive-list");
  const reader = document.getElementById("newsletter-reader-frame");
  const placeholder = document.getElementById("newsletter-reader-placeholder");
  const folderLink = document.getElementById("newsletter-folder-link");
  const folderFrame = document.getElementById("newsletter-folder-frame");
  const folderPlaceholder = document.getElementById("newsletter-folder-placeholder");

  if (folderLink) folderLink.href = newsletters.folderOpen || "#";

  const items = [newsletters.latest, ...(newsletters.items || [])].filter((item) => item?.title);

  if (list) {
    list.innerHTML = items.length
      ? items.map((item, index) => `
          <button class="newsletter-list-button" type="button" data-newsletter-index="${index}">
            <span>${item.date || "Gemeentebrief"}</span>
            <strong>${item.title}</strong>
          </button>
        `).join("")
      : `<p class="muted">Voeg PDF-skakels by die newsletters-afdeling in site-data.json. Tot dan wys die Drive-folder hieronder.</p>`;
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

  if (folderFrame && folderPlaceholder && newsletters.folderId) {
    attachEmbed("newsletter-folder-frame", "newsletter-folder-placeholder", getDriveFolderEmbedUrl(newsletters.folderId));
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

  list.innerHTML = videos.map((video, index) => `
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
  if (!feedUrl || !document.getElementById("video-list")) return;
  try {
    const response = await fetch(feedUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("YouTube feed could not load");
    const data = await response.json();
    renderVideos(data.videos || []);
  } catch (error) {
    console.error("YouTube feed could not be loaded.", error);
  }
}

function applySiteData(data) {
  const config = {
    ...data,
    links: { ...requiredDefaults.links, ...(data.links || {}) },
    newsletters: { ...requiredDefaults.newsletters, ...(data.newsletters || {}) },
  };

  setTextFields(config);
  renderServices(config.services);
  setContactActions(config);
  renderLatestNewsletter(config.newsletters);
  renderNewsletterArchive(config.newsletters);

  setLink("google-doc-link", config.links.googleDoc);
  setLink("facebook-link", config.links.facebook);
  setLink("google-business-link", config.links.googleBusiness);
  setLink("youtube-streams-link", config.links.youtubeStreams);
  setLink("maps-link", config.links.mapsOpen || config.links.mapsEmbed);

  attachEmbed("google-doc-frame", "google-doc-placeholder", getGoogleDocPreviewUrl(config.links.googleDoc));
  attachEmbed("youtube-frame", "youtube-placeholder", config.links.youtubeEmbed || getUploadsEmbedUrl(config.links.youtubeChannelId));
  attachEmbed("map-frame", "map-placeholder", config.links.mapsEmbed);
  loadYouTubeFeed(config.links.youtubeFeedUrl);
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
