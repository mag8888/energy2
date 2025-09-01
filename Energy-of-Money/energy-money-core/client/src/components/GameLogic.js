// 🎮 GameLogic - Основная логика игры
import React, { useState, useCallback } from 'react';
import { PROFESSIONS } from '../data/professions';

export class GameLogic {
  constructor() {
    this.players = new Map();
    this.currentPlayerIndex = 0;
    this.playerQueue = [];
    this.gameStarted = false;
    this.turnTimeLeft = 120;
    this.currentPlayerId = null;
  }

  // Инициализация игрока с профессией
  initializePlayer(playerData, professionId) {
    // Если professionId не указан, создаем временного игрока без профессии
    if (!professionId) {
      return {
        id: playerData.id,
        username: playerData.username,
        socketId: playerData.socketId,
        position: 1, // Начинают с 1-й клетки
        color: this.getPlayerColor(playerData.id),
        profession: null, // Профессия будет установлена позже
        balance: 0,
        salary: 0,
        passiveIncome: 0,
        totalExpenses: 0,
        cashFlow: 0,
        ready: false,
        isOnBigCircle: false, // Начинают на малом круге
        assets: [],
        children: 0,
        loans: {
          auto: 0,
          education: 0,
          housing: 0,
          cards: 0
        }
      };
    }

    const profession = PROFESSIONS.find(p => p.id === professionId);
    if (!profession) {
      throw new Error(`Профессия с ID ${professionId} не найдена`);
    }

    return {
      id: playerData.id,
      username: playerData.username,
      socketId: playerData.socketId,
      position: 1, // Начинают с 1-й клетки
      color: this.getPlayerColor(playerData.id),
      profession: profession,
      balance: profession.balance,
      salary: profession.salary,
      passiveIncome: profession.passiveIncome,
      totalExpenses: profession.totalExpenses,
      cashFlow: profession.cashFlow,
      ready: false,
      isOnBigCircle: false, // Начинают на малом круге
      assets: [],
      children: 0,
      loans: {
        auto: profession.creditAuto || 0,
        education: profession.creditEducation || 0,
        housing: profession.creditHousing || 0,
        cards: profession.creditCards || 0
      }
    };
  }

  // Получение цвета игрока
  getPlayerColor(playerId) {
    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    return colors[playerId % colors.length];
  }

  // Добавление игрока в игру
  addPlayer(playerData, professionId) {
    // Проверяем, существует ли игрок уже
    if (this.players.has(playerData.id)) {
      console.log('🎮 [GameLogic] Игрок уже существует:', playerData.username);
      return this.players.get(playerData.id);
    }
    
    const player = this.initializePlayer(playerData, professionId);
    this.players.set(player.id, player);
    this.playerQueue.push(player.id);
    console.log('🎮 [GameLogic] Добавлен новый игрок:', player.username);
    return player;
  }

  // Удаление игрока из игры
  removePlayer(playerId) {
    this.players.delete(playerId);
    this.playerQueue = this.playerQueue.filter(id => id !== playerId);
    
    // Если удаленный игрок был текущим, переходим к следующему
    if (this.currentPlayerId === playerId) {
      this.nextTurn();
    }
  }

  // Очистка всех игроков
  clearAllPlayers() {
    this.players.clear();
    this.playerQueue = [];
    this.currentPlayerId = null;
    this.currentPlayerIndex = 0;
    console.log('🎮 [GameLogic] Все игроки очищены');
  }

  // Начало игры
  startGame() {
    console.log('🎮 [GameLogic] startGame вызвана');
    console.log('🎮 [GameLogic] playerQueue:', this.playerQueue);
    console.log('🎮 [GameLogic] players.size:', this.players.size);
    
    if (this.playerQueue.length < 2) {
      throw new Error('Для начала игры нужно минимум 2 игрока');
    }
    
    this.gameStarted = true;
    this.currentPlayerIndex = 0;
    this.currentPlayerId = this.playerQueue[0];
    this.turnTimeLeft = 120;
    
    console.log('🎮 [GameLogic] Игра запущена:', {
      currentPlayerId: this.currentPlayerId,
      currentPlayerIndex: this.currentPlayerIndex,
      playerQueue: this.playerQueue
    });
    
    return {
      gameStarted: true,
      playerQueue: this.playerQueue,
      currentPlayerId: this.currentPlayerId,
      currentPlayerIndex: this.currentPlayerIndex
    };
  }

  // Следующий ход
  nextTurn() {
    if (!this.gameStarted) return null;
    
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playerQueue.length;
    this.currentPlayerId = this.playerQueue[this.currentPlayerIndex];
    this.turnTimeLeft = 120;
    
    return {
      currentPlayerId: this.currentPlayerId,
      currentPlayerIndex: this.currentPlayerIndex,
      turnTimeLeft: this.turnTimeLeft
    };
  }

  // Получение текущего игрока
  getCurrentPlayer() {
    console.log('🎮 [GameLogic] getCurrentPlayer вызвана');
    console.log('🎮 [GameLogic] currentPlayerId:', this.currentPlayerId);
    console.log('🎮 [GameLogic] players.size:', this.players.size);
    
    const currentPlayer = this.players.get(this.currentPlayerId);
    console.log('🎮 [GameLogic] Текущий игрок:', currentPlayer);
    
    return currentPlayer;
  }

  // Обновление баланса игрока
  updatePlayerBalance(playerId, amount) {
    const player = this.players.get(playerId);
    if (player) {
      player.balance = Math.max(0, player.balance + amount);
      return player.balance;
    }
    return null;
  }

  // Движение игрока
  movePlayer(playerId, diceValue) {
    const player = this.players.get(playerId);
    if (!player) return null;
    
    const newPosition = player.position + diceValue;
    
    // Логика перехода на большой круг
    if (!player.isOnBigCircle && newPosition > 24) {
      player.isOnBigCircle = true;
      player.position = newPosition - 24; // Переходим на большой круг
    } else if (player.isOnBigCircle) {
      player.position = newPosition > 52 ? newPosition - 52 : newPosition;
    } else {
      player.position = newPosition > 24 ? newPosition - 24 : newPosition;
    }
    
    return {
      playerId,
      newPosition: player.position,
      isOnBigCircle: player.isOnBigCircle
    };
  }

  // Получение всех игроков
  getAllPlayers() {
    console.log('🎮 [GameLogic] getAllPlayers вызвана');
    console.log('🎮 [GameLogic] players.size:', this.players.size);
    console.log('🎮 [GameLogic] players.keys():', Array.from(this.players.keys()));
    
    const allPlayers = Array.from(this.players.values());
    console.log('🎮 [GameLogic] Все игроки:', allPlayers);
    
    return allPlayers;
  }

  // Получение состояния игры
  getGameState() {
    return {
      players: this.getAllPlayers(),
      currentPlayerId: this.currentPlayerId,
      currentPlayerIndex: this.currentPlayerIndex,
      playerQueue: this.playerQueue,
      gameStarted: this.gameStarted,
      turnTimeLeft: this.turnTimeLeft
    };
  }

  // Проверка, является ли игрок текущим
  isCurrentPlayer(playerId) {
    return this.currentPlayerId === playerId;
  }

  // Получение индекса игрока в очереди
  getPlayerIndex(playerId) {
    return this.playerQueue.indexOf(playerId);
  }
}

// 🎯 Хуки для работы с игровой логикой
export const useGameLogic = () => {
  const [gameLogic] = useState(() => new GameLogic());
  const [gameState, setGameState] = useState(gameLogic.getGameState());

  const updateGameState = useCallback(() => {
    setGameState(gameLogic.getGameState());
  }, [gameLogic]);

  const addPlayer = useCallback((playerData, professionId) => {
    const player = gameLogic.addPlayer(playerData, professionId);
    updateGameState();
    return player;
  }, [gameLogic, updateGameState]);

  const removePlayer = useCallback((playerId) => {
    gameLogic.removePlayer(playerId);
    updateGameState();
  }, [gameLogic, updateGameState]);

  const startGame = useCallback(() => {
    const result = gameLogic.startGame();
    updateGameState();
    return result;
  }, [gameLogic, updateGameState]);

  const nextTurn = useCallback(() => {
    const result = gameLogic.nextTurn();
    updateGameState();
    return result;
  }, [gameLogic, updateGameState]);

  const movePlayer = useCallback((playerId, diceValue) => {
    const result = gameLogic.movePlayer(playerId, diceValue);
    updateGameState();
    return result;
  }, [gameLogic, updateGameState]);

  const updatePlayerBalance = useCallback((playerId, amount) => {
    const result = gameLogic.updatePlayerBalance(playerId, amount);
    updateGameState();
    return result;
  }, [gameLogic, updateGameState]);

  const clearAllPlayers = useCallback(() => {
    gameLogic.clearAllPlayers();
    updateGameState();
  }, [gameLogic, updateGameState]);

  return {
    gameState,
    addPlayer,
    removePlayer,
    clearAllPlayers,
    startGame,
    nextTurn,
    movePlayer,
    updatePlayerBalance,
    getCurrentPlayer: () => gameLogic.getCurrentPlayer(),
    isCurrentPlayer: (playerId) => gameLogic.isCurrentPlayer(playerId),
    getAllPlayers: () => gameLogic.getAllPlayers()
  };
};
