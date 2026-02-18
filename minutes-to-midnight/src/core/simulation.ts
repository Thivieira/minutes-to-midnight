// Simulation engine - Core game logic
import type { GameState, FactionStats, ActionType, Faction } from './types';
import { DIFFICULTY_SETTINGS, INITIAL_STATS } from './types';

// Seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

let rng: SeededRandom;

export function initGame(
  difficulty: GameState['difficulty'],
  playerFaction: Faction,
  seed?: number
): GameState {
  const actualSeed = seed ?? Math.floor(Math.random() * 0x7fffffff);
  rng = new SeededRandom(actualSeed);

  const aiFaction: Faction = playerFaction === 'USA' ? 'USSR' : 'USA';

  const player = { ...INITIAL_STATS[playerFaction] };
  const ai = { ...INITIAL_STATS[aiFaction] };

  return {
    year: 1945,
    turn: 0,
    difficulty,
    playerFaction,
    aiFaction,
    player,
    ai,
    gameOver: false,
    winCondition: null,
    lossCondition: null,
    events: [],
    eventLog: [],
    playerActions: [],
    aiActions: [],
    seed: actualSeed,
    worldTension: 30,
  };
}

// Action effects definition
interface ActionEffects {
  gdpChange: number;
  influenceChange: number;
  militaryChange: number;
  stabilityChange: number;
  tensionChange: number;
  allianceChange: number;
}

const ACTION_EFFECTS: Record<ActionType, { player: ActionEffects; ai: ActionEffects }> = {
  economy: {
    player: { gdpChange: 8, influenceChange: 2, militaryChange: 0, stabilityChange: 3, tensionChange: -2, allianceChange: 0 },
    ai: { gdpChange: 6, influenceChange: 1, militaryChange: 0, stabilityChange: 2, tensionChange: -2, allianceChange: 0 },
  },
  diplomacy: {
    player: { gdpChange: -2, influenceChange: 8, militaryChange: 0, stabilityChange: 2, tensionChange: -5, allianceChange: 8 },
    ai: { gdpChange: -1, influenceChange: 6, militaryChange: 0, stabilityChange: 1, tensionChange: -4, allianceChange: 6 },
  },
  tech: {
    player: { gdpChange: 3, influenceChange: 1, militaryChange: 0, stabilityChange: 0, tensionChange: 1, allianceChange: 0 },
    ai: { gdpChange: 4, influenceChange: 1, militaryChange: 0, stabilityChange: 0, tensionChange: 1, allianceChange: 0 },
  },
  espionage: {
    player: { gdpChange: -1, influenceChange: 4, militaryChange: 0, stabilityChange: -2, tensionChange: 5, allianceChange: 0 },
    ai: { gdpChange: -1, influenceChange: 3, militaryChange: 0, stabilityChange: -2, tensionChange: 4, allianceChange: 0 },
  },
  military: {
    player: { gdpChange: -3, influenceChange: 3, militaryChange: 10, stabilityChange: -1, tensionChange: 6, allianceChange: 2 },
    ai: { gdpChange: -4, influenceChange: 4, militaryChange: 12, stabilityChange: -2, tensionChange: 7, allianceChange: 1 },
  },
  ideological: {
    player: { gdpChange: -1, influenceChange: 6, militaryChange: 0, stabilityChange: -1, tensionChange: 3, allianceChange: 0 },
    ai: { gdpChange: -1, influenceChange: 5, militaryChange: 0, stabilityChange: -1, tensionChange: 3, allianceChange: 0 },
  },
  economic_warfare: {
    player: { gdpChange: -2, influenceChange: -2, militaryChange: 0, stabilityChange: -2, tensionChange: 8, allianceChange: -3 },
    ai: { gdpChange: -3, influenceChange: -1, militaryChange: 0, stabilityChange: -3, tensionChange: 7, allianceChange: -2 },
  },
  proxy_war: {
    player: { gdpChange: -4, influenceChange: 5, militaryChange: 3, stabilityChange: -3, tensionChange: 10, allianceChange: 3 },
    ai: { gdpChange: -4, influenceChange: 4, militaryChange: 3, stabilityChange: -4, tensionChange: 9, allianceChange: 2 },
  },
  brinkmanship: {
    player: { gdpChange: -1, influenceChange: 2, militaryChange: 2, stabilityChange: -2, tensionChange: 15, allianceChange: 1 },
    ai: { gdpChange: -1, influenceChange: 2, militaryChange: 2, stabilityChange: -2, tensionChange: 15, allianceChange: 0 },
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function applyActionEffects(stats: FactionStats, action: ActionType, isPlayer: boolean): Partial<FactionStats> {
  const effects = isPlayer ? ACTION_EFFECTS[action].player : ACTION_EFFECTS[action].ai;

  // Apply military burden
  const militaryBurden = stats.militaryPower > 60 ? (stats.militaryPower - 60) * 0.05 : 0;

  // Apply war drain
  const warDrain = stats.ongoingConflicts.length * 2;

  // Calculate tech bonus
  const techBonus = (stats.techLevel.military + stats.techLevel.economic + stats.techLevel.space) * 0.002;

  // Apply effects
  const newStats: Partial<FactionStats> = {
    gdp: clamp(stats.gdp * (1 + stats.gdpGrowthRate) + effects.gdpChange - militaryBurden - warDrain + techBonus * stats.gdp, 10, 500),
    influence: clamp(stats.influence + effects.influenceChange, 0, 150),
    militaryPower: clamp(stats.militaryPower + effects.militaryChange, 0, 100),
    domesticStability: clamp(stats.domesticStability + effects.stabilityChange, 0, 100),
    worldTension: clamp(stats.worldTension + effects.tensionChange, 0, 100),
    allianceStrength: clamp(stats.allianceStrength + effects.allianceChange, 0, 100),
  };

  // Update GDP growth rate based on stability
  if (newStats.domesticStability !== undefined) {
    const stabilityMod = (newStats.domesticStability - 50) * 0.0005;
    newStats.gdpGrowthRate = clamp(stats.gdpGrowthRate + stabilityMod, -0.1, 0.1);
  }

  return newStats;
}

export function executeTurn(state: GameState, playerActions: ActionType[]): GameState {
  const newState: GameState = JSON.parse(JSON.stringify(state));
  newState.turn++;
  newState.year = 1945 + newState.turn;

  // Execute player actions
  newState.playerActions = playerActions;
  for (const action of playerActions) {
    const effects = applyActionEffects(newState.player, action, true);
    Object.assign(newState.player, effects);
  }

  // Execute AI actions (placeholder - will be replaced with real AI)
  newState.aiActions = [];
  // TODO: Add AI decision logic

  // Apply global events and shocks
  applyGlobalShocks(newState);

  // Check win/loss conditions
  checkGameEnd(newState);

  // Clamp all stats to valid ranges
  clampStats(newState.player);
  clampStats(newState.ai);

  return newState;
}

function clampStats(stats: FactionStats): void {
  stats.influence = clamp(stats.influence, 0, 150);
  stats.gdp = clamp(stats.gdp, 10, 500);
  stats.gdpGrowthRate = clamp(stats.gdpGrowthRate, -0.15, 0.15);
  stats.militaryPower = clamp(stats.militaryPower, 0, 100);
  stats.domesticStability = clamp(stats.domesticStability, 0, 100);
  stats.worldTension = clamp(stats.worldTension, 0, 100);
  stats.allianceStrength = clamp(stats.allianceStrength, 0, 100);
  stats.resourceLeverage = clamp(stats.resourceLeverage, 0, 100);
}

function applyGlobalShocks(state: GameState): void {
  // Oil crisis (1973, 1979, etc.)
  if (state.year === 1973 || state.year === 1979) {
    const shock = state.year === 1973 ? -8 : -5;
    state.player.gdp += shock;
    state.ai.gdp += shock;
    state.player.gdpGrowthRate -= 0.02;
    state.ai.gdpGrowthRate -= 0.02;
    state.worldTension += 5;
  }

  // Economic recession (random every ~7 years)
  if (rng && rng.next() < 0.1) {
    const recessionYear = 1958 + rng.nextInt(0, 10) * 7;
    if (state.year === recessionYear) {
      state.player.gdp += rng.nextFloat(-10, -5);
      state.ai.gdp += rng.nextFloat(-10, -5);
      state.player.gdpGrowthRate -= 0.03;
      state.ai.gdpGrowthRate -= 0.03;
    }
  }
}

function checkGameEnd(state: GameState): void {
  const settings = DIFFICULTY_SETTINGS[state.difficulty];

  // Check loss conditions first
  if (state.player.worldTension >= 100) {
    state.gameOver = true;
    state.lossCondition = 'nuclear';
    return;
  }

  if (state.player.domesticStability <= 0) {
    state.gameOver = true;
    state.lossCondition = 'stability';
    return;
  }

  if (state.player.gdp < 20) {
    state.gameOver = true;
    state.lossCondition = 'gdp';
    return;
  }

  // Check win conditions
  if (state.player.influence >= settings.influenceThreshold) {
    state.gameOver = true;
    state.winCondition = 'influence';
    return;
  }

  // AI collapse check
  if (state.ai.domesticStability < 20 && state.ai.gdp < 30) {
    state.gameOver = true;
    state.winCondition = 'collapse';
    return;
  }

  // Max year check (optional - game can go indefinitely)
  if (state.year >= 2000) {
    // Determine winner by influence
    if (state.player.influence > state.ai.influence) {
      state.gameOver = true;
      state.winCondition = 'influence';
    } else {
      state.gameOver = true;
      state.lossCondition = 'stability'; // Arbitrary loss
    }
  }
}

export function getRng(): SeededRandom | undefined {
  return rng;
}
