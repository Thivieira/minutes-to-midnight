// Core game types for Minutes to Midnight

export type Faction = 'USA' | 'USSR';

export type Difficulty = 'Easy' | 'Normal' | 'Extreme';

export type ActionType = 
  | 'economy'
  | 'diplomacy'
  | 'tech'
  | 'espionage'
  | 'military'
  | 'ideological'
  | 'economic_warfare'
  | 'proxy_war'
  | 'brinkmanship';

export interface FactionStats {
  faction: Faction;
  influence: number;
  gdp: number;
  gdpGrowthRate: number;
  militaryPower: number;
  domesticStability: number;
  worldTension: number;
  techLevel: {
    military: number;
    economic: number;
    space: number;
  };
  allianceStrength: number;
  ongoingConflicts: string[];
  resourceLeverage: number;
}

export interface GameState {
  year: number;
  turn: number;
  difficulty: Difficulty;
  playerFaction: Faction;
  aiFaction: Faction;
  player: FactionStats;
  ai: FactionStats;
  gameOver: boolean;
  winCondition: 'influence' | 'collapse' | 'blocs' | null;
  lossCondition: 'nuclear' | 'stability' | 'gdp' | null;
  events: GameEvent[];
  eventLog: EventRecord[];
  playerActions: ActionType[];
  aiActions: ActionType[];
  seed: number;
  worldTension: number;
}

// Flexible effect type for events - allows various field names
export interface EventEffects {
  gdp?: number;
  influence?: number;
  militaryPower?: number;
  domesticStability?: number;
  worldTension?: number;
  stability?: number;
  tension?: number;
  allianceStrength?: number;
  resourceLeverage?: number;
  techLevel?: {
    military?: number;
    economic?: number;
    space?: number;
  };
}

export interface EventChoice {
  id: string;
  text: string;
  effects: EventEffects;
  delayedEffects?: {
    turns: number;
    effects: EventEffects;
  };
}

export type EventCategory = 'political' | 'economic' | 'social' | 'coup' | 'proxy' | 'espionage' | 'tech' | 'scandal' | 'alliance' | 'crisis' | 'military';

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  triggerConditions: {
    minYear?: number;
    maxYear?: number;
    minTension?: number;
    maxTension?: number;
    minStability?: number;
    maxStability?: number;
    minInfluence?: number;
    maxInfluence?: number;
    faction?: Faction;
    requiredEvent?: string;
    chance?: number;
  };
  choices: EventChoice[];
}

export interface EventRecord {
  year: number;
  eventId: string;
  choiceId: string;
  effects: EventEffects;
  aiChoice?: string;
}

export interface AIDecision {
  action: ActionType;
  score: number;
  reasoning: string;
}

export interface AIPersonality {
  name: string;
  influenceWeight: number;
  gdpWeight: number;
  stabilityWeight: number;
  tensionWeight: number;
  riskAppetite: number;
  preferredActions: ActionType[];
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, {
  influenceThreshold: number;
  crisisThreshold: number;
  aiEfficiency: number;
  baseGrowthUSA: number;
  baseGrowthUSSR: number;
}> = {
  Easy: {
    influenceThreshold: 80,
    crisisThreshold: 90,
    aiEfficiency: 0.7,
    baseGrowthUSA: 0.035,
    baseGrowthUSSR: 0.028,
  },
  Normal: {
    influenceThreshold: 100,
    crisisThreshold: 85,
    aiEfficiency: 0.85,
    baseGrowthUSA: 0.03,
    baseGrowthUSSR: 0.024,
  },
  Extreme: {
    influenceThreshold: 120,
    crisisThreshold: 75,
    aiEfficiency: 1.0,
    baseGrowthUSA: 0.025,
    baseGrowthUSSR: 0.02,
  },
};

export const INITIAL_STATS: Record<Faction, FactionStats> = {
  USA: {
    faction: 'USA',
    influence: 50,
    gdp: 100,
    gdpGrowthRate: 0.03,
    militaryPower: 40,
    domesticStability: 80,
    worldTension: 30,
    techLevel: { military: 5, economic: 6, space: 4 },
    allianceStrength: 45,
    ongoingConflicts: [],
    resourceLeverage: 50,
  },
  USSR: {
    faction: 'USSR',
    influence: 45,
    gdp: 70,
    gdpGrowthRate: 0.024,
    militaryPower: 50,
    domesticStability: 75,
    worldTension: 30,
    techLevel: { military: 5, economic: 4, space: 3 },
    allianceStrength: 40,
    ongoingConflicts: [],
    resourceLeverage: 35,
  },
};
