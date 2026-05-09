// Mouse input
canvas.addEventListener('click', (e) => {
  if (Game.state !== 'playing') return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;
  const col = Math.floor(mx / CELL_SIZE);
  const row = Math.floor(my / CELL_SIZE);

  if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) return;

  // Online mode: role-based click
  if (Game.onlineMode) {
    if (Game.role === 'defender' && Game.selectedPlant) {
      Game.placePlant(row, col, Game.selectedPlant);
    } else if (Game.role === 'attacker' && Game.selectedZombie) {
      Game.spawnZombie(Game.selectedZombie, row);
    }
    return;
  }

  // Local mode: defender places plant
  if (Game.selectedPlant) {
    Game.placePlant(row, col, Game.selectedPlant);
  }
});

// Keyboard shortcuts for plant selection (defender)
document.addEventListener('keydown', (e) => {
  // Defender: plant selection 1-7
  if (e.key >= '1' && e.key <= '7') {
    const idx = parseInt(e.key) - 1;
    if (idx < PLANT_ORDER.length) {
      Game.selectedPlant = PLANT_ORDER[idx];
      updatePanelSelection();
    }
  }
  if (e.key === 'Escape') {
    Game.selectedPlant = null;
    updatePanelSelection();
  }

  // Attacker (zombie) keyboard controls — used when no gamepad is available
  // Arrow keys + Enter for zombie control
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    if (e.key === 'ArrowUp') {
      Game.selectedRow = Math.max(0, Game.selectedRow - 1);
    } else {
      Game.selectedRow = Math.min(GRID_ROWS - 1, Game.selectedRow + 1);
    }
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
    const idx = ZOMBIE_ORDER.indexOf(Game.selectedZombie);
    if (e.key === 'ArrowLeft') {
      Game.selectedZombie = ZOMBIE_ORDER[(idx - 1 + ZOMBIE_ORDER.length) % ZOMBIE_ORDER.length];
    } else {
      Game.selectedZombie = ZOMBIE_ORDER[(idx + 1) % ZOMBIE_ORDER.length];
    }
    updatePanelSelection();
  }
  if (e.key === 'Enter') {
    e.preventDefault();
    if (Game.selectedZombie && Game.state === 'playing') {
      Game.spawnZombie(Game.selectedZombie, Game.selectedRow);
    }
  }
});
