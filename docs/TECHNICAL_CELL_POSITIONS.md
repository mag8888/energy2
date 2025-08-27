# 🔧 ТЕХНИЧЕСКИЕ КООРДИНАТЫ КЛЕТОК

## ⚠️ ТОЛЬКО ДЛЯ СПРАВКИ - НЕ РЕДАКТИРОВАТЬ!

---

## 📐 ФОРМУЛЫ РАСЧЕТА ПОЗИЦИЙ

### Внутренний круг (24 клетки):
```javascript
const cellSize = 42;
const squareSize = 13 * (cellSize + 2); // 13×13 клеток
const innerRadius = ((squareSize / 2) - (cellSize / 2)) * 0.9; // 234px
const innerCenter = 350; // Центр поля

for (let i = 0; i < 24; i++) {
  const angle = (i * 15 - 90) * (Math.PI / 180); // -90° до +270°
  const x = Math.cos(angle) * innerRadius;
  const y = Math.sin(angle) * innerRadius;
  
  positions.push({
    position: i,
    x: x + innerCenter - cellSize/2,
    y: y + innerCenter - cellSize/2,
    number: i + 1
  });
}
```

### Внешний квадрат (56 клеток):
```javascript
const cellSpacing = cellSize + 2; // 44px
const outerSquareWidth = 14 * cellSpacing; // 616px
const outerSquareHeight = 14 * cellSpacing; // 616px

// Центрирование
const marginX = (700 - outerSquareWidth) / 2; // 42px
const marginY = (700 - outerSquareHeight) / 2; // 42px
```

---

## 📍 ТОЧНЫЕ КООРДИНАТЫ КЛЕТОК

### Верхний ряд (1-14):
- **Клетка 1**: x = marginX + 0 * (44 * 1.15) - 42, y = marginY - 44
- **Клетка 2**: x = marginX + 1 * (44 * 1.15) - 42, y = marginY - 44
- **Клетка 3**: x = marginX + 2 * (44 * 1.15) - 42, y = marginY - 44
- ...и так далее

### Нижний ряд (15-28):
- **Клетка 15**: x = marginX + 0 * (44 * 1.15) - 42, y = marginY + 700 - 88
- **Клетка 16**: x = marginX + 1 * (44 * 1.15) - 42, y = marginY + 700 - 88
- ...и так далее

### Левый столбец (40-51):
- **Клетка 40**: x = marginX - 42, y = marginY + 0 * (44 * 1.15) + 5
- **Клетка 41**: x = marginX - 42, y = marginY + 1 * (44 * 1.15) + 5
- ...и так далее

### Правый столбец (15-26):
- **Клетка 15**: x = marginX + 14 * (44 * 1.15) - 42 - 42 - 5 - 3, y = marginY + 0 * (44 * 1.15) + 5
- **Клетка 16**: x = marginX + 14 * (44 * 1.15) - 42 - 42 - 5 - 3, y = marginY + 1 * (44 * 1.15) + 5
- ...и так далее

---

## 🔒 КОНСТАНТЫ (НЕ ИЗМЕНЯТЬ)

```javascript
// Размеры
const FIELD_SIZE = 700;
const CELL_SIZE = 42;
const CELL_SPACING = 44;
const INNER_CENTER = 350;

// Радиусы
const INNER_RADIUS = 234;
const OUTER_SQUARE_SIZE = 616;

// Сдвиги
const LEFT_SHIFT = 42;
const RIGHT_SHIFT = 92;
const TOP_SHIFT = 44;
const BOTTOM_SHIFT = 700;

// Растяжения
const HORIZONTAL_STRETCH = 1.15;
const VERTICAL_STRETCH = 1.15;
```

---

## 🚫 ЗАПРЕЩЕННЫЕ ИЗМЕНЕНИЯ

1. **Размеры поля**: 700x700
2. **Размеры клеток**: 42x42
3. **Расстояния**: 44px между клетками
4. **Радиус внутреннего круга**: 234px
5. **Сдвиги**: 42px влево, 92px вправо
6. **Растяжения**: 15% по горизонтали и вертикали
7. **Количество клеток**: 24 + 56 = 80

---

*Файл защищен от редактирования*
*Статус: ЗАФИКСИРОВАНО*
