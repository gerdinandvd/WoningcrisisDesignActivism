// =========================
// Responsive Navigation Module
// =========================

export function initNavigation() {
  console.log("initNavigation() called");

  function setupNavigation() {
    console.log("setupNavigation() called");
    const navToggle = document.getElementById("nav-toggle");
    const navLinks = document.getElementById("nav-links");

    console.log("navToggle:", navToggle);
    console.log("navLinks:", navLinks);

    if (!navToggle || !navLinks) {
      console.warn("Navigation elements not found");
      return;
    }

    console.log("Navigation elements found! Setting up event listeners...");

    // Toggle menu on hamburger click
    navToggle.addEventListener("click", (event) => {
      console.log("Hamburger clicked!");
      console.log(
        "Current active state before toggle:",
        navToggle.classList.contains("active"),
      );
      event.stopPropagation();
      navToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
      console.log(
        "Current active state after toggle:",
        navToggle.classList.contains("active"),
      );
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        console.log("Link clicked, closing menu");
        navToggle.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        !navToggle.contains(event.target) &&
        !navLinks.contains(event.target)
      ) {
        navToggle.classList.remove("active");
        navLinks.classList.remove("active");
      }
    });
  }

  // Try to setup immediately if DOM is ready
  if (document.readyState === "loading") {
    console.log("Document still loading, waiting for DOMContentLoaded...");
    document.addEventListener("DOMContentLoaded", setupNavigation);
  } else {
    console.log(
      "Document already loaded, setting up navigation immediately...",
    );
    setupNavigation();
  }
}
