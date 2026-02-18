// Simulation engine - Core game logic
import { initGame, executeTurn } from './core/simulation';
import { getTriggerableEvents } from './events/eventEngine';
import type { GameState, ActionType, Difficulty, Faction } from './core/types';
import { renderGame, showEventMenu, renderGameOver, injectStyles } from './ui/renderer';

let gameState: GameState;

// Initialize game
function startGame(difficulty: Difficulty, faction: Faction): void {
  gameState = initGame(difficulty, faction);
  render();
}

// Handle player actions
function handleActions(actions: ActionType[]): void {
  if (actions.length !== 2) {
    console.error('Must select exactly 2 actions');
    return;
  }

  gameState = executeTurn(gameState, actions);
  render();
}

// Handle event choices
function handleEventChoice(eventId: string, choiceId: string): void {
  // TODO: Implement event choice handling
  console.log(`Event: ${eventId}, Choice: ${choiceId}`);
  // Re-render after choice
  render();
}

// Main render function
function render(): void {
  if (gameState.gameOver) {
    renderGameOver(gameState);
    return;
  }

  // Check for random events
  const events = getTriggerableEvents(gameState);
  if (events.length > 0) {
    // Show first available event
    showEventMenu(events[0], (choiceId) => {
      handleEventChoice(events[0].id, choiceId);
    });
    return;
  }

  renderGame(gameState, (actions) => {
    handleActions(actions);
  });
}

// Save/Load functionality
function saveGameLocal(): void {
  const saveData = JSON.stringify(gameState);
  localStorage.setItem('m2m_save', saveData);
}

function loadGame(): boolean {
  const saveData = localStorage.getItem('m2m_save');
  if (saveData) {
    gameState = JSON.parse(saveData);
    render();
    return true;
  }
  return false;
}

// Auto-load if save exists
document.addEventListener('DOMContentLoaded', () => {
  injectStyles();
  if (!loadGame()) {
    // Show start screen if no save
    renderStartScreen();
  }
});

function renderStartScreen(): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="start-screen">
      <h1>Minutes to Midnight</h1>
      <p class="subtitle">Cold War Grand Strategy</p>
      
      <div class="menu">
        <h2>New Game</h2>
        <div class="form-group">
          <label>Faction:</label>
          <select id="faction-select">
            <option value="USA">United States</option>
            <option value="USSR">Soviet Union</option>
          </select>
        </div>
        <div class="form-group">
          <label>Difficulty:</label>
          <select id="difficulty-select">
            <option value="Easy">Easy</option>
            <option value="Normal" selected>Normal</option>
            <option value="Extreme">Extreme</option>
          </select>
        </div>
        <button id="start-btn">Start Game</button>
      </div>
      
      <div class="menu">
        <h2>Continue</h2>
        <button id="continue-btn" disabled>No saved game</button>
      </div>
    </div>
  `;

  const startBtn = document.getElementById('start-btn');
  const continueBtn = document.getElementById('continue-btn');
  
  if (localStorage.getItem('m2m_save')) {
    continueBtn?.removeAttribute('disabled');
    if (continueBtn) continueBtn.textContent = 'Continue Game';
  }

  startBtn?.addEventListener('click', () => {
    const faction = (document.getElementById('faction-select') as HTMLSelectElement).value as Faction;
    const difficulty = (document.getElementById('difficulty-select') as HTMLSelectElement).value as Difficulty;
    startGame(difficulty, faction);
  });

  continueBtn?.addEventListener('click', () => {
    loadGame();
  });
}

// Expose save function for UI
(window as unknown as { saveGame: () => void }).saveGame = saveGameLocal;
