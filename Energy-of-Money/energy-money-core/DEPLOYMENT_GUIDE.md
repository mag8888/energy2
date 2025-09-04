# 🚀 Руководство по деплою на Vercel

## 📋 Подготовка к деплою

### 1. Настройка проекта
- ✅ Создан `vercel.json` для конфигурации
- ✅ Добавлен `vercel-build` скрипт в `package.json`
- ✅ Настроен CORS для продакшена
- ✅ Создан API роут для Socket.IO

### 2. Переменные окружения в Vercel

В панели Vercel добавьте следующие переменные:

```bash
NODE_ENV=production
SOCKET_IO_CORS_ORIGIN=https://your-domain.vercel.app
JWT_SECRET=your-secret-key-here
SESSION_SECRET=your-session-secret-here
LOG_LEVEL=info
```

### 3. Настройка деплоя

#### В интерфейсе Vercel:

1. **Framework Preset:** `Other`
2. **Root Directory:** `./client`
3. **Build Command:** `npm run vercel-build`
4. **Output Directory:** `build`
5. **Install Command:** `npm install`

### 4. Настройка API роутов

Для Socket.IO сервера:
- Создайте отдельный проект для API
- Используйте `api/index.js` как точку входа
- Настройте переменные окружения

## 🔧 Альтернативный подход

### Вариант 1: Раздельный деплой
- **Frontend:** Vercel (React)
- **Backend:** Railway/Heroku (Node.js + Socket.IO)

### Вариант 2: Полный стек на Vercel
- Используйте Serverless Functions для API
- Настройте WebSocket через Vercel Edge Functions

## 📱 Мобильная адаптация

Проект уже адаптирован для мобильных устройств:
- Адаптивные размеры клеток
- Мобильная боковая панель
- Оптимизированные hover эффекты

## 🚀 Команды для деплоя

```bash
# 1. Подготовка
git add .
git commit -m "Подготовка к деплою на Vercel"
git push

# 2. Деплой через Vercel CLI (опционально)
npm i -g vercel
vercel --prod
```

## 🔍 Проверка после деплоя

1. Откройте сайт в браузере
2. Проверьте подключение Socket.IO
3. Создайте тестовую комнату
4. Проверьте мобильную версию

## 🐛 Возможные проблемы

### Socket.IO не подключается
- Проверьте CORS настройки
- Убедитесь, что API роуты работают
- Проверьте переменные окружения

### Мобильная версия не работает
- Проверьте viewport meta tag
- Убедитесь, что CSS адаптивен
- Проверьте размеры элементов

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь в правильности переменных окружения
3. Проверьте настройки CORS
