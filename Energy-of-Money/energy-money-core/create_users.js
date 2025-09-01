const io = require('socket.io-client');

const testUsers = [
  { username: 'MAG', email: 'xqrmedia@gmail.com', password: 'magpass' },
  { username: 'Romeo', email: 'romeo@example.com', password: 'romeopass' },
  { username: 'Alice', email: 'alice@example.com', password: 'alicepass' },
  { username: 'Bob', email: 'bob@example.com', password: 'bobpass' }
];

let currentIndex = 0;

function createNextUser() {
  if (currentIndex >= testUsers.length) {
    console.log('✅ Все пользователи созданы!');
    process.exit(0);
    return;
  }

  const user = testUsers[currentIndex];
  console.log(`\n👤 Создаем пользователя: ${user.username} (${user.email})`);
  
  const socket = io('http://localhost:5000');
  
  socket.on('connect', () => {
    socket.emit('authenticateUser', user.username, user.email, user.password, (response) => {
      if (response.success) {
        console.log(`✅ ${user.username} успешно зарегистрирован!`);
      } else {
        console.log(`❌ Ошибка регистрации ${user.username}:`, response.error);
      }
      
      socket.disconnect();
      currentIndex++;
      setTimeout(createNextUser, 500); // Небольшая задержка между запросами
    });
  });
  
  socket.on('error', (error) => {
    console.log(`❌ Ошибка подключения для ${user.username}:`, error);
    socket.disconnect();
    currentIndex++;
    setTimeout(createNextUser, 500);
  });
}

console.log('🚀 Начинаем создание тестовых пользователей...');
createNextUser();

