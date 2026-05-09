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
