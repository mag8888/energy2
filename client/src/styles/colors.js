// 🎨 ЦВЕТОВАЯ СХЕМА ПОТОК ДЕНЕГ GAME
// Все цвета проекта в одном месте для консистентности

export const colors = {
  // 🌈 ОСНОВНЫЕ ЦВЕТА
  primary: {
    main: '#1976d2',      // Основной синий
    light: '#42a5f5',     // Светло-синий
    dark: '#1565c0',      // Темно-синий
    contrast: '#ffffff'    // Белый текст на синем
  },
  
  secondary: {
    main: '#ff9800',      // Оранжевый
    light: '#ffb74d',     // Светло-оранжевый
    dark: '#f57c00',      // Темно-оранжевый
    contrast: '#ffffff'    // Белый текст на оранжевом
  },

  // 🎨 ФУНКЦИОНАЛЬНЫЕ ЦВЕТА
  success: {
    main: '#4caf50',      // Зеленый - успех
    light: '#81c784',     // Светло-зеленый
    dark: '#388e3c',      // Темно-зеленый
    contrast: '#ffffff'    // Белый текст на зеленом
  },

  warning: {
    main: '#ff9800',      // Оранжевый - предупреждение
    light: '#ffb74d',     // Светло-оранжевый
    dark: '#f57c00',      // Темно-оранжевый
    contrast: '#ffffff'    // Белый текст на оранжевом
  },

  error: {
    main: '#f44336',      // Красный - ошибка
    light: '#e57373',     // Светло-красный
    dark: '#d32f2f',      // Темно-красный
    contrast: '#ffffff'    // Белый текст на красном
  },

  info: {
    main: '#2196f3',      // Синий - информация
    light: '#64b5f6',     // Светло-синий
    dark: '#1976d2',      // Темно-синий
    contrast: '#ffffff'    // Белый текст на синем
  },

  // 🎮 ИГРОВЫЕ ЦВЕТА
  game: {
    primary: '#673AB7',    // Основной игровой
    secondary: '#512DA8',  // Дополнительный игровой
    accent: '#9C27B0',     // Акцент игровой
    background: '#0f0c29', // Фон игры
    surface: '#302b63',    // Поверхности игры
    start: '#FF6B35'       // Кнопка старта
  },

  // 🎲 КАРТОЧКИ И СТАТУСЫ
  cards: {
    player: '#4CAF50',     // Карточка игрока
    ready: '#4CAF50',      // Статус "готов"
    waiting: '#FF9800',    // Статус "ожидание"
    inactive: '#9E9E9E',   // Неактивный
    opponent: '#FF5722'    // Противник
  },

  // ⚪ НЕЙТРАЛЬНЫЕ ЦВЕТА
  white: {
    main: '#ffffff',       // Основной белый
    light: '#fafafa',      // Светлый
    lighter: '#f5f5f5'    // Очень светлый
  },

  black: {
    main: '#000000',       // Основной черный
    dark: '#212121',       // Темный
    darker: '#121212'      // Очень темный
  },

  gray: {
    50: '#fafafa',         // Очень светлый
    100: '#f5f5f5',       // Светлый
    200: '#eeeeee',        // Светло-серый
    300: '#e0e0e0',       // Серый
    400: '#bdbdbd',        // Средне-серый
    500: '#9e9e9e',       // Серый
    600: '#757575',        // Темно-серый
    700: '#616161',        // Темный
    800: '#424242',        // Очень темный
    900: '#212121'         // Почти черный
  },

  // 🏠 КОМПОНЕНТ-СПЕЦИФИЧНЫЕ
  roomSelection: {
    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
    card: '#ffffff',
    input: '#ffffff',
    button: '#1976d2',
    text: '#212121'
  },

  roomSetup: {
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    card: '#ffffff',
    playerCard: '#4CAF50',
    readyButton: '#4CAF50',
    startButton: '#FF6B35'
  },

  gameBoard: {
    background: '#1a1a2e',
    cells: '#16213e',
    player: '#4CAF50',
    opponent: '#FF5722',
    neutral: '#9E9E9E'
  }
};

// 🎯 ЦВЕТА ДЛЯ ТЕКСТА (всегда контрастные)
export const textColors = {
  primary: '#212121',      // Основной текст
  secondary: '#757575',    // Вторичный текст
  disabled: '#9e9e9e',    // Отключенный текст
  inverse: '#ffffff',      // Инвертированный текст
  success: '#2E7D32',      // Текст успеха
  warning: '#E65100',      // Текст предупреждения
  error: '#D32F2F'         // Текст ошибки
};

// 🎨 ЦВЕТА ДЛЯ ФОНОВ
export const backgroundColors = {
  primary: '#ffffff',      // Основной фон
  secondary: '#f5f5f5',   // Вторичный фон
  overlay: 'rgba(0, 0, 0, 0.5)', // Наложение
  gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' // Градиент
};

// 🔲 ЦВЕТА ДЛЯ ГРАНИЦ
export const borderColors = {
  light: '#e0e0e0',       // Светлая граница
  medium: '#bdbdbd',      // Средняя граница
  dark: '#9e9e9e',        // Темная граница
  primary: '#1976d2',     // Основная граница
  secondary: '#ff9800'    // Вторичная граница
};

// 🎭 ЦВЕТА ДЛЯ ТЕМ
export const themes = {
  light: {
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#212121',
    textSecondary: '#757575',
    border: '#e0e0e0'
  },
  
  dark: {
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333'
  }
};

// 🔧 УТИЛИТЫ ДЛЯ ЦВЕТОВ
export const colorUtils = {
  // Получить контрастный цвет для фона
  getContrastText: (backgroundColor) => {
    const colors = [
      '#000000', '#ffffff', '#212121', '#757575'
    ];
    
    // Простая логика выбора контрастного цвета
    if (backgroundColor.includes('fff') || backgroundColor.includes('f5f')) {
      return '#212121'; // Темный текст на светлом фоне
    } else {
      return '#ffffff'; // Светлый текст на темном фоне
    }
  },

  // Получить цвет с прозрачностью
  withOpacity: (color, opacity) => {
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  },

  // Проверить, нужен ли темный текст
  needsDarkText: (backgroundColor) => {
    const lightColors = ['#ffffff', '#fafafa', '#f5f5f5', '#eeeeee'];
    return lightColors.includes(backgroundColor);
  }
};

// 📱 АДАПТИВНЫЕ ЦВЕТА
export const responsiveColors = {
  mobile: {
    primary: '#1976d2',
    background: '#ffffff'
  },
  tablet: {
    primary: '#1565c0',
    background: '#fafafa'
  },
  desktop: {
    primary: '#0d47a1',
    background: '#f5f5f5'
  }
};

// 🎨 ЭКСПОРТ ПО УМОЛЧАНИЮ
export default colors;
