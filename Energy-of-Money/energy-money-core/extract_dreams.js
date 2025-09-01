const fs = require('fs');

// Читаем файл fastTrack.js
const content = fs.readFileSync('client/src/data/fastTrack.js', 'utf8');

// Находим все мечты
const dreamRegex = /id: (\d+),\s*name: '([^']+)',\s*description: '([^']+)',\s*type: 'dream',\s*cost: (\d+)/g;

const dreams = [];
let match;

while ((match = dreamRegex.exec(content)) !== null) {
  dreams.push({
    id: parseInt(match[1]),
    name: match[2],
    description: match[3],
    cost: parseInt(match[4])
  });
}

console.log('Все мечты из большого круга:');
console.log('============================');
dreams.forEach((dream, index) => {
  console.log(`${index + 1}. ID: ${dream.id} | ${dream.name} | ${dream.cost}₽`);
  console.log(`   ${dream.description}`);
  console.log('');
});

console.log(`Всего мечт: ${dreams.length}`);

// Создаем код для RoomSetup.js
console.log('\nКод для RoomSetup.js:');
console.log('====================');
console.log('const dreams = [');
dreams.forEach((dream, index) => {
  const comma = index < dreams.length - 1 ? ',' : '';
  console.log(`  { id: ${dream.id}, name: '${dream.name}', cost: ${dream.cost}, description: '${dream.description}' }${comma}`);
});
console.log('];');

