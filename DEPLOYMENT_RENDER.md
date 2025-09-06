Запуск и деплой проекта mag8888/energy2

Локальный запуск
- Сервер: `cd server && npm install && node index.js` (порт 5000)
- Клиент: `cd client && npm install && npm run build` (для прод) или `npm start` (dev)
- Быстрый старт: из корня `npm run start` запускает сервер и клиент одновременно.

Деплой на Render (один сервис, фронт+бэк)
- Тип: Web Service (Node)
- Ветка: main
- Вариант через Blueprint: файл `render.yaml` уже в репозитории
- Вручную (если без Blueprint):
  - Root Directory: `.`
  - Build Command: `npm --prefix client install --no-audit --no-fund && npm --prefix client run build && npm --prefix server install --no-audit --no-fund`
  - Start Command: `node server/index.js`
  - Health Check Path: `/health`
  - Environment: `NODE_ENV=production`, `NODE_VERSION=20`, `NPM_CONFIG_LEGACY_PEER_DEPS=true`

Что делает сервер
- Раздаёт собранный фронт из `client/build`
- Имеет SPA fallback на `index.html`
- Socket.IO настроен с разрешённым CORS (same-origin в продакшене)
- API: `/health`, `/api/rooms`, `/api/rooms/:roomId`

Проверка после деплоя
- Открыть корень домена — загрузится приложение
- `/health` → `{ status: 'OK' }`
- Консоль браузера: `✅ [Socket] Connected`
- Создание/вход в комнату работает в двух вкладках

