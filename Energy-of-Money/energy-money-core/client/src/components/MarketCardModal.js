import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import {
  TrendingUp as ProfitIcon,
  TrendingDown as LossIcon,
  Warning as WarningIcon,
  CheckCircle as AcceptIcon,
  Cancel as DeclineIcon
} from '@mui/icons-material';

const MarketCardModal = ({ 
  open, 
  onClose, 
  marketCard, 
  playerAssets, 
  onAccept, 
  onDecline,
  currentPlayer 
}) => {
  if (!marketCard) return null;

  const hasMatchingAsset = marketCard.affectsAllPlayers || 
    playerAssets.some(asset => 
      marketCard.targetAsset === 'any_business' ? asset.type === 'business' : asset.id === marketCard.targetAsset
    );

  const isProfit = marketCard.profit > 0;
  const isLoss = marketCard.loss > 0;
  const isMarketCrash = marketCard.type === 'market_crash';

  const getProfitLossText = () => {
    if (isProfit) {
      return `Прибыль: +$${marketCard.profit.toLocaleString()}`;
    } else if (isLoss) {
      return `Убыток: -$${marketCard.loss.toLocaleString()}`;
    }
    return '';
  };

  const getProfitLossColor = () => {
    if (isProfit) return '#4CAF50';
    if (isLoss) return '#F44336';
    return '#FF9800';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '15px'
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        color: 'white',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          {marketCard.icon}
          <Typography variant="h5" component="div">
            🏪 Карточка Рынка
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
            {marketCard.name}
          </Typography>
          
          <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 2, textAlign: 'center' }}>
            {marketCard.description}
          </Typography>

          {isMarketCrash && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <WarningIcon />
              Эта карточка влияет на всех игроков!
            </Alert>
          )}

          {hasMatchingAsset && !isMarketCrash && (
            <Box sx={{ 
              background: 'rgba(76, 175, 80, 0.1)', 
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '8px',
              p: 2,
              mb: 2
            }}>
              <Typography variant="body2" sx={{ color: '#4CAF50', textAlign: 'center' }}>
                ✅ У вас есть подходящий актив: {marketCard.targetAssetName}
              </Typography>
            </Box>
          )}

          {!hasMatchingAsset && !isMarketCrash && (
            <Box sx={{ 
              background: 'rgba(255, 152, 0, 0.1)', 
              border: '1px solid rgba(255, 152, 0, 0.3)',
              borderRadius: '8px',
              p: 2,
              mb: 2
            }}>
              <Typography variant="body2" sx={{ color: '#FF9800', textAlign: 'center' }}>
                ⚠️ У вас нет подходящего актива для этой карточки
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {!isMarketCrash && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                Цена предложения:
              </Typography>
              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                ${marketCard.offerPrice.toLocaleString()}
              </Typography>
            </Box>
          )}

          {getProfitLossText() && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                Результат:
              </Typography>
              <Chip
                icon={isProfit ? <ProfitIcon /> : <LossIcon />}
                label={getProfitLossText()}
                sx={{
                  backgroundColor: getProfitLossColor(),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          )}

          {currentPlayer && (
            <Box sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '8px',
              p: 2,
              mt: 2
            }}>
              <Typography variant="body2" sx={{ color: '#B0BEC5', textAlign: 'center' }}>
                Игрок: {currentPlayer.username || currentPlayer.name || 'Игрок'}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        gap: 2
      }}>
        {hasMatchingAsset && !isMarketCrash && (
          <Button
            onClick={onAccept}
            variant="contained"
            startIcon={<AcceptIcon />}
            sx={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: '10px',
              '&:hover': {
                background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)'
              }
            }}
          >
            Принять предложение
          </Button>
        )}

        <Button
          onClick={onDecline}
          variant="outlined"
          startIcon={<DeclineIcon />}
          sx={{
            borderColor: '#F44336',
            color: '#F44336',
            px: 4,
            py: 1.5,
            borderRadius: '10px',
            '&:hover': {
              borderColor: '#d32f2f',
              backgroundColor: 'rgba(244, 67, 54, 0.1)'
            }
          }}
        >
          Отказаться
        </Button>

        <Button
          onClick={onClose}
          sx={{
            background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
            color: 'white',
            px: 4,
            py: 1.5,
            borderRadius: '10px',
            '&:hover': {
              background: 'linear-gradient(135deg, #4B5563 0%, #374151 100%)'
            }
          }}
        >
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarketCardModal;

