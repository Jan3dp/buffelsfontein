const siteConfig = {
  // Google Doc provided by the church.
  // This preview URL works when the document is shared as "Anyone with the link can view".
  // If it does not display, use Google Docs: File > Share > Publish to web > Embed,
  // then replace this value with the published /pub?embedded=true URL.
  googleDocEmbedUrl: "https://docs.google.com/document/d/1fP17MR7py5kAE3WhLUhaP6Z211nt3pcZSzmYrytvLOk/preview",
  googleDocOpenUrl: "https://docs.google.com/document/d/1fP17MR7py5kAE3WhLUhaP6Z211nt3pcZSzmYrytvLOk/edit?usp=drive_link",

  // No API key approach for now.
  // YouTube channel handles do not give us a clean latest-streams embed by themselves,
  // so the public streams page is linked directly.
  youtubeStreamsUrl: "https://www.youtube.com/@GKGobabis/streams",

  // Optional later: paste a real YouTube embed URL here, preferably a playlist:
  // https://www.youtube.com/embed/videoseries?list=PLAYLIST_ID
  youtubeEmbedUrl: "",
};

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

function attachLink(linkId, url) {
  const link = document.getElementById(linkId);

  if (!link || !url) {
    return;
  }

  link.href = url;
}

function setupOptionalYouTubeEmbed() {
  const shell = document.getElementById("youtube-embed-shell");
  const attached = attachEmbed("youtube-frame", "youtube-placeholder", siteConfig.youtubeEmbedUrl);

  if (shell && attached) {
    shell.classList.add("has-embed");
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

attachEmbed("google-doc-frame", "google-doc-placeholder", siteConfig.googleDocEmbedUrl);
attachLink("google-doc-link", siteConfig.googleDocOpenUrl);
attachLink("youtube-streams-link", siteConfig.youtubeStreamsUrl);
setupOptionalYouTubeEmbed();
setupMobileMenu();
setupFooterYear();
