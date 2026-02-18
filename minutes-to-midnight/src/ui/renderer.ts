// UI Renderer - Text-based game interface
import type { GameState, ActionType, GameEvent, FactionStats } from '../core/types';

// Color scheme - Cold War aesthetic
const COLORS = {
  bg: '#0a0a0f',
  panel: '#12121a',
  border: '#2a2a3a',
  usa: '#003366',
  ussr: '#8b0000',
  text: '#c0c0c0',
  highlight: '#ffd700',
  danger: '#ff4444',
  success: '#44ff44',
  muted: '#666680',
};

// Render main game view
export function renderGame(state: GameState, onConfirm: (actions: ActionType[]) => void): void {
  actionConfirmCallback = onConfirm;
  const app = document.getElementById('app');
  if (!app) return;

  const faction = state.playerFaction;
  const opponent = state.aiFaction;

  app.innerHTML = `
    <div class="game-container">
      <header class="game-header">
        <h1>Minutes to Midnight</h1>
        <div class="year-display">Year: ${state.year}</div>
      </header>

      <div class="main-content">
        <div class="stats-panel player-${faction.toLowerCase()}">
          <h2>${faction} Stats</h2>
          ${renderStats(state.player)}
        </div>

        <div class="world-summary">
          <h2>World Status</h2>
          ${renderWorldSummary(state)}
        </div>

        <div class="stats-panel opponent">
          <h2>${opponent} (AI)</h2>
          ${renderStatsLimited(state.ai)}
        </div>
      </div>

      <div class="action-panel">
        <h2>Select 2 Actions</h2>
        <div class="actions-grid" id="actions-grid">
          ${renderActionButtons()}
        </div>
        <div class="selected-actions">
          <span>Selected: </span>
          <span id="selected-count">0</span>/2
        </div>
        <button id="confirm-actions" disabled>Confirm Actions</button>
      </div>

      <footer class="game-footer">
        <button id="save-btn">Save Game</button>
        <button id="menu-btn">Main Menu</button>
      </footer>
    </div>
  `;

  setupActionSelection();
  setupButtons(state);
}

function renderStats(stats: FactionStats): string {
  const bar = (value: number, _max: number = 100) => 
    '█'.repeat(Math.floor(value / 10)) + '░'.repeat(10 - Math.floor(value / 10));

  return `
    <div class="stat-row">
      <span class="stat-label">Influence</span>
      <span class="stat-bar">${bar(stats.influence)}</span>
      <span class="stat-value">${stats.influence}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">GDP</span>
      <span class="stat-bar gdp">${bar(Math.min(stats.gdp / 5, 100))}</span>
      <span class="stat-value">${stats.gdp.toFixed(1)}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Growth</span>
      <span class="stat-value growth">${(stats.gdpGrowthRate * 100).toFixed(1)}%</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Military</span>
      <span class="stat-bar military">${bar(stats.militaryPower)}</span>
      <span class="stat-value">${stats.militaryPower}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Stability</span>
      <span class="stat-bar stability">${bar(stats.domesticStability)}</span>
      <span class="stat-value">${stats.domesticStability}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Tension</span>
      <span class="stat-bar tension">${bar(stats.worldTension)}</span>
      <span class="stat-value">${stats.worldTension}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Alliances</span>
      <span class="stat-bar alliances">${bar(stats.allianceStrength)}</span>
      <span class="stat-value">${stats.allianceStrength}</span>
    </div>
  `;
}

function renderStatsLimited(stats: FactionStats): string {
  return `
    <div class="stat-row">
      <span class="stat-label">Influence</span>
      <span class="stat-value">${stats.influence}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">GDP</span>
      <span class="stat-value">${stats.gdp.toFixed(1)}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Military</span>
      <span class="stat-value">${stats.militaryPower}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Stability</span>
      <span class="stat-value">${stats.domesticStability}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Tension</span>
      <span class="stat-value tension-value">${stats.worldTension}</span>
    </div>
  `;
}

function renderWorldSummary(state: GameState): string {
  const tension = state.player.worldTension;
  let tensionStatus = 'LOW';
  let tensionClass = 'low';
  
  if (tension > 50) { tensionStatus = 'ELEVATED'; tensionClass = 'elevated'; }
  if (tension > 75) { tensionStatus = 'CRITICAL'; tensionClass = 'critical'; }
  if (tension > 90) { tensionStatus = 'EXTREME'; tensionClass = 'extreme'; }

  return `
    <div class="world-tension ${tensionClass}">
      <span class="tension-label">World Tension:</span>
      <span class="tension-value">${tension} (${tensionStatus})</span>
    </div>
    <div class="turn-info">
      <span>Turn: ${state.turn}</span>
      <span>Difficulty: ${state.difficulty}</span>
    </div>
  `;
}

const ACTIONS: { id: ActionType; label: string; desc: string }[] = [
  { id: 'economy', label: 'Economy', desc: 'Boost GDP and growth' },
  { id: 'diplomacy', label: 'Diplomacy', desc: 'Build alliances and influence' },
  { id: 'tech', label: 'Technology', desc: 'Advance tech levels' },
  { id: 'espionage', label: 'Espionage', desc: 'Secret operations' },
  { id: 'military', label: 'Military', desc: 'Build military power' },
  { id: 'ideological', label: 'Ideology', desc: 'Spread your ideology' },
  { id: 'economic_warfare', label: 'Economic War', desc: 'Sabotage opponent economy' },
  { id: 'proxy_war', label: 'Proxy War', desc: 'Fight via proxies' },
  { id: 'brinkmanship', label: 'Brinkmanship', desc: 'Risky nuclear signaling' },
];

function renderActionButtons(): string {
  return ACTIONS.map(a => `
    <button class="action-btn" data-action="${a.id}">
      <span class="action-label">${a.label}</span>
      <span class="action-desc">${a.desc}</span>
    </button>
  `).join('');
}

let selectedActions: ActionType[] = [];
let actionConfirmCallback: ((actions: ActionType[]) => void) | null = null;

function setupActionSelection(): void {
  const buttons = document.querySelectorAll('.action-btn');
  const countEl = document.getElementById('selected-count');
  const confirmBtn = document.getElementById('confirm-actions') as HTMLButtonElement;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = (btn as HTMLElement).dataset.action as ActionType;
      
      if (selectedActions.includes(action)) {
        selectedActions = selectedActions.filter(a => a !== action);
        btn.classList.remove('selected');
      } else if (selectedActions.length < 2) {
        selectedActions.push(action);
        btn.classList.add('selected');
      }

      if (countEl) countEl.textContent = selectedActions.length.toString();
      if (confirmBtn) confirmBtn.disabled = selectedActions.length !== 2;
    });
  });
}

function setupButtons(_state: GameState): void {
  const confirmBtn = document.getElementById('confirm-actions');
  const saveBtn = document.getElementById('save-btn');
  const menuBtn = document.getElementById('menu-btn');

  confirmBtn?.addEventListener('click', () => {
    if (selectedActions.length === 2) {
      if (actionConfirmCallback) actionConfirmCallback(selectedActions);
      selectedActions = [];
    }
  });

  saveBtn?.addEventListener('click', () => {
    (window as unknown as { saveGame: () => void }).saveGame();
    alert('Game saved!');
  });

  menuBtn?.addEventListener('click', () => {
    if (confirm('Return to menu? Unsaved progress will be lost.')) {
      location.reload();
    }
  });
}

// Show event modal
export function showEventMenu(event: GameEvent, onChoice: (choiceId: string) => void): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="event-modal">
      <div class="event-card">
        <span class="event-category">${event.category.toUpperCase()}</span>
        <h2>${event.title}</h2>
        <p class="event-description">${event.description}</p>
        
        <div class="event-choices">
          ${event.choices.map(choice => `
            <button class="choice-btn" data-choice="${choice.id}">
              ${choice.text}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const choiceId = (btn as HTMLElement).dataset.choice;
      if (choiceId) onChoice(choiceId);
    });
  });
}

// Show game over screen
export function renderGameOver(state: GameState): void {
  const app = document.getElementById('app');
  if (!app) return;

  const won = state.winCondition !== null;
  const title = won ? 'VICTORY' : 'DEFEAT';
  const message = won 
    ? getWinMessage(state.winCondition!)
    : getLossMessage(state.lossCondition!);

  app.innerHTML = `
    <div class="game-over">
      <h1 class="${won ? 'victory' : 'defeat'}">${title}</h1>
      <p class="game-over-message">${message}</p>
      
      <div class="final-stats">
        <h2>Final Stats</h2>
        <p>Year: ${state.year}</p>
        <p>Final Influence: ${state.player.influence}</p>
        <p>Final GDP: ${state.player.gdp.toFixed(1)}</p>
        <p>World Tension: ${state.player.worldTension}</p>
      </div>
      
      <div class="game-over-actions">
        <button id="new-game-btn">New Game</button>
        <button id="review-log-btn">Review Event Log</button>
      </div>
    </div>
  `;

  document.getElementById('new-game-btn')?.addEventListener('click', () => {
    location.reload();
  });

  document.getElementById('review-log-btn')?.addEventListener('click', () => {
    // TODO: Show event log
    alert('Event log coming soon!');
  });
}

function getWinMessage(condition: string): string {
  switch (condition) {
    case 'influence': return 'You have achieved global dominance through superior influence!';
    case 'collapse': return 'The opponent has collapsed economically and politically!';
    case 'blocs': return 'You have successfully fragmented the opponent\'s alliance bloc!';
    default: return 'You have won!';
  }
}

function getLossMessage(condition: string): string {
  switch (condition) {
    case 'nuclear': return 'Nuclear war has consumed the world. Everyone loses.';
    case 'stability': return 'Your nation has descended into chaos. The government has fallen.';
    case 'gdp': return 'Economic collapse has destroyed your nation\'s ability to function.';
    default: return 'You have been defeated.';
  }
}

// Inject CSS
export function injectStyles(): void {
  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Courier New', monospace;
      background: ${COLORS.bg};
      color: ${COLORS.text};
      min-height: 100vh;
    }
    
    .game-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid ${COLORS.border};
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    
    .game-header h1 {
      font-size: 1.8rem;
      color: ${COLORS.highlight};
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    
    .year-display {
      font-size: 1.5rem;
      color: ${COLORS.highlight};
      border: 1px solid ${COLORS.highlight};
      padding: 5px 15px;
    }
    
    .main-content {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .stats-panel {
      background: ${COLORS.panel};
      border: 1px solid ${COLORS.border};
      padding: 15px;
    }
    
    .stats-panel h2 {
      font-size: 1rem;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .player-usa h2 { color: #4a90d9; }
    .player-ussr h2 { color: #d94a4a; }
    .opponent h2 { color: ${COLORS.muted}; }
    
    .stat-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      font-size: 0.85rem;
    }
    
    .stat-label {
      width: 80px;
      color: ${COLORS.muted};
    }
    
    .stat-bar {
      flex: 1;
      font-family: monospace;
      letter-spacing: -2px;
    }
    
    .stat-bar.gdp { color: #44ff44; }
    .stat-bar.military { color: #ff4444; }
    .stat-bar.stability { color: #44ff44; }
    .stat-bar.tension { color: #ff4444; }
    .stat-bar.alliances { color: #4488ff; }
    
    .stat-value {
      width: 40px;
      text-align: right;
      color: ${COLORS.text};
    }
    
    .growth { color: #44ff44; }
    .tension-value { color: #ff4444; }
    
    .world-summary {
      background: ${COLORS.panel};
      border: 1px solid ${COLORS.border};
      padding: 15px;
    }
    
    .world-summary h2 {
      font-size: 1rem;
      margin-bottom: 15px;
      text-transform: uppercase;
    }
    
    .world-tension {
      padding: 10px;
      text-align: center;
      border: 1px solid ${COLORS.border};
      margin-bottom: 10px;
    }
    
    .world-tension.low { border-color: #44ff44; }
    .world-tension.elevated { border-color: #ffff44; background: #2a2a20; }
    .world-tension.critical { border-color: #ff8844; background: #2a2010; }
    .world-tension.extreme { border-color: #ff4444; background: #2a1010; animation: pulse 1s infinite; }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    .tension-label { color: ${COLORS.muted}; }
    .tension-value { font-weight: bold; }
    
    .turn-info {
      display: flex;
      justify-content: space-between;
      color: ${COLORS.muted};
      font-size: 0.85rem;
    }
    
    .action-panel {
      background: ${COLORS.panel};
      border: 1px solid ${COLORS.border};
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .action-panel h2 {
      margin-bottom: 15px;
      text-transform: uppercase;
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .action-btn {
      background: ${COLORS.bg};
      border: 1px solid ${COLORS.border};
      color: ${COLORS.text};
      padding: 15px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }
    
    .action-btn:hover {
      border-color: ${COLORS.highlight};
      background: #1a1a25;
    }
    
    .action-btn.selected {
      border-color: ${COLORS.highlight};
      background: #252530;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
    }
    
    .action-label {
      display: block;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .action-desc {
      font-size: 0.75rem;
      color: ${COLORS.muted};
    }
    
    .selected-actions {
      margin-bottom: 15px;
      color: ${COLORS.muted};
    }
    
    #confirm-actions {
      width: 100%;
      padding: 15px;
      background: ${COLORS.highlight};
      color: ${COLORS.bg};
      border: none;
      font-weight: bold;
      text-transform: uppercase;
      cursor: pointer;
    }
    
    #confirm-actions:disabled {
      background: ${COLORS.border};
      cursor: not-allowed;
    }
    
    .game-footer {
      display: flex;
      gap: 10px;
    }
    
    .game-footer button {
      flex: 1;
      padding: 10px;
      background: transparent;
      border: 1px solid ${COLORS.border};
      color: ${COLORS.muted};
      cursor: pointer;
    }
    
    .game-footer button:hover {
      border-color: ${COLORS.text};
      color: ${COLORS.text};
    }
    
    /* Event Modal */
    .event-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .event-card {
      background: ${COLORS.panel};
      border: 2px solid ${COLORS.highlight};
      padding: 30px;
      max-width: 600px;
      width: 100%;
    }
    
    .event-category {
      display: inline-block;
      background: ${COLORS.highlight};
      color: ${COLORS.bg};
      padding: 2px 8px;
      font-size: 0.75rem;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .event-card h2 {
      color: ${COLORS.highlight};
      margin-bottom: 15px;
    }
    
    .event-description {
      margin-bottom: 20px;
      line-height: 1.6;
    }
    
    .event-choices {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .choice-btn {
      background: ${COLORS.bg};
      border: 1px solid ${COLORS.border};
      color: ${COLORS.text};
      padding: 15px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
    }
    
    .choice-btn:hover {
      border-color: ${COLORS.highlight};
      background: #1a1a25;
    }
    
    /* Game Over */
    .game-over {
      text-align: center;
      padding: 40px;
    }
    
    .game-over h1 {
      font-size: 3rem;
      margin-bottom: 20px;
      letter-spacing: 5px;
    }
    
    .game-over h1.victory { color: #44ff44; }
    .game-over h1.defeat { color: #ff4444; }
    
    .game-over-message {
      font-size: 1.2rem;
      margin-bottom: 30px;
    }
    
    .final-stats {
      background: ${COLORS.panel};
      border: 1px solid ${COLORS.border};
      padding: 20px;
      margin-bottom: 30px;
      display: inline-block;
    }
    
    .game-over-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
    }
    
    .game-over-actions button {
      padding: 15px 30px;
      background: ${COLORS.highlight};
      color: ${COLORS.bg};
      border: none;
      font-weight: bold;
      cursor: pointer;
    }
    
    /* Start Screen */
    .start-screen {
      max-width: 500px;
      margin: 50px auto;
      text-align: center;
    }
    
    .start-screen h1 {
      font-size: 2.5rem;
      color: ${COLORS.highlight};
      letter-spacing: 5px;
      margin-bottom: 10px;
    }
    
    .start-screen .subtitle {
      color: ${COLORS.muted};
      margin-bottom: 30px;
    }
    
    .start-screen .menu {
      background: ${COLORS.panel};
      border: 1px solid ${COLORS.border};
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .start-screen .menu h2 {
      margin-bottom: 15px;
      color: ${COLORS.text};
    }
    
    .form-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .form-group label {
      color: ${COLORS.muted};
    }
    
    .form-group select {
      background: ${COLORS.bg};
      border: 1px solid ${COLORS.border};
      color: ${COLORS.text};
      padding: 8px;
      min-width: 150px;
    }
    
    .start-screen button {
      padding: 15px 40px;
      background: ${COLORS.highlight};
      color: ${COLORS.bg};
      border: none;
      font-weight: bold;
      cursor: pointer;
      text-transform: uppercase;
    }
    
    .start-screen button:disabled {
      background: ${COLORS.border};
      cursor: not-allowed;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .main-content {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;
  document.head.appendChild(style);
}

// Add confirmActions to window
(window as unknown as { confirmActions: (actions: ActionType[]) => void }).confirmActions = () => {};

// Add saveGame to window
(window as unknown as { saveGame: () => void }).saveGame = () => {};
