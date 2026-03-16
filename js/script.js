function initializeGameBar(roleData) {
  const container = document.querySelector(".game-container");
  if (!container) return;

  container.innerHTML += `
    <div class="game-bar">
      <div class="xp-text">XP: 100</div>

      <div class="grid-container">
        <button class="role active">naam</button>
        <button class="role active">valid</button>
        <button class="role">Vluchteling</button>
        <button class="role">naam</button>
        <button class="role">naam</button>
      </div>
    </div>
  `;
}

function getGameRoleData() {
  return {
    name: "Vluchteling",
    description:
      "Je bent een vluchteling die op zoek is naar een woning in Nederland.",
  };
}
