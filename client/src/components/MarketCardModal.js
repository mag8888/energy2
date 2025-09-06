import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const MarketCardModal = ({ open, onClose, marketCard }) => {
  const card = marketCard || {};
  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Рыночная сделка</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>{card.title || card.name || 'Сделка'}</Typography>
        <Typography variant="body2" color="text.secondary">
          {card.description || 'Описание отсутствует'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarketCardModal;

