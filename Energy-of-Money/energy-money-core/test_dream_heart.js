const io = require('socket.io-client');

// Подключаемся к серверу
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('✅ Подключились к серверу');
  
  // Тестируем регистрацию пользователя
  console.log('\n🔐 Тестируем регистрацию пользователя...');
  socket.emit('authenticateUser', 'DreamHeartTester', 'dreamheart@example.com', 'heartpass123', (response) => {
    console.log('📧 Ответ на регистрацию:', response);
    
    if (response.success) {
      console.log('✅ Пользователь успешно зарегистрирован!');
      console.log('👤 Данные пользователя:', response.userData);
      
      // Тестируем создание комнаты
      console.log('\n🏠 Тестируем создание комнаты...');
      socket.emit('createRoom', {
        name: 'Тестовая комната с сердечками на мечтах',
        professionType: 'individual',
        maxPlayers: 4,
        gameDuration: 180
      });
      
      // Слушаем ответ на создание комнаты
      socket.on('roomCreated', (roomResponse) => {
        console.log('📧 Ответ на создание комнаты:', roomResponse);
        
        if (roomResponse.success) {
          console.log('✅ Комната успешно создана!');
          console.log('🏠 ID комнаты:', roomResponse.roomId);
          
          // Тестируем готовность игрока с мечтой
          console.log('\n🌟 Тестируем готовность игрока с мечтой...');
          const readyData = {
            roomId: roomResponse.roomId,
            playerId: response.userData.id,
            professionId: 1, // Инженер
            dreamId: 2 // Построить дом мечты для семьи
          };
          console.log('🎯 Отправляем playerReady с мечтой:', readyData);
          socket.emit('playerReady', readyData);
          
          // Слушаем ответ на готовность
          socket.on('playerReadyResponse', (readyResponse) => {
            console.log('📧 Ответ на готовность:', readyResponse);
            
            if (readyResponse.success) {
              console.log('✅ Игрок успешно готов с мечтой!');
              console.log('🌟 Выбранная мечта:', readyResponse.dream);
              
              // Завершаем тест
              console.log('\n🎉 Тест завершен успешно!');
              console.log('✅ Функциональность сердечка на мечтах работает корректно');
              socket.disconnect();
              process.exit(0);
            } else {
              console.error('❌ Ошибка при установке готовности:', readyResponse.error);
              socket.disconnect();
              process.exit(1);
            }
          });
          
        } else {
          console.error('❌ Ошибка при создании комнаты:', roomResponse.error);
          socket.disconnect();
          process.exit(1);
        }
      });
      
    } else {
      console.error('❌ Ошибка при регистрации:', response.error);
      socket.disconnect();
      process.exit(1);
    }
  });
});

socket.on('disconnect', () => {
  console.log('🔌 Отключились от сервера');
});

socket.on('error', (error) => {
  console.error('❌ Ошибка WebSocket:', error);
  process.exit(1);
});

// Таймаут для теста
setTimeout(() => {
  console.error('⏰ Таймаут - сервер не отвечает');
  socket.disconnect();
  process.exit(1);
}, 10000);

