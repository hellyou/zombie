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

  // ========== Online mode ==========

  document.getElementById('online-btn').addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('room-screen').classList.remove('hidden');
  });

  document.getElementById('room-back-btn').addEventListener('click', () => {
    Network.disconnect();
    document.getElementById('room-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('room-status').textContent = '';
  });

  document.getElementById('cancel-room-btn').addEventListener('click', () => {
    Network.disconnect();
    document.getElementById('waiting-screen').classList.add('hidden');
    document.getElementById('room-screen').classList.remove('hidden');
  });

  document.getElementById('create-room-btn').addEventListener('click', createRoom);
  document.getElementById('join-room-btn').addEventListener('click', joinRoom);
  document.getElementById('room-code-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') joinRoom();
  });

  // Network callbacks
  Network.on('onRoomCreated', (roomId) => {
    document.getElementById('room-screen').classList.add('hidden');
    document.getElementById('waiting-screen').classList.remove('hidden');
    document.getElementById('room-code-display').textContent = roomId;
    document.getElementById('room-status').textContent = '';
  });

  Network.on('onPlayerJoined', (role) => {
    if (role === 'defender') {
      // Host: opponent joined, show start button
      document.getElementById('waiting-screen').classList.add('hidden');
      document.getElementById('room-screen').classList.remove('hidden');
      document.getElementById('room-status').textContent = '对手已加入！点击开始对战';
      document.getElementById('room-status').style.color = '#4CAF50';
      document.getElementById('create-room-btn').textContent = '🎮 开始对战';
      document.getElementById('create-room-btn').onclick = startOnlineGame;
      document.getElementById('join-room-btn').style.display = 'none';
      document.getElementById('room-code-input').style.display = 'none';
    } else {
      // Guest: waiting for host to start
      document.getElementById('room-screen').classList.add('hidden');
      document.getElementById('waiting-screen').classList.remove('hidden');
      document.getElementById('room-code-display').textContent = '已加入';
      document.getElementById('cancel-room-btn').textContent = '等待房主开始...';
      document.getElementById('cancel-room-btn').disabled = true;
      document.getElementById('waiting-screen').querySelector('.waiting-hint').textContent = '已加入房间，等待房主开始游戏';
    }
  });

  Network.on('onGameStart', (config) => {
    Game.startGame();
    Game.onlineMode = true;
    Game.role = config.role;
    document.getElementById('room-screen').classList.add('hidden');
    document.getElementById('waiting-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    buildPanelButtons();
    if (Game.role === 'defender') {
      Game.selectedPlant = PLANT_ORDER[0];
    } else {
      Game.selectedZombie = ZOMBIE_ORDER[0];
    }
    updatePanelSelection();
    showGameStatus(Game.role === 'defender' ? '🌱 你是防守方' : '🧟 你是进攻方');
  });

  Network.on('onOpponentAction', (action) => {
    Game.applyOpponentAction(action);
  });

  Network.on('onOpponentDisconnected', () => {
    showDisconnectOverlay('对手已断开连接');
  });

  Network.on('onRoomExpired', () => {
    document.getElementById('room-status').textContent = '房间已过期，请重新创建';
    document.getElementById('room-status').style.color = '#F44336';
  });

  Network.on('onError', (msg) => {
    document.getElementById('room-status').textContent = msg;
    document.getElementById('room-status').style.color = '#F44336';
  });

  Network.on('onDisconnect', () => {
    if (Game.state === 'playing') {
      showDisconnectOverlay('网络连接断开');
    }
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

// ========== Online mode helpers ==========

let _gameStatusTimer = null;

function createRoom() {
  const status = document.getElementById('room-status');
  status.textContent = '连接中...';
  status.style.color = '#888';
  Network.connect().then(() => {
    Network.createRoom();
  }).catch(() => {
    status.textContent = '无法连接到服务器，请检查网络';
    status.style.color = '#F44336';
  });
}

function joinRoom() {
  const code = document.getElementById('room-code-input').value.trim();
  if (code.length !== 4) {
    document.getElementById('room-status').textContent = '请输入 4 位房间码';
    document.getElementById('room-status').style.color = '#F44336';
    return;
  }
  const status = document.getElementById('room-status');
  status.textContent = '连接中...';
  status.style.color = '#888';
  Network.connect().then(() => {
    Network.joinRoom(code);
  }).catch(() => {
    status.textContent = '无法连接到服务器';
    status.style.color = '#F44336';
  });
}

function startOnlineGame() {
  Network.startGame();
}

function showGameStatus(text) {
  const el = document.createElement('div');
  el.id = 'game-status-toast';
  el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.85);color:#fff;padding:16px 32px;border-radius:12px;font-size:20px;z-index:50;transition:opacity 0.5s;';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; }, 2000);
  setTimeout(() => { el.remove(); }, 2500);
}

function showDisconnectOverlay(msg) {
  let overlay = document.getElementById('disconnect-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'disconnect-overlay';
    overlay.innerHTML = `<p>${msg}</p><button id="disconnect-ok-btn" style="padding:12px 32px;font-size:18px;border:none;border-radius:8px;background:#4CAF50;color:#fff;cursor:pointer;">确定</button>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#disconnect-ok-btn').addEventListener('click', () => {
      overlay.remove();
      document.getElementById('game-screen').classList.add('hidden');
      document.getElementById('start-screen').classList.remove('hidden');
      Game.init();
    });
  }
  overlay.classList.remove('hidden');
}

// Update buildPanelButtons for online mode
const _origBuildPanelButtons = buildPanelButtons;
buildPanelButtons = function() {
  _origBuildPanelButtons();
  if (Game.onlineMode) {
    if (Game.role === 'defender') {
      document.getElementById('zombie-panel').innerHTML = '<div style="color:#666;text-align:center;padding:16px;font-size:13px;">🧟 等待对手操作</div>';
    } else {
      document.getElementById('plant-panel').innerHTML = '<div style="color:#666;text-align:center;padding:16px;font-size:13px;">🌱 等待对手操作</div>';
    }
  }
  // Build mobile bar
  buildMobileBar();
};

function buildMobileBar() {
  const bar = document.getElementById('mobile-bar');
  if (!bar) return;
  bar.innerHTML = '';
  const items = Game.role === 'defender' || !Game.onlineMode ? PLANT_ORDER : ZOMBIE_ORDER;
  const statsMap = Game.role === 'defender' || !Game.onlineMode ? PLANT_STATS : ZOMBIE_STATS;
  items.forEach((type) => {
    const s = statsMap[type];
    const btn = document.createElement('button');
    btn.className = 'unit-btn';
    btn.dataset.type = type;
    btn.innerHTML = `<span class="emoji">${s.emoji}</span><span class="cost">☀️${s.cost}</span>`;
    btn.addEventListener('click', () => {
      if (Game.role === 'defender' || !Game.onlineMode) {
        Game.selectedPlant = type;
      } else {
        Game.selectedZombie = type;
      }
      updatePanelSelection();
    });
    bar.appendChild(btn);
  });
}

// Update endGame for online mode
const _origEndGame = endGame;
endGame = function(winner) {
  if (Game.onlineMode) {
    Network.gameOver(winner);
  }
  _origEndGame(winner);
};

// Hook into Game.update to add HUD updates and draw prep overlay
const _origUpdate = Game.update;
Game.update = function(dt) {
  _origUpdate.call(this, dt);
  updateHUD();
  updateCooldowns();
};
