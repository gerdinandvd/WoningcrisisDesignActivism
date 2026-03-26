import { GameRoleData } from "./gameRoleData.js";
import { loadConfig } from "./loader.js";

// =========================
// Config & Setup
// =========================

const config = await loadConfig("config");

let rolesList = null;

const gameRoleData = await GameRoleData.create(config);
const container = document.querySelector(".game-container");

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
      initializeGameRole(gameRoleData, gameRoleData.getCurrentRole());
    } else {
      console.error("Failed to update node");
    }
  }
}

function OnRoleClick(event) {
  const target = event.target;

  if (target.classList.contains("role")) {
    const role = target.getAttribute("data-role");
    console.log("Role clicked:", role);

    const success = gameRoleData.setCurrentRole(role);
    if (success) {
      const starterNodeId = gameRoleData.getStarterNodeId();
      gameRoleData.setCurrentNodeId(starterNodeId);
      initializeGameRole(gameRoleData, role);
    }
  }
}

function OnFinishClick(event) {
  const target = event.target;

  if (target.classList.contains("finish-button")) {
    console.log("Finish clicked");
    gameRoleData.markRoleAsPlayed(gameRoleData.getCurrentRole());
    initializeGameBar();
  }
}

// =========================
// UI Rendering
// =========================

function initializeGameBar() {
  if (!container) {
    console.error("Container element not found");
    return;
  }

  const rolesList = gameRoleData.getRoles();
  if (!rolesList || rolesList.length === 0) return;

  const xp = gameRoleData.getXP();

  const rolesHtml = rolesList
    .map((role) => {
      const isPlayed = gameRoleData.isRolePlayed(role);
      const playedClass = isPlayed ? "played" : "";
      return `<button class="role ${playedClass}" data-role="${role}">${role}${isPlayed ? " (Played)" : ""}</button>`;
    })
    .join("");

  container.innerHTML = `
    <div class="game-bar">
      <div class="xp-text">XP: ${xp}</div>
      <div class="grid-container">
        ${rolesHtml}
      </div>
    </div>
  `;
}

function initializeGameRole(gameRoleData, current_role) {
  if (!container) {
    console.error("Container element not found");
    return;
  }

  const rolesList = gameRoleData.getRoles();
  const xp = gameRoleData.getXP();

  const description = gameRoleData.getRoleData(current_role).description;
  const curentNode = gameRoleData.getCurrentNode();

  const choices = curentNode.choices;
  const name = curentNode.name;
  const descriptionNode = curentNode.description;

  const roleProgressHtml = createRoleProgressHtml(gameRoleData, rolesList, current_role);
  let choicesHtml = "";
  let actionText = "Wat doe je?";

  if (curentNode.type === "ending") {
    actionText = "Het verhaal is ten einde.";
    choicesHtml = `<button class="finish-button">Finish</button>`;
  } else {
    choicesHtml = createChoicesHtml(choices);
  }

  container.innerHTML = `
      <div class="game-bar">
        <div class="xp-text">XP: ${xp}</div>
        <div class="role-text">
        <h1>Rol: ${current_role}</h1></div>

        <div class="role-progress">
          ${roleProgressHtml}
        </div>
      </div>
      <div class="game-content">
        <h2>${name}</h2>
        <h3>${descriptionNode}</h3>

        <h3>${actionText}</h3>
        <div class="choices">
          ${choicesHtml}
        </div>
      </div>
  `;
}

// =========================
// HTML Helper Functions
// =========================

function createRoleProgressHtml(gameRoleData, rolesList, current_role) {
  return rolesList
    .map((role) => {
      const classes = ["role-badge"];
      let statusIcon = "";

      if (role === current_role) {
        classes.push("current");
      } else if (gameRoleData.isRolePlayed(role)) {
        classes.push("played");
        statusIcon = ' <span class="check">✓</span>';
      } else {
        classes.push("unplayed");
      }

      return `<div class="${classes.join(" ")}">${role}${statusIcon}</div>`;
    })
    .join("");
}

function createChoicesHtml(choices) {
  console.log("choices:", choices);

  let choicesHtml = "";

  for (const choice of choices) {
    choicesHtml += `<button class="choice" data-next="${choice.next}">${choice.text}</button>`;
  }

  return choicesHtml;
}

// =========================
// Main
// =========================

async function main() {
  container.addEventListener("click", (event) => {
    OnChoiceClick(event);
    OnRoleClick(event);
    OnFinishClick(event);
  });

  initializeGameBar();
}

main();
