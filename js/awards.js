import { loadConfig } from "./loader.js";
import { GameRoleData } from "./GameRoleData.js";

let config;
let gameRoleData;
let container;

async function init() {
  try {
    config = await loadConfig("config");
    gameRoleData = await GameRoleData.create(config);
    gameRoleData.markAwardsAsViewed();
    container = document.getElementById("awards-container");
    displayAwards();
  } catch (error) {
    console.error("Error initializing awards:", error);
  }
}

function displayAwards() {
  const unlockedAwards = gameRoleData.getUnlockedAwards();
  if (unlockedAwards.length === 0) {
    container.innerHTML = "<p>Geen awards verdiend nog.</p>";
    return;
  }

  const awardsHtml = unlockedAwards
    .map((awardId) => {
      const awardData = gameRoleData.getAwardData(awardId);
      if (!awardData) return "";

      let imageHtml = "";
      if (awardData.image) {
        imageHtml = `<img src="${awardData.image}" alt="${awardData.name}" class="award-image" />`;
      }

      return `
      <div class="award-card">
        ${imageHtml}
        <h3>${awardData.name}</h3>
        <p>${awardData.description}</p>
      </div>
    `;
    })
    .join("");

  container.innerHTML = awardsHtml;
}

init();
