import React from 'react';
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  LocalCafe as CoffeeIcon,
  Spa as SpaIcon,
  PhoneIphone as AppIcon,
  Campaign as MarketingIcon,
  LocalCarWash as CarWashIcon,
  ContentCut as BeautyIcon,
  Restaurant as RestaurantIcon,
  SelfImprovement as YogaIcon,
  Hotel as HotelIcon,
  Terrain as MountainIcon,
  Park as EcoIcon,
  School as SchoolIcon,
  Movie as MovieIcon,
  BakeryDining as BakeryIcon,
  FitnessCenter as GymIcon,
  Work as CoworkingIcon,
  TrendingUp as StockIcon,
  CurrencyBitcoin as BitcoinIcon
} from '@mui/icons-material';

// Карточки рынка - влияют на активы игроков
export const MARKET_CARDS = [
  // Карточки для недвижимости
  {
    id: 1,
    name: 'Старое жилье идет под снос',
    description: 'Покупатель предлагает 25,000$ за комнату в пригороде',
    targetAsset: 'room_suburb',
    targetAssetName: 'Комната в пригороде',
    originalCost: 3000,
    offerPrice: 25000,
    profit: 22000,
    icon: <HomeIcon />,
    category: 'real_estate',
    type: 'sale_offer'
  },
  {
    id: 2,
    name: 'Покупатель квартиры-студии',
    description: 'Предлагает 7,000$ за квартиру-студию (субаренда)',
    targetAsset: 'studio_apartment',
    targetAssetName: 'Квартира-студия (субаренда)',
    originalCost: 2000,
    offerPrice: 7000,
    profit: 5000,
    icon: <HomeIcon />,
    category: 'real_estate',
    type: 'sale_offer'
  },
  {
    id: 3,
    name: 'Покупатель земли',
    description: 'Предлагает 100,000$ за участок земли',
    targetAsset: 'land_plot',
    targetAssetName: 'Участок земли',
    originalCost: 50000,
    offerPrice: 100000,
    profit: 50000,
    icon: <HomeIcon />,
    category: 'real_estate',
    type: 'sale_offer'
  },
  {
    id: 4,
    name: 'Покупатель дома',
    description: 'Предлагает 200,000$ за ваш дом',
    targetAsset: 'house',
    targetAssetName: 'Дом',
    originalCost: 150000,
    offerPrice: 200000,
    profit: 50000,
    icon: <HomeIcon />,
    category: 'real_estate',
    type: 'sale_offer'
  },
  {
    id: 5,
    name: 'Покупатель квартиры',
    description: 'Предлагает 120,000$ за квартиру',
    targetAsset: 'apartment',
    targetAssetName: 'Квартира',
    originalCost: 80000,
    offerPrice: 120000,
    profit: 40000,
    icon: <HomeIcon />,
    category: 'real_estate',
    type: 'sale_offer'
  },

  // Карточки для бизнеса
  {
    id: 6,
    name: 'Большая сеть выкупает маникюрные салоны',
    description: 'Вам предлагается 100,000$ за ваш салон красоты',
    targetAsset: 'beauty_salon',
    targetAssetName: 'Салон красоты/барбершоп',
    originalCost: 500000,
    offerPrice: 100000,
    loss: 400000,
    icon: <BeautyIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 7,
    name: 'Покупатель кофейни',
    description: 'Предлагает вам 25,000$ за кофейню',
    targetAsset: 'coffee_shop',
    targetAssetName: 'Кофейня в центре города',
    originalCost: 100000,
    offerPrice: 25000,
    loss: 75000,
    icon: <CoffeeIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 8,
    name: 'Покупатель на партнерство',
    description: 'Предлагает 50,000$ за долю в вашем бизнесе',
    targetAsset: 'any_business',
    targetAssetName: 'Любой бизнес',
    originalCost: 0,
    offerPrice: 50000,
    profit: 50000,
    icon: <BusinessIcon />,
    category: 'business',
    type: 'partnership_offer'
  },
  {
    id: 9,
    name: 'Покупатель спа-центра',
    description: 'Предлагает 150,000$ за центр здоровья и спа',
    targetAsset: 'spa_center',
    targetAssetName: 'Центр здоровья и спа',
    originalCost: 270000,
    offerPrice: 150000,
    loss: 120000,
    icon: <SpaIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 10,
    name: 'Покупатель мобильного приложения',
    description: 'Предлагает 200,000$ за ваше мобильное приложение',
    targetAsset: 'mobile_app',
    targetAssetName: 'Мобильное приложение (подписка)',
    originalCost: 420000,
    offerPrice: 200000,
    loss: 220000,
    icon: <AppIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 11,
    name: 'Покупатель агентства маркетинга',
    description: 'Предлагает 80,000$ за агентство цифрового маркетинга',
    targetAsset: 'marketing_agency',
    targetAssetName: 'Агентство цифрового маркетинга',
    originalCost: 160000,
    offerPrice: 80000,
    loss: 80000,
    icon: <MarketingIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 12,
    name: 'Покупатель автомоек',
    description: 'Предлагает 80,000$ за сеть автомоек',
    targetAsset: 'car_wash',
    targetAssetName: 'Сеть автомоек самообслуживания',
    originalCost: 120000,
    offerPrice: 80000,
    loss: 40000,
    icon: <CarWashIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 13,
    name: 'Покупатель ресторана',
    description: 'Предлагает 180,000$ за франшизу ресторана',
    targetAsset: 'restaurant',
    targetAssetName: 'Франшиза популярного ресторана',
    originalCost: 320000,
    offerPrice: 180000,
    loss: 140000,
    icon: <RestaurantIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 14,
    name: 'Покупатель йога-центра',
    description: 'Предлагает 100,000$ за йога-центр',
    targetAsset: 'yoga_center',
    targetAssetName: 'Йога- и медитационный центр',
    originalCost: 170000,
    offerPrice: 100000,
    loss: 70000,
    icon: <YogaIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 15,
    name: 'Покупатель отеля',
    description: 'Предлагает 300,000$ за мини-отель',
    targetAsset: 'hotel',
    targetAssetName: 'Мини-отель/бутик-гостиница',
    originalCost: 200000,
    offerPrice: 300000,
    profit: 100000,
    icon: <HotelIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 16,
    name: 'Покупатель эко-ранчо',
    description: 'Предлагает 800,000$ за туристический комплекс',
    targetAsset: 'eco_ranch',
    targetAssetName: 'Туристический комплекс (эко-ранчо)',
    originalCost: 1000000,
    offerPrice: 800000,
    loss: 200000,
    icon: <EcoIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 17,
    name: 'Покупатель школы',
    description: 'Предлагает 50,000$ за школу иностранных языков',
    targetAsset: 'language_school',
    targetAssetName: 'Школа иностранных языков',
    originalCost: 20000,
    offerPrice: 50000,
    profit: 30000,
    icon: <SchoolIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 18,
    name: 'Покупатель киностудии',
    description: 'Предлагает 300,000$ за киностудию',
    targetAsset: 'movie_studio',
    targetAssetName: 'Снять полнометражный фильм',
    originalCost: 500000,
    offerPrice: 300000,
    loss: 200000,
    icon: <MovieIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 19,
    name: 'Покупатель пекарни',
    description: 'Предлагает 200,000$ за пекарню',
    targetAsset: 'bakery',
    targetAssetName: 'Пекарня с доставкой',
    originalCost: 300000,
    offerPrice: 200000,
    loss: 100000,
    icon: <BakeryIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 20,
    name: 'Покупатель фитнес-студии',
    description: 'Предлагает 400,000$ за сеть фитнес-студий',
    targetAsset: 'fitness_studios',
    targetAssetName: 'Сеть фитнес-студий',
    originalCost: 750000,
    offerPrice: 400000,
    loss: 350000,
    icon: <GymIcon />,
    category: 'business',
    type: 'sale_offer'
  },
  {
    id: 21,
    name: 'Покупатель коворкинга',
    description: 'Предлагает 300,000$ за коворкинг-пространство',
    targetAsset: 'coworking',
    targetAssetName: 'Коворкинг-пространство',
    originalCost: 500000,
    offerPrice: 300000,
    loss: 200000,
    icon: <CoworkingIcon />,
    category: 'business',
    type: 'sale_offer'
  },

  // Карточки для криптовалют и акций
  {
    id: 22,
    name: 'Очередной скам биржи',
    description: 'Все игроки теряют все BTC',
    targetAsset: 'bitcoin',
    targetAssetName: 'Bitcoin',
    originalCost: 0,
    offerPrice: 0,
    loss: 100,
    icon: <BitcoinIcon />,
    category: 'crypto',
    type: 'market_crash',
    affectsAllPlayers: true
  },
  {
    id: 23,
    name: 'Покупатель акций',
    description: 'Предлагает 40,000$ за ваш портфель акций',
    targetAsset: 'stocks',
    targetAssetName: 'Акции',
    originalCost: 25000,
    offerPrice: 40000,
    profit: 15000,
    icon: <StockIcon />,
    category: 'stocks',
    type: 'sale_offer'
  },
  {
    id: 24,
    name: 'Биржевой крах',
    description: 'Все акции теряют 50% стоимости',
    targetAsset: 'stocks',
    targetAssetName: 'Акции',
    originalCost: 0,
    offerPrice: 0,
    loss: 50,
    icon: <StockIcon />,
    category: 'stocks',
    type: 'market_crash',
    affectsAllPlayers: true
  }
];

// Функция для перемешивания массива (алгоритм Фишера-Йейтса)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Создание колоды карточек рынка (24 карточки)
export const createMarketDeck = () => {
  return shuffleArray([...MARKET_CARDS]);
};

// Класс для управления колодой карточек рынка
export class MarketDeckManager {
  constructor() {
    this.deck = createMarketDeck();
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
      console.log('🔄 [MarketDeckManager] Отбой перемешан и возвращен в колоду');
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
    this.deck = createMarketDeck();
    this.discardPile = [];
    console.log('🔄 [MarketDeckManager] Колода перемешана заново');
  }
}

// Функция для получения случайной карточки рынка (для обратной совместимости)
export const getRandomMarketCard = () => {
  const randomIndex = Math.floor(Math.random() * MARKET_CARDS.length);
  return MARKET_CARDS[randomIndex];
};

// Функция для получения карточки рынка по ID
export const getMarketCardById = (id) => {
  return MARKET_CARDS.find(card => card.id === id);
};

// Функция для получения карточек рынка по категории
export const getMarketCardsByCategory = (category) => {
  return MARKET_CARDS.filter(card => card.category === category);
};

// Функция для получения карточек рынка по типу
export const getMarketCardsByType = (type) => {
  return MARKET_CARDS.filter(card => card.type === type);
};

// Функция для проверки, есть ли у игрока подходящий актив для карточки рынка
export const checkPlayerHasMatchingAsset = (playerAssets, marketCard) => {
  if (marketCard.affectsAllPlayers) {
    return true; // Карточка влияет на всех игроков
  }

  if (marketCard.targetAsset === 'any_business') {
    // Проверяем, есть ли у игрока любой бизнес
    return playerAssets.some(asset => asset.type === 'business');
  }

  // Проверяем точное совпадение
  return playerAssets.some(asset => asset.id === marketCard.targetAsset);
};

// Функция для получения подходящих карточек рынка для игрока
export const getSuitableMarketCardsForPlayer = (playerAssets) => {
  return MARKET_CARDS.filter(card => checkPlayerHasMatchingAsset(playerAssets, card));
};
