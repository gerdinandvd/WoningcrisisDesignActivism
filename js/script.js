import { GameRoleData } from "./gameRoleData.js";
import { loadConfig } from "./loader.js";

const config = await loadConfig("config");

let roles = null;

const gameRoleData = new GameRoleData(config);

function initializeGameBar() {
  const container = document.querySelector(".game-container");
  if (!container) return;

  // Haal de rollen op
  const rolesList = gameRoleData.getRoles();
  if (!rolesList || rolesList.length === 0) return;

  const xp = gameRoleData.getXP();

  // Maak de HTML van de game bar
  const rolesHtml = rolesList
    .map((role) => `<button class="role">${role}</button>`)
    .join("");
  // role active class toevoegen aan de eerste rol
  container.innerHTML += `
    <div class="game-bar">
      <div class="xp-text">XP: ${xp}</div>
      <div class="grid-container">
        ${rolesHtml}
      </div>
    </div>
  `;
}

initializeGameBar();
