const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

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
  
  users.set(userId, userData);
  usernameToUserId.set(username.toLowerCase(), userId);
  
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
    users.set(userId, user);
    console.log(`✅ [SERVER] Updated socketId for user ${user.username}: ${socketId}`);
  } else {
    console.log(`❌ [SERVER] User not found for userId: ${userId}`);
  }
};

// Создаем дефолтную комнату
const createDefaultRoom = () => {
  const roomId = 'lobby';
  rooms.set(roomId, {
    roomId: roomId,
    displayName: 'Лобби',
    maxPlayers: 1,
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

// Создаем дефолтную комнату при запуске
createDefaultRoom();

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
  
  // Создание комнаты
  socket.on('createRoom', (roomData) => {
    console.log('🏠 [SERVER] createRoom requested:', roomData);
    
    try {
      const { name, password, professionType, profession, maxPlayers } = roomData;
      
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

      // Создаем новую комнату
      const newRoom = {
        roomId: uniqueRoomId,
        displayName: name.trim(),
        maxPlayers: maxPlayers || 2, // Используем переданное значение или по умолчанию 2 (диапазон 1-10)
        currentPlayers: [],
        status: 'waiting',
        password: password || '',
        hostId: socket.id,
        createdAt: Date.now(),
        professionType: professionType || 'individual',
        hostProfession: profession || null
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
      io.to(roomId).emit('playersUpdate', room.currentPlayers);
      
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
  socket.on('playerReady', (roomId, playerId) => {
    console.log('🎯 [SERVER] Player ready requested:', { roomId, playerId });
    
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
        console.log('🎯 [SERVER] Player marked as ready:', { roomId, username: player.username });
        
        // Отправляем обновленный список игроков в комнату
        io.to(roomId).emit('playersUpdate', room.currentPlayers);
        
        // Отправляем обновленный список комнат всем
        const roomsList = getRoomsList();
        io.emit('roomsList', roomsList);
      }
    } catch (error) {
      console.error('❌ [SERVER] Error setting player ready:', error);
      socket.emit('error', { message: 'Ошибка установки готовности' });
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
      socket.emit('playersUpdate', room.currentPlayers);
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
        io.to(roomId).emit('playersUpdate', room.currentPlayers);
        
        console.log('✅ [SERVER] Room state restored for player:', existingPlayer.username);
      } else {
        console.log('⚠️ [SERVER] Player not found in room, cannot restore state:', { roomId, socketId: socket.id });
      }
    } catch (error) {
      console.error('❌ [SERVER] Error restoring room state:', error);
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
        
        // Отправляем обновленный список игроков
        io.to(roomId).emit('playersUpdate', room.currentPlayers);
        
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
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});