# 植物大战僵尸双人对战 - 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一款双人同屏对战的植物大战僵尸 Web 游戏，防守方用键鼠种植物，进攻方用手柄派僵尸。

**Architecture:** 纯前端 HTML/CSS + Canvas 渲染。UI 面板用 HTML 元素，游戏战场用 Canvas 绘制。游戏逻辑用 requestAnimationFrame 驱动主循环。手柄通过 Gamepad API 接入。

**Tech Stack:** 原生 JavaScript + Canvas API + Gamepad API，零外部依赖。

---

## 文件结构

```
f:\CC\CC1\
├── index.html          # 主入口，加载所有 JS
├── style.css           # 全部样式
├── js/
│   ├── constants.js    # 游戏常量（网格、数值、费用）
│   ├── game.js         # 游戏状态管理 + 主循环
│   ├── canvas.js       # Canvas 渲染引擎
│   ├── sun.js          # 阳光系统
│   ├── plants.js       # 植物类和逻辑
│   ├── zombies.js      # 僵尸类和逻辑
│   ├── projectiles.js  # 子弹系统
│   ├── input.js        # 键鼠输入
│   ├── gamepad.js      # 手柄输入
│   └── ui.js           # HTML UI 交互
```

---

### Task 1: 项目骨架 + HTML/CSS 结构

**Files:**
- Create: `f:\CC\CC1\index.html`
- Create: `f:\CC\CC1\style.css`
- Create: `f:\CC\CC1\js\constants.js`

- [ ] **Step 1: 创建项目目录**

```bash
mkdir -p "f:\CC\CC1\js"
```

- [ ] **Step 2: 创建 constants.js — 所有游戏常量**

```js
// Grid
const GRID_ROWS = 5;
const GRID_COLS = 9;
const CELL_SIZE = 70;
const CANVAS_WIDTH = GRID_COLS * CELL_SIZE;  // 630
const CANVAS_HEIGHT = GRID_ROWS * CELL_SIZE; // 350

// Timing
const GAME_DURATION = 180; // 3 minutes in seconds
const PREP_TIME = 5;
const SUN_DROP_INTERVAL = 10; // seconds
const SUNFLOWER_INTERVAL = 8;

// Sun
const INITIAL_SUN_DEFENDER = 150;
const INITIAL_SUN_ATTACKER = 100;
const SUN_DROP_AMOUNT = 25;
const SUN_KILL_REWARD = 25;

// Plants stats: [cost, cooldown, hp, damage, attackSpeed, special]
const PLANT_STATS = {
  sunflower:    { cost: 50,  cd: 5,  hp: 100, damage: 0,  attackSpeed: 0,  label: '向日葵', emoji: '🌻' },
  peashooter:   { cost: 100, cd: 5,  hp: 100, damage: 20, attackSpeed: 1.5, label: '豌豆射手', emoji: '🌱' },
  wallnut:      { cost: 50,  cd: 10, hp: 1000, damage: 0, attackSpeed: 0,  label: '坚果墙', emoji: '🥜' },
  snowpea:      { cost: 175, cd: 5,  hp: 100, damage: 20, attackSpeed: 1.5, label: '寒冰射手', emoji: '❄️', slow: 0.5 },
  potatomine:   { cost: 25,  cd: 15, hp: 100, damage: 500, attackSpeed: 0,  label: '土豆雷', emoji: '💣', armTime: 15 },
  cherrybomb:   { cost: 150, cd: 30, hp: 0,   damage: 800, attackSpeed: 0,  label: '樱桃炸弹', emoji: '🍒', radius: 1 },
  repeater:     { cost: 200, cd: 5,  hp: 100, damage: 20, attackSpeed: 1.5, label: '双发射手', emoji: '🔫', multishot: 2 },
};

// Zombies stats: [cost, cooldown, hp, damage, speed, special]
const ZOMBIE_STATS = {
  normal:     { cost: 50,  cd: 5,  hp: 100, damage: 40, speed: 0.5, label: '普通僵尸', emoji: '🧟' },
  cone:       { cost: 100, cd: 7,  hp: 200, damage: 40, speed: 0.5, label: '路障僵尸', emoji: '🪖' },
  bucket:     { cost: 150, cd: 10, hp: 550, damage: 40, speed: 0.5, label: '铁桶僵尸', emoji: '⛑️' },
  pole:       { cost: 125, cd: 8,  hp: 150, damage: 40, speed: 0.8, label: '撑杆跳僵尸', emoji: '🏃', jump: true },
  newspaper:  { cost: 75,  cd: 6,  hp: 150, damage: 40, speed: 0.5, label: '读报僵尸', emoji: '📰', rageSpeed: 1.2, rageHp: 50 },
  football:   { cost: 200, cd: 12, hp: 400, damage: 40, speed: 1.0, label: '橄榄球僵尸', emoji: '🏈' },
  screendoor: { cost: 125, cd: 8,  hp: 300, damage: 40, speed: 0.5, label: '栅栏僵尸', emoji: '🛡️', shieldHp: 200 },
};

const ZOMBIE_ATTACK_SPEED = 2; // seconds between attacks
const ZOMBIE_ORDER = ['normal', 'cone', 'bucket', 'pole', 'newspaper', 'football', 'screendoor'];
const PLANT_ORDER = ['sunflower', 'peashooter', 'wallnut', 'snowpea', 'potatomine', 'cherrybomb', 'repeater'];
```

- [ ] **Step 3: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>植物大战僵尸 - 双人对战</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <!-- Start Screen -->
    <div id="start-screen" class="screen">
      <h1>🌱 植物大战僵尸 🧟</h1>
      <h2>双人对战</h2>
      <p>防守方: 键鼠 | 进攻方: 手柄</p>
      <button id="start-btn">开始游戏</button>
    </div>

    <!-- Game Screen -->
    <div id="game-screen" class="screen hidden">
      <div id="game-header">
        <div id="defender-info" class="player-info">
          <span class="player-label defender">🌱 防守方</span>
          <span class="sun-count" id="defender-sun">☀️ 150</span>
        </div>
        <div id="timer">⏱️ 3:00</div>
        <div id="attacker-info" class="player-info">
          <span class="sun-count" id="attacker-sun">☀️ 100</span>
          <span class="player-label attacker">🧟 进攻方</span>
        </div>
      </div>

      <div id="game-area">
        <div id="plant-panel" class="side-panel">
          <!-- Plant buttons inserted by JS -->
        </div>
        <canvas id="game-canvas" width="630" height="350"></canvas>
        <div id="zombie-panel" class="side-panel">
          <!-- Zombie buttons inserted by JS -->
        </div>
      </div>
    </div>

    <!-- End Screen -->
    <div id="end-screen" class="screen hidden">
      <h1 id="result-title"></h1>
      <p id="result-detail"></p>
      <button id="restart-btn">再来一局</button>
    </div>
  </div>

  <script src="js/constants.js"></script>
  <script src="js/game.js"></script>
  <script src="js/canvas.js"></script>
  <script src="js/sun.js"></script>
  <script src="js/plants.js"></script>
  <script src="js/zombies.js"></script>
  <script src="js/projectiles.js"></script>
  <script src="js/input.js"></script>
  <script src="js/gamepad.js"></script>
  <script src="js/ui.js"></script>
</body>
</html>
```

- [ ] **Step 4: 创建 style.css**

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  font-family: 'Segoe UI', sans-serif; 
  background: #1a1a2e; 
  color: #fff; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  min-height: 100vh;
  overflow: hidden;
}
.hidden { display: none !important; }

.screen {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 16px; position: absolute; inset: 0;
}
#start-screen { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
#start-screen h1 { font-size: 48px; }
#start-screen h2 { font-size: 28px; color: #ffd700; }
#start-screen p { color: #888; }
#start-btn, #restart-btn {
  padding: 16px 48px; font-size: 24px; border: none; border-radius: 12px;
  background: linear-gradient(135deg, #4CAF50, #45a049); color: #fff;
  cursor: pointer; transition: transform 0.2s; margin-top: 16px;
}
#start-btn:hover, #restart-btn:hover { transform: scale(1.05); }

#game-header {
  display: flex; justify-content: space-between; align-items: center;
  width: 100%; max-width: 900px; padding: 8px 16px;
  background: rgba(0,0,0,0.3); border-radius: 12px;
}
.player-info { display: flex; align-items: center; gap: 12px; }
.player-label { font-weight: bold; font-size: 18px; }
.player-label.defender { color: #8bc34a; }
.player-label.attacker { color: #ff6b6b; }
.sun-count { font-size: 18px; color: #ffd700; }
#timer { font-size: 24px; font-weight: bold; color: #fff; font-variant-numeric: tabular-nums; }

#game-area {
  display: flex; align-items: stretch; gap: 0;
  background: #2d2d2d; border-radius: 12px; overflow: hidden;
  border: 2px solid #444;
}
.side-panel {
  width: 140px; display: flex; flex-direction: column; gap: 4px;
  padding: 8px; overflow-y: auto;
}
#plant-panel { background: rgba(46, 125, 50, 0.2); }
#zombie-panel { background: rgba(183, 28, 28, 0.2); }
.unit-btn {
  display: flex; align-items: center; gap: 6px; padding: 6px 8px;
  border: 1px solid #555; border-radius: 6px; background: rgba(255,255,255,0.05);
  color: #ccc; cursor: pointer; font-size: 12px; transition: all 0.15s;
}
.unit-btn:hover { background: rgba(255,255,255,0.15); border-color: #888; }
.unit-btn.selected { border-color: #ffd700; background: rgba(255,215,0,0.2); }
.unit-btn .emoji { font-size: 20px; }
.unit-btn .cost { color: #ffd700; font-size: 11px; }
.unit-btn .cd-overlay { color: #666; font-size: 10px; }
.unit-btn.on-cooldown { opacity: 0.5; pointer-events: none; }
.unit-btn .info { display: flex; flex-direction: column; }

canvas { display: block; cursor: crosshair; }

#end-screen { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
#result-title { font-size: 42px; }
#result-detail { font-size: 20px; color: #aaa; }
```

- [ ] **Step 5: 提交骨架**

```bash
git init && git add -A && git commit -m "feat: project scaffold with HTML/CSS/constants"
```


### Task 2: 游戏状态管理 + 主循环

**Files:**
- Create: `f:\CC\CC1\js\game.js`

- [ ] **Step 1: 实现 Game 对象**

```js
const Game = {
  state: 'menu', // 'menu' | 'preparing' | 'playing' | 'ended'
  time: 0,        // elapsed seconds in current state
  gameTime: 0,    // elapsed seconds during playing state
  defenderSun: INITIAL_SUN_DEFENDER,
  attackerSun: INITIAL_SUN_ATTACKER,
  
  // Grid: GRID_ROWS x GRID_COLS, each cell is null or a plant object
  grid: [],
  
  plants: [],     // all plant instances
  zombies: [],    // all zombie instances
  projectiles: [],// all projectile instances
  suns: [],       // all sun instances on field
  
  selectedPlant: null,  // defender's currently selected plant type
  selectedZombie: null, // attacker's currently selected zombie type
  selectedRow: 2,       // attacker's currently selected row (0-indexed)
  
  init() {
    this.grid = Array.from({length: GRID_ROWS}, () => Array(GRID_COLS).fill(null));
    this.plants = [];
    this.zombies = [];
    this.projectiles = [];
    this.suns = [];
    this.time = 0;
    this.gameTime = 0;
    this.defenderSun = INITIAL_SUN_DEFENDER;
    this.attackerSun = INITIAL_SUN_ATTACKER;
    this.state = 'menu';
  },
  
  startGame() {
    this.init();
    this.state = 'preparing';
    this.time = PREP_TIME;
  },
  
  update(dt) {
    if (this.state === 'preparing') {
      this.time -= dt;
      if (this.time <= 0) {
        this.state = 'playing';
        this.time = 0;
        this.gameTime = 0;
      }
      return;
    }
    if (this.state !== 'playing') return;
    
    this.time += dt;
    this.gameTime += dt;
    
    // Update all systems
    updateSunSystem(dt);
    updatePlants(dt);
    updateZombies(dt);
    updateProjectiles(dt);
    checkCollisions();
    checkWinCondition();
  },
  
  // Helper: get entity at grid position
  getPlantAt(row, col) {
    return this.grid[row]?.[col] || null;
  },
  
  // Helper: place a plant
  placePlant(row, col, plantType) {
    if (this.grid[row][col]) return false;
    const stats = PLANT_STATS[plantType];
    if (this.defenderSun < stats.cost) return false;
    this.defenderSun -= stats.cost;
    const plant = createPlant(plantType, row, col);
    this.grid[row][col] = plant;
    this.plants.push(plant);
    return true;
  },
  
  // Helper: spawn a zombie
  spawnZombie(zombieType, row) {
    const stats = ZOMBIE_STATS[zombieType];
    if (this.attackerSun < stats.cost) return false;
    this.attackerSun -= stats.cost;
    const zombie = createZombie(zombieType, row);
    this.zombies.push(zombie);
    return true;
  },
};

function gameLoop(timestamp) {
  if (!Game._lastTime) Game._lastTime = timestamp;
  const dt = Math.min((timestamp - Game._lastTime) / 1000, 0.05); // cap dt
  Game._lastTime = timestamp;
  
  Game.update(dt);
  render();
  
  requestAnimationFrame(gameLoop);
}
```

- [ ] **Step 2: 启动游戏循环**

在 ui.js 中（将在后面创建），`start-btn` 点击时调用 `Game.startGame()` 并启动 `requestAnimationFrame(gameLoop)`。不过循环本身应该在页面加载时就开始，或者由开始按钮触发。

先在 constants.js 底部追加启动逻辑，等 UI 创建后再绑定按钮。


### Task 3: Canvas 渲染

**Files:**
- Create: `f:\CC\CC1\js\canvas.js`

- [ ] **Step 1: 实现渲染函数**

```js
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
    ctx.beginPath(); ctx.moveTo(0, r * CELL_SIZE);
    ctx.lineTo(CANVAS_WIDTH, r * CELL_SIZE); ctx.stroke();
  }
  for (let c = 0; c <= GRID_COLS; c++) {
    ctx.beginPath(); ctx.moveTo(c * CELL_SIZE, 0);
    ctx.lineTo(c * CELL_SIZE, CANVAS_HEIGHT); ctx.stroke();
  }
}

function drawPlant(plant) {
  const x = plant.col * CELL_SIZE + CELL_SIZE / 2;
  const y = plant.row * CELL_SIZE + CELL_SIZE / 2;
  const stats = PLANT_STATS[plant.type];
  
  // Draw emoji
  ctx.font = '36px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(stats.emoji, x, y);
  
  // HP bar
  const barWidth = 50; const barHeight = 4;
  const barX = x - barWidth / 2; const barY = y + 20;
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
  
  ctx.font = '32px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(stats.emoji, x, y);
  
  // HP bar
  const barWidth = 50; const barHeight = 4;
  const barX = x - barWidth / 2; const barY = y - 24;
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
    ctx.fillRect(barX, barY - 6, barWidth * (zombie.shieldHp / 200), 3);
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

// Also draw preparation countdown
function drawPrepOverlay(timeLeft) {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = '#fff';
  ctx.font = '64px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(Math.ceil(timeLeft), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  ctx.font = '24px sans-serif';
  ctx.fillText('准备阶段', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
}
```


### Task 4: 植物系统

**Files:**
- Create: `f:\CC\CC1\js\plants.js`

- [ ] **Step 1: 实现植物工厂和更新逻辑**

```js
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
  // Damage zombies in 3x3 area
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
```


### Task 5: 僵尸系统

**Files:**
- Create: `f:\CC\CC1\js\zombies.js`

- [ ] **Step 1: 实现僵尸工厂和更新逻辑**

```js
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
```


### Task 6: 子弹系统

**Files:**
- Create: `f:\CC\CC1\js\projectiles.js`

- [ ] **Step 1: 实现子弹和碰撞检测**

```js
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
        if (p.slow && z.speed === ZOMBIE_STATS[z.type]?.speed) {
          z.speed = ZOMBIE_STATS[z.type].speed * 0.5;
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
```


### Task 7: 阳光系统

**Files:**
- Create: `f:\CC\CC1\js\sun.js`

- [ ] **Step 1: 实现阳光生成和分配**

```js
let sunDropTimer = 0;
const SUN_FALL_SPEED = 50; // pixels per second
const SUN_LIFETIME = 8; // seconds

function createSun(x, y, owner) {
  return {
    x: x,
    y: y,
    targetY: y + 80 + Math.random() * 60,
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
      const x = 50 + Math.random() * (CANVAS_WIDTH - 100);
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
    
    // Auto-collect 1 second after landing (so players can see it)
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
          // Shared: split evenly
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
```


### Task 8: 键鼠输入

**Files:**
- Create: `f:\CC\CC1\js\input.js`

- [ ] **Step 1: 实现鼠标和键盘事件**

```js
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
    // Don't deselect, allow rapid planting
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
```


### Task 9: 手柄输入

**Files:**
- Create: `f:\CC\CC1\js\gamepad.js`

- [ ] **Step 1: 实现 Gamepad API 轮询**

```js
let previousButtons = {};
const GAMEPAD_POLL_INTERVAL = 100; // ms

function initGamepad() {
  window.addEventListener('gamepadconnected', (e) => {
    console.log('Gamepad connected:', e.gamepad.id);
  });
}

function pollGamepad() {
  if (Game.state !== 'playing') return;
  
  const gamepads = navigator.getGamepads();
  const gp = gamepads[0]; // first connected controller for attacker
  if (!gp) return;
  
  const buttons = gp.buttons.map((b, i) => ({
    pressed: b.pressed,
    justPressed: b.pressed && !previousButtons[i]?.pressed,
  }));
  previousButtons = gp.buttons.map(b => ({ pressed: b.pressed }));
  
  // D-pad up/down: select row
  const dpadUp = buttons[12].pressed;
  const dpadDown = buttons[13].pressed;
  // Left stick up/down
  const stickY = gp.axes[1];
  
  if (dpadUp || stickY < -0.5) {
    Game.selectedRow = Math.max(0, Game.selectedRow - 1);
  }
  if (dpadDown || stickY > 0.5) {
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
```


### Task 10: UI 交互

**Files:**
- Create: `f:\CC\CC1\js\ui.js`

- [ ] **Step 1: 实现 UI 控制逻辑**

```js
document.addEventListener('DOMContentLoaded', () => {
  Game.init();
  initUI();
  initGamepad();
  requestAnimationFrame(gameLoop);
  
  document.getElementById('start-btn').addEventListener('click', () => {
    Game.startGame();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    buildPanelButtons();
    // Default selection
    Game.selectedPlant = PLANT_ORDER[0];
    Game.selectedZombie = ZOMBIE_ORDER[0];
    updatePanelSelection();
  });
  
  document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    Game.init();
  });
});

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
  
  ZOMBIE_ORDER.forEach((type, idx) => {
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
  // Update cooldown indicators and sun affordability
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

// Update UI HUD every frame
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

// Hook into existing update
const _origUpdate = Game.update;
Game.update = function(dt) {
  _origUpdate.call(this, dt);
  if (this.state === 'preparing') {
    drawPrepOverlay(this.time);
  }
  updateHUD();
  updateCooldowns();
};
```


### Task 11: 集成测试 + 可运行验证

**Files:**
- Modify: `f:\CC\CC1\index.html`
- Modify: `f:\CC\CC1\js\game.js`

- [ ] **Step 1: 验证所有文件加载无误**

```bash
# Start a local HTTP server (required for Gamepad API)
cd "f:\CC\CC1" && python -m http.server 8080
# Or use npx serve .
```

打开浏览器访问 `http://localhost:8080`，验证：
1. 开始画面显示，点击按钮进入游戏
2. 5秒准备倒计时正常
3. 防守方可以点击左侧植物栏选择植物，点击网格放置
4. 连接手柄后，进攻方可以用 LB/RB 切换僵尸，↑/↓ 选行，A 部署
5. 阳光自动收集，计数器更新
6. 僵尸走到最左侧触发防守方失败
7. 3分钟到触发防守方胜利
8. 结束后点击再来一局回到开始画面

- [ ] **Step 2: 修复遇到的问题**

记录并修复任何控制台错误或逻辑问题。

- [ ] **Step 3: 最终提交**

```bash
git add -A && git commit -m "feat: complete PvZ dual-player game implementation"
```
