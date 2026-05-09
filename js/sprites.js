// Sprite drawing functions for plants and zombies
// All functions: (ctx, x, y, size, anim)

// ==================== PLANTS ====================

function drawSunflowerSprite(ctx, x, y, s, anim) {
  const r = s * 0.4;
  // Petals
  ctx.fillStyle = '#FFD700';
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 + Math.sin(Date.now() / 800) * 0.03;
    const px = x + Math.cos(angle) * r * 0.8;
    const py = y + Math.sin(angle) * r * 0.8;
    ctx.beginPath();
    ctx.ellipse(px, py, r * 0.35, r * 0.2, angle, 0, Math.PI * 2);
    ctx.fill();
  }
  // Center
  ctx.fillStyle = '#8B4513';
  ctx.beginPath(); ctx.arc(x, y, r * 0.45, 0, Math.PI * 2); ctx.fill();
  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x - 5, y - 3, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, y - 3, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(x - 5, y - 3, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, y - 3, 2, 0, Math.PI * 2); ctx.fill();
  // Smile
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y + 2, 5, 0.1, Math.PI - 0.1); ctx.stroke();
  // Stem
  ctx.strokeStyle = '#228B22'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y + r * 0.45);
  ctx.lineTo(x, y + s * 0.48); ctx.stroke();
}

function drawPeashooterSprite(ctx, x, y, s, anim) {
  const recoil = anim?.shootAnim > 0 ? 1 - anim.shootAnim * 0.3 : 1;
  const bw = 28 * recoil;
  // Body
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill();
  // Mouth tube
  ctx.fillStyle = '#2E7D32';
  ctx.fillRect(x + 12, y - 5, 16, 10);
  // Mouth opening
  ctx.fillStyle = '#1B5E20';
  ctx.fillRect(x + 24, y - 3, 6, 6);
  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x - 5, y - 7, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, y - 7, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(x - 4, y - 7, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 6, y - 7, 3, 0, Math.PI * 2); ctx.fill();
}

function drawWallnutSprite(ctx, x, y, s, anim) {
  // Body
  ctx.fillStyle = '#DEB887';
  const w = 30, h = 34;
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 10);
  ctx.fill();
  // Outline
  ctx.strokeStyle = '#8B6914'; ctx.lineWidth = 2;
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 10);
  ctx.stroke();
  // Eyes
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(x - 6, y - 4, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 6, y - 4, 3, 0, Math.PI * 2); ctx.fill();
  // Wavy mouth
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - 8, y + 6);
  for (let i = 0; i <= 4; i++) {
    const nx = x - 8 + i * 4;
    const ny = y + 6 + (i % 2 === 0 ? 0 : 3);
    ctx.lineTo(nx, ny);
  }
  ctx.stroke();
  // Crack line
  ctx.strokeStyle = '#A0522D'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - 4, y - 12);
  ctx.lineTo(x - 1, y - 8); ctx.lineTo(x + 3, y - 10); ctx.stroke();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawSnowpeaSprite(ctx, x, y, s, anim) {
  const recoil = anim?.shootAnim > 0 ? 1 - anim.shootAnim * 0.3 : 1;
  // Body
  ctx.fillStyle = '#87CEEB';
  ctx.beginPath(); ctx.arc(x, y, 16 * recoil, 0, Math.PI * 2); ctx.fill();
  // Mouth tube
  ctx.fillStyle = '#2196F3';
  ctx.fillRect(x + 12, y - 5, 16, 10);
  ctx.fillStyle = '#1565C0';
  ctx.fillRect(x + 24, y - 3, 6, 6);
  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x - 5, y - 7, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, y - 7, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1565C0';
  ctx.beginPath(); ctx.arc(x - 4, y - 7, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 6, y - 7, 3, 0, Math.PI * 2); ctx.fill();
  // Ice sparkles
  ctx.fillStyle = '#E3F2FD';
  ctx.beginPath(); ctx.arc(x - 14, y - 10, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 14, y + 6, 2, 0, Math.PI * 2); ctx.fill();
}

function drawPotatomineSprite(ctx, x, y, s, anim) {
  // Body
  ctx.fillStyle = '#8D6E63';
  ctx.beginPath(); ctx.ellipse(x, y + 4, 18, 14, 0, 0, Math.PI * 2); ctx.fill();
  // Darker top
  ctx.fillStyle = '#6D4C41';
  ctx.beginPath(); ctx.ellipse(x, y, 16, 8, 0, Math.PI, Math.PI * 2); ctx.fill();
  // Sleepy eyes (closed arcs)
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x - 6, y - 2, 3, 0.1, Math.PI - 0.1); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + 6, y - 2, 3, 0.1, Math.PI - 0.1); ctx.stroke();
  // Fuse
  ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y - 14);
  ctx.lineTo(x + 3, y - 20); ctx.lineTo(x + 1, y - 24); ctx.stroke();
  // Fuse tip
  const armed = anim?.armed;
  ctx.fillStyle = armed ? '#FF5722' : '#8D6E63';
  ctx.beginPath(); ctx.arc(x + 1, y - 24, 3, 0, Math.PI * 2); ctx.fill();
}

function drawCherrybombSprite(ctx, x, y, s, anim) {
  // Two cherries
  ctx.fillStyle = '#F44336';
  ctx.beginPath(); ctx.arc(x - 10, y + 2, 13, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 10, y + 2, 13, 0, Math.PI * 2); ctx.fill();
  // Highlight
  ctx.fillStyle = '#EF9A9A';
  ctx.beginPath(); ctx.arc(x - 13, y - 4, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 7, y - 4, 4, 0, Math.PI * 2); ctx.fill();
  // Stems
  ctx.strokeStyle = '#4CAF50'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 10, y - 11);
  ctx.lineTo(x - 12, y - 20); ctx.lineTo(x, y - 22); ctx.lineTo(x + 12, y - 20); ctx.stroke();
  // Angry eyebrows
  ctx.strokeStyle = '#B71C1C'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 16, y - 4);
  ctx.lineTo(x - 8, y - 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 16, y - 4);
  ctx.lineTo(x + 8, y - 2); ctx.stroke();
}

function drawRepeaterSprite(ctx, x, y, s, anim) {
  const recoil = anim?.shootAnim > 0 ? 1 - anim.shootAnim * 0.3 : 1;
  // Taller body
  ctx.fillStyle = '#66BB6A';
  ctx.beginPath(); ctx.ellipse(x, y, 16, 22, 0, 0, Math.PI * 2); ctx.fill();
  // Two mouth tubes
  ctx.fillStyle = '#2E7D32';
  ctx.fillRect(x + 10, y - 12, 16, 8);
  ctx.fillRect(x + 10, y + 4, 16, 8);
  // Mouth openings
  ctx.fillStyle = '#1B5E20';
  ctx.fillRect(x + 22, y - 10, 5, 5);
  ctx.fillRect(x + 22, y + 6, 5, 5);
  // Two pairs of eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x - 4, y - 12, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 4, y - 12, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x - 4, y + 4, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 4, y + 4, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(x - 3, y - 12, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, y - 12, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x - 3, y + 4, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, y + 4, 2.5, 0, Math.PI * 2); ctx.fill();
}

// ==================== ZOMBIES ====================

function drawNormalZombieSprite(ctx, x, y, s, anim) {
  const eatTilt = anim?.attackPhase || 0;
  const tilt = Math.sin(eatTilt * Math.PI) * 5;
  // Legs
  ctx.fillStyle = '#455A64';
  ctx.fillRect(x - 10, y + 10, 7, 22);
  ctx.fillRect(x + 3, y + 10, 7, 22);
  // Body
  ctx.fillStyle = '#5D4037';
  ctx.fillRect(x - 15, y - 10, 30, 24);
  // Arms reaching forward
  ctx.strokeStyle = '#8FBC8F'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(x - 15, y - 5);
  ctx.lineTo(x - 28, y + 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 15, y - 5);
  ctx.lineTo(x + 28, y + 5); ctx.stroke();
  // Head
  ctx.fillStyle = '#8FBC8F';
  ctx.beginPath(); ctx.arc(x + tilt * 0.2, y - 20, 16, 0, Math.PI * 2); ctx.fill();
  // Hair
  ctx.strokeStyle = '#4E342E'; ctx.lineWidth = 2;
  for (let i = -8; i <= 8; i += 4) {
    ctx.beginPath(); ctx.moveTo(x + i, y - 34);
    ctx.lineTo(x + i - 3, y - 28); ctx.stroke();
  }
  // Eyes
  ctx.fillStyle = '#FFEB3B';
  ctx.beginPath(); ctx.arc(x - 5 + tilt * 0.2, y - 22, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5 + tilt * 0.2, y - 22, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(x - 5 + tilt * 0.2, y - 22, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5 + tilt * 0.2, y - 22, 1.5, 0, Math.PI * 2); ctx.fill();
  // Mouth
  ctx.fillStyle = '#4E342E';
  ctx.beginPath(); ctx.arc(x + tilt * 0.2, y - 14, 4, 0, Math.PI); ctx.fill();
}

function drawConeZombieSprite(ctx, x, y, s, anim) {
  drawNormalZombieSprite(ctx, x, y, s, anim);
  // Orange cone on head
  ctx.fillStyle = '#FF9800';
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 28);
  ctx.lineTo(x + 10, y - 28);
  ctx.lineTo(x, y - 44);
  ctx.closePath(); ctx.fill();
  // Cone stripe
  ctx.strokeStyle = '#E65100'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - 6, y - 32);
  ctx.lineTo(x + 6, y - 32); ctx.stroke();
}

function drawBucketZombieSprite(ctx, x, y, s, anim) {
  drawNormalZombieSprite(ctx, x, y, s, anim);
  // Silver bucket on head
  ctx.fillStyle = '#9E9E9E';
  ctx.fillRect(x - 14, y - 42, 28, 20);
  // Bucket rim
  ctx.fillStyle = '#BDBDBD';
  ctx.fillRect(x - 16, y - 42, 32, 4);
  // Bucket highlight
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(x - 10, y - 38, 4, 14);
}

function drawPoleZombieSprite(ctx, x, y, s, anim) {
  drawNormalZombieSprite(ctx, x, y, s, anim);
  // Pole behind body
  ctx.strokeStyle = '#795548'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x - 5, y - 35);
  ctx.lineTo(x + 20, y + 40); ctx.stroke();
  ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - 5, y - 35);
  ctx.lineTo(x + 20, y + 40); ctx.stroke();
}

function drawNewspaperZombieSprite(ctx, x, y, s, anim) {
  const rage = anim?.rageMode;
  if (!rage) {
    // Newspaper covering lower body
    ctx.fillStyle = '#F5DEB3';
    ctx.fillRect(x - 18, y - 8, 36, 26);
    // Fold line
    ctx.strokeStyle = '#D7CCC8'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y - 8);
    ctx.lineTo(x, y + 18); ctx.stroke();
    // Text lines
    ctx.strokeStyle = '#999'; ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(x - 14, y - 2 + i * 5);
      ctx.lineTo(x - 2, y - 2 + i * 5); ctx.stroke();
    }
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(x + 4, y - 2 + i * 5);
      ctx.lineTo(x + 14, y - 2 + i * 5); ctx.stroke();
    }
    // Head (less body visible)
    drawNormalZombieSprite(ctx, x, y - 4, s, anim);
  } else {
    // Rage mode - draw normal zombie with extra speed lines
    drawNormalZombieSprite(ctx, x, y, s, anim);
    // Speed lines
    ctx.strokeStyle = '#FF5722'; ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + 25 + i * 3, y - 15 + i * 8);
      ctx.lineTo(x + 35 + i * 3, y - 15 + i * 8);
      ctx.stroke();
    }
  }
}

function drawFootballZombieSprite(ctx, x, y, s, anim) {
  // Legs
  ctx.fillStyle = '#455A64';
  ctx.fillRect(x - 12, y + 12, 9, 22);
  ctx.fillRect(x + 3, y + 12, 9, 22);
  // Wider body (shoulder pads)
  ctx.fillStyle = '#37474F';
  ctx.fillRect(x - 20, y - 8, 40, 26);
  // Pads highlight
  ctx.fillStyle = '#546E7A';
  ctx.fillRect(x - 20, y - 8, 40, 6);
  // Arms
  ctx.strokeStyle = '#8FBC8F'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(x - 20, y - 2);
  ctx.lineTo(x - 32, y + 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 20, y - 2);
  ctx.lineTo(x + 32, y + 5); ctx.stroke();
  // Head
  ctx.fillStyle = '#8FBC8F';
  ctx.beginPath(); ctx.arc(x, y - 20, 16, 0, Math.PI * 2); ctx.fill();
  // Football helmet
  ctx.fillStyle = '#E53935';
  ctx.beginPath(); ctx.arc(x, y - 22, 18, Math.PI, 0); ctx.fill();
  // Face mask bars
  ctx.strokeStyle = '#BDBDBD'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 16, y - 26);
  ctx.lineTo(x - 16, y - 16); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 16, y - 26);
  ctx.lineTo(x + 16, y - 16); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 16, y - 20);
  ctx.lineTo(x + 16, y - 20); ctx.stroke();
  // White stripe on helmet
  ctx.fillStyle = '#FAFAFA';
  ctx.fillRect(x - 2, y - 38, 4, 6);
  // Eyes (visible through face mask)
  ctx.fillStyle = '#FFEB3B';
  ctx.beginPath(); ctx.arc(x - 5, y - 22, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, y - 22, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(x - 5, y - 22, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, y - 22, 1.5, 0, Math.PI * 2); ctx.fill();
}

function drawScreendoorZombieSprite(ctx, x, y, s, anim) {
  drawNormalZombieSprite(ctx, x, y, s, anim);
  // Screen door frame
  ctx.strokeStyle = '#A1887F'; ctx.lineWidth = 3;
  ctx.strokeRect(x - 18, y - 14, 36, 40);
  // Cross pattern (X)
  ctx.strokeStyle = '#8D6E63'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 16, y - 12);
  ctx.lineTo(x + 16, y + 24); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 16, y - 12);
  ctx.lineTo(x - 16, y + 24); ctx.stroke();
  // Inner frame bar
  ctx.strokeStyle = '#A1887F'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y - 14);
  ctx.lineTo(x, y + 26); ctx.stroke();
}

// ==================== DISPATCH FUNCTIONS ====================

function drawPlantSprite(ctx, type, x, y, size, anim) {
  switch(type) {
    case 'sunflower': drawSunflowerSprite(ctx, x, y, size, anim); break;
    case 'peashooter': drawPeashooterSprite(ctx, x, y, size, anim); break;
    case 'wallnut': drawWallnutSprite(ctx, x, y, size, anim); break;
    case 'snowpea': drawSnowpeaSprite(ctx, x, y, size, anim); break;
    case 'potatomine': drawPotatomineSprite(ctx, x, y, size, anim); break;
    case 'cherrybomb': drawCherrybombSprite(ctx, x, y, size, anim); break;
    case 'repeater': drawRepeaterSprite(ctx, x, y, size, anim); break;
  }
}

function drawZombieSprite(ctx, type, x, y, size, anim) {
  switch(type) {
    case 'normal': drawNormalZombieSprite(ctx, x, y, size, anim); break;
    case 'cone': drawConeZombieSprite(ctx, x, y, size, anim); break;
    case 'bucket': drawBucketZombieSprite(ctx, x, y, size, anim); break;
    case 'pole': drawPoleZombieSprite(ctx, x, y, size, anim); break;
    case 'newspaper': drawNewspaperZombieSprite(ctx, x, y, size, anim); break;
    case 'football': drawFootballZombieSprite(ctx, x, y, size, anim); break;
    case 'screendoor': drawScreendoorZombieSprite(ctx, x, y, size, anim); break;
  }
}
