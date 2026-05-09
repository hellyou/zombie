// Mouse input for defender
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

  if (Game.selectedPlant) {
    Game.placePlant(row, col, Game.selectedPlant);
  }
});

// Keyboard shortcuts for plant selection (defender)
document.addEventListener('keydown', (e) => {
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
});
