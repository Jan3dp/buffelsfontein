const driveConfig = {
  siteDataFileId: "1KyC0bqMOTAOw9ptWBYLLKSEz9aFvbd_e",
  newslettersFolderId: "15JL3P9Zzy0uiS6Skk__1yFooEcGAi5gl",
};

const fallbackConfig = {
  church: {
    name: "Gereformeerde Kerk Gobabis",
    shortName: "GK Gobabis",
    language: "Afrikaans",
    identity: "Gereformeerd",
    tagline: "'n Warm, gereformeerde gemeente waar ons saam onder God se Woord leef en Christus as Koning bely.",
    minister: "Nog te bevestig",
    location: "Gobabis, Namibie",
    phone: "Nog te bevestig",
    email: "Nog te bevestig",
    address: "Nog te bevestig",
  },
  services: [
    { name: "Oggenddiens", time: "09:30" },
    { name: "Aanddiens", time: "18:00" },
  ],
  links: {
    googleDoc: "https://docs.google.com/document/d/1fP17MR7py5kAE3WhLUhaP6Z211nt3pcZSzmYrytvLOk/edit?usp=drive_link",
    facebook: "https://www.facebook.com/gkgobabis/",
    googleBusiness: "https://share.google/ICmQsJ9kmqwWJQGmM",
    youtubeStreams: "https://www.youtube.com/@GKGobabis/streams",
    youtubeChannelId: "",
    youtubeEmbed: "",
  },
};

function getValue(data, path) {
  return path.split(".").reduce((current, key) => current?.[key], data);
}

function setTextFields(data) {
  document.querySelectorAll("[data-field]").forEach((element) => {
    const value = getValue(data, element.dataset.field || "");
    if (value) {
      element.textContent = value;
    }
  });
}

function setLink(linkId, url) {
  const link = document.getElementById(linkId);
  if (link && url) {
    link.href = url;
  }
}

function getGoogleDocPreviewUrl(url) {
  const match = url.match(/\/document\/d\/([^/]+)/);
  if (!match) {
    return "";
  }
  return `https://docs.google.com/document/d/${match[1]}/preview`;
}

function getDriveDownloadUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

function getDriveFolderEmbedUrl(folderId) {
  return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
}

function getUploadsEmbedUrl(channelId) {
  if (!channelId || !channelId.startsWith("UC")) {
    return "";
  }

  const uploadsPlaylistId = `UU${channelId.slice(2)}`;
  return `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}`;
}

function attachEmbed(frameId, placeholderId, url) {
  const frame = document.getElementById(frameId);
  const placeholder = document.getElementById(placeholderId);

  if (!frame || !placeholder || !url) {
    return false;
  }

  frame.src = url;
  frame.style.display = "block";
  placeholder.style.display = "none";
  return true;
}

function renderServices(services = []) {
  const container = document.getElementById("service-list");
  if (!container || !services.length) {
    return;
  }

  container.innerHTML = services
    .map((service, index) => `
      <p class="service-time${index > 0 ? " smaller" : ""}">${service.time}</p>
      <p>${service.name}</p>
    `)
    .join("");
}

function applySiteData(data) {
  const config = {
    ...fallbackConfig,
    ...data,
    church: { ...fallbackConfig.church, ...(data.church || {}) },
    links: { ...fallbackConfig.links, ...(data.links || {}) },
  };

  setTextFields(config);
  renderServices(config.services);
  setLink("google-doc-link", config.links.googleDoc);
  setLink("facebook-link", config.links.facebook);
  setLink("google-business-link", config.links.googleBusiness);
  setLink("youtube-streams-link", config.links.youtubeStreams);

  const docPreviewUrl = getGoogleDocPreviewUrl(config.links.googleDoc);
  attachEmbed("google-doc-frame", "google-doc-placeholder", docPreviewUrl);

  const youtubeEmbedUrl = config.links.youtubeEmbed || getUploadsEmbedUrl(config.links.youtubeChannelId);
  attachEmbed("youtube-frame", "youtube-placeholder", youtubeEmbedUrl);
}

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }
  return response.json();
}

async function setupData() {
  const remoteSiteDataUrl = getDriveDownloadUrl(driveConfig.siteDataFileId);

  try {
    const remoteSiteData = await loadJson(remoteSiteDataUrl);
    applySiteData(remoteSiteData);
  } catch (remoteError) {
    console.warn("Could not load Google Drive JSON. Falling back to local site-data.json.", remoteError);

    try {
      const localSiteData = await loadJson("site-data.json");
      applySiteData(localSiteData);
    } catch (localError) {
      console.warn(localError);
      applySiteData(fallbackConfig);
    }
  }

  attachEmbed(
    "newsletter-folder-frame",
    "newsletter-folder-placeholder",
    getDriveFolderEmbedUrl(driveConfig.newslettersFolderId)
  );
}

function setupMobileMenu() {
  const button = document.querySelector(".menu-button");
  const links = document.getElementById("nav-links");

  if (!button || !links) {
    return;
  }

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
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}

setupData();
setupMobileMenu();
setupFooterYear();
