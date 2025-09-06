import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Chip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';

const ProfessionDetails = ({ 
  profession, 
  isOpen, 
  onClose, 
  isSelected, 
  onClick, 
  onDetailsClick 
}) => {
  if (!profession) return null;

  const formatCurrency = (amount) => `$${amount?.toLocaleString() || '0'}`;

  // Если это модальный режим
  if (isOpen !== undefined) {
    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
            border: '2px solid #4a90e2'
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ position: 'relative' }}>
            {onClose && (
              <IconButton
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  zIndex: 1,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
            <ProfessionContent profession={profession} formatCurrency={formatCurrency} />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  // Обычный режим карточки
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Paper
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
          borderRadius: 2,
          border: isSelected ? '3px solid #4caf50' : '2px solid #4a90e2',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? {
            transform: 'translateY(-4px)',
            boxShadow: 8
          } : {}
        }}
        onClick={onClick}
      >
        <ProfessionContent profession={profession} formatCurrency={formatCurrency} />
        
        {/* Кнопка подробнее */}
        {onDetailsClick && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDetailsClick(profession);
              }}
              sx={{
                borderColor: '#4a90e2',
                color: '#4a90e2',
                '&:hover': {
                  borderColor: '#4a90e2',
                  backgroundColor: 'rgba(74, 144, 226, 0.1)'
                }
              }}
            >
              📋 Подробнее
            </Button>
          </Box>
        )}

        {/* Статус выбора */}
        {isSelected && (
          <Box sx={{ 
            textAlign: 'center', 
            p: 1, 
            bgcolor: '#4caf50', 
            color: 'white',
            borderRadius: 2,
            fontWeight: 'bold',
            fontSize: '0.8rem',
            mt: 2
          }}>
            ✅ ВЫБРАНО
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

// Вынесем содержимое в отдельный компонент
const ProfessionContent = ({ profession, formatCurrency }) => {
  return (
    <>
      {/* Заголовок */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          {profession.icon} {profession.name}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#7f8c8d', mt: 1 }}>
          {profession.description}
        </Typography>
      </Box>

      {/* Финансовая сводка как в примере */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ 
          textAlign: 'center', 
          mb: 2, 
          fontWeight: 'bold',
          color: '#2c3e50'
        }}>
          💰 Финансовая сводка
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              bgcolor: '#e8f5e8', 
              borderRadius: 2,
              border: '2px solid #4caf50'
            }}>
              <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                {formatCurrency(profession.salary)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                Зарплата
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              bgcolor: '#fff3e0', 
              borderRadius: 2,
              border: '2px solid #ff9800'
            }}>
              <Typography variant="h5" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                {formatCurrency(profession.totalExpenses)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                Расходы
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              bgcolor: profession.cashFlow >= 0 ? '#e8f5e8' : '#ffebee', 
              borderRadius: 2,
              border: `2px solid ${profession.cashFlow >= 0 ? '#4caf50' : '#f44336'}`
            }}>
              <Typography variant="h5" sx={{ 
                color: profession.cashFlow >= 0 ? '#2e7d32' : '#d32f2f', 
                fontWeight: 'bold' 
              }}>
                {formatCurrency(profession.cashFlow)}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: profession.cashFlow >= 0 ? '#2e7d32' : '#d32f2f', 
                fontWeight: 'bold' 
              }}>
                Денежный поток
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Детализация расходов как в примере */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ 
          textAlign: 'center', 
          mb: 2, 
          fontWeight: 'bold',
          color: '#2c3e50'
        }}>
          📊 Детализация расходов
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              bgcolor: '#fff3e0', 
              borderRadius: 2,
              border: '2px solid #ff9800'
            }}>
              <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                {formatCurrency(profession.taxAmount)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                Налоги ({Math.round(profession.taxRate * 100)}% от зарплаты)
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              bgcolor: '#fff3e0', 
              borderRadius: 2,
              border: '2px solid #ff9800'
            }}>
              <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                {formatCurrency(profession.otherExpenses)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                Прочие расходы
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Дополнительная информация */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ 
          textAlign: 'center', 
          mb: 2, 
          fontWeight: 'bold',
          color: '#2c3e50'
        }}>
          📋 Дополнительная информация
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              bgcolor: '#e3f2fd', 
              borderRadius: 2,
              border: '2px solid #2196f3'
            }}>
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                {formatCurrency(profession.balance)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                Начальный баланс
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              bgcolor: '#e8f5e8', 
              borderRadius: 2,
              border: '2px solid #4caf50'
            }}>
              <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                {formatCurrency(profession.salary + profession.passiveIncome + profession.dividends)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                Общий доход
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Кредиты */}
      {(profession.creditAuto > 0 || profession.creditEducation > 0 || profession.creditHousing > 0 || profession.creditCards > 0) && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ 
            textAlign: 'center', 
            mb: 2, 
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            💳 Кредиты
          </Typography>
          <Grid container spacing={2}>
            {profession.creditAuto > 0 && (
              <Grid item xs={6}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: '#ffebee', 
                  borderRadius: 2,
                  border: '2px solid #f44336'
                }}>
                  <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    {formatCurrency(profession.creditAuto)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    Автокредит (ежемесячный платеж)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', mt: 0.5 }}>
                    + {formatCurrency(profession.creditAuto * 20)} (тело кредита)
                  </Typography>
                </Box>
              </Grid>
            )}
            {profession.creditEducation > 0 && (
              <Grid item xs={6}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: '#ffebee', 
                  borderRadius: 2,
                  border: '2px solid #f44336'
                }}>
                  <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    {formatCurrency(profession.creditEducation)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    Образовательный кредит (ежемесячный платеж)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', mt: 0.5 }}>
                    + {formatCurrency(profession.creditEducation * 20)} (тело кредита)
                  </Typography>
                </Box>
              </Grid>
            )}
            {profession.creditHousing > 0 && (
              <Grid item xs={6}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: '#ffebee', 
                  borderRadius: 2,
                  border: '2px solid #f44336'
                }}>
                  <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    {formatCurrency(profession.creditHousing)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    Ипотека (ежемесячный платеж)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', mt: 0.5 }}>
                    + {formatCurrency(profession.creditHousing * 200)} (тело кредита)
                  </Typography>
                </Box>
              </Grid>
            )}
            {profession.creditCards > 0 && (
              <Grid item xs={6}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: '#ffebee', 
                  borderRadius: 2,
                  border: '2px solid #f44336'
                }}>
                  <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    {formatCurrency(profession.creditCards)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    Кредитные карты (ежемесячный платеж)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', mt: 0.5 }}>
                    + {formatCurrency(profession.creditCards * 20)} (тело кредита)
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Бонусы */}
      {profession.bonusCards > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ 
            textAlign: 'center', 
            mb: 2, 
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            🎁 Бонусы
          </Typography>
          <Box sx={{ 
            textAlign: 'center', 
            p: 2, 
            bgcolor: '#f3e5f5', 
            borderRadius: 2,
            border: '2px solid #9c27b0'
          }}>
            <Typography variant="h6" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
              +{profession.bonusCards} карта(ы) возможности
            </Typography>
            <Typography variant="caption" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
              Дополнительные шансы улучшить финансовое положение!
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProfessionDetails;