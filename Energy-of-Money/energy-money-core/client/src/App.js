import React, { useMemo, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Registration from './components/Registration';
import RoomSelection from './components/RoomSelection';
import RoomSetup from './components/RoomSetup';
import OriginalGameBoard from './components/OriginalGameBoard';
import ErrorBoundary from './components/ErrorBoundary';
import socket from './socket';

// 🎮 Интеграция модулей Energy of Money
import { 
  globalGameEngine, 
  integrateWithExistingRooms,
  getGameStatistics 
} from './modules/index.js';

function AppRouter() {
  const navigate = useNavigate();
  // Загружаем сохраненного пользователя из localStorage сразу при инициализации
  const savedUser = localStorage.getItem('energy_of_money_user');
  let initialUser = null;
  
  if (savedUser) {
    try {
      initialUser = JSON.parse(savedUser);
      console.log('✅ [App] Пользователь загружен из localStorage:', initialUser);
    } catch (error) {
      console.error('❌ [App] Ошибка парсинга пользователя:', error);
    }
  } else {
    console.log('⚠️ [App] Пользователь не найден в localStorage');
  }

  const [user, setUser] = useState(initialUser);

  // Логируем изменения user
  useEffect(() => {
    console.log('🔄 [App] Состояние user изменилось:', user);
    console.log('🔄 [App] Тип user:', typeof user);
    console.log('🔄 [App] user === null:', user === null);
  }, [user]);

  const playerData = useMemo(() => {
    console.log('🔄 [App] Обновляем playerData, user:', user);
    console.log('🔄 [App] playerData useMemo вызван, user:', user);
    if (!user) {
      console.log('❌ [App] playerData: null (пользователь не зарегистрирован)');
      return null; // Возвращаем null если пользователь не зарегистрирован
    }
    const data = { id: user.id, username: user.username, email: user.email };
    console.log('✅ [App] playerData создан:', data);
    return data;
  }, [user]);

  const handleRoomSelect = ({ roomId }) => {
    if (!roomId) return;
    navigate(`/room/${roomId}/setup`);
  };

  const handleRegister = (playerData) => {
    setUser(playerData);
    navigate('/'); // Переходим на страницу выбора комнат
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('energy_of_money_user');
    localStorage.removeItem('energy_of_money_player_name');
    
    // Если пользователь не выбрал "Запомнить меня", удаляем сохраненные данные
    const rememberMe = localStorage.getItem('energy_of_money_remember_me');
    if (!rememberMe) {
      localStorage.removeItem('energy_of_money_remember_me');
      console.log('🗑️ [App] Данные для автологина удалены при выходе');
    }
    
    navigate('/register'); // Переходим на страницу регистрации
  };

  const handleSetupComplete = ({ roomId }) => {
    if (!roomId) return;
    navigate(`/room/${roomId}/original`);
  };

  const OriginalGamePage = () => {
    const { roomId } = useParams();
    return (
      <OriginalGameBoard 
        roomId={roomId}
        playerData={playerData}
        onExit={() => navigate('/')}
      />
    );
  };

  return (
    <Routes>
      <Route 
        path="/register" 
        element={<Registration onRegister={handleRegister} />} 
      />
      <Route 
        path="/" 
        element={
          playerData ? (
            <div>
              {/* Кнопки выбора поля */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                padding: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px',
                margin: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
                <button
                  onClick={() => {
                    alert('Кнопка "Поле 1" нажата!');
                    console.log('🎯 [App] Нажата кнопка "Поле 1"');
                    navigate('/room/lobby/setup');
                  }}
                  style={{
                    padding: '15px 30px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 7px 20px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                  }}
                >
                  🎯 Поле 1
                </button>
                <button
                  onClick={() => navigate('/room/lobby/original')}
                  style={{
                    padding: '15px 30px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3, #1976D2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 7px 20px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                  }}
                >
                  🎮 Поле 2 (Оригинал)
                </button>
                <button
                  onClick={() => navigate('/room/lobby/original')}
                  style={{
                    padding: '15px 30px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #FF6B6B, #E53E3E)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 7px 20px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                  }}
                >
                  🔄 Поле 3 (Оригинал)
                </button>
              </div>
              
              {/* Существующий компонент RoomSelection */}
              <RoomSelection playerData={playerData} onRoomSelect={handleRoomSelect} onLogout={handleLogout} />
            </div>
          ) : (
            <Registration onRegister={handleRegister} />
          )
        } 
      />
      <Route 
        path="/room/:roomId/setup" 
        element={
          playerData ? (
            <RoomSetup playerData={playerData} onRoomSetup={handleSetupComplete} />
          ) : (
            <Registration onRegister={handleRegister} />
          )
        } 
      />
      <Route 
        path="/room/:roomId/original" 
        element={
          playerData ? (
            <OriginalGamePage />
          ) : (
            <Registration onRegister={handleRegister} />
          )
        } 
      />
    </Routes>
  );
}

function App() {
      // 🎮 Инициализация игрового движка Energy of Money
    useEffect(() => {
      console.log('🎮 [App] Инициализируем игровой движок Energy of Money...');
    
    // Инициализируем базовые комнаты в игровом движке
    const baseRooms = [
      { roomId: 'lobby', maxPlayers: 2 }
    ];
    
    try {
      integrateWithExistingRooms(baseRooms);
      console.log('✅ [App] Игровой движок Energy of Money инициализирован');
      
      // Логируем статистику
      const stats = getGameStatistics();
      console.log('📊 [App] Статистика игры:', stats);
    } catch (error) {
      console.error('❌ [App] Ошибка инициализации игрового движка:', error);
    }
  }, []);

  // Инициализация сокета (для наглядности логируем подключение)
  useEffect(() => {
    if (!socket) return;
    const onConnect = () => console.log('🔌 [EoM] Socket connected:', socket.id);
    const onError = (error) => {
      console.error('❌ [EoM] Socket error:', error);
      // При критической ошибке сокета перенаправляем на страницу регистрации
      if (window.location.pathname !== '/register') {
        window.location.href = '/register';
      }
    };
    const onDisconnect = (reason) => {
      console.warn('⚠️ [EoM] Socket disconnected:', reason);
      // При отключении от сервера перенаправляем на главную страницу
      if (window.location.pathname.includes('/room/')) {
        window.location.href = '/';
      }
    };
    
    socket.on('connect', onConnect);
    socket.on('error', onError);
    socket.on('disconnect', onDisconnect);
    
    return () => { 
      socket.off('connect', onConnect);
      socket.off('error', onError);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
