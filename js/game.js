// Game state management and main loop
// Dependencies: constants.js (loaded before this file)
// Functions referenced from later-loaded modules:
//   updateSunSystem, updatePlants, updateZombies, updateProjectiles,
//   checkCollisions, checkWinCondition, render, createPlant, createZombie

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
    this.selectedPlant = null;
    this.selectedZombie = null;
    this.selectedRow = 2;
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

// Start game loop on page load
requestAnimationFrame(gameLoop);
