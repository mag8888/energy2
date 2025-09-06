#!/bin/bash

echo "🤖 Установка Energy of Money Telegram Bot..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Установите Node.js 16+ и попробуйте снова."
    exit 1
fi

# Проверяем версию Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Требуется Node.js версии 16 или выше. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js версии $(node -v) найден"

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install

# Создаем .env файл если его нет
if [ ! -f .env ]; then
    echo "📝 Создаем файл .env..."
    cp env.example .env
    echo "⚠️  Не забудьте отредактировать .env файл и добавить ваш BOT_TOKEN!"
fi

# Создаем папку для логов
mkdir -p logs

echo "✅ Установка завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Получите токен бота у @BotFather в Telegram"
echo "2. Отредактируйте файл .env и добавьте BOT_TOKEN"
echo "3. Запустите бота командой: npm start"
echo ""
echo "🚀 Для запуска в продакшене используйте PM2:"
echo "npm install -g pm2"
echo "pm2 start ecosystem.config.js"
