import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card,
  CardContent,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import { 
  Add, 
  Settings, 
  Group, 
  Speed, 
  Chat, 
  Lock,
  Public,
  CheckCircle,
  Error
} from '@mui/icons-material';

const RoomCreation = ({ user, onRoomCreated, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxPlayers: 4,
    gameSpeed: 'normal',
    enableChat: true,
    privateRoom: false,
    password: '',
    category: 'casual'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [generatedRoomId, setGeneratedRoomId] = useState(null);

  // Цветовая схема
  const colors = {
    primary: '#8B5CF6',
    primaryDark: '#7C3AED',
    primaryLight: '#F3E8FF',
    secondary: '#A78BFA',
    secondaryDark: '#6D28D9',
    secondaryLight: '#DDD6FE',
    background: '#0F1020',
    surface: '#12142A',
    text: '#EDE9FE',
    textSecondary: '#C4B5FD',
    border: '#2A2F45',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B'
  };

  // Генерация названия комнаты по умолчанию
  useEffect(() => {
    if (!formData.name) {
      const defaultName = `Комната ${user?.username || 'Игрока'}`;
      setFormData(prev => ({ ...prev, name: defaultName }));
    }
  }, [user]);

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название комнаты обязательно';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Название должно содержать минимум 3 символа';
    }

    if (formData.privateRoom && !formData.password) {
      newErrors.password = 'Для приватной комнаты необходим пароль';
    }

    if (formData.password && formData.password.length < 4) {
      newErrors.password = 'Пароль должен содержать минимум 4 символа';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка изменения полей
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку при вводе
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Если убираем приватность, очищаем пароль
    if (field === 'privateRoom' && !value) {
      setFormData(prev => ({ ...prev, password: '' }));
    }
  };

  // Создание комнаты
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          creatorId: user.userId
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Комната создана успешно!' });
        setGeneratedRoomId(data.room.roomId);
        
        setTimeout(() => {
          onRoomCreated(data.room);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Ошибка создания комнаты' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка сети. Попробуйте снова.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Предварительный просмотр настроек
  const getSettingsPreview = () => {
    const preview = [];
    
    preview.push(`Игроков: ${formData.maxPlayers}`);
    preview.push(`Скорость: ${getSpeedLabel(formData.gameSpeed)}`);
    preview.push(`Чат: ${formData.enableChat ? 'Включен' : 'Выключен'}`);
    preview.push(`Тип: ${formData.privateRoom ? 'Приватная' : 'Публичная'}`);
    preview.push(`Категория: ${getCategoryLabel(formData.category)}`);
    
    return preview;
  };

  const getSpeedLabel = (speed) => {
    const labels = {
      slow: 'Медленная',
      normal: 'Обычная',
      fast: 'Быстрая'
    };
    return labels[speed] || speed;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      casual: 'Обычная',
      competitive: 'Соревновательная',
      training: 'Тренировочная',
      tournament: 'Турнирная'
    };
    return labels[category] || category;
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 4
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={8} sx={{
          p: 4,
          width: '100%',
          maxWidth: 600,
          background: colors.surface,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          {/* Заголовок */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ 
              color: colors.primary, 
              fontWeight: 'bold',
              mb: 1
            }}>
              🏠 Создание новой комнаты
            </Typography>
            <Typography variant="body1" sx={{ color: colors.textSecondary }}>
              Настройте параметры комнаты и начните игру
            </Typography>
          </Box>

          {/* Информация о пользователе */}
          <Card sx={{ mb: 3, bgcolor: colors.surface, border: '1px solid '+colors.border }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: colors.primaryDark, mb: 1 }}>
                👤 Создатель: {user?.username}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                ID: {user?.displayId} | Email: {user?.email}
              </Typography>
            </CardContent>
          </Card>

          {/* Форма создания комнаты */}
          <Box component="form" onSubmit={handleCreateRoom}>
            <Grid container spacing={3}>
              {/* Основные настройки */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ color: colors.primary, mb: 2 }}>
                  📝 Основные настройки
                </Typography>
                
                {/* Название комнаты */}
                <TextField
                  fullWidth
                  label="Название комнаты"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{ mb: 2 }}
                />

                {/* Описание */}
                <TextField
                  fullWidth
                  label="Описание (необязательно)"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  sx={{ mb: 2 }}
                />

                {/* Максимум игроков */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Максимум игроков</InputLabel>
                  <Select
                    value={formData.maxPlayers}
                    label="Максимум игроков"
                    onChange={(e) => handleInputChange('maxPlayers', e.target.value)}
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <MenuItem key={num} value={num}>
                        {num} игроков
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Категория */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Категория</InputLabel>
                  <Select
                    value={formData.category}
                    label="Категория"
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <MenuItem value="casual">🎮 Обычная</MenuItem>
                    <MenuItem value="competitive">🏆 Соревновательная</MenuItem>
                    <MenuItem value="training">📚 Тренировочная</MenuItem>
                    <MenuItem value="tournament">🏅 Турнирная</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Игровые настройки */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ color: colors.primary, mb: 2 }}>
                  ⚙️ Игровые настройки
                </Typography>
                
                {/* Скорость игры */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Скорость игры</InputLabel>
                  <Select
                    value={formData.gameSpeed}
                    label="Скорость игры"
                    onChange={(e) => handleInputChange('gameSpeed', e.target.value)}
                  >
                    <MenuItem value="slow">🐌 Медленная</MenuItem>
                    <MenuItem value="normal">⚡ Обычная</MenuItem>
                    <MenuItem value="fast">🚀 Быстрая</MenuItem>
                  </Select>
                </FormControl>

                {/* Дополнительные настройки */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.enableChat}
                      onChange={(e) => handleInputChange('enableChat', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Включить чат"
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.privateRoom}
                      onChange={(e) => handleInputChange('privateRoom', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Приватная комната"
                  sx={{ mb: 2 }}
                />

                {/* Пароль для приватной комнаты */}
                {formData.privateRoom && (
                  <TextField
                    fullWidth
                    label="Пароль комнаты"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={{ mb: 2 }}
                  />
                )}
              </Grid>
            </Grid>

            {/* Предварительный просмотр */}
            <Box sx={{ mt: 3, p: 2, bgcolor: colors.primaryLight, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ color: colors.primaryDark, mb: 1 }}>
                📋 Предварительный просмотр настроек:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {getSettingsPreview().map((setting, index) => (
                  <Chip
                    key={index}
                    label={setting}
                    size="small"
                    sx={{ bgcolor: colors.surface, color: colors.text }}
                  />
                ))}
              </Box>
            </Box>

            {/* Сообщения */}
            {message.text && (
              <Alert 
                severity={message.type} 
                sx={{ mt: 3 }}
                icon={message.type === 'success' ? <CheckCircle /> : <Error />}
              >
                {message.text}
                {generatedRoomId && (
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                    ID комнаты: {generatedRoomId}
                  </Typography>
                )}
              </Alert>
            )}

            {/* Кнопки */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={onBack}
                sx={{
                  borderColor: colors.textSecondary,
                  color: colors.textSecondary,
                  px: 4,
                  py: 1.5
                }}
              >
                ← Назад
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                startIcon={<Add />}
                sx={{
                  bgcolor: colors.primary,
                  color: colors.surface,
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: colors.primaryDark,
                    transform: 'translateY(-1px)',
                    boxShadow: 4
                  },
                  '&:disabled': {
                    bgcolor: colors.border,
                    color: colors.textSecondary
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {isLoading ? '⏳ Создание...' : '🚀 Создать комнату'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default RoomCreation;
