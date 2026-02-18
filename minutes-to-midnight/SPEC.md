# Minutes to Midnight - Specification

## Project Overview
- **Name**: Minutes to Midnight
- **Type**: Cold War grand strategy simulation (PWA)
- **Core**: Text-based strategy game v0.5 with systems-driven gameplay
- **Target**: Browser (desktop + mobile PWA)

## Roadmap
- **v0.5**: Complete text game, no map, menus + text + simple UI panels
- **v1.0**: Same engine + graphical world map + influence visualization

## Core Gameplay

### Factions
- **USA**: Higher baseline growth, strong diplomacy/alliances, soft power. Sensitive to public opinion, war fatigue, scandals.
- **USS R**: Higher military efficiency, strong early cohesion, faster influence via revolutionary movements. Lower growth, rigid economy, collapse risk if over-militarized.

### Win Conditions
1. Reach Influence threshold (120 Extreme / 100 Normal) without nuclear war/collapse
2. Opponent enters systemic collapse (GDP contraction + stability crisis)
3. Opponent loses major blocs and can't recover

### Loss Conditions
1. Nuclear war triggers
2. Domestic stability reaches 0
3. GDP severe contraction → collapse

### Core Stats (per faction)
1. Influence (global)
2. GDP (index)
3. GDP growth rate
4. Military power
5. Domestic stability
6. World tension
7. Tech level (military/economic/space)
8. Alliance strength
9. Ongoing conflicts (proxy wars)
10. Resource leverage

## Actions per Turn
Player chooses 2 actions per year:
1. Economy
2. Diplomacy
3. Tech
4. Espionage
5. Military buildup
6. Ideological campaigns
7. Economic warfare
8. Proxy war
9. Brinkmanship

Each action has: immediate effects, delayed consequences, event interaction, tension impact, GDP impact.

## GDP Formula
```
GDP_next = GDP_current × (1 + growth_rate)
growth_rate = base_growth + tech_bonus + stability_modifier + trade_modifier − military_burden − war_drain ± economic_warfare_effect ± shock_effect
```

## World Tension
- Tension increases: military buildup, brinkmanship, proxy escalation, espionage failures
- Tension decreases: diplomacy, treaties, de-escalation
- At 85 (Extreme): crisis check on high-risk actions
- At 100: nuclear war with very high probability

## Random Event Engine
100+ handcrafted events across categories:
- Political, economic, social movements
- Coups/revolutions, proxy sparks
- Espionage, tech breakthroughs
- Scandals, alliances shifting, crises

Each event: trigger conditions, 2-4 choices, immediate effects, hidden delayed effects.

## AI Opponent
- Strategic, not random
- Evaluates long-horizon outcomes
- Avoids suicidal nuclear escalation unless desperate
- Uses asymmetry (USSR plays differently than USA)
- Personality profiles: balanced, economic, ideological, trap-focused, aggressive

## v0.5 UI (Text-only)
- Year header
- Player stats panel
- World summary
- Events with choices
- Action selection (2 actions)
- Resolution report
- AI visible consequences
- End-of-year recap
- Save/load via localStorage
- Run summary (ASCII sparklines)

## PWA Requirements
- Service worker for offline play
- Web app manifest
- Installable on mobile (Android/iOS)
- Works offline after initial load

## Technical
- TypeScript
- Vite (vanilla-ts template)
- Modular: Simulation core | UI layer | Event engine | AI module
- All randomness seedable for reproducibility
