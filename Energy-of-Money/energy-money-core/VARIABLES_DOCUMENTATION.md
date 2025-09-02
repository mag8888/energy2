# 📊 Документация переменных проекта Energy of Money

## 🎯 Обзор

Этот документ содержит полное описание всех переменных, констант и состояний в проекте Energy of Money - игры Cashflow. Переменные организованы по модулям и компонентам для удобства навигации.

### ⚠️ Важное примечание о игровом поле

В проекте используется **расширенная версия игрового поля**:

- **76 клеток** (позиции 0-75)
- Используется в `client/src/components/OriginalGameBoard.js`
- 24 клетки внутреннего круга + 52 клетки внешнего квадрата
- Расширенная версия с дополнительными возможностями

---

## 🏗️ Модульная система (Core)

### 🎮 GameEngine (client/src/modules/core/gameEngine.js)

#### Свойства класса:
- **`gameState`** (GameState) - Объект управления состоянием игры
- **`rooms`** (Map) - Коллекция всех игровых комнат (roomId → Room)
- **`players`** (Map) - Коллекция всех игроков (playerId → Player)

### 👤 Player (client/src/modules/core/player.js)

#### Свойства класса:
- **`id`** (string) - Уникальный идентификатор игрока
- **`username`** (string) - Имя пользователя
- **`balance`** (number) - Текущий баланс игрока (по умолчанию 2000)
- **`position`** (number) - Позиция на игровом поле (0-75)
- **`ready`** (boolean) - Статус готовности игрока
- **`assets`** (Array) - Массив активов игрока
- **`liabilities`** (Array) - Массив обязательств игрока
- **`profession`** (Object|null) - Профессия игрока
- **`isFinancialFree`** (boolean) - Статус финансовой свободы

### 🏠 Room (client/src/modules/core/room.js)

#### Свойства класса:
- **`roomId`** (string) - Уникальный идентификатор комнаты
- **`maxPlayers`** (number) - Максимальное количество игроков (по умолчанию 6)
- **`players`** (Map) - Коллекция игроков в комнате (playerId → playerData)
- **`status`** (string) - Статус комнаты ('waiting', 'started', 'finished')
- **`createdAt`** (number) - Время создания комнаты (timestamp)
- **`gameStarted`** (boolean) - Флаг начала игры
- **`currentTurn`** (string|null) - ID текущего игрока
- **`turnTimer`** (number) - Таймер хода в секундах

### 🎯 GameState (client/src/modules/core/gameState.js)

#### Свойства состояния:
- **`players`** (Map) - Коллекция игроков (playerId → playerData)
- **`currentTurn`** (string|null) - ID текущего игрока
- **`gamePhase`** (string) - Фаза игры ('waiting', 'playing', 'finished')
- **`turnTimer`** (number) - Таймер хода
- **`roomId`** (string|null) - ID комнаты
- **`gameStarted`** (boolean) - Флаг начала игры

### 🎲 GameBoard (client/src/modules/game/gameBoard.js)

#### Свойства класса:
- **`roomId`** (string) - ID комнаты
- **`cells`** (Array) - Массив клеток игрового поля (74 клетки)
- **`currentPlayer`** (string|null) - ID текущего игрока

---

## 🎮 Клиентские компоненты

### 🎯 OriginalGameBoard (client/src/components/OriginalGameBoard.js)

#### Состояние мобильного интерфейса:
- **`isMobileMenuOpen`** (boolean) - Открыто ли мобильное меню
- **`theme`** (Object) - Тема Material-UI
- **`isMobile`** (boolean) - Флаг мобильного устройства

#### Состояние игры:
- **`turnOrder`** (Array) - Порядок ходов игроков
- **`currentTurn`** (string|null) - ID текущего игрока
- **`currentTurnIndex`** (number) - Индекс текущего хода
- **`gamePlayers`** (Array) - Массив игроков игры
- **`originalBoard`** (Array) - Исходное игровое поле

#### Состояние кубиков и движения:
- **`diceValue`** (number) - Значение кубика (1-6)
- **`isRolling`** (boolean) - Флаг броска кубика
- **`timerProgress`** (number) - Прогресс таймера (0-100)
- **`turnTimeLeft`** (number) - Оставшееся время хода в секундах (120)
- **`isTurnEnding`** (boolean) - Флаг окончания хода
- **`canRollDice`** (boolean) - Можно ли бросать кубик
- **`diceRolled`** (boolean) - Брошен ли кубик

#### Состояние игроков:
- **`players`** (Array) - Массив игроков для позиций
- **`currentPlayer`** (number) - Индекс текущего игрока
- **`isMoving`** (boolean) - Флаг движения фишки
- **`movingPlayerId`** (string|null) - ID движущегося игрока

#### Состояние модальных окон:
- **`showPlayerModal`** (boolean) - Показать модальное окно игрока
- **`showBankModal`** (boolean) - Показать модальное окно банка
- **`showAssetsModal`** (boolean) - Показать модальное окно активов
- **`selectedPlayer`** (Object|null) - Выбранный игрок
- **`showProfessionDetails`** (boolean) - Показать детали профессии
- **`selectedProfessionForDetails`** (Object|null) - Выбранная профессия

#### Состояние уведомлений:
- **`toast`** (Object) - Объект уведомления:
  - `open` (boolean) - Открыто ли уведомление
  - `message` (string) - Текст сообщения
  - `severity` (string) - Тип уведомления ('success', 'error', 'warning', 'info')

#### Состояние банковских операций:
- **`bankBalance`** (number) - Баланс банка (2500)
- **`transferAmount`** (string) - Сумма перевода
- **`selectedRecipient`** (string) - Выбранный получатель
- **`transferHistory`** (Array) - История переводов

#### Состояние карт:
- **`showMarketCardModal`** (boolean) - Показать модальное окно карты рынка
- **`currentMarketCard`** (Object|null) - Текущая карта рынка
- **`currentPlayerAssets`** (Array) - Активы текущего игрока
- **`showExpenseCardModal`** (boolean) - Показать модальное окно карты расходов
- **`currentExpenseCard`** (Object|null) - Текущая карта расходов

#### Состояние сделок:
- **`showDealModal`** (boolean) - Показать модальное окно сделки
- **`currentDealCard`** (Object|null) - Текущая карта сделки
- **`dealType`** (string|null) - Тип сделки ('small' или 'big')
- **`showDealTypeSelection`** (boolean) - Показать выбор типа сделки
- **`showPassCardModal`** (boolean) - Показать модальное окно передачи карты

#### Состояние благотворительности:
- **`showCharityModal`** (boolean) - Показать модальное окно благотворительности
- **`charityCost`** (number) - Стоимость благотворительности
- **`charityDiceCount`** (number) - Количество кубиков для благотворительности
- **`charityDiceResult`** (number|null) - Результат броска кубика благотворительности

#### Состояние ребенка:
- **`showChildModal`** (boolean) - Показать модальное окно рождения ребенка
- **`childDiceResult`** (number|null) - Результат броска кубика для ребенка

#### Состояние большого круга:
- **`isOnBigCircle`** (boolean) - Находится ли игрок на большом круге
- **`bigCircleBalance`** (number) - Баланс большого круга
- **`bigCirclePassiveIncome`** (number) - Пассивный доход большого круга
- **`bigCircleCells`** (Object) - Клетки большого круга
- **`showBigCircleModal`** (boolean) - Показать модальное окно большого круга
- **`currentBigCircleAction`** (string|null) - Текущее действие большого круга

#### Состояние перерывов:
- **`showBreakModal`** (boolean) - Показать модальное окно перерыва
- **`breakTimeLeft`** (number) - Оставшееся время перерыва
- **`isOnBreak`** (boolean) - Находится ли игра на перерыве

#### Состояние кредитов:
- **`showCreditModal`** (boolean) - Показать модальное окно кредита
- **`creditAmount`** (number) - Сумма кредита
- **`creditInterest`** (number) - Процент по кредиту

#### Состояние передачи активов:
- **`showTransferModal`** (boolean) - Показать модальное окно передачи
- **`selectedAsset`** (Object|null) - Выбранный актив для передачи
- **`selectedTransferPlayer`** (number|null) - Выбранный игрок для передачи

### 🏠 RoomSetup (client/src/components/RoomSetup.js)

#### Состояние комнаты:
- **`roomName`** (string) - Название комнаты
- **`isPublic`** (boolean) - Публичная ли комната
- **`roomPassword`** (string) - Пароль комнаты
- **`professionType`** (string) - Тип профессии ('individual' или 'shared')
- **`sharedProfession`** (Object|null) - Общая профессия для всех игроков

#### Состояние фильтров:
- **`categoryFilter`** (string) - Фильтр по категории ('all')
- **`difficultyFilter`** (string) - Фильтр по сложности ('all')

#### Состояние выбора:
- **`selectedPlayer`** (Object|null) - Выбранный игрок
- **`showPlayerCard`** (boolean) - Показать карточку игрока
- **`showPlayerAssets`** (boolean) - Показать активы игрока
- **`showProfessionDetails`** (boolean) - Показать детали профессии
- **`selectedProfessionForDetails`** (Object|null) - Выбранная профессия для деталей
- **`selectedProfession`** (Object|null) - Выбранная профессия
- **`selectedDream`** (Object|null) - Выбранная мечта

#### Состояние игрока:
- **`isReady`** (boolean) - Готов ли игрок
- **`playerName`** (string) - Имя игрока
- **`isHost`** (boolean) - Является ли игрок хостом

#### Состояние игры:
- **`players`** (Array) - Массив игроков
- **`canStart`** (boolean) - Можно ли начать игру
- **`isConnected`** (boolean) - Подключен ли к серверу

#### Состояние банка:
- **`bankBalance`** (number) - Баланс банка (2500)

---

## 🖥️ Серверная часть

### 🌐 Server (server/index.js)

#### Глобальные переменные:
- **`users`** (Map) - Коллекция пользователей (userId → userData)
- **`usernameToUserId`** (Map) - Маппинг имен пользователей на ID (username → userId)
- **`rooms`** (Map) - Коллекция комнат (roomId → roomData)
- **`breakTimers`** (Map) - Таймеры перерывов (roomId → breakTimer)

#### Константы:
- **`BREAK_INTERVAL`** (number) - Интервал между перерывами (50 минут в миллисекундах)
- **`BREAK_DURATION`** (number) - Длительность перерыва (10 минут в миллисекундах)
- **`PORT`** (number) - Порт сервера (5000 или из переменной окружения)

#### Структура данных пользователя:
```javascript
{
  id: string,           // Уникальный ID пользователя
  username: string,     // Имя пользователя
  email: string,        // Email пользователя
  password: string,     // Пароль (хешированный)
  socketId: string,     // ID сокета
  createdAt: number,    // Время создания (timestamp)
  lastSeen: number      // Время последней активности (timestamp)
}
```

#### Структура данных комнаты:
```javascript
{
  roomId: string,           // ID комнаты
  displayName: string,      // Отображаемое имя
  maxPlayers: number,       // Максимальное количество игроков
  gameDuration: number,     // Длительность игры в минутах
  currentPlayers: Array,    // Массив текущих игроков
  isOnBreak: boolean,       // Находится ли на перерыве
  breakStartTime: number,   // Время начала перерыва
  breakEndTime: number,     // Время окончания перерыва
  nextBreakTime: number,    // Время следующего перерыва
  gameEndTime: number       // Время окончания игры
}
```

### 🗄️ DatabaseManager (server/db-manager.js)

#### Свойства класса:
- **`database`** (Object) - Объект базы данных
- **`config`** (Object) - Конфигурация базы данных

---

## 🎨 Стили и темы

### 🎨 Colors (client/src/styles/colors.js)

#### Основные цвета:
- **`colors.primary`** (Object) - Основной цвет:
  - `main` (string) - '#1976d2'
  - `light` (string) - '#42a5f5'
  - `dark` (string) - '#1565c0'
  - `contrast` (string) - '#ffffff'

- **`colors.secondary`** (Object) - Вторичный цвет:
  - `main` (string) - '#dc004e'
  - `light` (string) - '#ff5983'
  - `dark` (string) - '#9a0036'
  - `contrast` (string) - '#ffffff'

- **`colors.success`** (Object) - Цвет успеха:
  - `main` (string) - '#4caf50'
  - `light` (string) - '#81c784'
  - `dark` (string) - '#388e3c'
  - `contrast` (string) - '#ffffff'

- **`colors.warning`** (Object) - Цвет предупреждения:
  - `main` (string) - '#ff9800'
  - `light` (string) - '#ffb74d'
  - `dark` (string) - '#f57c00'
  - `contrast` (string) - '#000000'

- **`colors.error`** (Object) - Цвет ошибки:
  - `main` (string) - '#f44336'
  - `light` (string) - '#e57373'
  - `dark` (string) - '#d32f2f'
  - `contrast` (string) - '#ffffff'

- **`colors.info`** (Object) - Информационный цвет:
  - `main` (string) - '#2196f3'
  - `light` (string) - '#64b5f6'
  - `dark` (string) - '#1976d2'
  - `contrast` (string) - '#ffffff'

#### Оттенки серого:
- **`colors.gray`** (Object) - Оттенки серого от 50 до 900
- **`colors.light`** (string) - '#f5f5f5'
- **`colors.dark`** (string) - '#212121'
- **`colors.white`** (string) - '#ffffff'
- **`colors.black`** (string) - '#000000'
- **`colors.lightGray`** (string) - '#e0e0e0'
- **`colors.darkGray`** (string) - '#616161'
- **`colors.transparent`** (string) - 'transparent'

#### Цвета текста:
- **`textColors`** (Object) - Цвета для текста (аналогично основным цветам)

#### Цвета границ:
- **`borderColors`** (Object) - Цвета для границ (аналогично основным цветам)

#### Специальные цвета:
- **`cards.player`** (string) - '#4caf50' - Цвет карточки игрока
- **`cards.ready`** (string) - '#2196f3' - Цвет готового игрока

#### Градиенты:
- **`roomSelection.background`** (string) - Градиент для выбора комнаты
- **`roomSetup.background`** (string) - Градиент для настройки комнаты
- **`game.background`** (string) - Градиент для игры

### 🎨 CashflowTheme (client/src/styles/cashflow-theme.js)

#### Основная тема:
- **`CASHFLOW_THEME`** (Object) - Основная тема приложения

#### Цветовая палитра:
- **`CASHFLOW_THEME.colors.primary`** (Object) - Индиго (#6366F1)
- **`CASHFLOW_THEME.colors.secondary`** (Object) - Розовый (#EC4899)
- **`CASHFLOW_THEME.colors.success`** (Object) - Изумрудный (#10B981)
- **`CASHFLOW_THEME.colors.warning`** (Object) - Янтарный (#F59E0B)
- **`CASHFLOW_THEME.colors.error`** (Object) - Красный (#EF4444)

#### Игровое поле:
- **`CASHFLOW_THEME.colors.board`** (Object):
  - `background` (string) - '#0F172A' - Сланцевый темный
  - `surface` (string) - '#1E293B' - Сланцевый
  - `border` (string) - '#334155' - Сланцевый светлый
  - `shadow` (string) - 'rgba(0, 0, 0, 0.25)'

#### Клетки:
- **`CASHFLOW_THEME.colors.cells`** (Object) - Цвета для разных типов клеток:
  - `innerCircle` (Object) - Фиолетовый (#7C3AED)
  - `outerSquare` (Object) - Циан (#06B6D4)
  - `opportunity` (Object) - Изумрудный (#10B981)
  - `payday` (Object) - Янтарный (#F59E0B)
  - `charity` (Object) - Розовый (#EC4899)
  - `doodad` (Object) - Фиолетовый (#8B5CF6)
  - `market` (Object) - Циан (#06B6D4)
  - `child` (Object) - Оранжевый (#F97316)
  - `downsized` (Object) - Серый (#6B7280)

#### Панель управления:
- **`CASHFLOW_THEME.colors.controlPanel`** (Object):
  - `background` (string) - 'rgba(30, 41, 59, 0.95)'
  - `surface` (string) - 'rgba(51, 65, 85, 0.8)'
  - `border` (string) - '#475569'
  - `shadow` (string) - '0 20px 40px rgba(0, 0, 0, 0.3)'
  - `backdrop` (string) - 'blur(20px)'

#### Фишки игроков:
- **`CASHFLOW_THEME.colors.playerTokens`** (Array) - Массив цветов фишек:
  - '#EF4444' - Красный
  - '#3B82F6' - Синий
  - '#10B981' - Изумрудный
  - '#F59E0B' - Янтарный
  - '#8B5CF6' - Фиолетовый
  - '#EC4899' - Розовый
  - '#06B6D4' - Циан
  - '#F97316' - Оранжевый

#### Анимации:
- **`CASHFLOW_THEME.animations.duration`** (Object):
  - `fast` (string) - '0.2s'
  - `normal` (string) - '0.3s'
  - `slow` (string) - '0.5s'
  - `verySlow` (string) - '1s'

- **`CASHFLOW_THEME.animations.easing`** (Object):
  - `easeOut` (string) - 'easeOut'
  - `easeIn` (string) - 'easeIn'
  - `easeInOut` (string) - 'easeInOut'
  - `bounce` (string) - 'easeOut'

#### Эффекты:
- **`CASHFLOW_THEME.effects.shadows`** (Object):
  - `small` (string) - '0 2px 8px rgba(0, 0, 0, 0.1)'
  - `medium` (string) - '0 4px 20px rgba(0, 0, 0, 0.15)'
  - `large` (string) - '0 8px 40px rgba(0, 0, 0, 0.2)'
  - `glow` (string) - '0 0 20px rgba(99, 102, 241, 0.5)'

- **`CASHFLOW_THEME.effects.gradients`** (Object):
  - `primary` (string) - 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
  - `secondary` (string) - 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)'
  - `success` (string) - 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)'
  - `board` (string) - 'radial-gradient(circle, #1E293B 0%, #0F172A 100%)'

#### Адаптивность:
- **`CASHFLOW_THEME.breakpoints`** (Object):
  - `mobile` (string) - '480px'
  - `tablet` (string) - '768px'
  - `desktop` (string) - '1024px'
  - `wide` (string) - '1440px'

### 🎨 ComponentStyles (client/src/styles/component-styles.js)

#### Стили компонентов:
- **`COMPONENT_STYLES`** (Object) - Стили для всех компонентов

#### Игровое поле:
- **`COMPONENT_STYLES.gameBoard`** (Object):
  - `container` (Object) - Стили контейнера игрового поля
  - `innerCircle` (Object) - Стили внутреннего круга
  - `outerSquare` (Object) - Стили внешнего квадрата

#### Клетки:
- **`COMPONENT_STYLES.cells`** (Object):
  - `base` (Object) - Базовые стили клеток
  - `hover` (Object) - Стили при наведении
  - `active` (Object) - Стили активной клетки

#### Панель управления:
- **`COMPONENT_STYLES.controlPanel`** (Object):
  - `container` (Object) - Стили контейнера панели
  - `section` (Object) - Стили секций панели

#### Кнопки:
- **`COMPONENT_STYLES.buttons`** (Object):
  - `primary` (Object) - Стили основных кнопок
  - `hover` (Object) - Стили при наведении

---

## 📊 Системы данных

### 🎴 MarketCards (client/src/data/marketCards.js)

#### Структура карты рынка:
```javascript
{
  id: number,              // Уникальный ID карты
  name: string,            // Название актива
  type: string,            // Тип актива ('stock', 'realEstate', 'business')
  cost: number,            // Стоимость
  downPayment: number,     // Первоначальный взнос
  cashFlow: number,        // Денежный поток
  marketValue: number,     // Рыночная стоимость
  description: string,     // Описание
  maxQuantity: number,     // Максимальное количество
  isDividendStock: boolean // Дивидендная ли акция
}
```

### 💸 ExpenseCards (client/src/data/expenseCards.js)

#### Структура карты расходов:
```javascript
{
  id: number,              // Уникальный ID карты
  name: string,            // Название расхода
  cost: number,            // Стоимость
  monthlyPayment: number,  // Ежемесячный платеж
  description: string,     // Описание
  category: string         // Категория расхода
}
```

### 👔 Professions (client/src/data/professions.js)

#### Структура профессии:
```javascript
{
  id: number,              // Уникальный ID профессии
  name: string,            // Название профессии
  salary: number,          // Зарплата
  taxes: number,           // Налоги
  mortgage: number,        // Ипотека
  schoolLoan: number,      // Кредит на образование
  carLoan: number,         // Автокредит
  creditCard: number,      // Кредитная карта
  retail: number,          // Розничные расходы
  other: number,           // Другие расходы
  totalExpenses: number,   // Общие расходы
  cashFlow: number,        // Денежный поток
  description: string      // Описание профессии
}
```

### 🎯 GameCells (client/src/data/gameCells.js)

#### Структура клетки:
```javascript
{
  id: number,              // Уникальный ID клетки
  name: string,            // Название клетки
  type: string,            // Тип клетки
  description: string,     // Описание
  action: string,          // Действие
  color: string,           // Цвет
  position: number         // Позиция на поле
}
```

---

## 💾 LocalStorage

### 🔑 Ключи хранения:

- **`potok-deneg_currentUser`** (string) - JSON строка с данными текущего пользователя
- **`potok-deneg_username`** (string) - Имя пользователя
- **`potok-deneg_turnOrder`** (string) - JSON строка с порядком ходов
- **`potok-deneg_currentTurn`** (string) - ID текущего игрока
- **`potok-deneg_gamePlayers`** (string) - JSON строка с данными игроков игры

---

## 🌐 Socket.IO события

### 📡 Клиент → Сервер:

- **`register`** - Регистрация пользователя
- **`joinRoom`** - Присоединение к комнате
- **`leaveRoom`** - Выход из комнаты
- **`startGame`** - Начало игры
- **`playerAction`** - Действие игрока
- **`breakRequest`** - Запрос перерыва

### 📡 Сервер → Клиент:

- **`playersList`** - Список игроков
- **`playersUpdate`** - Обновление игроков
- **`gameStart`** - Начало игры
- **`playerAction`** - Действие игрока
- **`breakStarted`** - Начало перерыва
- **`breakEnded`** - Окончание перерыва

---

## 🔧 Константы

### 🎮 Игровые константы:

- **`INITIAL_BALANCE`** (number) - 2000 - Начальный баланс игрока
- **`TURN_TIME`** (number) - 120 - Время хода в секундах (2 минуты)
- **`BREAK_INTERVAL`** (number) - 3000000 - Интервал между перерывами (50 минут)
- **`BREAK_DURATION`** - 600000 - Длительность перерыва (10 минут)
- **`MAX_PLAYERS`** (number) - 6 - Максимальное количество игроков
- **`BOARD_CELLS`** (number) - 76 - Количество клеток на поле
- **`INNER_CIRCLE_CELLS`** (number) - 24 - Количество клеток внутреннего круга
- **`OUTER_SQUARE_CELLS`** (number) - 52 - Количество клеток внешнего квадрата

### 🎨 Цветовые константы:

- **`PRIMARY_COLOR`** (string) - '#6366F1' - Основной цвет
- **`SUCCESS_COLOR`** (string) - '#10B981' - Цвет успеха
- **`WARNING_COLOR`** (string) - '#F59E0B' - Цвет предупреждения
- **`ERROR_COLOR`** (string) - '#EF4444' - Цвет ошибки

### 📱 Адаптивные константы:

- **`MOBILE_BREAKPOINT`** (string) - '480px' - Точка перелома для мобильных
- **`TABLET_BREAKPOINT`** (string) - '768px' - Точка перелома для планшетов
- **`DESKTOP_BREAKPOINT`** (string) - '1024px' - Точка перелома для десктопов

---

## 🔄 Поток данных

### 📊 Состояние игры:

1. **Инициализация**: Загрузка данных из localStorage
2. **Подключение**: Установка Socket.IO соединения
3. **Регистрация**: Создание пользователя на сервере
4. **Комната**: Присоединение к игровой комнате
5. **Игра**: Обработка игровых действий
6. **Сохранение**: Обновление localStorage

### 🎯 Обновление состояния:

- **React useState** - Для локального состояния компонентов
- **Socket.IO** - Для синхронизации между клиентами
- **LocalStorage** - Для персистентности данных
- **Immer** - Для иммутабельных обновлений

---

## 📝 Примечания

1. **Типизация**: Все переменные должны иметь четко определенные типы
2. **Инициализация**: Переменные инициализируются значениями по умолчанию
3. **Валидация**: Входящие данные проверяются на корректность
4. **Очистка**: Память очищается при размонтировании компонентов
5. **Синхронизация**: Состояние синхронизируется между клиентом и сервером
6. **Персистентность**: Важные данные сохраняются в localStorage
7. **Производительность**: Используются мемоизация и оптимизация рендеринга

---

*Документация обновлена: $(date)*
