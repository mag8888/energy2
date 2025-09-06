import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  LinearProgress,
  Button,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Coffee as CoffeeIcon,
  Timer as TimerIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';

const BreakModal = ({ open, breakEndTime, duration, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(duration || 0);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!open || !breakEndTime) return;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, breakEndTime - now);
      const elapsed = duration - remaining;
      
      setTimeLeft(remaining);
      setProgress(Math.max(0, (elapsed / duration) * 100));
    };

    // Обновляем сразу
    updateTimer();

    // Обновляем каждую секунду
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [open, breakEndTime, duration]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ p: 4, textAlign: 'center' }}>
            {/* Иконка перерыва */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <CoffeeIcon sx={{ 
                fontSize: 80, 
                color: '#fff',
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }} />
            </motion.div>

            {/* Заголовок */}
            <Typography variant="h4" sx={{ 
              color: '#fff',
              fontWeight: 'bold',
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              ☕ Перерыв!
            </Typography>

            <Typography variant="h6" sx={{ 
              color: 'rgba(255,255,255,0.9)',
              mb: 3,
              fontWeight: '300'
            }}>
              Время отдохнуть и восстановить силы
            </Typography>

            {/* Прогресс-бар */}
            <Paper sx={{ 
              p: 3, 
              mb: 3, 
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimerIcon sx={{ color: '#fff', mr: 1 }} />
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                    borderRadius: 4
                  }
                }}
              />
            </Paper>

            {/* Информация о перерыве */}
            <Box sx={{ 
              p: 2, 
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              mb: 3
            }}>
              <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>
                🎮 Игра приостановлена на 10 минут
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Перерывы каждые 50 минут помогают сохранить концентрацию
              </Typography>
            </Box>

            {/* Кнопка закрытия (только для хоста) */}
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={onClose}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                  border: '2px solid rgba(255,255,255,0.5)'
                }
              }}
            >
              Продолжить игру
            </Button>
          </Box>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default BreakModal;



