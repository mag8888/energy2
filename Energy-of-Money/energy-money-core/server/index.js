const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

// Импортируем данные о профессиях
const PROFESSIONS = [
  { id: 1, name: 'Врач', icon: '👨‍⚕️' },
  { id: 2, name: 'Курьер', icon: '🚚' },
  { id: 3, name: 'Программист', icon: '💻' },
  { id: 4, name: 'Учитель', icon: '👨‍🏫' },
  { id: 5, name: 'Инженер', icon: '⚙️' },
  { id: 6, name: 'Дизайнер', icon: '🎨' },
  { id: 7, name: 'Менеджер', icon: '👔' },
  { id: 8, name: 'Продавец', icon: '🛒' }
];

// Определяем порт
const PORT = process.env.PORT || 5000;

// Создаем Express приложение
const app = express();
const server = http.createServer(app);

// Настройка CORS
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Создаем Socket.IO сервер
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"]
  }
});

// Глобальное хранилище пользователей (в памяти)
const users = new Map(); // userId -> userData
const usernameToUserId = new Map(); // username -> userId
const rooms = new Map(); // roomId -> roomData

// Функции для персистентного хранения
const fs = require('fs');
const roomsFilePath = path.join(__dirname, 'rooms.json');
const usersFilePath = path.join(__dirname, 'users.json');

// Загрузка комнат из файла
const loadRooms = () => {
  try {
    if (fs.existsSync(roomsFilePath)) {
      const data = fs.readFileSync(roomsFilePath, 'utf8');
      const roomsData = JSON.parse(data);
      rooms.clear();
      for (const [roomId, roomData] of Object.entries(roomsData)) {
        rooms.set(roomId, roomData);
      }
      console.log(`🏠 [SERVER] Загружено ${rooms.size} комнат из файла`);
    }
  } catch (error) {
    console.error('❌ [SERVER] Ошибка загрузки комнат:', error);
  }
};

// Сохранение комнат в файл
const saveRooms = () => {
  try {
    const roomsData = {};
    for (const [roomId, roomData] of rooms.entries()) {
      roomsData[roomId] = roomData;
    }
    fs.writeFileSync(roomsFilePath, JSON.stringify(roomsData, null, 2));
    console.log(`🏠 [SERVER] Сохранено ${rooms.size} комнат в файл`);
  } catch (error) {
    console.error('❌ [SERVER] Ошибка сохранения комнат:', error);
  }
};

// Загрузка пользователей из файла
const loadUsers = () => {
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf8');
      const usersData = JSON.parse(data);
      users.clear();
      usernameToUserId.clear();
      
      for (const [userId, userData] of Object.entries(usersData)) {
        users.set(userId, userData);
        usernameToUserId.set(userData.username.toLowerCase(), userId);
      }
      console.log(`👤 [SERVER] Загружено ${users.size} пользователей из файла`);
    }
  } catch (error) {
    console.error('❌ [SERVER] Ошибка загрузки пользователей:', error);
  }
};

// Функция для получения названия профессии по ID
const getProfessionName = (professionId) => {
  const profession = PROFESSIONS.find(p => p.id === professionId);
  return profession ? profession.name : 'Неизвестная профессия';
};

// Функция для преобразования данных игроков с professionId в profession
const transformPlayersData = (players) => {
  return players.map(player => ({
    ...player,
    profession: player.professionId ? getProfessionName(player.professionId) : null
  }));
};

// Сохранение пользователей в файл
const saveUsers = () => {
  try {
    const usersData = {};
    for (const [userId, userData] of users.entries()) {
      usersData[userId] = userData;
    }
    console.log(`👤 [SERVER] Сохраняем ${users.size} пользователей:`, Array.from(users.keys()));
    console.log(`👤 [SERVER] Данные пользователей:`, usersData);
    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
    console.log(`👤 [SERVER] Сохранено ${users.size} пользователей в файл`);
  } catch (error) {
    console.error('❌ [SERVER] Ошибка сохранения пользователей:', error);
  }
};

// Система перерывов
const breakTimers = new Map(); // roomId -> breakTimer
const BREAK_INTERVAL = 50 * 60 * 1000; // 50 минут в миллисекундах
const BREAK_DURATION = 10 * 60 * 1000; // 10 минут в миллисекундах

// Игровая логика
const gameStates = new Map(); // roomId -> gameState
const turnTimers = new Map(); // roomId -> turnTimer
const TURN_DURATION = 120; // 2 минуты на ход

// Функция для генерации уникального User ID
const generateUserId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `user_${timestamp}_${randomStr}`;
};

// Функция для проверки уникальности username
const isUsernameUnique = (username) => {
  return !usernameToUserId.has(username.toLowerCase());
};

// Функция для регистрации пользователя
const registerUser = (username, email, password, socketId) => {
  const userId = generateUserId();
  const userData = {
    id: userId,
    username: username,
    email: email,
    password: password,
    socketId: socketId,
    createdAt: Date.now(),
    lastSeen: Date.now()
  };
  
  console.log(`👤 [SERVER] Регистрируем пользователя:`, { username, email, userId });
  console.log(`👤 [SERVER] Размер users до добавления:`, users.size);
  users.set(userId, userData);
  usernameToUserId.set(username.toLowerCase(), userId);
  console.log(`👤 [SERVER] Размер users после добавления:`, users.size);
  
  // Сохраняем пользователей в файл
  saveUsers();
  
  console.log(`👤 [SERVER] User registered: ${username} (${email}) (ID: ${userId})`);
  return userData;
};

// Функция для поиска пользователя по email
const getUserByEmail = (email) => {
  console.log(`🔍 [SERVER] Searching for user with email: ${email}`);
  
  for (const [userId, userData] of users.entries()) {
    if (userData.email.toLowerCase() === email.toLowerCase()) {
      console.log(`✅ [SERVER] User found:`, { id: userData.id, username: userData.username, email: userData.email });
      return userData;
    }
  }
  
  console.log(`❌ [SERVER] User not found with email: ${email}`);
  return null;
};

// Функция для поиска пользователя по username
const getUserByUsername = (username) => {
  if (!username || typeof username !== 'string') {
    console.log(`❌ [SERVER] Invalid username provided:`, username);
    return null;
  }
  
  const userId = usernameToUserId.get(username.toLowerCase());
  if (userId) {
    return users.get(userId);
  }
  
  return null;
};

// Функция для обновления socketId пользователя
const updateUserSocketId = (userId, socketId) => {
  console.log(`🔄 [SERVER] updateUserSocketId called: userId=${userId}, socketId=${socketId}`);
  const user = users.get(userId);
  if (user) {
    user.socketId = socketId;
    user.lastSeen = Date.now();
    // Сохраняем пользователей в файл
    saveUsers();
  }
};

// 🎮 Игровая логика
const initializeGameState = (roomId) => {
  const gameState = {
    players: new Map(),
    currentPlayerIndex: 0,
    playerQueue: [],
    gameStarted: false,
    turnTimeLeft: TURN_DURATION,
    currentPlayerId: null,
    turnTimer: null
  };
  gameStates.set(roomId, gameState);
  return gameState;
};

const getGameState = (roomId) => {
  return gameStates.get(roomId) || initializeGameState(roomId);
};

const addPlayerToGame = (roomId, playerData, professionId) => {
  const gameState = getGameState(roomId);
  const player = {
    id: playerData.id,
    username: playerData.username,
    socketId: playerData.socketId,
    position: 1,
    color: getPlayerColor(playerData.id),
    professionId: professionId,
    balance: 1000, // Будет обновлено из профессии
    ready: false,
    isOnBigCircle: false,
    assets: [],
    children: 0,
    loans: {}
  };
  
  gameState.players.set(player.id, player);
  gameState.playerQueue.push(player.id);
  
  return player;
};

const getPlayerColor = (playerId) => {
  const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  return colors[playerId % colors.length];
};

const startGame = (roomId) => {
  const gameState = getGameState(roomId);
  if (gameState.playerQueue.length < 2) {
    throw new Error('Для начала игры нужно минимум 2 игрока');
  }
  
  gameState.gameStarted = true;
  gameState.currentPlayerIndex = 0;
  gameState.currentPlayerId = gameState.playerQueue[0];
  gameState.turnTimeLeft = TURN_DURATION;
  
  // Запускаем таймер хода
  startTurnTimer(roomId);
  
  return {
    gameStarted: true,
    playerQueue: gameState.playerQueue,
    currentPlayerId: gameState.currentPlayerId,
    currentPlayerIndex: gameState.currentPlayerIndex
  };
};

const nextTurn = (roomId) => {
  const gameState = getGameState(roomId);
  if (!gameState.gameStarted) return null;
  
  // Останавливаем текущий таймер
  if (gameState.turnTimer) {
    clearInterval(gameState.turnTimer);
  }
  
  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.playerQueue.length;
  gameState.currentPlayerId = gameState.playerQueue[gameState.currentPlayerIndex];
  gameState.turnTimeLeft = TURN_DURATION;
  
  // Запускаем новый таймер
  startTurnTimer(roomId);
  
  return {
    currentPlayerId: gameState.currentPlayerId,
    currentPlayerIndex: gameState.currentPlayerIndex,
    turnTimeLeft: gameState.turnTimeLeft
  };
};

const startTurnTimer = (roomId) => {
  const gameState = getGameState(roomId);
  
  gameState.turnTimer = setInterval(() => {
    gameState.turnTimeLeft--;
    
    // Отправляем обновление времени всем игрокам в комнате
    io.to(roomId).emit('turnTimeUpdate', {
      turnTimeLeft: gameState.turnTimeLeft
    });
    
    // Если время вышло, автоматически переходим к следующему ходу
    if (gameState.turnTimeLeft <= 0) {
      const nextTurnData = nextTurn(roomId);
      io.to(roomId).emit('turnChanged', nextTurnData);
    }
  }, 1000);
};

const movePlayer = (roomId, playerId, diceValue) => {
  const gameState = getGameState(roomId);
  const player = gameState.players.get(playerId);
  if (!player) return null;
  
  const newPosition = player.position + diceValue;
  
  // Логика перехода на большой круг
  if (!player.isOnBigCircle && newPosition > 24) {
    player.isOnBigCircle = true;
    player.position = newPosition - 24;
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
};

const updatePlayerBalance = (roomId, playerId, amount) => {
  const gameState = getGameState(roomId);
  const player = gameState.players.get(playerId);
  if (player) {
    player.balance = Math.max(0, player.balance + amount);
    return player.balance;
  }
  return null;
};



// Функция для запуска системы перерывов в комнате
const startBreakSystem = (roomId) => {
  console.log(`⏰ [SERVER] Starting break system for room: ${roomId}`);
  
  const room = rooms.get(roomId);
  if (!room) {
    console.log(`❌ [SERVER] Room not found for break system: ${roomId}`);
    return;
  }
  
  // Устанавливаем время начала игры
  room.gameStartTime = Date.now();
  room.gameEndTime = room.gameStartTime + (room.gameDuration * 60 * 1000); // Конвертируем минуты в миллисекунды
  room.nextBreakTime = room.gameStartTime + BREAK_INTERVAL;
  
  // Проверяем, есть ли время для перерыва
  if (room.nextBreakTime >= room.gameEndTime) {
    console.log(`⏰ [SERVER] Game duration too short for breaks, skipping break system for room: ${roomId}`);
    return;
  }
  
  // Запускаем таймер для первого перерыва
  const breakTimer = setTimeout(() => {
    startBreak(roomId);
  }, BREAK_INTERVAL);
  
  breakTimers.set(roomId, breakTimer);
  
  console.log(`⏰ [SERVER] Break system started for room ${roomId}. Next break at: ${new Date(room.nextBreakTime).toLocaleString()}`);
};

// Функция для начала перерыва
const startBreak = (roomId) => {
  console.log(`☕ [SERVER] Starting break for room: ${roomId}`);
  
  const room = rooms.get(roomId);
  if (!room) {
    console.log(`❌ [SERVER] Room not found for break: ${roomId}`);
    return;
  }
  
  // Устанавливаем статус перерыва
  room.isOnBreak = true;
  room.breakStartTime = Date.now();
  room.breakEndTime = room.breakStartTime + BREAK_DURATION;
  
  // Уведомляем всех игроков о начале перерыва
  io.to(roomId).emit('breakStarted', {
    breakEndTime: room.breakEndTime,
    duration: BREAK_DURATION
  });
  
  console.log(`☕ [SERVER] Break started for room ${roomId}. End time: ${new Date(room.breakEndTime).toLocaleString()}`);
  
  // Запускаем таймер для окончания перерыва
  const breakEndTimer = setTimeout(() => {
    endBreak(roomId);
  }, BREAK_DURATION);
  
  // Проверяем, не превышает ли время окончания перерыва время окончания игры
  if (room.breakEndTime > room.gameEndTime) {
    console.log(`⏰ [SERVER] Break would exceed game end time, adjusting break duration for room: ${roomId}`);
    const adjustedDuration = room.gameEndTime - room.breakStartTime;
    clearTimeout(breakEndTimer);
    setTimeout(() => {
      endBreak(roomId);
    }, adjustedDuration);
  }
  
  // Сохраняем таймер окончания перерыва
  breakTimers.set(`${roomId}_breakEnd`, breakEndTimer);
};

// Функция для окончания перерыва
const endBreak = (roomId) => {
  console.log(`🎮 [SERVER] Ending break for room: ${roomId}`);
  
  const room = rooms.get(roomId);
  if (!room) {
    console.log(`❌ [SERVER] Room not found for break end: ${roomId}`);
    return;
  }
  
  // Убираем статус перерыва
  room.isOnBreak = false;
  room.breakStartTime = null;
  room.breakEndTime = null;
  
  // Устанавливаем время следующего перерыва
  const now = Date.now();
  room.nextBreakTime = now + BREAK_INTERVAL;
  
  // Проверяем, не превышает ли следующий перерыв время окончания игры
  if (room.nextBreakTime > room.gameEndTime) {
    console.log(`⏰ [SERVER] Next break would exceed game end time, stopping break system for room: ${roomId}`);
    stopBreakSystem(roomId);
    return;
  }
  
  // Уведомляем всех игроков об окончании перерыва
  io.to(roomId).emit('breakEnded', {
    nextBreakTime: room.nextBreakTime
  });
  
  console.log(`🎮 [SERVER] Break ended for room ${roomId}. Next break at: ${new Date(room.nextBreakTime).toLocaleString()}`);
  
  // Запускаем таймер для следующего перерыва
  const nextBreakTimer = setTimeout(() => {
    startBreak(roomId);
  }, BREAK_INTERVAL);
  
  breakTimers.set(roomId, nextBreakTimer);
};

// Функция для остановки системы перерывов
const stopBreakSystem = (roomId) => {
  console.log(`⏹️ [SERVER] Stopping break system for room: ${roomId}`);
  
  // Очищаем таймеры
  const breakTimer = breakTimers.get(roomId);
  if (breakTimer) {
    clearTimeout(breakTimer);
    breakTimers.delete(roomId);
  }
  
  const breakEndTimer = breakTimers.get(`${roomId}_breakEnd`);
  if (breakEndTimer) {
    clearTimeout(breakEndTimer);
    breakTimers.delete(`${roomId}_breakEnd`);
  }
  
  // Сбрасываем статус перерыва в комнате
  const room = rooms.get(roomId);
  if (room) {
    room.isOnBreak = false;
    room.breakStartTime = null;
    room.breakEndTime = null;
    room.nextBreakTime = null;
  }
  
  console.log(`⏹️ [SERVER] Break system stopped for room: ${roomId}`);
};

// Создаем дефолтную комнату
const createDefaultRoom = () => {
  const roomId = 'lobby';
  rooms.set(roomId, {
    roomId: roomId,
    displayName: 'Лобби',
    maxPlayers: 1,
    gameDuration: 180, // 3 часа по умолчанию
    currentPlayers: [],
    status: 'waiting',
    password: '',
    hostId: null,
    createdAt: Date.now()
  });
  console.log(`🏠 [SERVER] Default room created: ${roomId}`);
};

// Функция для получения списка комнат
const getRoomsList = () => {
  const roomsList = Array.from(rooms.values()).map(room => {
    // Находим имя хоста по hostId
    let hostUsername = 'Неизвестно';
    if (room.hostId) {
      console.log(`🔍 [SERVER] Looking for host username for room ${room.roomId}, hostId: ${room.hostId}`);
      console.log(`🔍 [SERVER] Available users:`, Array.from(users.values()).map(u => ({ username: u.username, socketId: u.socketId })));
      console.log(`🔍 [SERVER] Room currentPlayers:`, room.currentPlayers.map(p => ({ username: p.username, socketId: p.socketId })));
      
      // Ищем пользователя по socketId в глобальном хранилище
      for (const [userId, userData] of users.entries()) {
        if (userData.socketId === room.hostId) {
          hostUsername = userData.username;
          console.log(`✅ [SERVER] Found host username in users: ${hostUsername}`);
          break;
        }
      }
      
      // Если не нашли в users, ищем в currentPlayers комнаты
      if (hostUsername === 'Неизвестно') {
        const hostPlayer = room.currentPlayers.find(p => p.socketId === room.hostId);
        if (hostPlayer) {
          hostUsername = hostPlayer.username;
          console.log(`✅ [SERVER] Found host username in currentPlayers: ${hostUsername}`);
        } else {
          console.log(`❌ [SERVER] Host player not found in currentPlayers for room ${room.roomId}`);
          // Попробуем найти по id (если hostId это userId, а не socketId)
          for (const [userId, userData] of users.entries()) {
            if (userId === room.hostId) {
              hostUsername = userData.username;
              console.log(`✅ [SERVER] Found host username by userId: ${hostUsername}`);
              break;
            }
          }
        }
      }
    }
    
    return {
      id: room.roomId,
      roomId: room.roomId,
      displayName: room.displayName,
      maxPlayers: room.maxPlayers,
      gameDuration: room.gameDuration || 180, // Время игры в минутах
      currentPlayers: room.currentPlayers,
      status: room.status,
      hostId: room.hostId,
      hostUsername: hostUsername, // Добавляем имя хоста
      password: room.password,
      createdAt: room.createdAt // Добавляем время создания для сортировки
    };
  })
  .sort((a, b) => b.createdAt - a.createdAt); // Сортируем по времени создания (новые в начало)
  
  console.log(`📊 [SERVER] getRoomsList: ${roomsList.length} rooms`);
  return roomsList;
};

// Создаем дефолтную комнату при запуске (если нет комнат)
if (rooms.size === 0) {
createDefaultRoom();
}

// Функция для проверки состояния комнаты
const checkRoomStatus = (roomId) => {
  const room = rooms.get(roomId);
  if (!room) {
    console.log(`❌ [SERVER] Комната ${roomId} не найдена`);
    return null;
  }
  
  console.log(`🏠 [SERVER] Состояние комнаты ${roomId}:`);
  console.log(`   - Название: ${room.displayName}`);
  console.log(`   - Максимум игроков: ${room.maxPlayers}`);
  console.log(`   - Текущих игроков: ${room.currentPlayers.length}`);
  console.log(`   - Статус: ${room.status}`);
  console.log(`   - Игроки:`, room.currentPlayers.map(p => ({ username: p.username, socketId: p.socketId, ready: p.ready })));
  
  return room;
};

// Socket.IO обработчики
io.on('connection', (socket) => {
  console.log(`🔌 [SERVER] New client connected: ${socket.id}`);
  
  // Отправляем начальный список комнат
  socket.emit('roomsList', getRoomsList());
  
  // Аутентификация пользователя
  socket.on('authenticateUser', (username, email, password, callback) => {
    console.log(`🔐 [SERVER] authenticateUser event received from socket ${socket.id}`);
    
    try {
      if (!email || !email.trim()) {
        callback({ success: false, error: 'Email обязателен' });
        return;
      }
      
      const trimmedEmail = email.trim();
      const trimmedPassword = password ? password.trim() : '';
      
      // Ищем пользователя по email
      const existingUser = getUserByEmail(trimmedEmail);
      
      if (existingUser) {
        // Пользователь найден - выполняем вход
        console.log(`🔄 [SERVER] Updating socketId for existing user: ${existingUser.username}`);
        updateUserSocketId(existingUser.id, socket.id);
        
        // Проверяем пароль для существующих пользователей
        if (existingUser.password && existingUser.password !== trimmedPassword) {
          callback({ success: false, error: 'Неверный пароль' });
          return;
        }
        
        callback({ 
          success: true, 
          isLogin: true,
          userData: {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email
          }
        });
        
        console.log(`✅ [SERVER] User logged in: ${existingUser.username}`);
      } else {
        // Пользователь не найден - регистрируем нового
        if (!username || !username.trim()) {
          callback({ success: false, error: 'Имя обязательно для регистрации' });
          return;
        }
        
        const trimmedUsername = username.trim();
        
        // Проверяем уникальность username
        if (!isUsernameUnique(trimmedUsername)) {
          callback({ success: false, error: 'Пользователь с таким именем уже существует' });
          return;
        }
        
        // Регистрируем пользователя
        const userData = registerUser(trimmedUsername, trimmedEmail, trimmedPassword, socket.id);
        
        callback({ 
          success: true, 
          isLogin: false,
          userData: {
            id: userData.id,
            username: userData.username,
            email: userData.email
          }
        });
        
        console.log(`✅ [SERVER] User registered successfully: ${trimmedUsername}`);
      }
    } catch (error) {
      console.error(`❌ [SERVER] Error in authenticateUser:`, error);
      callback({ success: false, error: 'Внутренняя ошибка сервера' });
    }
  });
  
  // Проверка уникальности username
  socket.on('checkUsernameUnique', (username, callback) => {
    try {
      const isUnique = isUsernameUnique(username);
      callback({ unique: isUnique });
      console.log(`🔍 [SERVER] Username uniqueness check for "${username}": ${isUnique ? 'unique' : 'already exists'}`);
    } catch (error) {
      console.error(`❌ [SERVER] Error checking username uniqueness:`, error);
      callback({ unique: false, error: 'Ошибка проверки уникальности' });
    }
  });
  
  // Проверка существования пользователя по email
  socket.on('checkUserExists', (email, callback) => {
    try {
      console.log(`🔍 [SERVER] Checking if user exists with email: ${email}`);
      const existingUser = getUserByEmail(email);
      const exists = existingUser !== null;
      console.log(`🔍 [SERVER] User exists: ${exists}`);
      callback({ exists });
    } catch (error) {
      console.error(`❌ [SERVER] Error checking user existence:`, error);
      callback({ exists: false, error: 'Ошибка проверки пользователя' });
    }
  });
  
  // Получение списка комнат
  socket.on('getRoomsList', () => {
    console.log('🏠 [SERVER] getRoomsList requested by socket:', socket.id);
    const roomsList = getRoomsList();
    socket.emit('roomsList', roomsList);
    console.log('🏠 [SERVER] Sent rooms list:', roomsList.length, 'rooms');
  });
  
  // Получение списка комнат (альтернативное название)
  socket.on('getRooms', () => {
    console.log('🏠 [SERVER] getRooms requested by socket:', socket.id);
    const roomsList = getRoomsList();
    socket.emit('roomsList', roomsList);
    console.log('🏠 [SERVER] Sent rooms list:', roomsList.length, 'rooms');
  });
  
  // Проверка состояния комнаты
  socket.on('checkRoomStatus', (roomId) => {
    console.log(`🔍 [SERVER] checkRoomStatus requested for room: ${roomId}`);
    console.log(`🔍 [SERVER] Socket ID: ${socket.id}`);
    console.log(`🔍 [SERVER] Available rooms:`, Array.from(rooms.keys()));
    
    const room = checkRoomStatus(roomId);
    const roomFound = !!room;
    console.log(`🔍 [SERVER] Room found:`, roomFound ? 'YES' : 'NO');
    
    socket.emit('roomStatus', { roomId, room, roomFound });
    console.log(`🔍 [SERVER] roomStatus event sent to socket: ${socket.id}`);
    
    // Также отправляем обновление игроков
    if (room && room.currentPlayers) {
      socket.emit('playersUpdate', transformPlayersData(room.currentPlayers));
      console.log(`🔍 [SERVER] playersUpdate event sent to socket: ${socket.id}`);
    }
  });
  
  // Создание комнаты
  socket.on('createRoom', (roomData) => {
    console.log('🏠 [SERVER] createRoom requested:', roomData);
    
    try {
      const { name, password, professionType, profession, maxPlayers, gameDuration, sharedProfession } = roomData;
      
      // Генерируем уникальный ID комнаты
      const uniqueRoomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Проверяем, что имя комнаты указано
      if (!name || !name.trim()) {
        socket.emit('roomCreationError', { 
          success: false, 
          error: 'Название комнаты обязательно!' 
        });
        return;
      }

      // Проверяем количество игроков (1-10)
      if (maxPlayers < 1 || maxPlayers > 10) {
        socket.emit('roomCreationError', { 
          success: false, 
          error: 'Количество игроков должно быть от 1 до 10!' 
        });
        return;
      }

      // Проверяем время игры (60-360 минут)
      const validGameDuration = gameDuration && gameDuration >= 60 && gameDuration <= 360 ? gameDuration : 180;
      if (gameDuration && (gameDuration < 60 || gameDuration > 360)) {
        socket.emit('roomCreationError', { 
          success: false, 
          error: 'Время игры должно быть от 1 до 6 часов!' 
        });
        return;
      }

      // Создаем новую комнату
      const newRoom = {
        roomId: uniqueRoomId,
        displayName: name.trim(),
        maxPlayers: maxPlayers || 2, // Используем переданное значение или по умолчанию 2 (диапазон 1-10)
        gameDuration: validGameDuration, // Время игры в минутах
        currentPlayers: [],
        status: 'waiting',
        password: password || '',
        hostId: socket.id,
        createdAt: Date.now(),
        professionType: professionType || 'individual',
        hostProfession: profession || null,
        sharedProfession: sharedProfession || null // Общая профессия для всех игроков
      };
      
      // Добавляем комнату в список
      rooms.set(uniqueRoomId, newRoom);
      
      console.log('🏠 [SERVER] Room created:', {
        roomId: uniqueRoomId,
        name: name,
        hostId: socket.id
      });
      
      // Проверяем, есть ли пользователь с таким socketId
      let hostUser = null;
      for (const [userId, userData] of users.entries()) {
        if (userData.socketId === socket.id) {
          hostUser = userData;
          break;
        }
      }
      
      if (hostUser) {
        console.log('✅ [SERVER] Host user found:', { username: hostUser.username, email: hostUser.email });
      } else {
        console.log('❌ [SERVER] Host user not found for socketId:', socket.id);
        console.log('📊 [SERVER] Available users:', Array.from(users.values()).map(u => ({ username: u.username, socketId: u.socketId })));
      }
      
      // Отправляем подтверждение клиенту через emit
      socket.emit('roomCreated', { 
        success: true, 
        roomId: uniqueRoomId,
        room: newRoom
      });
      
      // Сохраняем комнаты в файл
      saveRooms();
      
      // Отправляем обновленный список комнат всем
      const roomsList = getRoomsList();
      io.emit('roomsList', roomsList);
      
      console.log('🏠 [SERVER] Updated rooms list sent to all clients');
      
    } catch (error) {
      console.error('❌ [SERVER] Error creating room:', error);
      
      // Отправляем ошибку клиенту через emit
      socket.emit('roomCreationError', { 
        success: false, 
        error: 'Ошибка создания комнаты' 
      });
    }
  });
  
  // Присоединение к комнате
  socket.on('joinRoom', (roomId, playerData) => {
    console.log('🔗 [SERVER] joinRoom requested:', { roomId, playerData });
    
    try {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('joinRoomError', { success: false, error: 'Комната не найдена' });
        return;
      }
      
      // Проверяем, не находится ли игрок уже в комнате
      const existingPlayer = room.currentPlayers.find(p => p.socketId === socket.id);
      if (existingPlayer) {
        console.log('🔗 [SERVER] Player already in room:', { roomId, username: existingPlayer.username });
        socket.emit('roomJoined', { success: true, roomId });
        return;
      }
      
      // Проверяем, не превышено ли максимальное количество игроков
      if (room.currentPlayers.length >= room.maxPlayers) {
        socket.emit('joinRoomError', { success: false, error: 'Комната заполнена' });
        return;
      }
      
      // Подключаем сокет к комнате
      socket.join(roomId);
      
      // Добавляем игрока в комнату
      const player = {
        id: socket.id,
        username: playerData?.username || 'Игрок', // Извлекаем username из объекта
        socketId: socket.id,
        ready: false,
        joinedAt: Date.now()
      };
      
      room.currentPlayers.push(player);
      
      console.log('🔗 [SERVER] Player joined room:', {
        roomId,
        username: player.username,
        totalPlayers: room.currentPlayers.length
      });
      
      // Отправляем подтверждение клиенту через emit
      socket.emit('roomJoined', { success: true, roomId });
      
      // Отправляем обновленный список игроков в комнату
      io.to(roomId).emit('playersUpdate', transformPlayersData(room.currentPlayers));
      
      // Сохраняем комнаты в файл
      saveRooms();
      
      // Отправляем обновленный список комнат всем
      const roomsList = getRoomsList();
      io.emit('roomsList', roomsList);
      
      // Логируем состояние комнаты после присоединения игрока
      console.log('🏠 [SERVER] Room state after player join:', {
        roomId: room.roomId,
        displayName: room.displayName,
        hostId: room.hostId,
        currentPlayers: room.currentPlayers.map(p => ({ username: p.username, socketId: p.socketId }))
      });
      
    } catch (error) {
      console.error('❌ [SERVER] Error joining room:', error);
      socket.emit('joinRoomError', { success: false, error: 'Ошибка присоединения к комнате' });
    }
  });
  
  // Установка готовности игрока
  socket.on('playerReady', (data) => {
    const { roomId, playerId, professionId } = data;
    console.log('🎯 [SERVER] Player ready requested:', { roomId, playerId, professionId });
    
    try {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Комната не найдена' });
        return;
      }
      
      // Находим игрока в комнате
      const player = room.currentPlayers.find(p => p.socketId === socket.id);
      if (player) {
        player.ready = true;
        player.professionId = professionId;
        console.log('🎯 [SERVER] Player marked as ready:', player.username, 'profession:', professionId);
        
        // Добавляем игрока в игровую логику
        addPlayerToGame(roomId, player, professionId);
        
        // Отправляем обновление всем игрокам в комнате
        io.to(roomId).emit('playersUpdate', transformPlayersData(room.currentPlayers));
        
        // Проверяем, готовы ли все игроки
        const allReady = room.currentPlayers.every(p => p.ready);
        if (allReady && room.currentPlayers.length >= 2) {
          console.log('🎮 [SERVER] All players ready, game can start');
          io.to(roomId).emit('allPlayersReady');
        }
      }
    } catch (error) {
      console.error('❌ [SERVER] Error setting player ready:', error);
      socket.emit('error', { message: 'Ошибка установки готовности игрока' });
    }
  });

  // Начало игры
  socket.on('startGame', (data) => {
    const { roomId } = data;
    console.log('🎮 [SERVER] Start game requested:', { roomId });
    
    try {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Комната не найдена' });
        return;
      }
      
      // Проверяем, что все игроки готовы
      const allReady = room.currentPlayers.every(p => p.ready);
      if (!allReady) {
        socket.emit('error', { message: 'Не все игроки готовы' });
        return;
      }
      
      // Начинаем игру
      const gameData = startGame(roomId);
      console.log('🎮 [SERVER] Game started:', gameData);
      
      // Отправляем событие начала игры всем игрокам
      io.to(roomId).emit('gameStarted', gameData);
      
    } catch (error) {
      console.error('❌ [SERVER] Error starting game:', error);
      socket.emit('error', { message: error.message });
    }
  });

  // Бросок кубика
  socket.on('playerRolledDice', (data) => {
    const { roomId, playerId, diceValue } = data;
    console.log('🎲 [SERVER] Player rolled dice:', { roomId, playerId, diceValue });
    
    try {
      const gameState = getGameState(roomId);
      if (!gameState.gameStarted) {
        socket.emit('error', { message: 'Игра не началась' });
        return;
      }
      
      // Проверяем, что это ход данного игрока
      if (gameState.currentPlayerId !== playerId) {
        socket.emit('error', { message: 'Не ваш ход' });
        return;
      }
      
      // Двигаем игрока
      const moveData = movePlayer(roomId, playerId, diceValue);
      console.log('🎮 [SERVER] Player moved:', moveData);
      
      // Отправляем событие движения всем игрокам
      io.to(roomId).emit('playerMoved', {
        ...moveData,
        diceValue
      });
      
    } catch (error) {
      console.error('❌ [SERVER] Error rolling dice:', error);
      socket.emit('error', { message: 'Ошибка броска кубика' });
    }
  });

  // Завершение хода
  socket.on('playerEndTurn', (data) => {
    const { roomId, playerId } = data;
    console.log('⏭️ [SERVER] Player ended turn:', { roomId, playerId });
    
    try {
      const gameState = getGameState(roomId);
      if (!gameState.gameStarted) {
        socket.emit('error', { message: 'Игра не началась' });
        return;
      }
      
      // Проверяем, что это ход данного игрока
      if (gameState.currentPlayerId !== playerId) {
        socket.emit('error', { message: 'Не ваш ход' });
        return;
      }
      
      // Переходим к следующему ходу
      const turnData = nextTurn(roomId);
      console.log('🔄 [SERVER] Turn changed:', turnData);
      
      // Отправляем событие смены хода всем игрокам
      io.to(roomId).emit('turnChanged', turnData);
      
    } catch (error) {
      console.error('❌ [SERVER] Error ending turn:', error);
      socket.emit('error', { message: 'Ошибка завершения хода' });
    }
  });

  // Завершение хода (новый обработчик)
  socket.on('endTurn', (data) => {
    const { roomId } = data;
    console.log('⏭️ [SERVER] End turn requested:', { roomId, socketId: socket.id });
    
    try {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Комната не найдена' });
        return;
      }
      
      // Находим игрока по socketId
      const player = room.currentPlayers.find(p => p.socketId === socket.id);
      if (!player) {
        socket.emit('error', { message: 'Игрок не найден в комнате' });
        return;
      }
      
      // Отправляем событие завершения хода
      socket.emit('playerEndTurn', { roomId, playerId: player.id });
      
    } catch (error) {
      console.error('❌ [SERVER] Error in endTurn:', error);
      socket.emit('error', { message: 'Ошибка завершения хода' });
    }
  });

  // Действие игрока (покупка, продажа и т.д.)
  socket.on('playerAction', (data) => {
    const { roomId, playerId, actionType, actionData } = data;
    console.log('🎯 [SERVER] Player action:', { roomId, playerId, actionType, actionData });
    
    try {
      const gameState = getGameState(roomId);
      if (!gameState.gameStarted) {
        socket.emit('error', { message: 'Игра не началась' });
        return;
      }
      
      // Обрабатываем различные типы действий
      switch (actionType) {
        case 'buyAsset':
          // Логика покупки актива
          break;
        case 'sellAsset':
          // Логика продажи актива
          break;
        case 'payExpense':
          // Логика оплаты расходов
          break;
        case 'receiveIncome':
          // Логика получения дохода
          break;
        default:
          socket.emit('error', { message: 'Неизвестный тип действия' });
          return;
      }
      
      // Отправляем обновление всем игрокам
      io.to(roomId).emit('playerActionCompleted', {
        playerId,
        actionType,
        actionData
      });
      
    } catch (error) {
      console.error('❌ [SERVER] Error processing player action:', error);
      socket.emit('error', { message: 'Ошибка обработки действия' });
    }
  });

  // Запуск игры
  socket.on('startGame', (roomId) => {
    console.log('🚀 [SERVER] Start game requested:', { roomId });
    
    try {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Комната не найдена' });
        return;
      }
      
      // Проверяем, что игрок является хостом комнаты
      if (room.hostId !== socket.id) {
        socket.emit('error', { message: 'Только хост может запустить игру' });
        return;
      }
      
      // Проверяем, что все игроки готовы
      const readyPlayers = room.currentPlayers.filter(p => p.ready);
      if (readyPlayers.length < 2) {
        socket.emit('error', { message: 'Для запуска игры нужно минимум 2 готовых игрока' });
        return;
      }
      
      // Меняем статус комнаты на "playing"
      room.status = 'playing';
      console.log('🚀 [SERVER] Game started in room:', { roomId, status: room.status });
      
      // Запускаем систему перерывов
      startBreakSystem(roomId);
      
      // Отправляем событие запуска игры всем игрокам в комнате
      io.to(roomId).emit('gameStarted', {
        success: true,
        roomId: roomId,
        status: room.status,
        players: room.currentPlayers
      });
      
      // Отправляем обновленный список комнат всем
      const roomsList = getRoomsList();
      io.emit('roomsList', roomsList);
      
    } catch (error) {
      console.error('❌ [SERVER] Error starting game:', error);
      socket.emit('error', { message: 'Ошибка запуска игры' });
    }
  });

  // Получение состояния игры
  socket.on('getGameState', (roomId) => {
    console.log('🎮 [SERVER] getGameState requested:', { roomId });
    
    try {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Комната не найдена' });
        return;
      }
      
      // Отправляем текущее состояние игры
      socket.emit('gameState', {
        roomId: roomId,
        status: room.status,
        players: room.currentPlayers,
        gamePhase: room.status === 'playing' ? 'playing' : 'waiting'
      });
      
      console.log('🎮 [SERVER] Game state sent:', { roomId, status: room.status });
      
    } catch (error) {
      console.error('❌ [SERVER] Error getting game state:', error);
      socket.emit('error', { message: 'Ошибка получения состояния игры' });
    }
  });

  // Завершение игры
  socket.on('endGame', (roomId) => {
    console.log('🏁 [SERVER] End game requested:', { roomId });
    
    try {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Комната не найдена' });
        return;
      }
      
      // Проверяем, что игрок является хостом комнаты
      if (room.hostId !== socket.id) {
        socket.emit('error', { message: 'Только хост может завершить игру' });
        return;
      }
      
      // Останавливаем систему перерывов
      stopBreakSystem(roomId);
      
      // Меняем статус комнаты на "finished"
      room.status = 'finished';
      console.log('🏁 [SERVER] Game ended in room:', { roomId, status: room.status });
      
      // Отправляем событие завершения игры всем игрокам в комнате
      io.to(roomId).emit('gameEnded', {
        success: true,
        roomId: roomId,
        status: room.status
      });
      
      // Отправляем обновленный список комнат всем
      const roomsList = getRoomsList();
      io.emit('roomsList', roomsList);
      
    } catch (error) {
      console.error('❌ [SERVER] Error ending game:', error);
      socket.emit('error', { message: 'Ошибка завершения игры' });
    }
  });

  // Получение данных комнаты
  socket.on('getRoomData', (roomId) => {
    console.log('🏠 [SERVER] getRoomData requested:', { roomId });
    console.log('🏠 [SERVER] Всего комнат:', rooms.size);
    console.log('🏠 [SERVER] Ключи комнат:', Array.from(rooms.keys()));
    
    try {
      const room = rooms.get(roomId);
      console.log('🏠 [SERVER] Найдена комната:', room);
      
      if (!room) {
        console.log('❌ [SERVER] Комната не найдена в Map');
        socket.emit('error', { message: 'Комната не найдена' });
        return;
      }
      
      // Находим имя хоста
      let hostUsername = 'Неизвестно';
      if (room.hostId) {
        console.log(`🔍 [SERVER] getRoomData: Looking for host username, hostId: ${room.hostId}`);
        
        // Ищем пользователя по socketId в глобальном хранилище
        for (const [userId, userData] of users.entries()) {
          if (userData.socketId === room.hostId) {
            hostUsername = userData.username;
            console.log(`✅ [SERVER] getRoomData: Found host username in users: ${hostUsername}`);
            break;
          }
        }
        
        // Если не нашли в users, ищем в currentPlayers комнаты
        if (hostUsername === 'Неизвестно') {
          const hostPlayer = room.currentPlayers.find(p => p.socketId === room.hostId);
          if (hostPlayer) {
            hostUsername = hostPlayer.username;
            console.log(`✅ [SERVER] getRoomData: Found host username in currentPlayers: ${hostUsername}`);
          } else {
            console.log(`❌ [SERVER] getRoomData: Host player not found in currentPlayers`);
            // Попробуем найти по id (если hostId это userId, а не socketId)
            for (const [userId, userData] of users.entries()) {
              if (userId === room.hostId) {
                hostUsername = userData.username;
                console.log(`✅ [SERVER] getRoomData: Found host username by userId: ${hostUsername}`);
                break;
              }
            }
          }
        }
      }
      
      // Отправляем данные комнаты клиенту
      socket.emit('roomData', {
        roomId: room.roomId,
        displayName: room.displayName,
        maxPlayers: room.maxPlayers,
        currentPlayers: room.currentPlayers,
        status: room.status,
        hostId: room.hostId,
        hostUsername: hostUsername,
        password: room.password,
        isPublic: room.password === '', // Комната считается открытой, если нет пароля
        professionType: room.professionType || 'individual',
        hostProfession: room.hostProfession || null,
        createdAt: room.createdAt
      });
      
      console.log('🏠 [SERVER] Room data sent:', { roomId, displayName: room.displayName });
      
      // Также отправляем обновленный список игроков
      socket.emit('playersUpdate', transformPlayersData(room.currentPlayers));
      console.log('👥 [SERVER] Players update sent after roomData:', room.currentPlayers.length, 'players');
      
    } catch (error) {
      console.error('❌ [SERVER] Error getting room data:', error);
      socket.emit('error', { message: 'Ошибка получения данных комнаты' });
    }
  });

  // Восстановление состояния комнаты после переподключения
  socket.on('restoreRoomState', (roomId) => {
    console.log('🔄 [SERVER] restoreRoomState requested:', { roomId, socketId: socket.id });
    
    try {
      const room = rooms.get(roomId);
      if (!room) {
        console.log('❌ [SERVER] Room not found for restore:', roomId);
        socket.emit('restoreRoomStateError', { message: 'Комната не найдена' });
        return;
      }
      
      // Проверяем, был ли игрок в этой комнате
      const existingPlayer = room.currentPlayers.find(p => p.socketId === socket.id);
      if (existingPlayer) {
        console.log('✅ [SERVER] Player found in room, restoring state:', { 
          roomId, 
          username: existingPlayer.username,
          socketId: socket.id 
        });
        
        // Подключаем сокет к комнате
        socket.join(roomId);
        
        // Отправляем данные комнаты
        socket.emit('roomData', {
          roomId: room.roomId,
          displayName: room.displayName,
          maxPlayers: room.maxPlayers,
          currentPlayers: room.currentPlayers,
          status: room.status,
          hostId: room.hostId,
          hostUsername: existingPlayer.username, // Используем имя текущего игрока
          password: room.password,
          isPublic: room.password === '',
          professionType: room.professionType || 'individual',
          hostProfession: room.hostProfession || null,
          createdAt: room.createdAt
        });
        
        // Отправляем обновленный список игроков
        io.to(roomId).emit('playersUpdate', transformPlayersData(room.currentPlayers));
        
        // Отправляем событие об успешном восстановлении
        socket.emit('roomStateRestored', { 
          roomId, 
          username: existingPlayer.username 
        });
        
        console.log('✅ [SERVER] Room state restored for player:', existingPlayer.username);
      } else {
        console.log('⚠️ [SERVER] Player not found in room, cannot restore state:', { roomId, socketId: socket.id });
        socket.emit('restoreRoomStateError', { message: 'Игрок не найден в комнате' });
      }
    } catch (error) {
      console.error('❌ [SERVER] Error restoring room state:', error);
      socket.emit('restoreRoomStateError', { message: 'Ошибка восстановления состояния' });
    }
  });

  // 🏦 Банковские операции
  socket.on('bankTransfer', (data) => {
    try {
      const { roomId, playerId, recipient, amount } = data;
      console.log('🏦 [SERVER] Bank transfer request:', { roomId, playerId, recipient, amount });
      
      const room = rooms.get(roomId);
      if (!room) {
        console.log('❌ [SERVER] Room not found for bank transfer:', roomId);
        return;
      }
      
      const player = room.currentPlayers.find(p => p.id === playerId);
      if (!player) {
        console.log('❌ [SERVER] Player not found for bank transfer:', playerId);
        return;
      }
      
      // Проверяем баланс игрока
      if (player.balance < amount) {
        socket.emit('bankTransferError', { message: 'Недостаточно средств' });
        return;
      }
      
      // Выполняем перевод
      player.balance -= amount;
      
      // Ищем получателя в той же комнате
      const recipientPlayer = room.currentPlayers.find(p => p.username === recipient);
      if (recipientPlayer) {
        recipientPlayer.balance += amount;
        console.log('✅ [SERVER] Transfer completed between players:', { 
          from: player.username, 
          to: recipient, 
          amount 
        });
      }
      
      // Отправляем обновление всем игрокам в комнате
      io.to(roomId).emit('playersUpdate', transformPlayersData(room.currentPlayers));
      socket.emit('bankTransferSuccess', { 
        message: `Перевод $${amount} выполнен успешно`,
        newBalance: player.balance 
      });
      
    } catch (error) {
      console.error('❌ [SERVER] Error in bank transfer:', error);
      socket.emit('bankTransferError', { message: 'Ошибка при выполнении перевода' });
    }
  });

  socket.on('creditPayment', (data) => {
    try {
      const { roomId, playerId, creditType, amount } = data;
      console.log('🏦 [SERVER] Credit payment request:', { roomId, playerId, creditType, amount });
      
      const room = rooms.get(roomId);
      if (!room) {
        console.log('❌ [SERVER] Room not found for credit payment:', roomId);
        return;
      }
      
      const player = room.currentPlayers.find(p => p.id === playerId);
      if (!player) {
        console.log('❌ [SERVER] Player not found for credit payment:', playerId);
        return;
      }
      
      // Проверяем баланс игрока
      if (player.balance < amount) {
        socket.emit('creditPaymentError', { message: 'Недостаточно средств' });
        return;
      }
      
      // Проверяем наличие кредита
      if (!player.credits || !player.credits[creditType] || player.credits[creditType] < amount) {
        socket.emit('creditPaymentError', { message: 'Сумма превышает размер кредита' });
        return;
      }
      
      // Выполняем погашение кредита
      player.balance -= amount;
      player.credits[creditType] -= amount;
      
      // Если кредит полностью погашен, удаляем его
      if (player.credits[creditType] <= 0) {
        delete player.credits[creditType];
      }
      
      console.log('✅ [SERVER] Credit payment completed:', { 
        player: player.username, 
        creditType, 
        amount,
        remainingCredit: player.credits[creditType] || 0
      });
      
      // Отправляем обновление всем игрокам в комнате
      io.to(roomId).emit('playersUpdate', transformPlayersData(room.currentPlayers));
      socket.emit('creditPaymentSuccess', { 
        message: `Погашение кредита $${amount} выполнено`,
        newBalance: player.balance,
        remainingCredits: player.credits
      });
      
    } catch (error) {
      console.error('❌ [SERVER] Error in credit payment:', error);
      socket.emit('creditPaymentError', { message: 'Ошибка при погашении кредита' });
    }
  });

  socket.on('getTransactionHistory', (data) => {
    try {
      const { roomId, playerId } = data;
      console.log('🏦 [SERVER] Transaction history request:', { roomId, playerId });
      
      const room = rooms.get(roomId);
      if (!room) {
        console.log('❌ [SERVER] Room not found for transaction history:', roomId);
        return;
      }
      
      // В реальном приложении здесь была бы база данных
      // Пока возвращаем тестовые данные
      const transactions = [
        {
          id: 1,
          from: 'MAG',
          to: 'Алексей',
          amount: 100,
          type: 'transfer',
          timestamp: '2024-01-15 14:30',
          status: 'completed'
        },
        {
          id: 2,
          from: 'Мария',
          to: 'MAG',
          amount: 50,
          type: 'transfer',
          timestamp: '2024-01-15 13:45',
          status: 'completed'
        }
      ];
      
      socket.emit('transactionHistory', transactions);
      
    } catch (error) {
      console.error('❌ [SERVER] Error getting transaction history:', error);
      socket.emit('transactionHistoryError', { message: 'Ошибка при получении истории транзакций' });
    }
  });

  // Обработчик отключения клиента
  socket.on('disconnect', () => {
    console.log(`🔌 [SERVER] Client disconnected: ${socket.id}`);
    
    // Удаляем игрока из всех комнат
    rooms.forEach((room, roomId) => {
      const playerIndex = room.currentPlayers.findIndex(p => p.socketId === socket.id);
      if (playerIndex !== -1) {
        const removedPlayer = room.currentPlayers[playerIndex];
        room.currentPlayers.splice(playerIndex, 1);
        console.log('🔌 [SERVER] Player removed from room:', { 
          roomId, 
          username: removedPlayer.username,
          socketId: socket.id 
        });
        
        // Если отключившийся игрок был хостом, останавливаем систему перерывов
        if (room.hostId === socket.id) {
          console.log(`🔌 [SERVER] Host disconnected, stopping break system for room: ${roomId}`);
          stopBreakSystem(roomId);
        }
        
        // Отправляем обновленный список игроков
        io.to(roomId).emit('playersUpdate', transformPlayersData(room.currentPlayers));
        
        // Сохраняем комнаты в файл
        saveRooms();
        
        // Отправляем обновленный список комнат
        const roomsList = getRoomsList();
        io.emit('roomsList', roomsList);
      }
    });
  });
});

// API маршруты
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/rooms', (req, res) => {
  const roomsList = getRoomsList();
  res.json(roomsList);
});

// Загружаем данные при запуске сервера
loadUsers();
loadRooms();

// Создаем дефолтную комнату при запуске (если нет комнат)
if (rooms.size === 0) {
  createDefaultRoom();
}

// Запускаем сервер
server.listen(PORT, () => {
  console.log(`🚀 Energy of Money Server запущен!`);
  console.log(`🌐 HTTP: http://localhost:${PORT}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🏠 API комнат: http://localhost:${PORT}/api/rooms`);
});

// Обработка завершения работы сервера
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  saveUsers(); // Сохраняем пользователей перед выключением
  saveRooms(); // Сохраняем комнаты перед выключением
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  saveUsers(); // Сохраняем пользователей перед выключением
  saveRooms(); // Сохраняем комнаты перед выключением
  process.exit(0);
});