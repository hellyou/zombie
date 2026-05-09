// UI interaction — ties all game systems together
// This file MUST be loaded LAST (after all other scripts)

document.addEventListener('DOMContentLoaded', () => {
  Game.init();
  initUI();
  initGamepad();

  document.getElementById('start-btn').addEventListener('click', () => {
    Game.startGame();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    buildPanelButtons();
    Game.selectedPlant = PLANT_ORDER[0];
    Game.selectedZombie = ZOMBIE_ORDER[0];
    updatePanelSelection();
  });

  document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    Game.init();
  });
});

function initUI() {
  // UI is set up via DOMContentLoaded above
}

function buildPanelButtons() {
  const plantPanel = document.getElementById('plant-panel');
  const zombiePanel = document.getElementById('zombie-panel');
  plantPanel.innerHTML = '';
  zombiePanel.innerHTML = '';

  PLANT_ORDER.forEach((type, idx) => {
    const stats = PLANT_STATS[type];
    const btn = document.createElement('button');
    btn.className = 'unit-btn';
    btn.dataset.type = type;
    btn.innerHTML = `
      <span class="emoji">${stats.emoji}</span>
      <span class="info">
        <span>${stats.label}</span>
        <span class="cost">☀️${stats.cost}</span>
      </span>
    `;
    btn.addEventListener('click', () => {
      Game.selectedPlant = type;
      updatePanelSelection();
    });
    plantPanel.appendChild(btn);
  });

  ZOMBIE_ORDER.forEach((type) => {
    const stats = ZOMBIE_STATS[type];
    const btn = document.createElement('button');
    btn.className = 'unit-btn';
    btn.dataset.type = type;
    btn.innerHTML = `
      <span class="emoji">${stats.emoji}</span>
      <span class="info">
        <span>${stats.label}</span>
        <span class="cost">☀️${stats.cost}</span>
      </span>
    `;
    btn.addEventListener('click', () => {
      Game.selectedZombie = type;
      updatePanelSelection();
    });
    zombiePanel.appendChild(btn);
  });
}

function updatePanelSelection() {
  document.querySelectorAll('.unit-btn').forEach(btn => {
    btn.classList.toggle('selected',
      btn.dataset.type === Game.selectedPlant || btn.dataset.type === Game.selectedZombie
    );
  });
  updateCooldowns();
}

function updateCooldowns() {
  document.querySelectorAll('#plant-panel .unit-btn').forEach(btn => {
    const type = btn.dataset.type;
    const stats = PLANT_STATS[type];
    btn.classList.toggle('on-cooldown', Game.defenderSun < stats.cost);
  });
  document.querySelectorAll('#zombie-panel .unit-btn').forEach(btn => {
    const type = btn.dataset.type;
    const stats = ZOMBIE_STATS[type];
    btn.classList.toggle('on-cooldown', Game.attackerSun < stats.cost);
  });
}

function updateHUD() {
  document.getElementById('defender-sun').textContent = `☀️ ${Math.floor(Game.defenderSun)}`;
  document.getElementById('attacker-sun').textContent = `☀️ ${Math.floor(Game.attackerSun)}`;

  const remaining = Math.max(0, GAME_DURATION - Game.gameTime);
  const mins = Math.floor(remaining / 60);
  const secs = Math.floor(remaining % 60);
  document.getElementById('timer').textContent = `⏱️ ${mins}:${secs.toString().padStart(2, '0')}`;
}

function checkWinCondition() {
  if (Game.state !== 'playing') return;

  // Check if any zombie reached left edge
  for (const z of Game.zombies) {
    if (z.x < 0) {
      endGame('attacker');
      return;
    }
  }

  // Check time up
  if (Game.gameTime >= GAME_DURATION) {
    endGame('defender');
  }
}

function endGame(winner) {
  Game.state = 'ended';
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('end-screen').classList.remove('hidden');

  if (winner === 'attacker') {
    document.getElementById('result-title').textContent = '🧟 进攻方胜利！';
    document.getElementById('result-title').style.color = '#ff6b6b';
    document.getElementById('result-detail').textContent = '僵尸突破了所有防线！';
  } else {
    document.getElementById('result-title').textContent = '🌱 防守方胜利！';
    document.getElementById('result-title').style.color = '#8bc34a';
    document.getElementById('result-detail').textContent = '成功抵挡了所有僵尸进攻！';
  }
}

// Hook into Game.update to add HUD updates and draw prep overlay
const _origUpdate = Game.update;
Game.update = function(dt) {
  _origUpdate.call(this, dt);
  if (this.state === 'preparing') {
    drawPrepOverlay(this.time);
  }
  updateHUD();
  updateCooldowns();
};
