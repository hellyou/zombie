let sunDropTimer = 0;
const SUN_FALL_SPEED = 50; // pixels per second
const SUN_LIFETIME = 8; // seconds

function createSun(x, y, owner) {
  return {
    x: x,
    y: y,
    targetY: y + 80 + RNG() * 60,
    owner: owner, // 'defender' | 'attacker' | 'shared'
    lifetime: SUN_LIFETIME,
    falling: true,
    collecting: false,
    collectDelay: 0,
  };
}

function updateSunSystem(dt) {
  // Natural sun drops
  sunDropTimer += dt;
  if (sunDropTimer >= SUN_DROP_INTERVAL) {
    sunDropTimer = 0;
    // Drop 2 suns at random positions
    for (let i = 0; i < 2; i++) {
      const x = 50 + RNG() * (CANVAS_WIDTH - 100);
      const y = -30;
      // Determine owner by x position
      let owner;
      if (x < CANVAS_WIDTH * 0.3) owner = 'defender';
      else if (x > CANVAS_WIDTH * 0.7) owner = 'attacker';
      else owner = 'shared';
      Game.suns.push(createSun(x, y, owner));
    }
  }

  // Update suns
  for (let i = Game.suns.length - 1; i >= 0; i--) {
    const s = Game.suns[i];
    s.lifetime -= dt;
    if (s.lifetime <= 0) {
      Game.suns.splice(i, 1);
      continue;
    }

    if (s.falling) {
      s.y += SUN_FALL_SPEED * dt;
      if (s.y >= s.targetY) {
        s.y = s.targetY;
        s.falling = false;
      }
    }

    // Auto-collect 1 second after landing
    if (!s.falling && !s.collecting) {
      s.collecting = true;
      s.collectDelay = 1;
    }
    if (s.collecting) {
      s.collectDelay -= dt;
      if (s.collectDelay <= 0) {
        if (s.owner === 'defender') {
          Game.defenderSun += SUN_DROP_AMOUNT;
        } else if (s.owner === 'attacker') {
          Game.attackerSun += SUN_DROP_AMOUNT;
        } else {
          Game.defenderSun += Math.floor(SUN_DROP_AMOUNT / 2);
          Game.attackerSun += Math.ceil(SUN_DROP_AMOUNT / 2);
        }
        Game.suns.splice(i, 1);
      }
    }
  }
}

// Called when a sunflower produces sun
function produceSunflowerSun(plant) {
  const x = plant.col * CELL_SIZE + CELL_SIZE / 2;
  const y = plant.row * CELL_SIZE;
  Game.suns.push(createSun(x, y, 'defender'));
}
