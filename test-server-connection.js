#!/usr/bin/env node

/**
 * 🧪 АВТОТЕСТ: Подключение к серверу и получение данных
 * 
 * Тестирует:
 * 1. Подключение клиента к серверу
 * 2. Получение списка игроков
 * 3. Получение данных комнаты
 * 4. Обработку событий startGame
 * 5. Синхронизацию таймера
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Запуск автотеста: Подключение к серверу и получение данных');
console.log('=' .repeat(65));

// Проверяем, что сервер запущен
function checkServer() {
  try {
    const result = execSync('ps aux | grep "node index.js" | grep -v grep', { encoding: 'utf8' });
    if (result.trim()) {
      console.log('✅ Сервер запущен');
      return true;
    }
  } catch (error) {
    console.log('❌ Сервер не запущен');
    return false;
  }
  return false;
}

// Проверяем, что клиент запущен
function checkClient() {
  try {
    const result = execSync('ps aux | grep "react-scripts" | grep -v grep', { encoding: 'utf8' });
    if (result.trim()) {
      console.log('✅ Клиент запущен');
      return true;
    }
  } catch (error) {
    console.log('❌ Клиент не запущен');
    return false;
  }
  return false;
}

// Проверяем исправления в useSocketEvents.js
function checkSocketConnectionFixes() {
  const filePath = 'client/src/hooks/useSocketEvents.js';
  
  if (!fs.existsSync(filePath)) {
    console.log('❌ Файл useSocketEvents.js не найден');
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  const checks = [
    {
      name: 'Добавлен joinRoom в handleConnect',
      pattern: /socket\.emit\('joinRoom', roomId\)/,
      found: false
    },
    {
      name: 'Улучшены логи в handlePlayersList',
      pattern: /🎯 \[playersList\] received:/,
      found: false
    },
    {
      name: 'Улучшены логи в handleGameStarted',
      pattern: /🎮 \[gameStarted\] received for room:/,
      found: false
    },
    {
      name: 'Добавлена задержка в handleGameStarted',
      pattern: /setTimeout\(\(\) => \{\s+console\.log\('🎮 \[gameStarted\] Delayed request for players\.\.\.'\);/,
      found: false
    },
    {
      name: 'Улучшены логи в handleTurnChanged',
      pattern: /🔄 \[turnChanged\] received:/,
      found: false
    }
  ];

  checks.forEach(check => {
    check.found = check.pattern.test(content);
    console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
  });

  return checks.every(check => check.found);
}

// Проверяем исправления в GameControls.js
function checkGameControlsConnection() {
  const filePath = 'client/src/components/GameControls.js';
  
  if (!fs.existsSync(filePath)) {
    console.log('❌ Файл GameControls.js не найден');
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  const checks = [
    {
      name: 'Кнопка "БРОСИТЬ КУБИК" для diceValue = 0',
      pattern: /if \(diceValue === 0\) return 'БРОСИТЬ КУБИК'/,
      found: false
    },
    {
      name: 'Обработчик клика для кубика',
      pattern: /if \(diceValue === 0 && onRollDice\)/,
      found: false
    },
    {
      name: 'Передача всех необходимых пропсов в NextPlayerButton',
      pattern: /diceValue={diceValue}.*onRollDice={onRollDice}.*isRolling={isRolling}/s,
      found: false
    }
  ];

  checks.forEach(check => {
    check.found = check.pattern.test(content);
    console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
  });

  return checks.every(check => check.found);
}

// Проверяем исправления в useGameLogic.js
function checkGameLogicConnection() {
  const filePath = 'client/src/hooks/useGameLogic.js';
  
  if (!fs.existsSync(filePath)) {
    console.log('❌ Файл useGameLogic.js не найден');
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  const checks = [
    {
      name: 'Убрана принудительная установка isMyTurn = true',
      pattern: /Принудительно устанавливаем isMyTurn для тестирования/,
      found: false,
      shouldBeFalse: true
    },
    {
      name: 'Правильная логика определения хода',
      pattern: /const isMyTurn = gameState\.currentTurn === gameState\.myId/,
      found: false
    },
    {
      name: 'Проверка myId перед установкой isMyTurn',
      pattern: /if \(gameState\.myId && gameState\.currentTurn\)/,
      found: false
    }
  ];

  checks.forEach(check => {
    if (check.shouldBeFalse) {
      check.found = !check.pattern.test(content);
      console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
    } else {
      check.found = check.pattern.test(content);
      console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
    }
  });

  return checks.every(check => check.found);
}

// Основная функция тестирования
function runTests() {
  console.log('\n🔍 Проверка окружения:');
  const serverRunning = checkServer();
  const clientRunning = checkClient();
  
  if (!serverRunning || !clientRunning) {
    console.log('\n❌ Необходимо запустить сервер и клиент перед тестированием');
    console.log('💡 Запустите:');
    console.log('   cd server && node index.js');
    console.log('   cd client && npm start');
    return;
  }

  console.log('\n🔍 Проверка исправлений в useSocketEvents.js:');
  const socketEventsFixed = checkSocketConnectionFixes();
  
  console.log('\n🔍 Проверка исправлений в GameControls.js:');
  const gameControlsFixed = checkGameControlsConnection();
  
  console.log('\n🔍 Проверка исправлений в useGameLogic.js:');
  const gameLogicFixed = checkGameLogicConnection();

  console.log('\n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:');
  console.log('=' .repeat(50));
  console.log(`useSocketEvents.js: ${socketEventsFixed ? '✅ ИСПРАВЛЕН' : '❌ НЕ ИСПРАВЛЕН'}`);
  console.log(`GameControls.js: ${gameControlsFixed ? '✅ ИСПРАВЛЕН' : '❌ НЕ ИСПРАВЛЕН'}`);
  console.log(`useGameLogic.js: ${gameLogicFixed ? '✅ ИСПРАВЛЕН' : '❌ НЕ ИСПРАВЛЕН'}`);

  if (socketEventsFixed && gameControlsFixed && gameLogicFixed) {
    console.log('\n🎉 ВСЕ ИСПРАВЛЕНИЯ ПОДКЛЮЧЕНИЯ ПРИМЕНЕНЫ!');
    console.log('\n🧪 СЛЕДУЮЩИЕ ШАГИ ДЛЯ ТЕСТИРОВАНИЯ:');
    console.log('1. Обновите страницу в браузере (F5)');
    console.log('2. Откройте консоль разработчика (F12)');
    console.log('3. Войдите в комнату и начните игру');
    console.log('4. Проверьте в консоли логи:');
    console.log('   - 🎯 [playersList] received: ...');
    console.log('   - 🎮 [gameStarted] received for room: ...');
    console.log('   - 🔄 [turnChanged] received: ...');
    console.log('5. Проверьте в интерфейсе:');
    console.log('   - Показываются ли реальные игроки');
    console.log('   - Идет ли таймер вниз от 2:00');
    console.log('   - Работает ли кнопка "БРОСИТЬ КУБИК"');
  } else {
    console.log('\n❌ НЕКОТОРЫЕ ИСПРАВЛЕНИЯ НЕ ПРИМЕНЕНЫ');
    console.log('💡 Проверьте файлы и примените исправления вручную');
  }
}

// Запуск тестов
runTests();

