import { GameRoleData } from "./GameRoleData.js";
import { loadConfig } from "./loader.js";
import { initNavigation } from "./navigation.js";

console.log("Script loaded!");

// =========================
// Initialize Navigation Module
// =========================

initNavigation();

// =========================
// Config & Setup
// =========================

console.log("Starting config and setup...");

let config;
let gameRoleData;
let container;

try {
  config = await loadConfig("config");
  console.log("Config loaded successfully");
  gameRoleData = await GameRoleData.create(config);
  console.log("GameRoleData created successfully");
  container = document.querySelector(".game-container");
  console.log("Container:", container);
} catch (error) {
  console.error("Error loading config or GameRoleData:", error);
  // If this is not a game page, these errors are expected
}

// UI Elements
const ui = {
  header: document.getElementById("game-header"),
  initialSelection: document.getElementById("initial-role-selection"),
  gameContent: document.getElementById("game-content"),

  xpDisplay: document.getElementById("xp-display"),
  initialXpDisplay: document.getElementById("initial-xp-display"),
  roleInfo: document.getElementById("role-info"),
  roleProgress: document.getElementById("role-progress"),

  rolesGrid: document.getElementById("roles-grid"),

  nodeName: document.getElementById("node-name"),
  nodeDescription: document.getElementById("node-description"),
  nodeLink: document.getElementById("node-link"),
  actionText: document.getElementById("action-text"),
  choicesContainer: document.getElementById("choices-container"),
};

console.log("UI object created:", ui);

// =========================
// Event Handlers
// =========================

function OnChoiceClick(event) {
  const target = event.target;

  if (target.classList.contains("choice")) {
    const nextNodeId = target.getAttribute("data-next");

    console.log("Next node ID:", nextNodeId);

    const currentNode = gameRoleData.getCurrentNode();
    if (!currentNode) {
      console.error("Current node not found");
      return;
    }

    console.log("Current node:", currentNode);
    const choice = currentNode.choices.find((c) => c.next === nextNodeId);
    if (choice && typeof choice.xp === "number") {
      gameRoleData.addXP(choice.xp);
      console.log("XP added:", choice.xp);
    }
    const success = gameRoleData.setCurrentNodeId(nextNodeId);

    if (success) {
      console.log("Node updated successfully");
      updateGameRoleUI();
    } else {
      console.error("Failed to update node");
    }
  }
}

function OnRoleClick(event) {
  const target = event.target.closest(".role-card");

  if (target) {
    const role = target.getAttribute("data-role");
    console.log("Role clicked:", role);

    const success = gameRoleData.setCurrentRole(role);
    if (success) {
      const starterNodeId = gameRoleData.getStarterNodeId();
      gameRoleData.setCurrentNodeId(starterNodeId);
      updateGameRoleUI();
    }
  }
}

function OnFinishClick(event) {
  const target = event.target;

  if (target.classList.contains("finish-button")) {
    console.log("Finish clicked");
    gameRoleData.markRoleAsPlayed(gameRoleData.getCurrentRole());
    showInitialRoleSelection();
  }
}

// =========================
// UI Rendering
// =========================

function updateXP() {
  const xp = gameRoleData.getXP();
  if (ui.xpDisplay) ui.xpDisplay.textContent = `XP: ${xp}`;
  if (ui.initialXpDisplay) ui.initialXpDisplay.textContent = `XP: ${xp}`;
}

function showInitialRoleSelection() {
  if (!ui.initialSelection || !ui.rolesGrid) return;

  updateXP();

  // Hide game content & header, show role selection
  ui.header.style.display = "none";
  ui.gameContent.style.display = "none";
  ui.initialSelection.style.display = "block";

  const rolesList = gameRoleData.getRoles();
  if (!rolesList || rolesList.length === 0) return;

  ui.rolesGrid.innerHTML = rolesList
    .map((roleId) => {
      const isPlayed = gameRoleData.isRolePlayed(roleId);
      const playedClass = isPlayed ? "played" : "";
      const roleData = gameRoleData.getRoleData(roleId);
      const displayName = gameRoleData.getRoleDisplayName(roleId);
      const description =
        roleData.description || "Geen beschrijving beschikbaar.";

      return `
        <div class="role-card ${playedClass}" data-role="${roleId}">
          <div class="card-header">
            ${displayName}${isPlayed ? " (Gespeeld)" : ""}
          </div>
          <div class="card-body">
            <p class="card-description">${description}</p>
            <div class="card-image">
              <img src="assets/placeholder.webp" alt="${displayName}">
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function updateGameRoleUI() {
  const current_role = gameRoleData.getCurrentRole();
  if (!current_role) return;

  updateXP();

  // Show game content & header, hide role selection
  ui.initialSelection.style.display = "none";
  ui.header.style.display = "block";
  ui.gameContent.style.display = "block";

  const rolesList = gameRoleData.getRoles();
  const currentNode = gameRoleData.getCurrentNode();

  if (!currentNode) return;

  // Update Header
  ui.roleInfo.innerHTML = `<h1>Rol: ${gameRoleData.getRoleDisplayName(current_role)}</h1>`;
  ui.roleProgress.innerHTML = createRoleProgressHtml(
    gameRoleData,
    rolesList,
    current_role,
  );

  // Update content
  ui.nodeName.textContent = currentNode.name;
  ui.nodeDescription.textContent = currentNode.description;

  if (currentNode.url) {
    ui.nodeLink.href = currentNode.url;
    ui.nodeLink.style.display = "inline-block";
  } else {
    ui.nodeLink.style.display = "none";
  }

  if (currentNode.type === "ending") {
    ui.actionText.textContent = "Het verhaal is ten einde.";
    ui.choicesContainer.innerHTML = `<button class="finish-button">Finish</button>`;
  } else {
    ui.actionText.textContent = "Wat doe je?";
    ui.choicesContainer.innerHTML = createChoicesHtml(currentNode.choices);
  }
}

// =========================
// HTML Helper Functions
// =========================

function createRoleProgressHtml(gameRoleData, rolesList, current_role) {
  return rolesList
    .map((roleId) => {
      const classes = ["role-badge"];
      let statusIcon = "";
      const displayName = gameRoleData.getRoleDisplayName(roleId);

      if (roleId === current_role) {
        classes.push("current");
      } else if (gameRoleData.isRolePlayed(roleId)) {
        classes.push("played");
        statusIcon = ' <span class="check">✓</span>';
      } else {
        classes.push("unplayed");
      }

      return `<div class="${classes.join(" ")}">${displayName}${statusIcon}</div>`;
    })
    .join("");
}

function createChoicesHtml(choices) {
  if (!choices) return "";
  return choices
    .map(
      (choice) =>
        `<button class="choice" data-next="${choice.next}">${choice.text}</button>`,
    )
    .join("");
}

// =========================
// Main
// =========================

async function main() {
  console.log("main() called");
  if (!container) {
    console.log(
      "Container not found - this is likely the index page, skipping game initialization",
    );
    return;
  }

  container.addEventListener("click", (event) => {
    OnChoiceClick(event);
    OnRoleClick(event);
    OnFinishClick(event);
  });

  showInitialRoleSelection();
}

console.log("Calling main()...");
main();
