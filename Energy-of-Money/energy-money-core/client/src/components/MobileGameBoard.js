import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { originalBoard } from '../data/fastTrack';

const MobileGameBoard = ({ onCellClick }) => {
  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      minHeight: '400px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
    }}>
      
      {/* Центральная область с логотипом */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '120px',
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%)',
        borderRadius: '15px',
        border: '2px solid rgba(255, 215, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '15px'
      }}>
        <Box sx={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4)',
          position: 'relative'
        }}>
          <Typography sx={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#FFD700',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.8)'
          }}>
            $
          </Typography>
        </Box>
      </Box>

      {/* Верхний ряд клеток (1-8) */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '8px',
        marginBottom: '10px'
      }}>
        {originalBoard.slice(0, 8).map((cell, i) => (
          <motion.div
            key={cell.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Box
              onClick={() => onCellClick && onCellClick(cell)}
              sx={{
                width: '35px',
                height: '35px',
                background: `linear-gradient(135deg, ${cell.color} 0%, ${cell.color}DD 100%)`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.2)',
                  zIndex: 10
                }
              }}
              title={`${cell.name} — ${cell.description}`}
            >
              <Typography sx={{ fontSize: '14px' }}>
                {cell.icon}
              </Typography>
              <Typography sx={{
                position: 'absolute',
                top: '1px',
                left: '2px',
                fontSize: '8px',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}>
                {cell.id}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>

      {/* Средние ряды (9-16 и 17-24) */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '8px',
        marginBottom: '10px'
      }}>
        {originalBoard.slice(8, 16).map((cell, i) => (
          <motion.div
            key={cell.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: (i + 8) * 0.1, duration: 0.4 }}
          >
            <Box
              onClick={() => onCellClick && onCellClick(cell)}
              sx={{
                width: '35px',
                height: '35px',
                background: `linear-gradient(135deg, ${cell.color} 0%, ${cell.color}DD 100%)`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.2)',
                  zIndex: 10
                }
              }}
              title={`${cell.name} — ${cell.description}`}
            >
              <Typography sx={{ fontSize: '14px' }}>
                {cell.icon}
              </Typography>
              <Typography sx={{
                position: 'absolute',
                top: '1px',
                left: '2px',
                fontSize: '8px',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}>
                {cell.id}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '8px',
        marginBottom: '15px'
      }}>
        {originalBoard.slice(16, 24).map((cell, i) => (
          <motion.div
            key={cell.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: (i + 16) * 0.1, duration: 0.4 }}
          >
            <Box
              onClick={() => onCellClick && onCellClick(cell)}
              sx={{
                width: '35px',
                height: '35px',
                background: `linear-gradient(135deg, ${cell.color} 0%, ${cell.color}DD 100%)`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.2)',
                  zIndex: 10
                }
              }}
              title={`${cell.name} — ${cell.description}`}
            >
              <Typography sx={{ fontSize: '14px' }}>
                {cell.icon}
              </Typography>
              <Typography sx={{
                position: 'absolute',
                top: '1px',
                left: '2px',
                fontSize: '8px',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}>
                {cell.id}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>

      {/* Внешние клетки - горизонтальные ряды */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Верхний ряд внешних клеток (25-38) */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '6px'
        }}>
          {originalBoard.slice(24, 38).map((cell, i) => (
            <motion.div
              key={cell.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: (i + 24) * 0.05, duration: 0.3 }}
            >
              <Box
                onClick={() => onCellClick && onCellClick(cell)}
                sx={{
                  width: '28px',
                  height: '28px',
                  background: `linear-gradient(135deg, ${cell.color} 0%, ${cell.color}DD 100%)`,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  position: 'relative',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.3)',
                    zIndex: 10
                  }
                }}
                title={`${cell.name} — ${cell.description}`}
              >
                <Typography sx={{ fontSize: '12px' }}>
                  {cell.icon}
                </Typography>
                <Typography sx={{
                  position: 'absolute',
                  top: '0px',
                  left: '1px',
                  fontSize: '6px',
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>
                  {cell.id}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* Нижний ряд внешних клеток (39-52) */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '6px'
        }}>
          {originalBoard.slice(38, 52).map((cell, i) => (
            <motion.div
              key={cell.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: (i + 38) * 0.05, duration: 0.3 }}
            >
              <Box
                onClick={() => onCellClick && onCellClick(cell)}
                sx={{
                  width: '28px',
                  height: '28px',
                  background: `linear-gradient(135deg, ${cell.color} 0%, ${cell.color}DD 100%)`,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  position: 'relative',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.3)',
                    zIndex: 10
                  }
                }}
                title={`${cell.name} — ${cell.description}`}
              >
                <Typography sx={{ fontSize: '12px' }}>
                  {cell.icon}
                </Typography>
                <Typography sx={{
                  position: 'absolute',
                  top: '0px',
                  left: '1px',
                  fontSize: '6px',
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>
                  {cell.id}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Угловые карточки */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px'
      }}>
        {/* Большая сделка */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Box
            onClick={() => onCellClick && onCellClick({ type: 'bigDeal', name: 'Большая сделка' })}
            sx={{
              width: '60px',
              height: '40px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
            title="Большая сделка"
          >
            💼
          </Box>
        </motion.div>

        {/* Малая сделка */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Box
            onClick={() => onCellClick && onCellClick({ type: 'smallDeal', name: 'Малая сделка' })}
            sx={{
              width: '60px',
              height: '40px',
              background: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
            title="Малая сделка"
          >
            📄
          </Box>
        </motion.div>

        {/* Рынок */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <Box
            onClick={() => onCellClick && onCellClick({ type: 'market', name: 'Рынок' })}
            sx={{
              width: '60px',
              height: '40px',
              background: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
            title="Рынок"
          >
            🏪
          </Box>
        </motion.div>

        {/* Расходы */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <Box
            onClick={() => onCellClick && onCellClick({ type: 'expense', name: 'Расходы' })}
            sx={{
              width: '60px',
              height: '40px',
              background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
            title="Расходы"
          >
            💸
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default MobileGameBoard;

