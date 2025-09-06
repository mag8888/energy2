import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Global purple theme
const theme = createTheme({
  palette: {
    primary: { main: '#8B5CF6', dark: '#7C3AED', light: '#E9D5FF' },
    secondary: { main: '#A78BFA', dark: '#6D28D9', light: '#DDD6FE' }
  }
});

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
