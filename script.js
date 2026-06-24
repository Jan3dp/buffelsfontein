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

function renderNewsletters(newsletters = []) {
  const container = document.getElementById("newsletter-list");
  if (!container) {
    return;
  }

  const validNewsletters = newsletters.filter((item) => item.title);

  if (!validNewsletters.length) {
    return;
  }

  container.innerHTML = validNewsletters
    .map((item) => {
      const link = item.url
        ? `<a href="${item.url}" target="_blank" rel="noopener">Lees nuusbrief</a>`
        : `<span class="muted">Skakel nog nie beskikbaar nie</span>`;

      return `
        <article class="newsletter-card">
          <p class="newsletter-date">${item.date || "Datum volg"}</p>
          <h3>${item.title}</h3>
          <p>${item.description || ""}</p>
          ${link}
        </article>
      `;
    })
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
  attachEmbed("youtube-frame", "youtube-placeholder", config.links.youtubeEmbed);
}

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }
  return response.json();
}

async function setupData() {
  try {
    const siteData = await loadJson("site-data.json");
    applySiteData(siteData);
  } catch (error) {
    console.warn(error);
    applySiteData(fallbackConfig);
  }

  try {
    const newsletterData = await loadJson("newsletters.json");
    renderNewsletters(newsletterData.newsletters || []);
  } catch (error) {
    console.warn(error);
  }
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
