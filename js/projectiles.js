const PROJECTILE_SPEED = 300; // pixels per second

function createProjectile(x, y, row, slow = false) {
  return {
    x: x,
    y: y,
    row: row,
    slow: slow,
    speed: PROJECTILE_SPEED,
  };
}

function updateProjectiles(dt) {
  for (let i = Game.projectiles.length - 1; i >= 0; i--) {
    const p = Game.projectiles[i];
    p.x += p.speed * dt;

    // Remove if off screen
    if (p.x > CANVAS_WIDTH) {
      Game.projectiles.splice(i, 1);
      continue;
    }
  }
}

function checkCollisions() {
  for (let i = Game.projectiles.length - 1; i >= 0; i--) {
    const p = Game.projectiles[i];

    for (let j = Game.zombies.length - 1; j >= 0; j--) {
      const z = Game.zombies[j];
      if (z.row !== p.row) continue;
      if (z.hp <= 0) continue;

      // Simple hitbox check
      const dx = Math.abs(p.x - z.x);
      const dy = Math.abs(p.y - (z.row * CELL_SIZE + CELL_SIZE / 2));
      if (dx < 20 && dy < 20) {
        // Apply damage (shield absorbs for screendoor)
        let damage = 20;
        if (z.type === 'screendoor' && z.shieldHp > 0) {
          z.shieldHp -= damage;
          if (z.shieldHp < 0) {
            z.hp += z.shieldHp; // overflow damage
            z.shieldHp = 0;
          }
        } else {
          z.hp -= damage;
        }

        // Apply slow
        if (p.slow && z.speed > 0 && z.type) {
          const baseSpeed = ZOMBIE_STATS[z.type].speed;
          z.speed = baseSpeed * 0.5;
          setTimeout(() => {
            if (z.speed) z.speed = ZOMBIE_STATS[z.type].speed;
          }, 3000);
        }

        Game.projectiles.splice(i, 1);
        break;
      }
    }
  }
}
