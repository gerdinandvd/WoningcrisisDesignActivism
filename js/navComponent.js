// =========================
// Navigation Component
// =========================

export function createNav() {
  // Detect if in subfolder
  const isSubfolder =
    window.location.pathname.includes("/culprits/") ||
    window.location.pathname.includes("/posters/");
  const prefix = isSubfolder ? "../" : "";

  // Create nav element
  const nav = document.createElement("nav");
  nav.className = "nav";
  nav.innerHTML = `
    <div class="nav-logo-container">
      <a href="${prefix}index.html">
        <img class="nav-logo" src="${prefix}assets/klemLogo.png" alt="Logo KLEM" />
      </a>
    </div>
    <h1 class="nav-title">WoningCrisis Design Activism</h1>
    <div class="nav-links" id="nav-links">
      <a href="${prefix}index.html"><button class="button">Home</button></a>
      <a href="${prefix}game.html"><button class="button">Game</button></a>
      <a href="${prefix}posters.html"><button class="button">Posters</button></a>
      <a href="${prefix}culprits.html"><button class="button">Boosdoeners</button></a>
    </div>
    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  `;

  return nav;
}
