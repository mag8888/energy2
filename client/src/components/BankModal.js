import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';

const BankModal = ({ open = false, onClose = () => {}, onTransfer = () => {}, players = [], currentPlayer = {} }) => {
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [error, setError] = useState('');

  const handleTransfer = () => {
    if (!transferTo || !transferAmount) {
      setError('Заполните все поля');
      return;
    }

    const amount = parseInt(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Введите корректную сумму');
      return;
    }

    const balance = Number(currentPlayer?.balance || 0);
    if (amount > balance) {
      setError('Недостаточно средств');
      return;
    }

    onTransfer(transferTo, amount);
    handleClose();
  };

  const handleClose = () => {
    setTransferTo('');
    setTransferAmount('');
    setError('');
    onClose();
  };

  const safePlayers = Array.isArray(players) ? players : [];
  const availablePlayers = safePlayers.filter(p => p && p.id !== currentPlayer?.id);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      component={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <DialogTitle>🏦 Банковские операции</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Ваш баланс: <strong>${currentPlayer?.balance || 0}</strong>
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Перевести игроку</InputLabel>
          <Select
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            label="Перевести игроку"
          >
            {availablePlayers.map((player) => (
              <MenuItem key={player.id} value={player.id}>
                {player.username} (${player.balance})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Сумма"
          type="number"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          placeholder="Введите сумму"
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleTransfer} variant="contained" color="primary">
          Перевести
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BankModal;
