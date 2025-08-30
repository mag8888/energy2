import React, { useMemo, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Registration from './components/Registration';
import RoomSelection from './components/RoomSelection';
import RoomSetup from './components/RoomSetup';
import GameBoard from './components/GameBoard';
import ErrorBoundary from './components/ErrorBoundary';
import socket from './socket';

function AppRouter() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Загружаем сохраненного пользователя (если есть)
  useEffect(() => {
    const savedUser = localStorage.getItem('energy_of_money_user');
    console.log('🔍 [App] Загружаем пользователя из localStorage:', savedUser);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        console.log('✅ [App] Пользователь загружен:', parsed);
        setUser(parsed);
      } catch (error) {
        console.error('❌ [App] Ошибка парсинга пользователя:', error);
      }
    } else {
      console.log('⚠️ [App] Пользователь не найден в localStorage');
    }
  }, []);

  const playerData = useMemo(() => {
    console.log('🔄 [App] Обновляем playerData, user:', user);
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
    navigate('/register'); // Переходим на страницу регистрации
  };

  const handleSetupComplete = ({ roomId }) => {
    if (!roomId) return;
    navigate(`/room/${roomId}/game`);
  };

  const GamePage = () => {
    const { roomId } = useParams();
    return (
      <GameBoard 
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
            <RoomSelection playerData={playerData} onRoomSelect={handleRoomSelect} onLogout={handleLogout} />
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
        path="/room/:roomId/game" 
        element={
          playerData ? (
            <GamePage />
          ) : (
            <Registration onRegister={handleRegister} />
          )
        } 
      />
    </Routes>
  );
}

function App() {
  // Инициализация сокета (для наглядности логируем подключение)
  useEffect(() => {
    if (!socket) return;
    const onConnect = () => console.log('🔌 [EoM] Socket connected:', socket.id);
    socket.on('connect', onConnect);
    return () => { socket.off('connect', onConnect); };
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
