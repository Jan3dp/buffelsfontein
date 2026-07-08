const FEED_REFRESH_MS = 60 * 60 * 1000;

const requiredDefaults = {
  links: {
    youtubeStreams: "https://www.youtube.com/@GKGobabis/streams",
    mapsOpen: "https://www.google.com/maps/search/?api=1&query=Gereformeerde%20Kerk%20Gobabis",
  },
  feeds: {
    youtube: "",
    newsletters: "",
    leesstof: "",
  },
  newsletters: {
    folderOpen: "https://drive.google.com/drive/folders/15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl?usp=drive_link",
  },
  leesstof: {
    folderOpen: "https://drive.google.com/drive/folders/1BPUuMvxQSjrc_zviu24URLujCOZwCv2A?usp=sharing",
  },
};

function getValue(data, path) {
  return path.split(".").reduce((current, key) => current?.[key], data);
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("af-ZA", { dateStyle: "medium", timeStyle: "short" });
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

  if (phoneLink && phone) phoneLink.href = `tel:${String(phone).replace(/\s+/g, "")}`;
  if (emailLink && email) emailLink.href = `mailto:${email}`;
}

function showDataError() {
  document.body.classList.add("data-load-failed");
  if (document.getElementById("data-alert")) return;

  const alert = document.createElement("div");
  alert.id = "data-alert";
  alert.className = "data-alert";
  alert.setAttribute("role", "status");
  alert.textContent = "Die site-data.json lêer kon nie gelaai word nie. Maak seker die JSON is geldig en in die repo beskikbaar.";

  document.querySelector("main")?.prepend(alert);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

function setUpdated(id, value) {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = value ? `Laas opgedateer: ${formatDate(value)}` : "Laas opgedateer: nog nie beskikbaar nie";
}

function getYouTubeEmbedUrl(videoId) {
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

function getNewsletterViewerUrl(item) {
  return item?.viewerUrl || item?.url || "";
}

function renderLatestVideo(videos = [], updatedAt = "") {
  const latest = videos.find((video) => video.videoId);
  setUpdated("youtube-updated", updatedAt || latest?.publishedAt);

  const title = document.getElementById("latest-video-title");
  const thumb = document.getElementById("latest-video-thumb");
  if (title && latest?.title) title.textContent = latest.title;
  if (thumb && latest?.thumbnail) {
    thumb.src = latest.thumbnail;
    thumb.style.display = "block";
  }
}

function renderVideoPage(videos = []) {
  const list = document.getElementById("video-list");
  const frame = document.getElementById("video-page-frame");
  const placeholder = document.getElementById("video-page-placeholder");
  if (!list || !frame || !placeholder) return;

  if (!videos.length) {
    list.innerHTML = `<p class="muted">Geen videos is tans beskikbaar nie.</p>`;
    return;
  }

  list.innerHTML = videos.map((video) => `
    <button class="video-list-button" type="button" data-video-id="${escapeHtml(video.videoId)}">
      ${video.thumbnail ? `<img src="${escapeHtml(video.thumbnail)}" alt="" loading="lazy" />` : ""}
      <span>${video.publishedAt ? new Date(video.publishedAt).toLocaleDateString("af-ZA") : "Video"}</span>
      <strong>${escapeHtml(video.title)}</strong>
    </button>
  `).join("");

  const first = videos.find((video) => video.videoId);
  if (first) {
    frame.src = getYouTubeEmbedUrl(first.videoId);
    frame.style.display = "block";
    placeholder.style.display = "none";
  }

  list.onclick = (event) => {
    const button = event.target.closest("[data-video-id]");
    if (!button) return;
    frame.src = getYouTubeEmbedUrl(button.dataset.videoId);
    frame.style.display = "block";
    placeholder.style.display = "none";
  };
}

function normalizeNewsletterFeed(feed = {}) {
  const items = feed.items || [];
  const latest = feed.latest || items[0] || null;
  return { ...feed, latest, items };
}

function renderLatestNewsletter(feedData = {}) {
  const feed = normalizeNewsletterFeed(feedData);
  const latest = feed.latest;

  setUpdated("newsletter-updated", feed.updatedAt || latest?.updatedAt);

  const title = document.getElementById("latest-newsletter-title");
  const date = document.getElementById("latest-newsletter-date");
  const description = document.getElementById("latest-newsletter-description");
  const link = document.getElementById("latest-newsletter-link");

  if (title && latest?.title) title.textContent = latest.title;
  if (date) date.textContent = latest?.date || "Nuutste";
  if (description) description.textContent = latest ? "Maak die nuutste gemeentebrief oop." : "Geen nuusbriewe is tans beskikbaar nie.";

  const url = getNewsletterViewerUrl(latest);
  if (link && url) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
  }
}

function renderNewsletterPage(feedData = {}) {
  const feed = normalizeNewsletterFeed(feedData);
  const list = document.getElementById("newsletter-archive-list");
  const reader = document.getElementById("newsletter-reader-frame");
  const placeholder = document.getElementById("newsletter-reader-placeholder");
  if (!list || !reader || !placeholder) return;

  const items = feed.items.filter((item) => item?.title);
  if (!items.length) {
    list.innerHTML = `<p class="muted">Geen nuusbriewe is tans beskikbaar nie.</p>`;
    return;
  }

  list.innerHTML = items.map((item, index) => `
    <button class="newsletter-list-button" type="button" data-newsletter-index="${index}">
      <span>${escapeHtml(item.date || "Gemeentebrief")}</span>
      <strong>${escapeHtml(item.title)}</strong>
    </button>
  `).join("");

  const firstUrl = getNewsletterViewerUrl(items[0]);
  if (firstUrl) {
    reader.src = firstUrl;
    reader.style.display = "block";
    placeholder.style.display = "none";
  }

  list.onclick = (event) => {
    const button = event.target.closest("[data-newsletter-index]");
    if (!button) return;
    const selected = items[Number(button.dataset.newsletterIndex)];
    const url = getNewsletterViewerUrl(selected);
    if (!url) return;
    reader.src = url;
    reader.style.display = "block";
    placeholder.style.display = "none";
  };
}

function getDriveViewerUrl(item) {
  return item?.viewerUrl || item?.url || "";
}

function getLeesstofItems(categories = []) {
  return categories.flatMap((category) =>
    (category.items || []).map((item) => ({ ...item, category: category.title, categorySlug: category.slug }))
  );
}

function renderLeesstofFeed(feedData = {}) {
  setUpdated("leesstof-updated", feedData.updatedAt);

  const categoryList = document.getElementById("leesstof-category-list");
  const itemsContainer = document.getElementById("leesstof-items");
  const summary = document.getElementById("leesstof-summary");
  const search = document.getElementById("leesstof-search");
  if (!categoryList || !itemsContainer) return;

  const categories = (feedData.categories || []).filter((category) => category?.title);
  const allItems = getLeesstofItems(categories);

  if (summary) {
    summary.textContent = categories.length
      ? `${feedData.itemCount || allItems.length} stukke leesstof in ${categories.length} onderwerpe.`
      : "Geen leesstof is tans beskikbaar nie.";
  }

  if (!categories.length) {
    categoryList.innerHTML = `<p class="muted">Geen onderwerpe is tans beskikbaar nie.</p>`;
    itemsContainer.innerHTML = `<p class="muted">Plaas PDF-, Word- of Google Docs-lêers in onderwerp-folders in Google Drive.</p>`;
    return;
  }

  categoryList.innerHTML = `
    <button class="category-pill is-active" type="button" data-category="all">Alle</button>
    ${categories.map((category) => `
      <button class="category-pill" type="button" data-category="${escapeHtml(category.slug)}">
        ${escapeHtml(category.title)} <span>${category.count}</span>
      </button>
    `).join("")}
  `;

  let activeCategory = "all";

  function renderItems() {
    const query = String(search?.value || "").toLowerCase().trim();
    const visibleCategories = categories
      .map((category) => {
        const items = (category.items || []).filter((item) => {
          const haystack = `${item.title || ""} ${item.fileName || ""} ${category.title || ""}`.toLowerCase();
          const matchesCategory = activeCategory === "all" || category.slug === activeCategory;
          const matchesSearch = !query || haystack.includes(query);
          return matchesCategory && matchesSearch;
        });
        return { ...category, items };
      })
      .filter((category) => category.items.length);

    if (!visibleCategories.length) {
      itemsContainer.innerHTML = `<p class="muted">Geen leesstof pas by jou soektog nie.</p>`;
      return;
    }

    itemsContainer.innerHTML = visibleCategories.map((category) => `
      <section class="leesstof-category" id="leesstof-${escapeHtml(category.slug)}">
        <div class="leesstof-category-heading">
          <h2>${escapeHtml(category.title)}</h2>
          <span>${category.items.length}</span>
        </div>
        <div class="leesstof-card-grid">
          ${category.items.map((item) => {
            const viewerUrl = getDriveViewerUrl(item);
            const openUrl = item.url || viewerUrl;
            return `
              <article class="leesstof-card">
                <div>
                  <span class="file-type">${escapeHtml(item.fileType || "Dokument")}</span>
                  <h3>${escapeHtml(item.title || item.fileName || "Leesstof")}</h3>
                  <p class="muted">Laas opgedateer: ${escapeHtml(item.date || "Onbekend")}</p>
                </div>
                <div class="hero-actions compact-actions">
                  ${viewerUrl ? `<a class="button primary" href="${escapeHtml(viewerUrl)}" target="_blank" rel="noopener">Lees</a>` : ""}
                  ${openUrl ? `<a class="button secondary" href="${escapeHtml(openUrl)}" target="_blank" rel="noopener">Drive</a>` : ""}
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `).join("");
  }

  categoryList.onclick = (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category || "all";
    categoryList.querySelectorAll(".category-pill").forEach((pill) => pill.classList.toggle("is-active", pill === button));
    renderItems();
  };

  if (search) search.oninput = renderItems;
  renderItems();
}

function getCachedFeed(cacheKey) {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (!cached || !cached.data || !cached.savedAt) return null;
    return cached;
  } catch (error) {
    console.warn("Cached feed could not be read.", error);
    return null;
  }
}

function saveCachedFeed(cacheKey, data) {
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data }));
  } catch (error) {
    console.warn("Cached feed could not be saved.", error);
  }
}

function isFresh(cached) {
  return cached && Date.now() - cached.savedAt < FEED_REFRESH_MS;
}

function renderYouTubeFeed(data) {
  renderLatestVideo(data?.videos || [], data?.updatedAt);
  renderVideoPage(data?.videos || []);
}

function renderNewsletterFeed(data) {
  renderLatestNewsletter(data || {});
  renderNewsletterPage(data || {});
}

async function loadFeed(url, cacheKey, render) {
  const cached = getCachedFeed(cacheKey);
  if (cached?.data) render(cached.data);
  if (!url || isFresh(cached)) return;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Feed could not load: ${url}`);
    const data = await response.json();
    saveCachedFeed(cacheKey, data);
    render(data);
  } catch (error) {
    console.error("Feed could not be refreshed.", error);
    if (!cached?.data) render({});
  }
}

function applySiteData(data) {
  const config = {
    ...data,
    links: { ...requiredDefaults.links, ...(data.links || {}) },
    feeds: { ...requiredDefaults.feeds, ...(data.feeds || {}) },
    newsletters: { ...requiredDefaults.newsletters, ...(data.newsletters || {}) },
    leesstof: { ...requiredDefaults.leesstof, ...(data.leesstof || {}) },
  };

  setTextFields(config);
  renderServices(config.services);
  setContactActions(config);

  setLink("facebook-link", config.links.facebook);
  setLink("google-business-link", config.links.googleBusiness);
  setLink("youtube-streams-link", config.links.youtubeStreams);
  setLink("maps-link", config.links.mapsOpen);
  setLink("newsletter-folder-link", config.newsletters.folderOpen);
  setLink("leesstof-folder-link", config.leesstof.folderOpen);

  loadFeed(config.feeds.youtube, "gkg-youtube-feed", renderYouTubeFeed);
  loadFeed(config.feeds.newsletters, "gkg-newsletter-feed", renderNewsletterFeed);
  loadFeed(config.feeds.leesstof, "gkg-leesstof-feed", renderLeesstofFeed);
}

async function setupData() {
  try {
    const response = await fetch("site-data.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load site-data.json");
    applySiteData(await response.json());
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
