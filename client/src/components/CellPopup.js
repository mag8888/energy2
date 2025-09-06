import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const CellPopup = ({ open, onClose, cell }) => {
  const c = cell || {};
  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Клетка поля</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>{c.title || c.name || 'Клетка'}</Typography>
        <Typography variant="body2" color="text.secondary">
          {c.description || 'Описание отсутствует'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CellPopup;

