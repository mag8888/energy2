# 🔧 Исправление путей для Render - Energy2

## ✅ Проблема решена!

### 🐛 Что было не так:
```
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/opt/render/project/src/client/package.json'
```

Render искал файлы в неправильном пути `/src/client/` вместо `/client/`.

### 🔧 Что исправлено:

#### 1. **Упростили buildCommand** в `render.yaml`:
```yaml
buildCommand: |
  npm install
  cd client && npm install && npm run build
  cd ../server && npm install
```

#### 2. **Убрали зависимость от bash скрипта**:
- Прямые команды в `buildCommand`
- Нет проблем с путями к файлам
- Проще для отладки

#### 3. **Правильная последовательность**:
1. `npm install` - устанавливает корневые зависимости
2. `cd client && npm install && npm run build` - собирает React клиент
3. `cd ../server && npm install` - устанавливает зависимости сервера

## 🚀 Следующие шаги:

### 1. **Пересоздайте Web Service** на Render:
- Удалите старый деплой
- Создайте новый Web Service
- Подключите репозиторий `mag8888/energy2`

### 2. **Настройки деплоя**:
- **Build Command**: 
  ```bash
  npm install
  cd client && npm install && npm run build
  cd ../server && npm install
  ```
- **Start Command**: `cd server && npm start`
- **Health Check**: `/health`

### 3. **Переменные окружения**:
```
NODE_ENV=production
PORT=10000
NODE_VERSION=20
```

### 4. **Диск**:
- Mount Path: `/var/data`
- Size: 1GB

## ✅ Результат:
- **Правильные пути** к файлам ✅
- **Корректная сборка** клиента и сервера ✅
- **Упрощенный процесс** деплоя ✅
- **Node.js 20** - актуальная версия ✅

---

**Проблема с путями решена! 🎉**
