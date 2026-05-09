// Zombie creation and update logic
// Dependencies: constants.js, game.js

function createZombie(type, row) {
  const stats = ZOMBIE_STATS[type];
  const zombie = {
    type: type,
    row: row,
    x: CANVAS_WIDTH + 10, // spawn off-screen right
    hp: stats.hp,
    maxHp: stats.hp,
    damage: stats.damage,
    speed: stats.speed,
    attackTimer: 0,
    eating: false,    // currently eating a plant
    targetPlant: null,
    // Special properties
    jumped: false,    // pole vaulter
    rageMode: false,  // newspaper
    shieldHp: type === 'screendoor' ? 200 : 0,
  };
  return zombie;
}

function updateZombies(dt) {
  for (let i = Game.zombies.length - 1; i >= 0; i--) {
    const z = Game.zombies[i];

    // Remove dead zombies
    if (z.hp <= 0) {
      Game.attackerSun += SUN_KILL_REWARD;
      Game.zombies.splice(i, 1);
      continue;
    }

    // Check if zombie reached left edge
    if (z.x < 0) {
      // Win condition - handled in checkWinCondition
      continue;
    }

    // Check for plant in current cell
    const col = Math.floor(z.x / CELL_SIZE);
    const plant = col >= 0 && col < GRID_COLS ? Game.grid[z.row][col] : null;

    if (plant && plant.hp > 0 && plant.type !== 'cherrybomb') {
      // Eating plant
      if (!z.eating) {
        z.eating = true;
        z.targetPlant = plant;
      }
      z.attackTimer += dt;
      if (z.attackTimer >= ZOMBIE_ATTACK_SPEED) {
        z.attackTimer = 0;
        // Pole vaulter: jump over first plant
        if (z.type === 'pole' && !z.jumped) {
          z.jumped = true;
          z.eating = false;
          z.targetPlant = null;
          z.x -= 15; // move past the plant
          continue;
        }
        plant.hp -= z.damage;
      }
    } else {
      // Moving left
      z.eating = false;
      z.targetPlant = null;
      let speed = z.speed * CELL_SIZE;
      if (z.type === 'newspaper' && z.rageMode) {
        speed = ZOMBIE_STATS.newspaper.rageSpeed * CELL_SIZE;
      }
      z.x -= speed * dt;

      // Trigger potato mine
      const mineCol = Math.floor(z.x / CELL_SIZE);
      if (mineCol >= 0 && mineCol < GRID_COLS) {
        const mine = Game.grid[z.row][mineCol];
        if (mine && mine.type === 'potatomine' && mine.armed) {
          // Explode
          z.hp -= PLANT_STATS.potatomine.damage;
          Game.grid[z.row][mineCol] = null;
          const idx = Game.plants.indexOf(mine);
          if (idx >= 0) Game.plants.splice(idx, 1);
        }
      }
    }

    // Newspaper zombie rage trigger
    if (z.type === 'newspaper' && !z.rageMode && z.hp <= ZOMBIE_STATS.newspaper.rageHp) {
      z.rageMode = true;
    }
  }
}
