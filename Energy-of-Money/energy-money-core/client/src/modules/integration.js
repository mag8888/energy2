// 🔗 Интеграция модулей Energy of Money с текущим проектом
import { GameEngine } from './core/index.js';
import { GameBoard } from './game/index.js';

// Создаем глобальные экземпляры для использования в проекте
export const globalGameEngine = new GameEngine();
export const globalGameBoards = new Map(); // roomId -> GameBoard

// Функция для получения или создания игрового поля для комнаты
export function getGameBoard(roomId) {
  if (!globalGameBoards.has(roomId)) {
    globalGameBoards.set(roomId, new GameBoard(roomId));
  }
  return globalGameBoards.get(roomId);
}

// Функция для интеграции с существующей системой комнат
export function integrateWithExistingRooms(existingRooms) {
  console.log('🔗 Интегрируем модули с существующими комнатами...');
  
  existingRooms.forEach(room => {
    try {
      // Создаем комнату в GameEngine
      globalGameEngine.createRoom(room.roomId, room.maxPlayers || 6);
      console.log(`✅ Комната ${room.roomId} интегрирована`);
      
      // Создаем игровое поле для комнаты
      getGameBoard(room.roomId);
      console.log(`✅ Игровое поле для комнаты ${room.roomId} создано`);
      
    } catch (error) {
      console.log(`❌ Ошибка интеграции комнаты ${room.roomId}:`, error.message);
    }
  });
}

// Функция для обработки игровых действий через модули
export function processGameAction(roomId, playerId, action, data) {
  try {
    const gameBoard = getGameBoard(roomId);
    
    switch (action) {
      case 'roll_dice':
        const steps = data.steps || Math.floor(Math.random() * 6) + 1;
        const moveResult = gameBoard.movePlayer(playerId, steps);
        return {
          success: true,
          action: 'move',
          data: moveResult
        };
        
      case 'buy_asset':
        // Логика покупки актива
        return {
          success: true,
          action: 'buy_asset',
          data: { asset: data.asset }
        };
        
      case 'sell_asset':
        // Логика продажи актива
        return {
          success: true,
          action: 'sell_asset',
          data: { asset: data.asset }
        };
        
      default:
        return {
          success: false,
          error: 'Unknown action'
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Функция для получения информации о клетке
export function getCellInfo(roomId, position) {
  try {
    const gameBoard = getGameBoard(roomId);
    return gameBoard.getCellInfo(position);
  } catch (error) {
    console.error('❌ Ошибка получения информации о клетке:', error);
    return null;
  }
}

// Функция для получения соседних клеток
export function getNeighborCells(roomId, position, range = 3) {
  try {
    const gameBoard = getGameBoard(roomId);
    return gameBoard.getNeighborCells(position, range);
  } catch (error) {
    console.error('❌ Ошибка получения соседних клеток:', error);
    return [];
  }
}

// Функция для получения статистики игры
export function getGameStatistics() {
  return globalGameEngine.getGameStats();
}

// Функция для очистки данных комнаты при её удалении
export function cleanupRoom(roomId) {
  try {
    globalGameEngine.deleteRoom(roomId);
    globalGameBoards.delete(roomId);
    console.log(`✅ Комната ${roomId} очищена`);
  } catch (error) {
    console.error(`❌ Ошибка очистки комнаты ${roomId}:`, error);
  }
}

// Экспортируем основные классы для прямого использования
export { GameEngine } from './core/index.js';
export { GameBoard } from './game/index.js';

console.log('🔗 Модули Energy of Money интегрированы с проектом!');
