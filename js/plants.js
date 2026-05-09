function createPlant(type, row, col) {
  const stats = PLANT_STATS[type];
  const plant = {
    type: type,
    row: row,
    col: col,
    hp: stats.hp,
    attackTimer: 0,
    cooldownTimer: 0,  // for potato mine arm time
    armed: type !== 'potatomine', // potato mine needs to arm
  };
  return plant;
}

function updatePlants(dt) {
  for (let i = Game.plants.length - 1; i >= 0; i--) {
    const plant = Game.plants[i];

    // Remove dead plants
    if (plant.hp <= 0) {
      Game.grid[plant.row][plant.col] = null;
      Game.plants.splice(i, 1);
      continue;
    }

    // Potato mine arming
    if (plant.type === 'potatomine' && !plant.armed) {
      plant.cooldownTimer += dt;
      if (plant.cooldownTimer >= PLANT_STATS.potatomine.armTime) {
        plant.armed = true;
      }
      continue;
    }

    // Cherry bomb explodes immediately on placement
    if (plant.type === 'cherrybomb') {
      explodeCherryBomb(plant);
      Game.grid[plant.row][plant.col] = null;
      Game.plants.splice(i, 1);
      continue;
    }

    // Shooting plants
    if (statsHasAttack(plant.type)) {
      plant.attackTimer += dt;
      if (plant.attackTimer >= PLANT_STATS[plant.type].attackSpeed) {
        plant.attackTimer = 0;
        // Check if there's a zombie in this row
        const hasZombieInRow = Game.zombies.some(z =>
          z.row === plant.row && z.hp > 0
        );
        if (hasZombieInRow) {
          const isSlow = plant.type === 'snowpea';
          const count = PLANT_STATS[plant.type].multishot || 1;
          for (let s = 0; s < count; s++) {
            Game.projectiles.push(createProjectile(
              plant.col * CELL_SIZE + CELL_SIZE,
              plant.row * CELL_SIZE + CELL_SIZE / 2,
              plant.row, isSlow
            ));
          }
        }
      }
    }
  }
}

function statsHasAttack(type) {
  return PLANT_STATS[type].damage > 0 && type !== 'potatomine' && type !== 'cherrybomb';
}

function explodeCherryBomb(plant) {
  const stats = PLANT_STATS.cherrybomb;
  const centerX = plant.col * CELL_SIZE + CELL_SIZE / 2;
  const centerY = plant.row * CELL_SIZE + CELL_SIZE / 2;
  const radius = stats.radius * CELL_SIZE * 1.5;

  for (let i = Game.zombies.length - 1; i >= 0; i--) {
    const z = Game.zombies[i];
    const zx = z.x;
    const zy = z.row * CELL_SIZE + CELL_SIZE / 2;
    const dist = Math.sqrt((zx - centerX) ** 2 + (zy - centerY) ** 2);
    if (dist <= radius) {
      z.hp -= stats.damage;
      if (z.hp <= 0) {
        Game.attackerSun += SUN_KILL_REWARD;
        Game.zombies.splice(i, 1);
      }
    }
  }
}
