#!/bin/bash

echo "🚀 Запуск Cashflow Game..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Запустите скрипт из корневой папки проекта."
    exit 1
fi

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm install
fi

# Проверяем зависимости в server
if [ ! -d "server/node_modules" ]; then
    echo "📦 Устанавливаем зависимости сервера..."
    cd server && npm install && cd ..
fi

# Проверяем зависимости в client
if [ ! -d "client/node_modules" ]; then
    echo "📦 Устанавливаем зависимости клиента..."
    cd client && npm install && cd ..
fi

echo "✅ Все зависимости установлены!"

# Запускаем проект
echo "🎮 Запускаем Cashflow Game..."
npm run dev
