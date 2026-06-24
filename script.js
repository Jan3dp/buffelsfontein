const driveConfig = {
  newslettersFolderId: "15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl",
};

const requiredDefaults = {
  links: {
    youtubeChannelId: "UCqYlRWltvAJaUrrbKyiIYsw",
    youtubeStreams: "https://www.youtube.com/@GKGobabis/streams",
    mapsEmbed: "https://www.google.com/maps?q=Gereformeerde%20Kerk%20Gobabis&output=embed",
    mapsOpen: "https://www.google.com/maps/search/?api=1&query=Gereformeerde%20Kerk%20Gobabis",
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

function getDriveFolderEmbedUrl(folderId) {
  return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
}

function getUploadsEmbedUrl(channelId) {
  if (!channelId || !channelId.startsWith("UC")) return "";
  return `https://www.youtube.com/embed/videoseries?list=UU${channelId.slice(2)}`;
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

function applySiteData(data) {
  const config = {
    ...data,
    links: { ...requiredDefaults.links, ...(data.links || {}) },
  };

  setTextFields(config);
  renderServices(config.services);
  setContactActions(config);

  setLink("google-doc-link", config.links.googleDoc);
  setLink("facebook-link", config.links.facebook);
  setLink("google-business-link", config.links.googleBusiness);
  setLink("youtube-streams-link", config.links.youtubeStreams);
  setLink("maps-link", config.links.mapsOpen || config.links.mapsEmbed);

  attachEmbed("google-doc-frame", "google-doc-placeholder", getGoogleDocPreviewUrl(config.links.googleDoc));
  attachEmbed("youtube-frame", "youtube-placeholder", config.links.youtubeEmbed || getUploadsEmbedUrl(config.links.youtubeChannelId));
  attachEmbed("map-frame", "map-placeholder", config.links.mapsEmbed);
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

  attachEmbed("newsletter-folder-frame", "newsletter-folder-placeholder", getDriveFolderEmbedUrl(driveConfig.newslettersFolderId));
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
