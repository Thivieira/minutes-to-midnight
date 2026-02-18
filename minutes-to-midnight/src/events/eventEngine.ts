// Event engine - Random event generation and handling
import type { GameState, GameEvent, EventChoice, EventEffects } from '../core/types';

// Event library - Starter set of 25+ events
export const EVENT_LIBRARY: GameEvent[] = [
  {
    id: 'sputnik_shock',
    title: 'Sputnik Shock',
    description: 'The Soviet Union has launched the first artificial satellite, shocking the American public and raising questions about technological superiority.',
    category: 'tech',
    triggerConditions: { minYear: 1957, maxYear: 1958, faction: 'USA', chance: 0.7 },
    choices: [
      { id: 'education_invest', text: 'Invest heavily in science education', effects: { gdp: -3, techLevel: { military: 1, economic: 1, space: 2 }, stability: 2, tension: 3 } },
      { id: 'space_race', text: 'Launch full-scale space program', effects: { gdp: -5, techLevel: { military: 0, economic: 0, space: 3 }, influence: 3, tension: 5 } },
      { id: 'ignore', text: 'Dismiss as propaganda', effects: { influence: -2, stability: -3, tension: -2 } },
    ],
  },
  {
    id: 'u2_incident',
    title: 'U-2 Incident',
    description: 'A American spy plane has been shot down over Soviet territory. International outrage mounts.',
    category: 'espionage',
    triggerConditions: { minYear: 1960, maxYear: 1960, chance: 0.8 },
    choices: [
      { id: 'apology', text: 'Issue formal apology', effects: { influence: -3, stability: -2, tension: -5 } },
      { id: 'deny', text: 'Deny everything', effects: { influence: 2, stability: 1, tension: 8 } },
      { id: 'escalate', text: 'Accuse USSR of aggression', effects: { influence: 1, tension: 12 } },
    ],
  },
  {
    id: 'cuban_missile',
    title: 'Cuban Missile Crisis',
    description: 'Intelligence confirms Soviet nuclear missiles in Cuba, just 90 miles from American shores.',
    category: 'crisis',
    triggerConditions: { minYear: 1962, maxYear: 1962, chance: 0.9 },
    choices: [
      { id: 'blockade', text: 'Naval blockade', effects: { militaryPower: 5, tension: 20, stability: -5 } },
      { id: 'invade', text: 'Full invasion', effects: { militaryPower: 10, tension: 35, stability: -10, gdp: -10 } },
      { id: 'negotiate', text: 'Secret negotiations', effects: { influence: -5, tension: -10, stability: 3 } },
      { id: 'signal', text: 'Backchannel diplomatic signal', effects: { influence: -2, tension: 5, stability: 1 } },
    ],
  },
  {
    id: 'berlin_wall',
    title: 'Berlin Wall Built',
    description: 'East Germany constructs a wall dividing Berlin. The world watches in shock.',
    category: 'political',
    triggerConditions: { minYear: 1961, maxYear: 1961, chance: 0.8 },
    choices: [
      { id: 'protest', text: 'Strong diplomatic protest', effects: { influence: 2, tension: 10 } },
      { id: 'accept', text: 'Accept reality quietly', effects: { influence: -2, tension: -3, stability: 1 } },
      { id: 'propaganda', text: 'Launch propaganda campaign', effects: { gdp: -2, influence: 3, tension: 5 } },
    ],
  },
  {
    id: 'vietnam_war',
    title: 'Vietnam Escalation',
    description: 'Military advisors request increased commitment in Vietnam. The situation deteriorates.',
    category: 'proxy',
    triggerConditions: { minYear: 1964, maxYear: 1968 },
    choices: [
      { id: 'escalate', text: 'Commit more troops', effects: { militaryPower: 8, gdp: -8, stability: -8, tension: 15 } },
      { id: 'advisors', text: 'Keep to advisors only', effects: { militaryPower: 2, gdp: -2, stability: -2, tension: 5 } },
      { id: 'withdraw', text: 'Begin withdrawal', effects: { influence: -5, stability: 5, tension: -5, gdp: 2 } },
    ],
  },
  {
    id: 'moon_landing',
    title: 'Moon Landing',
    description: 'American astronauts have walked on the moon. A monumental achievement.',
    category: 'tech',
    triggerConditions: { minYear: 1969, maxYear: 1969, chance: 0.9 },
    choices: [
      { id: 'celebrate', text: 'Mass celebration', effects: { influence: 8, stability: 8, gdp: -2 } },
      { id: 'space_program', text: 'Expand space program', effects: { techLevel: { military: 0, economic: 1, space: 3 }, gdp: -5 } },
      { id: 'military_space', text: 'Militarize space', effects: { techLevel: { military: 2, economic: 0, space: 2 }, tension: 10 } },
    ],
  },
  {
    id: 'watergate',
    title: 'Watergate Scandal',
    description: 'A break-in at the Democratic National Committee headquarters leads to a massive scandal.',
    category: 'scandal',
    triggerConditions: { minYear: 1972, maxYear: 1974, faction: 'USA', chance: 0.6 },
    choices: [
      { id: 'coverup', text: 'Attempt cover-up', effects: { stability: -15, influence: -5 } },
      { id: 'truth', text: 'Full transparency', effects: { stability: -10, influence: 2 } },
      { id: 'delay', text: 'Delay and deflect', effects: { stability: -8, influence: -3 } },
    ],
  },
  {
    id: 'afghanistan_invasion',
    title: 'Afghanistan Invasion',
    description: 'Soviet forces have invaded Afghanistan. The West must respond.',
    category: 'proxy',
    triggerConditions: { minYear: 1979, maxYear: 1980, faction: 'USSR', chance: 0.8 },
    choices: [
      { id: 'boycott', text: 'Olympic boycott', effects: { influence: -3, tension: 8 } },
      { id: 'aid', text: 'Arm mujahideen', effects: { gdp: -3, tension: 12, influence: 4 } },
      { id: 'sanctions', text: 'Economic sanctions', effects: { gdp: -2, tension: 6, influence: 1 } },
      { id: 'invade', text: 'Direct military response', effects: { militaryPower: 5, tension: 25, stability: -5, gdp: -10 } },
    ],
  },
  {
    id: 'reagan_buildup',
    title: 'Reagan Military Buildup',
    description: 'A massive military modernization program is proposed.',
    category: 'military',
    triggerConditions: { minYear: 1981, maxYear: 1985, faction: 'USA', chance: 0.7 },
    choices: [
      { id: 'full_buildup', text: 'Full military buildup', effects: { militaryPower: 15, gdp: -10, tension: 15 } },
      { id: 'selective', text: 'Selective modernization', effects: { militaryPower: 8, gdp: -5, tension: 8 } },
      { id: 'defense', text: 'Focus on defense only', effects: { militaryPower: 5, gdp: -3, tension: 3 } },
    ],
  },
  {
    id: 'perestroika',
    title: 'Perestroika',
    description: 'Soviet leadership announces major economic reforms.',
    category: 'political',
    triggerConditions: { minYear: 1985, maxYear: 1988, faction: 'USSR', chance: 0.6 },
    choices: [
      { id: 'radical', text: 'Radical reforms', effects: { gdp: 5, stability: -10, influence: -3 } },
      { id: 'cautious', text: 'Cautious gradualism', effects: { gdp: 2, stability: -3 } },
      { id: 'halt', text: 'Halt reforms', effects: { stability: 2, gdp: -3, influence: -2 } },
    ],
  },
  {
    id: 'chernobyl',
    title: 'Chernobyl Disaster',
    description: 'A nuclear reactor explosion in Ukraine spreads radiation across Europe.',
    category: 'crisis',
    triggerConditions: { minYear: 1986, maxYear: 1986, faction: 'USSR', chance: 0.7 },
    choices: [
      { id: 'coverup', text: 'Minimize information', effects: { stability: -8, influence: -5 } },
      { id: 'transparency', text: 'Full disclosure', effects: { stability: -12, influence: 2 } },
      { id: 'blame', text: 'Blame saboteurs', effects: { stability: -5, tension: 5 } },
    ],
  },
  {
    id: 'wall_fall',
    title: 'Berlin Wall Falls',
    description: 'The Berlin Wall has fallen. German reunification seems inevitable.',
    category: 'political',
    triggerConditions: { minYear: 1989, maxYear: 1989, chance: 0.8 },
    choices: [
      { id: 'support', text: 'Support reunification', effects: { influence: 8, gdp: -5, stability: 5 } },
      { id: 'cautious', text: 'Cautious approach', effects: { influence: 3, stability: 2 } },
      { id: 'oppose', text: 'Oppose reunification', effects: { influence: -5, stability: -3 } },
    ],
  },
  {
    id: 'soviet_collapse',
    title: 'Soviet Union Dissolves',
    description: 'The Soviet Union has officially dissolved. A new world order emerges.',
    category: 'political',
    triggerConditions: { minYear: 1991, maxYear: 1991, faction: 'USSR', chance: 0.9 },
    choices: [
      { id: 'absorb', text: 'Absorb former states', effects: { influence: 15, gdp: -8, stability: 5 } },
      { id: 'cooperate', text: 'Cooperative approach', effects: { influence: 10, stability: 8 } },
      { id: 'isolate', text: 'Focus on US interests', effects: { influence: 5, gdp: 3, stability: 3 } },
    ],
  },
  {
    id: 'oil_crisis_73',
    title: '1973 Oil Crisis',
    description: 'OPEC embargo causes oil prices to skyrocket.',
    category: 'economic',
    triggerConditions: { minYear: 1973, maxYear: 1973, chance: 0.9 },
    choices: [
      { id: 'conservation', text: 'National conservation program', effects: { gdp: -5, stability: 2 } },
      { id: 'diplomacy', text: 'Pressure OPEC diplomatically', effects: { influence: -3, tension: 8 } },
      { id: 'domestic', text: 'Develop domestic sources', effects: { gdp: -8, influence: 2, resourceLeverage: 10 } },
    ],
  },
  {
    id: 'oil_crisis_79',
    title: '1979 Oil Crisis',
    description: 'Iranian revolution disrupts oil supplies.',
    category: 'economic',
    triggerConditions: { minYear: 1979, maxYear: 1979, chance: 0.7 },
    choices: [
      { id: 'spr', text: 'Use Strategic Petroleum Reserve', effects: { gdp: -3, stability: 3 } },
      { id: 'saudi', text: 'Pressure Saudi Arabia', effects: { influence: -2, resourceLeverage: 5 } },
      { id: 'crash', text: 'Let market adjust', effects: { gdp: -8, stability: -5 } },
    ],
  },
  {
    id: 'starwars',
    title: 'Star Wars Initiative',
    description: 'A revolutionary missile defense system is proposed.',
    category: 'tech',
    triggerConditions: { minYear: 1983, maxYear: 1985, faction: 'USA', chance: 0.6 },
    choices: [
      { id: 'full_program', text: 'Full SDI program', effects: { gdp: -12, techLevel: { military: 3, economic: 1, space: 2 }, tension: 15 } },
      { id: 'research', text: 'Limited research', effects: { gdp: -4, techLevel: { military: 1, economic: 0, space: 1 }, tension: 5 } },
      { id: 'reject', text: 'Reject concept', effects: { influence: -3, stability: 2 } },
    ],
  },
  {
    id: 'solidarity',
    title: 'Solidarity Movement',
    description: 'Independent trade union forms in Poland, challenging communist rule.',
    category: 'social',
    triggerConditions: { minYear: 1980, maxYear: 1981, faction: 'USSR', chance: 0.5 },
    choices: [
      { id: 'martial', text: 'Martial law response', effects: { stability: -8, tension: 10, influence: -3 } },
      { id: 'negotiate', text: 'Negotiate reforms', effects: { stability: -3, influence: -2 } },
      { id: 'ignore', text: 'Ignore for now', effects: { stability: -5, influence: 1 } },
    ],
  },
  {
    id: 'ir_revolution',
    title: 'Iranian Revolution',
    description: 'Islamic revolution overthrows the Shah.',
    category: 'coup',
    triggerConditions: { minYear: 1979, maxYear: 1979, chance: 0.7 },
    choices: [
      { id: 'support_shah', text: 'Support the Shah', effects: { influence: -5, tension: 10 } },
      { id: 'neutral', text: 'Stay neutral', effects: { influence: 1, stability: 1 } },
      { id: 'engage', text: 'Engage new regime', effects: { influence: -3, stability: 2 } },
    ],
  },
  {
    id: 'detente',
    title: 'Era of Détente',
    description: 'A period of relaxed tensions between superpowers.',
    category: 'alliance',
    triggerConditions: { minYear: 1969, maxYear: 1975, chance: 0.4 },
    choices: [
      { id: 'embrace', text: 'Embrace détente', effects: { tension: -15, stability: 5, influence: 3 } },
      { id: 'skeptical', text: 'Remain skeptical', effects: { tension: -5, influence: -2 } },
      { id: 'exploit', text: 'Use for advantage', effects: { gdp: 3, influence: 5, tension: -8 } },
    ],
  },
  {
    id: 'falklands',
    title: 'Falklands War',
    description: 'Argentina invades the Falkland Islands. Britain must respond.',
    category: 'proxy',
    triggerConditions: { minYear: 1982, maxYear: 1982 },
    choices: [
      { id: 'support_argentina', text: 'Support Argentina', effects: { influence: -5, tension: 8 } },
      { id: 'support_uk', text: 'Support Britain', effects: { influence: 3, tension: 5 } },
      { id: 'neutral', text: 'Stay neutral', effects: { influence: 1, stability: 1 } },
    ],
  },
  {
    id: 'nitty_gritty',
    title: 'Nicaragua Contras',
    description: 'Support for anti-communist rebels in Nicaragua is proposed.',
    category: 'proxy',
    triggerConditions: { minYear: 1981, maxYear: 1986, faction: 'USA', chance: 0.5 },
    choices: [
      { id: 'full_support', text: 'Full covert support', effects: { gdp: -3, tension: 10, influence: 5 } },
      { id: 'diplomatic', text: 'Diplomatic pressure only', effects: { influence: -2, tension: 3 } },
      { id: 'ignore', text: 'Ignore entirely', effects: { influence: -4, stability: 2 } },
    ],
  },
  {
    id: 'gulf_war',
    title: 'Gulf War',
    description: 'Iraq invades Kuwait. Coalition intervention is proposed.',
    category: 'proxy',
    triggerConditions: { minYear: 1990, maxYear: 1991 },
    choices: [
      { id: 'coalition', text: 'Lead coalition', effects: { influence: 10, militaryPower: 5, gdp: -5, tension: 10 } },
      { id: 'support', text: 'Support but not lead', effects: { influence: 5, gdp: -2, tension: 5 } },
      { id: 'isolate', text: 'Isolate economically', effects: { influence: -3, gdp: 1 } },
    ],
  },
  {
    id: 'euromissiles',
    title: 'Euromissiles Crisis',
    description: 'Soviet SS-20 missiles in Europe prompt NATO response.',
    category: 'military',
    triggerConditions: { minYear: 1979, maxYear: 1983 },
    choices: [
      { id: 'deploy', text: 'Deploy Pershing missiles', effects: { militaryPower: 8, tension: 15, influence: 5 } },
      { id: 'negotiate', text: 'Negotiate withdrawal', effects: { tension: -10, influence: -3 } },
      { id: 'protest', text: 'Massive protests', effects: { stability: -5, tension: -5 } },
    ],
  },
  {
    id: 'japan_rise',
    title: "Japan's Economic Rise",
    description: 'Japanese economy challenges American industrial dominance.',
    category: 'economic',
    triggerConditions: { minYear: 1980, maxYear: 1990, faction: 'USA', chance: 0.5 },
    choices: [
      { id: 'trade_war', text: 'Trade restrictions', effects: { gdp: -3, stability: -3, tension: 8 } },
      { id: 'compete', text: 'Compete directly', effects: { gdp: 2, techLevel: { military: 0, economic: 2, space: 0 }, stability: 1 } },
      { id: 'ally', text: 'Economic alliance', effects: { allianceStrength: 8, gdp: 3 } },
    ],
  },
  {
    id: 'domino_theory',
    title: 'Domino Theory Concern',
    description: 'A Southeast Asian country shows signs of communist influence.',
    category: 'proxy',
    triggerConditions: { minYear: 1955, maxYear: 1975, chance: 0.3 },
    choices: [
      { id: 'intervene', text: 'Military intervention', effects: { militaryPower: 5, gdp: -5, stability: -5, tension: 12 } },
      { id: 'aid', text: 'Economic aid', effects: { gdp: -2, influence: 3, tension: 3 } },
      { id: 'ignore', text: 'Let it happen', effects: { influence: -5, tension: -5, stability: 2 } },
    ],
  },
  {
    id: 'scientific_breakthrough',
    title: 'Major Scientific Breakthrough',
    description: 'A revolutionary discovery in physics/medicine/technology.',
    category: 'tech',
    triggerConditions: { minYear: 1945, maxYear: 1990, chance: 0.15 },
    choices: [
      { id: 'militarize', text: 'Militarize the technology', effects: { techLevel: { military: 3, economic: 0, space: 0 }, tension: 10, gdp: -3 } },
      { id: 'civilian', text: 'Civilian applications only', effects: { techLevel: { military: 0, economic: 3, space: 1 }, gdp: 5, stability: 3 } },
      { id: 'share', text: 'Share with world', effects: { influence: 8, stability: 5, gdp: 1 } },
    ],
  },
];

// Get events that can trigger this turn
export function getTriggerableEvents(state: GameState): GameEvent[] {
  const { year, worldTension } = state;
  
  return EVENT_LIBRARY.filter(event => {
    const conditions = event.triggerConditions;
    
    // Year check
    if (conditions.minYear && year < conditions.minYear) return false;
    if (conditions.maxYear && year > conditions.maxYear) return false;
    
    // Chance check
    if (conditions.chance && Math.random() > conditions.chance) return false;
    
    // Tension check
    if (conditions.minTension && worldTension < conditions.minTension) return false;
    if (conditions.maxTension && worldTension > conditions.maxTension) return false;
    
    // Faction-specific events
    if (conditions.faction && conditions.faction !== state.playerFaction) return false;
    
    return true;
  });
}

// Apply event effects to faction
export function applyEventEffects(
  _stats: EventEffects,
  _choice: EventChoice
): EventEffects {
  // Placeholder - would apply effects to faction stats
  return {};
}
