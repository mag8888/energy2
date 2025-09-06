import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  Paper,
  Avatar
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Group as GroupIcon,
  Gamepad as GameIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import AuthForm from './components/AuthForm';
import RoomsPage from './pages/RoomsPage';
import GameBoard from './components/GameBoard';
import OriginalGameBoard from './components/original/OriginalGameBoard.full';
import socket from './socket';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
  // Original board toggle (persisted)
  const [useOriginalBoard, setUseOriginalBoard] = useState(() => {
    try {
      const qs = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      if (qs && qs.get('original') === '1') return true;
      return localStorage.getItem('use_original_board') === '1';
    } catch { return false; }
  });

  const toggleOriginalBoard = () => {
    setUseOriginalBoard(prev => {
      const next = !prev;
      try {
        localStorage.setItem('use_original_board', next ? '1' : '0');
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          if (next) url.searchParams.set('original', '1');
          else url.searchParams.delete('original');
          window.history.replaceState({}, '', url);
        }
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь
    const savedUser = localStorage.getItem('energy_of_money_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setCurrentPage('rooms');
      } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error);
        localStorage.removeItem('energy_of_money_user');
      }
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('rooms');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setCurrentGame(null);
    localStorage.removeItem('energy_of_money_user');
    // Socket остается активным для переподключения
  };

  const handleGameStart = (gameRoom) => {
    setCurrentGame(gameRoom);
    setCurrentPage('game');
  };

  const handleExitGame = () => {
    setCurrentGame(null);
    setCurrentPage('rooms');
  };

  const renderPage = () => {
    if (!user) {
      return <AuthForm onAuthSuccess={handleAuthSuccess} />;
    }

    switch (currentPage) {
      case 'rooms':
        console.log('🔌 [App] Rendering RoomsPage with socket:', socket);
        return <RoomsPage socket={socket} user={user} onGameStart={handleGameStart} />;
      case 'game':{
        if (useOriginalBoard){
          return (
            <OriginalGameBoard roomId={currentGame?.id} socket={socket} user={user} onExit={handleExitGame} />
          );
        }
        return (
          <GameBoard 
            roomId={currentGame?.id} 
            socket={socket} 
            user={user} 
            onExit={handleExitGame}
          />
        );
      }
      case 'original-preview':{
        const demoUser = user || { id: 'demo_'+Date.now(), username: 'Demo User', email: 'demo@example.com' };
        return (
          <OriginalGameBoard roomId={'demo-room'} socket={socket} user={demoUser} onExit={() => setCurrentPage('home')} />
        );
      }
      case 'home':
      default:
        return (
          <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <Avatar sx={{ mr: 2, width: 64, height: 64, bgcolor: 'primary.main' }}>
                  <PersonIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="h4" gutterBottom>
                    👋 Привет, {user.username}!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    ID: {user.id} | Email: {user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Игр сыграно: {user.gameStats?.gamesPlayed || 0} | Побед: {user.gameStats?.gamesWon || 0}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h5" color="text.secondary" gutterBottom>
                🚀 Energy of Money
              </Typography>
              <Typography variant="body1" sx={{ mt: 3, mb: 4 }}>
                Создавайте комнаты, присоединяйтесь к играм и развивайте свои финансовые навыки!
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<GroupIcon />}
                  onClick={() => setCurrentPage('rooms')}
                >
                  🏠 Управление комнатами
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<GameIcon />}
                  onClick={() => setCurrentPage('rooms')}
                >
                  🎮 Начать игру
                </Button>
              </Box>
            </Paper>
          </Container>
        );
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🚀 Energy of Money
          </Typography>
          
          {user && (
            <>
              <Button 
                color="inherit" 
                startIcon={<HomeIcon />}
                onClick={() => setCurrentPage('home')}
              >
                Главная
              </Button>
              
              <Button 
                color="inherit" 
                startIcon={<GroupIcon />}
                onClick={() => setCurrentPage('rooms')}
              >
                Комнаты
              </Button>
              
              <Button 
                variant="outlined"
                color="inherit"
                onClick={toggleOriginalBoard}
                sx={{ ml: 1 }}
              >
                Original: {useOriginalBoard ? 'ON' : 'OFF'}
              </Button>

              <Button 
                variant="contained"
                color="secondary"
                onClick={() => { setCurrentGame({ id: 'demo-room' }); setCurrentPage('original-preview'); }}
                sx={{ ml: 1 }}
              >
                Открыть Original
              </Button>
              
              {currentGame && (
                <Button 
                  color="inherit" 
                  startIcon={<GameIcon />}
                  onClick={() => setCurrentPage('game')}
                >
                  Игра
                </Button>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <Avatar sx={{ mr: 1, width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {user.username}
                </Typography>
                <Button 
                  color="inherit" 
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  size="small"
                >
                  Выйти
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <main>
        {renderPage()}
      </main>
    </Box>
  );
}

export default App;
