const io = require('socket.io-client');

// Подключаемся к серверу
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('✅ Подключились к серверу');
  
  // Тестируем регистрацию нового пользователя
  console.log('\n🔐 Тестируем регистрацию нового пользователя...');
  socket.emit('authenticateUser', 'NewUser', 'newuser@example.com', 'newpass123', (response) => {
    console.log('📧 Ответ на регистрацию:', response);
    
    if (response.success) {
      console.log('✅ Новый пользователь успешно зарегистрирован!');
      console.log('👤 Данные пользователя:', response.userData);
    } else {
      console.log('❌ Ошибка регистрации:', response.error);
    }
    
    // Тестируем вход существующего пользователя
    console.log('\n🔐 Тестируем вход существующего пользователя...');
    socket.emit('authenticateUser', 'MAG', 'xqrmedia@gmail.com', 'magpass', (response2) => {
      console.log('📧 Ответ на вход:', response2);
      
      if (response2.success) {
        console.log('✅ Пользователь успешно вошел!');
        console.log('👤 Данные пользователя:', response2.userData);
      } else {
        console.log('❌ Ошибка входа:', response2.error);
      }
      
      // Отключаемся
      setTimeout(() => {
        socket.disconnect();
        process.exit(0);
      }, 1000);
    });
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

