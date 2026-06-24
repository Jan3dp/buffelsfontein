const siteConfig = {
  // Replace this with the published Google Doc embed URL.
  // In Google Docs: File > Share > Publish to web > Embed.
  // Example format:
  // https://docs.google.com/document/d/e/2PACX-.../pub?embedded=true
  googleDocEmbedUrl: "",

  // Replace this with a YouTube embed URL.
  // Recommended no-API option: create a sermon playlist and use its embed URL.
  // Example playlist format:
  // https://www.youtube.com/embed/videoseries?list=YOUR_PLAYLIST_ID
  // Example single channel uploads are harder without API/RSS, so playlist is best for now.
  youtubeEmbedUrl: "",
};

function attachEmbed(frameId, placeholderId, url) {
  const frame = document.getElementById(frameId);
  const placeholder = document.getElementById(placeholderId);

  if (!frame || !placeholder || !url) {
    return;
  }

  frame.src = url;
  frame.style.display = "block";
  placeholder.style.display = "none";
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
attachEmbed("youtube-frame", "youtube-placeholder", siteConfig.youtubeEmbedUrl);
setupMobileMenu();
setupFooterYear();
