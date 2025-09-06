import React from 'react';
import {
  ShoppingCart as ShoppingIcon, PhoneIphone as PhoneIcon, DirectionsCar as CarIcon,
  Flight as FlightIcon, Restaurant as RestaurantIcon, LocalHospital as HospitalIcon,
  School as SchoolIcon, Home as HomeIcon, SportsEsports as GamingIcon,
  LocalBar as BarIcon, Movie as MovieIcon, Spa as SpaIcon,
  FitnessCenter as GymIcon, Pets as PetIcon, LocalGroceryStore as GroceryIcon,
  LocalPharmacy as PharmacyIcon, LocalGasStation as GasIcon, LocalLaundryService as LaundryIcon,
  LocalTaxi as TaxiIcon, LocalPizza as PizzaIcon, LocalCafe as CoffeeIcon,
  LocalFlorist as FlowerIcon, LocalCarWash as CarWashIcon, LocalPrintshop as PrintIcon
} from '@mui/icons-material';

// Карточки расходов - обязательные траты
export const EXPENSE_CARDS = [
  // Покупки и техника
  {
    id: 1,
    name: 'Новый смартфон',
    description: 'Обновление мобильного устройства',
    cost: 800,
    icon: <PhoneIcon />,
    category: 'technology',
    type: 'purchase'
  },
  {
    id: 2,
    name: 'Ноутбук',
    description: 'Покупка нового ноутбука для работы',
    cost: 1200,
    icon: <PhoneIcon />,
    category: 'technology',
    type: 'purchase'
  },
  {
    id: 3,
    name: 'Планшет',
    description: 'Покупка планшета для развлечений',
    cost: 500,
    icon: <PhoneIcon />,
    category: 'technology',
    type: 'purchase'
  },
  {
    id: 4,
    name: 'Игровая приставка',
    description: 'Покупка игровой консоли',
    cost: 400,
    icon: <GamingIcon />,
    category: 'entertainment',
    type: 'purchase'
  },
  {
    id: 5,
    name: 'Наушники',
    description: 'Качественные беспроводные наушники',
    cost: 150,
    icon: <PhoneIcon />,
    category: 'technology',
    type: 'purchase'
  },

  // Транспорт
  {
    id: 6,
    name: 'Ремонт автомобиля',
    description: 'Неожиданный ремонт машины',
    cost: 800,
    icon: <CarIcon />,
    category: 'transport',
    type: 'repair'
  },
  {
    id: 7,
    name: 'Шиномонтаж',
    description: 'Замена резины на автомобиле',
    cost: 300,
    icon: <CarIcon />,
    category: 'transport',
    type: 'maintenance'
  },
  {
    id: 8,
    name: 'Такси',
    description: 'Поездка на такси в аэропорт',
    cost: 80,
    icon: <TaxiIcon />,
    category: 'transport',
    type: 'service'
  },
  {
    id: 9,
    name: 'Заправка',
    description: 'Полная заправка автомобиля',
    cost: 60,
    icon: <GasIcon />,
    category: 'transport',
    type: 'fuel'
  },

  // Путешествия
  {
    id: 10,
    name: 'Билет на самолет',
    description: 'Авиабилет в отпуск',
    cost: 400,
    icon: <FlightIcon />,
    category: 'travel',
    type: 'transport'
  },
  {
    id: 11,
    name: 'Отель',
    description: 'Проживание в отеле на выходные',
    cost: 200,
    icon: <HomeIcon />,
    category: 'travel',
    type: 'accommodation'
  },
  {
    id: 12,
    name: 'Экскурсия',
    description: 'Экскурсионный тур',
    cost: 100,
    icon: <FlightIcon />,
    category: 'travel',
    type: 'activity'
  },

  // Еда и рестораны
  {
    id: 13,
    name: 'Ресторан',
    description: 'Ужин в дорогом ресторане',
    cost: 120,
    icon: <RestaurantIcon />,
    category: 'food',
    type: 'dining'
  },
  {
    id: 14,
    name: 'Пицца',
    description: 'Заказ пиццы на вечеринку',
    cost: 50,
    icon: <PizzaIcon />,
    category: 'food',
    type: 'delivery'
  },
  {
    id: 15,
    name: 'Кофе',
    description: 'Кофе в кофейне',
    cost: 8,
    icon: <CoffeeIcon />,
    category: 'food',
    type: 'beverage'
  },
  {
    id: 16,
    name: 'Продукты',
    description: 'Покупка продуктов на неделю',
    cost: 150,
    icon: <GroceryIcon />,
    category: 'food',
    type: 'groceries'
  },

  // Здоровье и красота
  {
    id: 17,
    name: 'Визит к врачу',
    description: 'Консультация специалиста',
    cost: 100,
    icon: <HospitalIcon />,
    category: 'health',
    type: 'medical'
  },
  {
    id: 18,
    name: 'Спа-процедуры',
    description: 'Расслабляющие процедуры',
    cost: 200,
    icon: <SpaIcon />,
    category: 'beauty',
    type: 'wellness'
  },
  {
    id: 19,
    name: 'Аптека',
    description: 'Покупка лекарств',
    cost: 80,
    icon: <PharmacyIcon />,
    category: 'health',
    type: 'medicine'
  },
  {
    id: 20,
    name: 'Фитнес-клуб',
    description: 'Абонемент в спортзал',
    cost: 100,
    icon: <GymIcon />,
    category: 'health',
    type: 'fitness'
  },

  // Развлечения
  {
    id: 21,
    name: 'Кино',
    description: 'Поход в кинотеатр',
    cost: 25,
    icon: <MovieIcon />,
    category: 'entertainment',
    type: 'leisure'
  },
  {
    id: 22,
    name: 'Бар',
    description: 'Вечер в баре с друзьями',
    cost: 60,
    icon: <BarIcon />,
    category: 'entertainment',
    type: 'social'
  },
  {
    id: 23,
    name: 'Цветы',
    description: 'Букет цветов для подарка',
    cost: 40,
    icon: <FlowerIcon />,
    category: 'gifts',
    type: 'present'
  },
  {
    id: 24,
    name: 'Печать документов',
    description: 'Печать важных документов',
    cost: 15,
    icon: <PrintIcon />,
    category: 'services',
    type: 'business'
  }
];

// Функция для получения случайной карточки расходов
export const getRandomExpenseCard = () => {
  const randomIndex = Math.floor(Math.random() * EXPENSE_CARDS.length);
  return EXPENSE_CARDS[randomIndex];
};

// Функция для получения карточки расходов по ID
export const getExpenseCardById = (id) => {
  return EXPENSE_CARDS.find(card => card.id === id);
};

// Функция для получения карточек расходов по категории
export const getExpenseCardsByCategory = (category) => {
  return EXPENSE_CARDS.filter(card => card.category === category);
};

// Функция для получения карточек расходов по типу
export const getExpenseCardsByType = (type) => {
  return EXPENSE_CARDS.filter(card => card.type === type);
};

// Функция для получения карточек расходов по диапазону стоимости
export const getExpenseCardsByCostRange = (minCost, maxCost) => {
  return EXPENSE_CARDS.filter(card => card.cost >= minCost && card.cost <= maxCost);
};

// Функция для перемешивания массива (алгоритм Фишера-Йейтса)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Создание колоды карточек расходов (24 карточки)
export const createExpenseDeck = () => {
  return shuffleArray([...EXPENSE_CARDS]);
};

// Класс для управления колодой карточек расходов
export class ExpenseDeckManager {
  constructor() {
    this.deck = createExpenseDeck();
    this.discardPile = [];
  }

  // Вытащить карточку из колоды
  drawCard() {
    if (this.deck.length === 0) {
      // Если колода пуста, перемешиваем отбой
      this.shuffleDiscardPile();
    }
    
    if (this.deck.length === 0) {
      return null; // Нет карточек
    }
    
    return this.deck.pop();
  }

  // Отложить карточку в отбой
  discardCard(card) {
    if (card) {
      this.discardPile.push(card);
    }
  }

  // Перемешать отбой и вернуть в колоду
  shuffleDiscardPile() {
    if (this.discardPile.length > 0) {
      this.deck = shuffleArray([...this.discardPile]);
      this.discardPile = [];
      console.log('🔄 [ExpenseDeckManager] Отбой перемешан и возвращен в колоду');
    }
  }

  // Получить количество карточек в колоде
  getDeckCount() {
    return this.deck.length;
  }

  // Получить количество карточек в отбое
  getDiscardCount() {
    return this.discardPile.length;
  }

  // Получить общее количество карточек
  getTotalCount() {
    return this.deck.length + this.discardPile.length;
  }

  // Перемешать всю колоду заново
  reshuffle() {
    this.deck = createExpenseDeck();
    this.discardPile = [];
    console.log('🔄 [ExpenseDeckManager] Колода перемешана заново');
  }
}

