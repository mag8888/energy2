import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { connectSocket } from '../socket';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon
} from '@mui/icons-material';

const Registration = ({ onRegister }) => {
  // Состояние формы
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  // Состояние "Запомнить меня"
  const [rememberMe, setRememberMe] = useState(false);
  
  // Состояние UI
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetPasswordMessage, setResetPasswordMessage] = useState('');

  // Шаги регистрации
  const steps = ['Email', 'Username', 'Password'];

  // Подключение к Socket.IO при монтировании
  useEffect(() => {
    console.log('🔌 [Registration] Component mounted, connecting to socket...');
    connectSocket().catch(console.error);
    
    // Проверяем сохраненные данные для автологина
    const savedCredentials = localStorage.getItem('energy_of_money_remember_me');
    if (savedCredentials) {
      try {
        const credentials = JSON.parse(savedCredentials);
        console.log('🔐 [Registration] Найдены сохраненные данные для автологина:', credentials.email);
        
        // Заполняем форму сохраненными данными
        setFormData(prev => ({
          ...prev,
          email: credentials.email || '',
          password: credentials.password || ''
        }));
        setRememberMe(true);
        
        // Автоматически пытаемся войти
        setTimeout(() => {
          if (credentials.email && credentials.password) {
            console.log('🔐 [Registration] Выполняем автоматический вход...');
            handleAutoLogin(credentials.email, credentials.password);
          }
        }, 1000);
      } catch (error) {
        console.error('❌ [Registration] Ошибка парсинга сохраненных данных:', error);
        localStorage.removeItem('energy_of_money_remember_me');
      }
    }
  }, []);

  // Очистка ошибок при изменении шага
  useEffect(() => {
    setError('');
  }, [currentStep]);

  // Обработчик изменения полей формы
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Очищаем ошибки при вводе
  }, []);

  // Валидация email
  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }, []);

  // Валидация username
  const validateUsername = useCallback((username) => {
    return username.trim().length >= 2;
  }, []);

  // Валидация password
  const validatePassword = useCallback((password) => {
    return password.length >= 6;
  }, []);

  // Функция автоматического входа
  const handleAutoLogin = useCallback(async (email, password) => {
    console.log('🔐 [Registration] Выполняем автоматический вход для:', email);
    setIsLoading(true);
    setError('');

    try {
      const socket = await connectSocket();
      
      // Проверяем существование пользователя
      socket.emit('checkUserExists', email, (response) => {
        if (response.exists) {
          console.log('🔐 [Registration] Пользователь найден, выполняем вход...');
          
          // Выполняем вход
          socket.emit('authenticateUser', '', email, password, (authResponse) => {
            if (authResponse.success) {
              console.log('✅ [Registration] Автоматический вход успешен:', authResponse.userData);
              
              // Сохраняем данные если включено "Запомнить меня"
              if (rememberMe) {
                const credentials = { email, password };
                localStorage.setItem('energy_of_money_remember_me', JSON.stringify(credentials));
                console.log('💾 [Registration] Данные для автологина сохранены');
              }
              
              onRegister(authResponse.userData);
            } else {
              console.log('❌ [Registration] Автоматический вход не удался:', authResponse.error);
              setError('Автоматический вход не удался. Введите данные вручную.');
              // Удаляем неверные данные
              localStorage.removeItem('energy_of_money_remember_me');
            }
            setIsLoading(false);
          });
        } else {
          console.log('❌ [Registration] Пользователь не найден для автологина');
          setError('Сохраненные данные устарели. Введите данные вручную.');
          localStorage.removeItem('energy_of_money_remember_me');
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error('❌ [Registration] Ошибка автоматического входа:', error);
      setError('Ошибка автоматического входа. Попробуйте войти вручную.');
      setIsLoading(false);
    }
  }, [rememberMe, onRegister]);

  // Проверка существования пользователя
  const checkUserExists = useCallback(async () => {
    if (!validateEmail(formData.email)) {
      setError('Введите корректный email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const socket = await connectSocket();
      
      // Проверяем существование пользователя через WebSocket
      socket.emit('checkUserExists', formData.email, (response) => {
        if (response.exists) {
          setIsExistingUser(true);
          setCurrentStep(1); // Переходим к вводу username
          console.log('🔍 [Registration] User exists, proceeding to username step');
        } else {
          setIsExistingUser(false);
          setCurrentStep(1); // Переходим к вводу username для нового пользователя
          console.log('🔍 [Registration] New user, proceeding to username step');
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('❌ [Registration] Error checking user:', error);
      setError('Ошибка при проверке пользователя. Попробуйте еще раз.');
      setIsLoading(false);
    }
  }, [formData.email, validateEmail]);

  // Проверка уникальности username
  const checkUsernameUnique = useCallback(async () => {
    if (!validateUsername(formData.username)) {
      setError('Имя должно содержать минимум 2 символа');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const socket = await connectSocket();
      
      // Проверяем уникальность username через WebSocket
      socket.emit('checkUsernameUnique', formData.username, (response) => {
        if (response.unique) {
          if (isExistingUser) {
            // Существующий пользователь - переходим к вводу пароля
            setCurrentStep(2);
            console.log('✅ [Registration] Username confirmed for existing user');
          } else {
            // Новый пользователь - переходим к вводу пароля
            setCurrentStep(2);
            console.log('✅ [Registration] Username is unique for new user');
          }
        } else {
          setError('Пользователь с таким именем уже существует. Выберите другое имя.');
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('❌ [Registration] Error checking username:', error);
      setError('Ошибка при проверке имени. Попробуйте еще раз.');
      setIsLoading(false);
    }
  }, [formData.username, validateUsername, isExistingUser]);

  // Финальная обработка формы
  const handleFinalSubmit = useCallback(async () => {
    if (isExistingUser) {
      // Для существующих пользователей проверяем только пароль
      if (!validatePassword(formData.password)) {
        setError('Пароль должен содержать минимум 6 символов');
        return;
      }
    } else {
      // Для новых пользователей проверяем username и пароль
      if (!validateUsername(formData.username)) {
        setError('Имя должно содержать минимум 2 символа');
        return;
      }
      if (!validatePassword(formData.password)) {
        setError('Пароль должен содержать минимум 6 символов');
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      const socket = await connectSocket();
      
      // Отправляем данные для аутентификации/регистрации через WebSocket
      socket.emit('authenticateUser', formData.username, formData.email, formData.password, (response) => {
        if (response.success) {
          console.log('✅ [Registration] User authenticated:', response.userData);
          
          // Сохраняем данные если включено "Запомнить меня"
          if (rememberMe) {
            const credentials = { 
              email: formData.email, 
              password: formData.password 
            };
            localStorage.setItem('energy_of_money_remember_me', JSON.stringify(credentials));
            console.log('💾 [Registration] Данные для автологина сохранены');
          } else {
            // Удаляем сохраненные данные если "Запомнить меня" отключено
            localStorage.removeItem('energy_of_money_remember_me');
            console.log('🗑️ [Registration] Данные для автологина удалены');
          }
          
          onRegister(response.userData);
        } else {
          setError(response.error || 'Ошибка при аутентификации. Попробуйте еще раз.');
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('❌ [Registration] Error during authentication:', error);
      setError('Ошибка при аутентификации. Попробуйте еще раз.');
      setIsLoading(false);
    }
  }, [formData, validatePassword, validateUsername, isExistingUser, rememberMe, onRegister]);

  // Обработчик отправки формы
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('🎯 [Registration] Form submitted at step:', currentStep);

    switch (currentStep) {
      case 0:
        checkUserExists();
        break;
      case 1:
        if (isExistingUser) {
          // Для существующих пользователей - сразу финальная отправка
          handleFinalSubmit();
        } else {
          // Для новых пользователей - проверка уникальности username
          checkUsernameUnique();
        }
        break;
      case 2:
        handleFinalSubmit();
        break;
      default:
        console.error('❌ [Registration] Invalid step:', currentStep);
    }
  }, [currentStep, checkUserExists, checkUsernameUnique, handleFinalSubmit, isExistingUser]);

  // Обработчик сброса пароля
  const handleResetPassword = useCallback(async () => {
    if (!validateEmail(formData.email)) {
      setError('Введите корректный email для сброса пароля');
      return;
    }

    setIsResettingPassword(true);
    setError('');

    try {
      // Эмулируем сброс пароля (в реальном приложении здесь будет API вызов)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResetPasswordMessage('Инструкции по сбросу пароля отправлены на ваш email');
      console.log('📧 [Registration] Password reset requested for:', formData.email);
    } catch (error) {
      console.error('❌ [Registration] Error resetting password:', error);
      setError('Ошибка при сбросе пароля. Попробуйте еще раз.');
    } finally {
      setIsResettingPassword(false);
    }
  }, [formData.email, validateEmail]);

  // Переход к предыдущему шагу
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  }, [currentStep]);

  // Переход к следующему шагу
  const goToNextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  }, [currentStep, steps.length]);

  // Получение заголовка для текущего шага
  const getStepTitle = useCallback(() => {
    if (currentStep === 0) return 'Введите ваш email';
    if (currentStep === 1) return isExistingUser ? 'Подтвердите имя пользователя' : 'Выберите имя пользователя';
    if (currentStep === 2) return isExistingUser ? 'Введите пароль' : 'Создайте пароль';
    return '';
  }, [currentStep, isExistingUser]);

  // Получение описания для текущего шага
  const getStepDescription = useCallback(() => {
    if (currentStep === 0) return 'Мы проверим, есть ли у вас аккаунт';
    if (currentStep === 1) return isExistingUser ? 'Подтвердите ваше имя пользователя' : 'Выберите уникальное имя для игры';
    if (currentStep === 2) return isExistingUser ? 'Введите пароль для входа' : 'Создайте надежный пароль';
    return '';
  }, [currentStep, isExistingUser]);

  // Обработчик нажатия клавиши Enter
  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      switch (currentStep) {
        case 0:
          if (formData.email.trim() && !isLoading) {
            checkUserExists();
          }
          break;
        case 1:
          if (isExistingUser) {
            if (formData.password && !isLoading) {
              handleFinalSubmit();
            }
          } else {
            if (formData.username.trim() && !isLoading) {
              checkUsernameUnique();
            }
          }
          break;
        case 2:
          if (formData.password && !isLoading) {
            handleFinalSubmit();
          }
          break;
        default:
          break;
      }
    }
  }, [currentStep, formData, isLoading, checkUserExists, checkUsernameUnique, handleFinalSubmit, isExistingUser]);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 500,
          width: '100%',
          padding: 4,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Заголовок */}
        <Box textAlign="center" mb={4}>
          <Box
            component={motion.div}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            sx={{ fontSize: '3rem', mb: 2 }}
          >
            🎮
          </Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Energy of Money
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {getStepTitle()}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            {getStepDescription()}
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Форма */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* Шаг 0: Email */}
          {currentStep === 0 && (
            <Box>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="example@email.com"
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ mb: 2 }}
                disabled={isLoading}
              />
              
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={isLoading || !formData.email.trim()}
                sx={{ mb: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Продолжить'}
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={handleResetPassword}
                disabled={isResettingPassword || !formData.email.trim()}
                size="small"
              >
                {isResettingPassword ? <CircularProgress size={16} /> : 'Забыли пароль?'}
              </Button>
            </Box>
          )}

          {/* Шаг 1: Username (для новых пользователей) или Password (для существующих) */}
          {currentStep === 1 && (
            <Box>
              {!isExistingUser ? (
                // Для новых пользователей - поле username
                <>
                  <TextField
                    fullWidth
                    label="Имя пользователя"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите ваше имя"
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{ mb: 2 }}
                    disabled={isLoading}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={goToPreviousStep}
                      disabled={isLoading}
                      sx={{ flex: 1 }}
                    >
                      Назад
                    </Button>
                    <Button
                      variant="contained"
                      onClick={goToNextStep}
                      disabled={isLoading || !formData.username.trim()}
                      sx={{ flex: 1 }}
                    >
                      {isLoading ? <CircularProgress size={24} /> : 'Продолжить'}
                    </Button>
                  </Box>
                </>
              ) : (
                // Для существующих пользователей - поле password
                <>
                  <TextField
                    fullWidth
                    label="Пароль"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите пароль"
                    InputProps={{
                      startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{ mb: 2 }}
                    disabled={isLoading}
                  />
                  
                  {/* Чекбокс "Запомнить меня" для существующих пользователей */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 }
                  }}
                  onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe ? (
                      <CheckBoxIcon sx={{ color: '#667eea', mr: 1 }} />
                    ) : (
                      <CheckBoxOutlineBlankIcon sx={{ color: '#667eea', mr: 1 }} />
                    )}
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Запомнить меня
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={goToPreviousStep}
                      disabled={isLoading}
                      sx={{ flex: 1 }}
                    >
                      Назад
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isLoading || !formData.password}
                      sx={{ flex: 1 }}
                    >
                      {isLoading ? <CircularProgress size={24} /> : 'Войти'}
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          )}

          {/* Шаг 2: Password */}
          {currentStep === 2 && (
            <Box>
              <TextField
                fullWidth
                label={isExistingUser ? "Пароль" : "Создайте пароль"}
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isExistingUser ? "Введите пароль" : "Минимум 6 символов"}
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ mb: 2 }}
                disabled={isLoading}
              />
              
              {/* Чекбокс "Запомнить меня" (только для существующих пользователей) */}
              {isExistingUser && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
                onClick={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe ? (
                    <CheckBoxIcon sx={{ color: '#667eea', mr: 1 }} />
                  ) : (
                    <CheckBoxOutlineBlankIcon sx={{ color: '#667eea', mr: 1 }} />
                  )}
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Запомнить меня
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={goToPreviousStep}
                  disabled={isLoading}
                  sx={{ flex: 1 }}
                >
                  Назад
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isLoading || !formData.password}
                  sx={{ flex: 1 }}
                >
                  {isLoading ? <CircularProgress size={24} /> : (isExistingUser ? 'Войти' : 'Создать аккаунт')}
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Сообщения об ошибках */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Сообщение о сбросе пароля */}
        {resetPasswordMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {resetPasswordMessage}
          </Alert>
        )}

        {/* Информация о шаге */}
        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="text.secondary">
            Шаг {currentStep + 1} из {steps.length}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Registration;
