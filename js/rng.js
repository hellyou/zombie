// Seeded pseudo-random number generator (Mulberry32)
// Used for deterministic game simulation in online mode
// In local mode, defaults to Math.random

let RNG = Math.random;

function createRNG(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
