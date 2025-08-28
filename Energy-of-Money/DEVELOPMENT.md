# 🛠️ Руководство разработчика

## 🚀 Быстрый старт

### Установка зависимостей
```bash
# Установка всех зависимостей
npm run install:all

# Или по отдельности
npm install                    # Корневые зависимости
cd client && npm install      # Зависимости клиента
cd server && npm install      # Зависимости сервера
```

### Запуск в режиме разработки
```bash
# Запуск клиента и сервера одновременно
npm run dev

# Или по отдельности
npm run dev:client    # Клиент на порту 3000
npm run dev:server    # Сервер на порту 5000
```

## 📁 Структура проекта

```
Energy-of-Money/
├── client/                 # React клиент
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── hooks/         # Кастомные хуки
│   │   ├── data/          # Игровые данные
│   │   ├── styles/        # Стили и темы
│   │   └── utils/         # Утилиты
├── server/                 # Node.js сервер
│   ├── models/            # Модели данных
│   ├── routes/            # API маршруты
│   ├── services/          # Бизнес-логика
│   └── utils/             # Утилиты сервера
└── shared/                # Общие модули
```

## 🔧 Основные команды

```bash
# Разработка
npm run dev              # Запуск клиента + сервера
npm run build            # Сборка для продакшена
npm run test             # Запуск тестов
npm run lint             # Проверка кода

# Клиент
npm run dev:client       # Запуск только клиента
npm run build:client     # Сборка клиента
npm run test:client      # Тесты клиента

# Сервер
npm run dev:server       # Запуск только сервера
npm run build:server     # Сборка сервера
npm run test:server      # Тесты сервера
```

## 🌐 Порты

- **Клиент**: http://localhost:3000
- **Сервер**: http://localhost:5000
- **API**: http://localhost:5000/api

## 🎮 Игровые механики

### Профессии
- Каждая профессия имеет уникальные характеристики
- Зарплата, расходы, кредиты
- Возможность улучшения через игру

### Игровое поле
- Классическая доска "Денежный поток"
- Различные типы клеток (доход, расход, возможность)
- Система кубиков и перемещений

### Мультиплеер
- Система комнат для игры
- Socket.IO для real-time взаимодействия
- Синхронизация состояния между игроками

## 🐛 Отладка

### Клиент
```javascript
// Включение детального логирования
localStorage.setItem('debug', 'energy-of-money:*');

// Логирование состояния игры
console.log('🎮 Game State:', gameState);
```

### Сервер
```javascript
// Логирование Socket.IO событий
socket.onAny((eventName, ...args) => {
  console.log('🔌 Event:', eventName, args);
});
```

### База данных
```javascript
// MongoDB (если используется)
mongoose.set('debug', true);
```

## 📊 Производительность

### Оптимизации React
- Используйте `React.memo()` для тяжелых компонентов
- Применяйте `useCallback` и `useMemo` для функций и вычислений
- Разбивайте большие компоненты на меньшие

### Оптимизации Socket.IO
- Ограничивайте частоту обновлений
- Используйте throttling для частых событий
- Группируйте обновления состояния

## 🧪 Тестирование

```bash
# Запуск всех тестов
npm test

# Тесты с coverage
npm run test:coverage

# Тесты в watch режиме
npm run test:watch
```

## 🚀 Деплой

### Подготовка к продакшену
```bash
# Сборка клиента
npm run build:client

# Сборка сервера
npm run build:server

# Проверка сборки
npm run build
```

### Переменные окружения
```bash
# .env.production
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/energy-of-money
```

## 🤝 Вклад в проект

1. Создайте feature branch
2. Внесите изменения
3. Добавьте тесты
4. Создайте Pull Request

## 📚 Полезные ссылки

- [React Documentation](https://reactjs.org/docs/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
