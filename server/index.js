const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => { callback(null, true); },
    methods: ['GET','POST'],
    credentials: true,
    allowedHeaders: ['Content-Type','Authorization']
  },
  transports: ['websocket','polling'],
  allowEIO3: true
});

app.use(cors());
app.use(express.json());

const clientBuildPath = require('path').join(__dirname, '..', 'client', 'build');
if (require('fs').existsSync(clientBuildPath)) {
  console.log('🧱 [SERVER] Serving client build from', clientBuildPath);
  app.use(express.static(clientBuildPath));
}

const rooms = new Map();
const users = new Map();
const userRooms = new Map();

const generateId = () => Math.random().toString(36).substr(2, 9);
const generateRoomId = () => `room_${generateId()}`;

// API маршруты
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/rooms', (req, res) => {
  const roomsList = Array.from(rooms.values()).map(room => ({
    id: room.id,
    name: room.name,
    players: room.players, // Отправляем полный массив игроков
    maxPlayers: room.maxPlayers,
    isPrivate: room.isPrivate,
    status: room.status,
    createdAt: room.createdAt,
    hostDream: room.hostDream
  }));
  res.json({ rooms: roomsList });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) {
    return res.status(404).json({ error: 'Комната не найдена' });
  }
  res.json({ room });
});

// Socket.IO обработчики
io.on('connection', (socket) => {
  console.log('🔌 Новое подключение:', socket.id);
  console.log('📡 [SERVER] Socket details:', {
    id: socket.id,
    transport: socket.conn.transport.name,
    remoteAddress: socket.handshake.address,
    userAgent: socket.handshake.headers['user-agent']
  });

  socket.on('disconnect', () => {
    console.log('❌ Отключение:', socket.id);
    // Находим пользователя по socket.id и удаляем его из комнаты
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
      if (playerIndex !== -1) {
        const player = room.players[playerIndex];
        leaveRoom(player.id, roomId);
        break;
      }
    }
  });

  // Получение списка комнат
  socket.on('get_rooms', () => {
    const roomsList = Array.from(rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      players: room.players, // Отправляем полный массив игроков
      maxPlayers: room.maxPlayers,
      isPrivate: room.isPrivate,
      status: room.status,
      createdAt: room.createdAt,
      hostDream: room.hostDream
    }));
    socket.emit('rooms_list', { rooms: roomsList });
  });

  // Создание комнаты
  socket.on('create_room', (data) => {
    const { roomName, maxPlayers = 4, isPrivate = false, password = '', userId, username, obligatoryProfession = false, selectedProfession = null, hostDream = null } = data;
    
    if (!roomName || !userId || !username) {
      socket.emit('room_error', { message: 'Недостаточно данных для создания комнаты' });
      return;
    }
    
    if (isPrivate && !password.trim()) {
      socket.emit('room_error', { message: 'Для приватной комнаты необходимо указать пароль' });
      return;
    }
    
    if (!hostDream) {
      socket.emit('room_error', { message: 'Необходимо выбрать мечту' });
      return;
    }

    const roomId = generateRoomId();
    const room = {
      id: roomId,
      name: roomName,
      maxPlayers,
      isPrivate,
      password: isPrivate ? password : '',
      status: 'waiting',
      createdAt: new Date(),
      createdBy: userId,
      hostDream: hostDream,
      obligatoryProfession: obligatoryProfession,
      selectedProfession: selectedProfession,
      players: [{
        id: userId,
        username: username,
        socketId: socket.id,
        isHost: true,
        profession: obligatoryProfession ? selectedProfession : null,
        dream: hostDream,
        ready: true // Хост готов по умолчанию
      }]
    };
    
    rooms.set(roomId, room);
    userRooms.set(userId, roomId);
    socket.join(roomId);
    
    socket.emit('room_created', { room, roomId });
    io.to(roomId).emit('room_joined', { room, roomId });
    io.emit('rooms_updated', Array.from(rooms.values()));
    
    console.log(`🏠 Создана комната: ${roomName} (${roomId}) пользователем ${username} (${isPrivate ? 'приватная' : 'публичная'}) с мечтой: ${hostDream.name}`);
  });

  // Присоединение к комнате
  socket.on('join_room', (data) => {
    const { roomId, password = '', userId, username, dream = null } = data;
    
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('room_error', { message: 'Комната не найдена' });
      return;
    }
    
    if (room.isPrivate && room.password !== password) {
      socket.emit('room_error', { message: 'Неверный пароль' });
      return;
    }
    
    if (room.players.length >= room.maxPlayers) {
      socket.emit('room_error', { message: 'Комната заполнена' });
      return;
    }
    
    if (room.players.some(p => p.id === userId)) {
      socket.emit('room_error', { message: 'Вы уже в этой комнате' });
      return;
    }
    
    if (!dream) {
      socket.emit('room_error', { message: 'Необходимо выбрать мечту для присоединения к комнате' });
      return;
    }

    const player = {
      id: userId,
      username: username,
      socketId: socket.id,
      isHost: false,
      profession: null,
      dream: dream,
      balance: 0,
      passiveIncome: 0,
      expenses: 0,
      cash: 0,
      currentPosition: 0,
      ready: false // Добавляем поле готовности
    };
    
    room.players.push(player);
    userRooms.set(userId, roomId);
    socket.join(roomId);
    
    io.to(roomId).emit('room_joined', { room, roomId });
    io.emit('rooms_updated', Array.from(rooms.values()));
    
    console.log(`👤 ${username} присоединился к комнате ${room.name} (${roomId}) с мечтой: ${dream.name}`);
  });

  // Обновление игрока
  socket.on('update_player', (data) => {
    const { roomId, userId, profession, dream } = data;
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('room_error', { message: 'Комната не найдена' });
      return;
    }
    
    const player = room.players.find(p => p.id === userId);
    if (player) {
      if (profession) player.profession = profession;
      if (dream) player.dream = dream;
      io.to(roomId).emit('roomData', room);
      io.emit('rooms_updated', Array.from(rooms.values()));
    }
  });

  // Установка готовности игрока
  socket.on('player_ready', (data) => {
    const { roomId, userId } = data;
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('room_error', { message: 'Комната не найдена' });
      return;
    }
    
    const player = room.players.find(p => p.id === userId);
    if (player) {
      player.ready = true;
      console.log(`✅ Игрок ${player.username} готов к игре`);
      
      // Отправляем обновленные данные комнаты всем игрокам
      io.to(roomId).emit('roomData', room);
      io.emit('rooms_updated', Array.from(rooms.values()));
    }
  });

  // Игровые события
  socket.on("start_game", (data) => {
    const { roomId, userId } = data;
    
    if (!roomId || !userId) {
      socket.emit("room_error", { message: "Недостаточно данных для старта игры" });
      return;
    }
    
    const room = rooms.get(roomId);
    if (!room || room.status !== "playing") {
      socket.emit("room_error", { message: "Игра не активна" });
      return;
    }
    
    // Проверяем, что пользователь является хостом
    const hostPlayer = room.players.find(p => p.id === userId && p.isHost);
    if (!hostPlayer) {
      socket.emit("room_error", { message: "Только хост может запустить игру" });
      return;
    }
    
    // Проверяем, что все игроки готовы
    const allPlayersReady = room.players.every(p => p.ready);
    if (!allPlayersReady) {
      socket.emit("room_error", { message: "Не все игроки готовы к игре" });
      return;
    }
    
    // Меняем статус комнаты на "игра"
    room.status = "playing";
    
    // Инициализируем игровые данные
    room.gameData = {
      currentTurn: 0, // Индекс игрока в массиве
      turnTimer: 120, // 2 минуты на ход
      gameStarted: new Date(),
      playerPositions: {}, // Позиции игроков на поле
      playerBalances: {}, // Балансы игроков
      playerAssets: {} // Активы игроков (бизнес, мечты)
    };
    
    // Устанавливаем начальные позиции и балансы
    room.players.forEach((player, index) => {
      room.gameData.playerPositions[player.id] = 0;
      room.gameData.playerBalances[player.id] = player.balance || 2000;
      room.gameData.playerAssets[player.id] = {
        businesses: [],
        dreams: [],
        passiveIncome: 0
      };
    });
    
    // Уведомляем всех в комнате о старте игры
    io.to(roomId).emit("game_started", { room });
    
    // Запускаем первый ход
    startNextTurn(roomId);
    
    console.log(`🎮 Игра запущена в комнате ${room.name} (${roomId}) хостом ${hostPlayer.username}`);
  });
  
  // Бросание кубиков
  socket.on("roll_dice", (data) => {
    const { roomId, playerId } = data;
    
    if (!roomId || !playerId) {
      socket.emit("room_error", { message: "Недостаточно данных для броска кубиков" });
      return;
    }
    
    const room = rooms.get(roomId);
    if (!room || room.status !== "playing") {
      socket.emit("room_error", { message: "Игра не активна" });
      return;
    }
    
    // Проверяем, что сейчас ход этого игрока
    if (room.gameData.currentTurn >= room.players.length) {
      socket.emit("room_error", { message: "Ошибка: неверный порядок ходов" });
      return;
    }
    
    const currentPlayer = room.players[room.gameData.currentTurn];
    if (currentPlayer.id !== playerId) {
      socket.emit("room_error", { message: "Сейчас не ваш ход" });
      return;
    }
    
    // Бросаем кубики
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    // Отправляем результат всем игрокам
    io.to(roomId).emit("dice_rolled", { playerId, dice1, dice2, total });
    
    console.log(`🎲 Игрок ${currentPlayer.username} бросил кубики: ${dice1} + ${dice2} = ${total}`);
  });
  
  // Движение игрока
  socket.on("player_moved", (data) => {
    const { roomId, playerId, cellId } = data;
    
    if (!roomId || !playerId || !cellId) {
      socket.emit("room_error", { message: "Недостаточно данных для движения" });
      return;
    }
    
    const room = rooms.get(roomId);
    if (!room || room.status !== "playing") {
      socket.emit("room_error", { message: "Игра не активна" });
      return;
    }
    
    // Обновляем позицию игрока
    room.gameData.playerPositions[playerId] = cellId - 1;
    
    // Отправляем событие клетки
    io.to(roomId).emit("cell_event", { playerId, cellId, event: "landed" });
    
    console.log(`🎯 Игрок ${playerId} переместился на клетку ${cellId}`);
  });
  
  // Завершение хода
  socket.on("end_turn", (data) => {
    const { roomId, playerId } = data;
    
    if (!roomId || !playerId) {
      socket.emit("room_error", { message: "Недостаточно данных для завершения хода" });
      return;
    }
    
    const room = rooms.get(roomId);
    if (!room || room.status !== "playing") {
      socket.emit("room_error", { message: "Игра не активна" });
      return;
    }
    
    // Проверяем, что сейчас ход этого игрока
    if (room.gameData.currentTurn >= room.players.length) {
      socket.emit("room_error", { message: "Ошибка: неверный порядок ходов" });
      return;
    }
    
    const currentPlayer = room.players[room.gameData.currentTurn];
    if (currentPlayer.id !== playerId) {
      socket.emit("room_error", { message: "Сейчас не ваш ход" });
      return;
    }
    
    // Уведомляем о завершении хода
    io.to(roomId).emit("turn_ended", { playerId });
    
    // Переходим к следующему игроку
    startNextTurn(roomId);
    
    console.log(`✅ Игрок ${currentPlayer.username} завершил ход`);
  });
});

// Функция для выхода игрока из комнаты
function leaveRoom(userId, roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  // Удаляем игрока из комнаты
  room.players = room.players.filter(p => p.id !== userId);
  
  // Удаляем связь пользователь-комната
  userRooms.delete(userId);
  
  // Если комната пустая, удаляем её
  if (room.players.length === 0) {
    rooms.delete(roomId);
    console.log(`🗑️ Комната ${room.name} (${roomId}) удалена - нет игроков`);
  } else {
    // Если вышел хост, назначаем нового хоста
    if (!room.players.some(p => p.isHost)) {
      room.players[0].isHost = true;
      console.log(`👑 Новый хост в комнате ${room.name}: ${room.players[0].username}`);
    }
    
    // Уведомляем оставшихся игроков
    io.to(roomId).emit('player_left', { userId, room });
    io.emit('rooms_updated', Array.from(rooms.values()));
    console.log(`👤 Игрок ${userId} вышел из комнаты ${room.name} (${roomId})`);
  }
}

// Функция для управления очередностью ходов
function startNextTurn(roomId) {
  const room = rooms.get(roomId);
  if (!room || room.status !== "playing") return;
  
  // Переходим к следующему игроку
  room.gameData.currentTurn = (room.gameData.currentTurn + 1) % room.players.length;
  
  const currentPlayer = room.players[room.gameData.currentTurn];
  
  // Уведомляем всех о начале нового хода
  io.to(roomId).emit("turn_started", { 
    playerId: currentPlayer.id, 
    duration: room.gameData.turnTimer 
  });
  
  // Запускаем таймер хода
  room.gameData.turnTimer = 120;
  
  const turnTimer = setInterval(() => {
    if (room.gameData.turnTimer > 0) {
      room.gameData.turnTimer--;
    } else {
      // Время вышло, автоматически завершаем ход
      clearInterval(turnTimer);
      startNextTurn(roomId);
    }
  }, 1000);
  
  console.log(`🎯 Ход игрока: ${currentPlayer.username} (${roomId})`);
}

const PORT = process.env.PORT || 5000;


if (require('fs').existsSync(clientBuildPath)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/socket.io')) return next();
    res.sendFile(require('path').join(clientBuildPath, 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`🚀 Energy of Money Server запущен!`);
  console.log(`🌐 HTTP: http://localhost:${PORT}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🏠 API комнат: http://localhost:${PORT}/api/rooms`);
});