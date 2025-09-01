const io = require('socket.io-client');

// Подключаемся к серверу
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('✅ Подключились к серверу');
  
  // Регистрируем тестового пользователя
  socket.emit('authenticateUser', 'TestUser', 'test@example.com', 'testpass', (response) => {
    console.log('📧 Ответ на регистрацию:', response);
    
    if (response.success) {
      console.log('✅ Пользователь успешно зарегистрирован!');
      console.log('👤 Данные пользователя:', response.userData);
    } else {
      console.log('❌ Ошибка регистрации:', response.error);
    }
    
    // Отключаемся
    setTimeout(() => {
      socket.disconnect();
      process.exit(0);
    }, 1000);
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
}, 5000);

