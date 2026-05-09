// Canvas rendering
// Dependencies: constants.js, game.js (loaded before this file)

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw grid background
  drawGrid();

  // Draw plants
  Game.plants.forEach(drawPlant);

  // Draw zombies
  Game.zombies.forEach(drawZombie);

  // Draw projectiles
  Game.projectiles.forEach(drawProjectile);

  // Draw suns
  Game.suns.forEach(drawSun);

  // Draw attacker row indicator
  if (Game.state === 'playing') {
    drawRowIndicator();
  }

  // Draw prep countdown overlay (on top of everything)
  if (Game.state === 'preparing') {
    drawPrepOverlay(Game.time);
  }
}

function drawGrid() {
  // Alternating green squares
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? '#4a7a3a' : '#5a8a4a';
      ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
  // Grid lines
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  for (let r = 0; r <= GRID_ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * CELL_SIZE);
    ctx.lineTo(CANVAS_WIDTH, r * CELL_SIZE);
    ctx.stroke();
  }
  for (let c = 0; c <= GRID_COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * CELL_SIZE, 0);
    ctx.lineTo(c * CELL_SIZE, CANVAS_HEIGHT);
    ctx.stroke();
  }
}

function drawPlant(plant) {
  const x = plant.col * CELL_SIZE + CELL_SIZE / 2;
  const y = plant.row * CELL_SIZE + CELL_SIZE / 2;
  const stats = PLANT_STATS[plant.type];

  // Draw sprite
  drawPlantSprite(ctx, plant.type, x, y, CELL_SIZE * 0.75, plant.anim);

  // HP bar
  const barWidth = 50;
  const barHeight = 4;
  const barX = x - barWidth / 2;
  const barY = y + 20;
  ctx.fillStyle = '#333';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  const hpRatio = plant.hp / stats.hp;
  ctx.fillStyle = hpRatio > 0.5 ? '#4CAF50' : hpRatio > 0.25 ? '#FFC107' : '#F44336';
  ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
}

function drawZombie(zombie) {
  const x = zombie.x;
  const y = zombie.row * CELL_SIZE + CELL_SIZE / 2;
  const stats = ZOMBIE_STATS[zombie.type];

  // Draw sprite with walk bob animation
  const spriteY = y + (zombie.anim?.bobY || 0);
  drawZombieSprite(ctx, zombie.type, x, spriteY, CELL_SIZE * 0.75, zombie.anim);

  // HP bar
  const barWidth = 50;
  const barHeight = 4;
  const barX = x - barWidth / 2;
  const barY = y - 24;
  ctx.fillStyle = '#333';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  const hpRatio = zombie.hp / stats.hp;
  ctx.fillStyle = hpRatio > 0.5 ? '#4CAF50' : hpRatio > 0.25 ? '#FFC107' : '#F44336';
  ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);

  // Shield bar for screendoor zombie
  if (zombie.type === 'screendoor' && zombie.shieldHp > 0) {
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY - 6, barWidth, 3);
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(barX, barY - 6, barWidth * (zombie.shieldHp / ZOMBIE_STATS.screendoor.shieldHp), 3);
  }
}

function drawProjectile(proj) {
  const color = proj.slow ? '#87CEEB' : '#4CAF50';
  ctx.beginPath();
  ctx.arc(proj.x, proj.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSun(sun) {
  ctx.font = '24px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('☀️', sun.x, sun.y);
}

function drawRowIndicator() {
  const y = Game.selectedRow * CELL_SIZE;
  ctx.strokeStyle = '#ff6b6b';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(2, y + 2, CANVAS_WIDTH - 4, CELL_SIZE - 4);
  ctx.setLineDash([]);
}

function drawPrepOverlay(timeLeft) {
  const num = Math.ceil(timeLeft);
  const frac = num - timeLeft; // 1 = just changed, 0 = about to change
  const scale = 0.8 + frac * 0.4; // pulse from 0.8 to 1.2

  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Glow circle
  const cx = CANVAS_WIDTH / 2;
  const cy = CANVAS_HEIGHT / 2;
  const glow = ctx.createRadialGradient(cx, cy, 20 * scale, cx, cy, 80 * scale);
  glow.addColorStop(0, 'rgba(255,255,255,0.2)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, 80 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Countdown number
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 72px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(num, 0, 0);
  ctx.restore();

  // Caption
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '20px sans-serif';
  ctx.fillText('准备阶段', cx, cy + 55);
}
