// 🎮 Основной экспорт модулей Energy of Money
// Этот файл экспортирует все доступные модули и функции

// Core модули
export { 
  GameEngine, 
  GameState, 
  Player, 
  Room 
} from './core/index.js';

// Game модули
export { 
  GameBoard 
} from './game/index.js';

// Интеграция
export { 
  globalGameEngine,
  globalGameBoards,
  getGameBoard,
  integrateWithExistingRooms,
  processGameAction,
  getCellInfo,
  getNeighborCells,
  getGameStatistics,
  cleanupRoom
} from './integration.js';

// Версии модулей
export const MODULES_VERSION = {
  core: '1.0.0',
  game: '1.0.0',
  integration: '1.0.0'
};

// Информация о модулях
export const MODULES_INFO = {
      name: 'Energy of Money Modules',
    version: '1.0.0',
    description: 'Модульная архитектура для игры Energy of Money',
  modules: [
    'Core - Основная логика игры',
    'Game - Игровое поле и механика',
    'Integration - Интеграция с проектом'
  ]
};

console.log('🎮 Все модули CASHFLOW загружены и готовы к использованию!');
console.log('📋 Доступные модули:', Object.keys(MODULES_INFO.modules).map(i => MODULES_INFO.modules[i]));
