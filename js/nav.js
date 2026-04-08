// =========================
// Navigation Entry Point
// =========================

import { initNavigation } from "./navigation.js";
import { createNav } from "./navComponent.js";

console.log("Navigation script loaded!");

// Insert nav if not present
if (!document.querySelector(".nav")) {
  const nav = createNav();
  document.body.insertBefore(nav, document.body.firstChild.nextSibling); // After noscript
}

// Initialize navigation
initNavigation();
