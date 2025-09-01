// 🎮 GameManager - Управление игровой логикой и socket соединениями
import React, { useEffect, useCallback } from 'react';
import socket from '../socket';
import { useGameLogic } from './GameLogic';

export const useGameManager = (roomId, playerData) => {
  const {
    gameState,
    addPlayer,
    removePlayer,
    clearAllPlayers,
    startGame,
    nextTurn,
    movePlayer,
    updatePlayerBalance,
    getCurrentPlayer,
    isCurrentPlayer,
    getAllPlayers
  } = useGameLogic();

  // Socket события для работы с игрой
  useEffect(() => {
    if (!roomId || !playerData) return;

    // Присоединяемся к комнате
    socket.emit('joinRoom', roomId, playerData);
    
    // Слушаем подтверждение присоединения к комнате
    socket.on('roomJoined', (data) => {
      console.log('🎮 [GameManager] Успешно присоединились к комнате:', data);
    });
    
    // Слушаем ошибки присоединения к комнате
    socket.on('joinRoomError', (error) => {
      console.error('🎮 [GameManager] Ошибка присоединения к комнате:', error);
    });

    // Слушаем все события для отладки
    socket.onAny((eventName, ...args) => {
      console.log(`🎮 [GameManager] Получено событие ${eventName}:`, args);
    });

    // Слушаем обновления игроков
    socket.on('playersUpdate', (updatedPlayers) => {
      console.log('🎮 [GameManager] Получены обновленные игроки:', updatedPlayers);
      console.log('🎮 [GameManager] Количество игроков:', updatedPlayers.length);
      console.log('🎮 [GameManager] Тип данных:', typeof updatedPlayers);
      console.log('🎮 [GameManager] Это массив?', Array.isArray(updatedPlayers));
      
      // Очищаем всех старых игроков
      clearAllPlayers();
      
      // Добавляем новых игроков
      updatedPlayers.forEach((playerData, index) => {
        console.log(`🎮 [GameManager] Обрабатываем игрока ${index + 1}:`, playerData);
        
        // Преобразуем данные игрока для совместимости с GameLogic
        const transformedPlayerData = {
          id: playerData.socketId || playerData.id, // Используем socketId как id
          username: playerData.username,
          socketId: playerData.socketId,
          professionId: playerData.professionId || null,
          ready: playerData.ready || false
        };
        
        console.log(`🎮 [GameManager] Преобразованные данные игрока:`, transformedPlayerData);
        
        // Добавляем игрока с профессией, если она есть
        addPlayer(transformedPlayerData, transformedPlayerData.professionId);
      });
      
      console.log('🎮 [GameManager] Все игроки после обновления:', getAllPlayers());
    });

    // Слушаем начало игры
    socket.on('gameStarted', (gameData) => {
      console.log('🎮 [GameManager] Игра началась:', gameData);
      console.log('🎮 [GameManager] Данные игры:', {
        currentPlayerId: gameData.currentPlayerId,
        playerQueue: gameData.playerQueue,
        gameStarted: gameData.gameStarted
      });
      startGame();
      
      // Обновляем текущего игрока
      setTimeout(() => {
        console.log('🎮 [GameManager] Текущий игрок после старта игры:', getCurrentPlayer());
        console.log('🎮 [GameManager] Все игроки после старта игры:', getAllPlayers());
      }, 100);
    });

    // Слушаем смену хода
    socket.on('turnChanged', (turnData) => {
      console.log('🎮 [GameManager] Смена хода:', turnData);
      nextTurn();
    });

    // Слушаем обновления баланса
    socket.on('playerBalanceUpdated', (balanceData) => {
      console.log('🎮 [GameManager] Обновление баланса:', balanceData);
      updatePlayerBalance(balanceData.playerId, balanceData.amount);
    });

    // Слушаем движение игрока
    socket.on('playerMoved', (moveData) => {
      console.log('🎮 [GameManager] Игрок походил:', moveData);
      movePlayer(moveData.playerId, moveData.diceValue);
    });

    // Слушаем готовность игрока
    socket.on('playerReady', (readyData) => {
      console.log('🎮 [GameManager] Игрок готов:', readyData);
      // Обновляем статус готовности игрока и добавляем профессию
      if (readyData.playerId && readyData.professionId) {
        // Находим игрока и обновляем его профессию
        const allPlayers = getAllPlayers();
        const player = allPlayers.find(p => p.id === readyData.playerId);
        if (player) {
          console.log('🎮 [GameManager] Обновляем профессию игрока:', player.username || player.name, '->', readyData.professionId);
          // Здесь можно добавить логику обновления профессии
        }
      }
    });
    
    // Слушаем статус комнаты
    socket.on('roomStatus', (data) => {
      console.log('🏠 [GameManager] Получен статус комнаты:', data);
      
      // Если в данных комнаты есть игроки, обновляем их
      if (data.room && data.room.currentPlayers && Array.isArray(data.room.currentPlayers)) {
        console.log('🏠 [GameManager] Обновляем игроков из roomStatus:', data.room.currentPlayers);
        
        // Очищаем всех старых игроков
        clearAllPlayers();
        
        // Добавляем новых игроков
        data.room.currentPlayers.forEach((playerData, index) => {
          console.log(`🏠 [GameManager] Обрабатываем игрока ${index + 1}:`, playerData);
          
          // Преобразуем данные игрока для совместимости с GameLogic
          const transformedPlayerData = {
            id: playerData.socketId || playerData.id, // Используем socketId как id
            username: playerData.username,
            socketId: playerData.socketId,
            professionId: playerData.professionId || null,
            ready: playerData.ready || false
          };
          
          console.log(`🏠 [GameManager] Преобразованные данные игрока:`, transformedPlayerData);
          
          // Добавляем игрока с профессией, если она есть
          addPlayer(transformedPlayerData, transformedPlayerData.professionId);
        });
        
        console.log('🏠 [GameManager] Все игроки после обновления из roomStatus:', getAllPlayers());
      }
    });

    return () => {
      socket.off('roomJoined');
      socket.off('joinRoomError');
      socket.off('playersUpdate');
      socket.off('gameStarted');
      socket.off('turnChanged');
      socket.off('playerBalanceUpdated');
      socket.off('playerMoved');
      socket.off('playerReady');
      socket.off('roomStatus');
    };
  }, [roomId, playerData, addPlayer, clearAllPlayers, startGame, nextTurn, movePlayer, updatePlayerBalance]);

  // Функции для отправки событий на сервер
  const sendPlayerReady = useCallback((professionId) => {
    socket.emit('playerReady', {
      roomId,
      playerId: playerData?.id,
      professionId
    });
  }, [roomId, playerData]);

  const sendRollDice = useCallback((diceValue) => {
    socket.emit('playerRolledDice', {
      roomId,
      playerId: playerData?.id,
      diceValue
    });
  }, [roomId, playerData]);

  const sendEndTurn = useCallback(() => {
    socket.emit('playerEndTurn', {
      roomId,
      playerId: playerData?.id
    });
  }, [roomId, playerData]);

  const sendStartGame = useCallback(() => {
    socket.emit('startGame', {
      roomId
    });
  }, [roomId]);

  const sendPlayerAction = useCallback((actionType, actionData) => {
    socket.emit('playerAction', {
      roomId,
      playerId: playerData?.id,
      actionType,
      actionData
    });
  }, [roomId, playerData]);

  return {
    gameState,
    getCurrentPlayer,
    isCurrentPlayer,
    getAllPlayers,
    sendPlayerReady,
    sendRollDice,
    sendEndTurn,
    sendStartGame,
    sendPlayerAction
  };
};
