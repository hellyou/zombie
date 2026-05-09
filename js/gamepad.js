let previousButtons = {};
const GAMEPAD_POLL_INTERVAL = 100; // ms
let gamepadConnected = false;

function initGamepad() {
  window.addEventListener('gamepadconnected', (e) => {
    console.log('Gamepad connected:', e.gamepad.id);
    gamepadConnected = true;
  });
  window.addEventListener('gamepaddisconnected', () => {
    gamepadConnected = false;
  });
}

function pollGamepad() {
  if (Game.state !== 'playing') return;

  const gamepads = navigator.getGamepads();
  const gp = gamepads[0];
  if (!gp) return;

  const buttons = gp.buttons.map((b, i) => ({
    pressed: b.pressed,
    justPressed: b.pressed && !previousButtons[i]?.pressed,
  }));
  previousButtons = gp.buttons.map(b => ({ pressed: b.pressed }));

  // D-pad up/down: select row
  if (buttons[12].justPressed) {
    Game.selectedRow = Math.max(0, Game.selectedRow - 1);
  }
  if (buttons[13].justPressed) {
    Game.selectedRow = Math.min(GRID_ROWS - 1, Game.selectedRow + 1);
  }

  // Left stick up/down: also select row
  const stickY = gp.axes[1];
  if (stickY < -0.5) {
    Game.selectedRow = Math.max(0, Game.selectedRow - 1);
  }
  if (stickY > 0.5) {
    Game.selectedRow = Math.min(GRID_ROWS - 1, Game.selectedRow + 1);
  }

  // LB/RB: cycle zombie type
  if (buttons[4].justPressed) { // LB
    const idx = ZOMBIE_ORDER.indexOf(Game.selectedZombie);
    Game.selectedZombie = ZOMBIE_ORDER[(idx - 1 + ZOMBIE_ORDER.length) % ZOMBIE_ORDER.length];
    updatePanelSelection();
  }
  if (buttons[5].justPressed) { // RB
    const idx = ZOMBIE_ORDER.indexOf(Game.selectedZombie);
    Game.selectedZombie = ZOMBIE_ORDER[(idx + 1) % ZOMBIE_ORDER.length];
    updatePanelSelection();
  }

  // A button: deploy zombie
  if (buttons[0].justPressed && Game.selectedZombie) {
    Game.spawnZombie(Game.selectedZombie, Game.selectedRow);
  }

  // D-pad left/right: alternative zombie selection
  if (buttons[14].justPressed) { // left
    const idx = ZOMBIE_ORDER.indexOf(Game.selectedZombie);
    Game.selectedZombie = ZOMBIE_ORDER[(idx - 1 + ZOMBIE_ORDER.length) % ZOMBIE_ORDER.length];
    updatePanelSelection();
  }
  if (buttons[15].justPressed) { // right
    const idx = ZOMBIE_ORDER.indexOf(Game.selectedZombie);
    Game.selectedZombie = ZOMBIE_ORDER[(idx + 1) % ZOMBIE_ORDER.length];
    updatePanelSelection();
  }
}

// Start polling
setInterval(pollGamepad, GAMEPAD_POLL_INTERVAL);
