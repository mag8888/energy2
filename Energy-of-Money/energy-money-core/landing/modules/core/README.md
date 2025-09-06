# 🎯 CORE MODULE - Основная логика игры CASHFLOW

## 📋 Описание

Модуль CORE содержит всю основную игровую логику и управление состоянием. Это сердце игры, которое обеспечивает:

- Управление состоянием игры
- Логику игроков и комнат
- Основной игровой движок
- Иммутабельные обновления состояния

## 🏗️ Архитектура

```
core/
├── index.js          # Главный экспорт модуля
├── gameState.js      # Управление состоянием игры
├── player.js         # Класс игрока
├── room.js           # Класс игровой комнаты
├── gameEngine.js     # Основной движок игры
├── package.json      # Зависимости модуля
└── rollup.config.js  # Конфигурация сборки
```

## 🚀 Использование

```javascript
import { GameEngine, Player, Room, GameState } from '@cashflow/core';

// Создаем игровой движок
const gameEngine = new GameEngine();

// Создаем комнату
const room = gameEngine.createRoom('room123', 4);

// Добавляем игрока
gameEngine.addPlayerToRoom('room123', 'player1', { username: 'Alice' });

// Устанавливаем готовность
gameEngine.setPlayerReady('room123', 'player1', true);
```

## 📦 Экспорты

### **GameEngine**
Основной класс для управления игрой:
- `createRoom(roomId, maxPlayers)` - создать комнату
- `addPlayerToRoom(roomId, playerId, playerData)` - добавить игрока
- `setPlayerReady(roomId, playerId, ready)` - установить готовность
- `processPlayerTurn(roomId, playerId, action, data)` - обработать ход

### **Player**
Класс игрока с методами:
- `getInfo()` - получить информацию
- `setReady(ready)` - установить готовность
- `movePosition(steps)` - переместить по полю
- `changeBalance(amount)` - изменить баланс

### **Room**
Класс игровой комнаты:
- `getInfo()` - получить информацию о комнате
- `addPlayer(playerId, playerData)` - добавить игрока
- `startGame()` - начать игру
- `nextTurn()` - следующий ход

### **GameState**
Управление глобальным состоянием:
- `getState()` - получить текущее состояние
- `updateState(updater)` - обновить состояние
- `addPlayer(playerId, playerData)` - добавить игрока

## 🔒 Изоляция

Этот модуль **полностью изолирован** и не зависит от других модулей:
- ❌ Не импортирует из `@cashflow/ui`
- ❌ Не импортирует из `@cashflow/network`
- ❌ Не импортирует из `@cashflow/data`
- ✅ Может импортировать только `immer` для иммутабельности

## 🧪 Тестирование

```bash
# Запустить тесты модуля
npm run test

# Запустить в режиме разработки
npm run dev

# Собрать модуль
npm run build
```

## 📝 Примеры

### **Создание простой игры**

```javascript
import { GameEngine } from '@cashflow/core';

const engine = new GameEngine();

// Создаем комнату
engine.createRoom('test-room', 2);

// Добавляем игроков
engine.addPlayerToRoom('test-room', 'player1', { username: 'Alice' });
engine.addPlayerToRoom('test-room', 'player2', { username: 'Bob' });

// Устанавливаем готовность
engine.setPlayerReady('test-room', 'player1', true);
engine.setPlayerReady('test-room', 'player2', true);

// Игра автоматически начнется, когда все игроки готовы
```

### **Обработка хода игрока**

```javascript
// Игрок выполняет действие
const result = engine.processPlayerTurn('test-room', 'player1', 'roll_dice', { steps: 5 });

console.log(result);
// {
//   success: true,
//   nextTurn: 'player2',
//   action: 'roll_dice',
//   data: { steps: 5 }
// }
```

## 🔧 Разработка

При разработке этого модуля:

1. **Не добавляйте зависимости** на другие модули CASHFLOW
2. **Используйте только** `immer` для обновления состояния
3. **Тестируйте** все изменения перед интеграцией
4. **Документируйте** новые методы и классы

---

**🎯 CORE модуль - основа всей игры CASHFLOW!**
