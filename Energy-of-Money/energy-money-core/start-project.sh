#!/bin/bash

echo "🚀 Запуск проекта Energy of Money..."

# Остановить все процессы на порту 3000
echo "🛑 Очистка порта 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "Порт 3000 свободен"

# Очистить кэш
echo "🧹 Очистка кэша..."
cd client
rm -rf node_modules/.cache

# Запустить проект
echo "🎯 Запуск React приложения..."
npm start
