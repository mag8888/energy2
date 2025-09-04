# Energy Money Core

Независимая версия основных компонентов игры "Energy of Money".

## Структура проекта

### Клиентская часть (`client/`)
- **Регистрация и авторизация**: `Registration.js`
- **Создание и редактирование комнат**: `RoomSetup.js`, `RoomSelection.js`
- **Игровая комната**: `GameBoard.js` - основное игровое поле
- **Вспомогательные компоненты**: `ProfessionModal.js`, `ErrorBoundary.js`
- **Стили и данные**: папки `styles/`, `data/`, `hooks/`

### Серверная часть (`server/`)
- **Основной сервер**: `index.js`
- **База данных**: `database.js`, `db-manager.js`
- **Email сервис**: `email-service.js`, `email-config.js`
- **Модели данных**: папка `models/`
- **Общая логика**: папка `shared/`

### Общие файлы (`shared/`)
- Константы и игровая логика
- Настройки комнат

## Установка и запуск

### Клиент
```bash
cd client
npm install
npm start
```

### Сервер
```bash
cd server
npm install
npm start
```

## Основные функции

1. **Система регистрации и авторизации** - полная аутентификация пользователей
2. **Управление комнатами** - создание, редактирование, выбор игровых комнат
3. **Игровое поле** - основная игровая механика с игровым полем

## Зависимости

Все необходимые зависимости указаны в `package.json` файлах клиента и сервера.
# Force Vercel update Thu Sep  4 21:27:54 MSK 2025
# Force Vercel update Thu Sep  4 21:33:10 MSK 2025
# Force Vercel update Thu Sep  4 21:37:12 MSK 2025
# Force Vercel update Thu Sep  4 21:46:06 MSK 2025
