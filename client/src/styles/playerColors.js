// Player colors palette and helpers used by OriginalGameBoard
export const PLAYER_COLORS = [
  '#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#14B8A6', '#F472B6', '#A78BFA'
];

export const getColorByIndex = (index = 0) => {
  const i = Math.abs(index) % PLAYER_COLORS.length;
  return PLAYER_COLORS[i];
};

export const assignPlayerColor = (players = [], player) => {
  // pick first unused color based on order
  const used = new Set(players.map(p => p.color).filter(Boolean));
  const color = PLAYER_COLORS.find(c => !used.has(c)) || getColorByIndex(players.length);
  return color;
};

export const getContrastTextColor = (bg = '#000') => {
  // Simple luminance check
  const hex = bg.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#111827' : '#FFFFFF';
};

