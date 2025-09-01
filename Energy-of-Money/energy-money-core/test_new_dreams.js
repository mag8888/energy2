const io = require('socket.io-client');

// Подключаемся к серверу
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('✅ Подключились к серверу');
  
  // Тестируем регистрацию пользователя
  console.log('\n🔐 Тестируем регистрацию пользователя...');
  socket.emit('authenticateUser', 'DreamTester', 'dreamtester@example.com', 'dreampass123', (response) => {
    console.log('📧 Ответ на регистрацию:', response);
    
    if (response.success) {
      console.log('✅ Пользователь успешно зарегистрирован!');
      console.log('👤 Данные пользователя:', response.userData);
      
      // Тестируем создание комнаты
      console.log('\n🏠 Тестируем создание комнаты...');
      socket.emit('createRoom', {
        name: 'Тестовая комната с новыми мечтами',
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
          
          // Тестируем готовность с новой мечтой (Туристический комплекс)
          console.log('\n🎯 Тестируем готовность с новой мечтой...');
          const readyData = {
            roomId: roomResponse.roomId,
            playerId: response.userData.id,
            professionId: 1, // Первая профессия
            dreamId: 7 // Туристический комплекс (эко-ранчо) - 1,000,000₽
          };
          
          socket.emit('playerReady', readyData);
          console.log('📧 Отправлены данные готовности:', readyData);
          console.log('🌟 Выбрана мечта: Туристический комплекс (эко-ранчо) - 1,000,000₽');
          
          // Отключаемся через 2 секунды
          setTimeout(() => {
            socket.disconnect();
            process.exit(0);
          }, 2000);
        } else {
          console.log('❌ Ошибка создания комнаты:', roomResponse.error);
          socket.disconnect();
          process.exit(1);
        }
      });
    } else {
      console.log('❌ Ошибка регистрации:', response.error);
      socket.disconnect();
      process.exit(1);
    }
  });
});

socket.on('error', (error) => {
  console.log('❌ Ошибка подключения:', error);
  process.exit(1);
});

// Таймаут на случай, если сервер не отвечает
setTimeout(() => {
  console.log('⏰ Таймаут - сервер не отвечает');
  process.exit(1);
}, 10000);

