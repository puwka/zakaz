import {
  TreePine,
  Shield,
  Ruler,
  Leaf,
  FileText,
  Wrench,
  Truck,
  CheckCircle,
  Heart,
  Award,
  Users,
  Table,
  Sofa,
  Palette,
  BookOpen,
} from 'lucide-react';

export interface Advantage {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export interface WorkStep {
  number: string;
  title: string;
  description: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
  priceRange?: string;
  features?: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Service {
  title: string;
  description: string;
  features: string[];
  imageUrl?: string;
}

export const advantages: Advantage[] = [
  {
    icon: TreePine,
    title: 'Натуральное дерево',
    description:
      'Работаем только с экологически чистой древесиной премиальных пород: дуб, ясень, орех, бук. Каждое дерево отбирается вручную.',
  },
  {
    icon: Shield,
    title: 'Гарантия 5 лет',
    description:
      'Даем официальную гарантию на все изделия. Мы уверены в качестве нашей работы и используемых материалов.',
  },
  {
    icon: Ruler,
    title: 'Индивидуальные размеры',
    description:
      'Изготавливаем мебель по вашим размерам. Идеально впишется в любой интерьер, даже самый нестандартный.',
  },
  {
    icon: Leaf,
    title: 'Экологичные масла',
    description:
      'Используем только натуральные масла и воски для финишной обработки. Безопасно для здоровья и окружающей среды.',
  },
];

export const workSteps: WorkStep[] = [
  {
    number: '01',
    title: 'Заявка',
    description:
      'Вы оставляете заявку на сайте или звоните нам. Мы уточняем детали и отвечаем на все вопросы.',
  },
  {
    number: '02',
    title: 'Замер и эскиз',
    description:
      'Наш мастер приезжает к вам для замера. Создаем 3D-визуализацию и согласовываем дизайн.',
  },
  {
    number: '03',
    title: 'Производство',
    description:
      'Изготавливаем изделие в нашей мастерской. Сроки зависят от сложности, обычно 2-4 недели.',
  },
  {
    number: '04',
    title: 'Доставка и монтаж',
    description:
      'Доставляем готовое изделие и устанавливаем его. Вы принимаете работу и наслаждаетесь результатом.',
  },
];

export const popularCategories: Category[] = [
  {
    name: 'Столы',
    slug: 'tables',
    description: 'Обеденные, письменные, журнальные столы из массива дерева',
    icon: Table,
    imageUrl: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    count: 12,
    priceRange: 'от 45 000 ₽',
    features: ['Дуб, ясень, орех', 'Любые размеры', 'Гарантия 5 лет'],
  },
  {
    name: 'Стулья',
    slug: 'chairs',
    description: 'Эргономичные стулья и кресла ручной работы',
    icon: Sofa,
    imageUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    count: 8,
    priceRange: 'от 15 000 ₽',
    features: ['Анатомическая спинка', 'Натуральная кожа', 'Индивидуальный размер'],
  },
  {
    name: 'Декор',
    slug: 'decor',
    description: 'Предметы интерьера и декоративные элементы',
    icon: Palette,
    imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    count: 15,
    priceRange: 'от 8 500 ₽',
    features: ['Уникальный дизайн', 'Ручная резьба', 'Эксклюзивные модели'],
  },
  {
    name: 'Полки',
    slug: 'shelves',
    description: 'Настенные и напольные полки для книг и аксессуаров',
    icon: BookOpen,
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-d7eb3e8890c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    count: 10,
    priceRange: 'от 18 000 ₽',
    features: ['Скрытое крепление', 'Выдерживает до 50 кг', 'Любая длина'],
  },
];

export const faqData: FAQ[] = [
  {
    question: 'Какие сроки изготовления?',
    answer:
      'Сроки зависят от сложности проекта. Простые изделия изготавливаются за 2-3 недели, сложные проекты (кухни, мебель на заказ) — от 4 до 8 недель. Точные сроки обговариваются при заказе и фиксируются в договоре.',
  },
  {
    question: 'Как происходит доставка?',
    answer:
      'Доставка осуществляется по Москве и области нашим транспортом. Мы бережно упаковываем каждое изделие и доставляем в удобное для вас время. При необходимости выполняем монтаж на месте.',
  },
  {
    question: 'Нужна ли предоплата?',
    answer:
      'Да, для начала работы требуется предоплата 50% от стоимости заказа. Оставшаяся сумма оплачивается после приемки готового изделия. Мы работаем как по наличному, так и по безналичному расчету.',
  },
  {
    question: 'Можно ли заказать мебель по индивидуальным размерам?',
    answer:
      'Конечно! Мы специализируемся на изготовлении мебели на заказ. Наш мастер приедет для замера, мы создадим 3D-визуализацию, и вы получите изделие, идеально подходящее под ваш интерьер.',
  },
];

export const services: Service[] = [
  {
    title: 'Изготовление кухонь на заказ',
    description:
      'Создаем кухни мечты из массива дерева. Учитываем все ваши пожелания: от планировки до выбора фурнитуры. Работаем с любыми размерами и конфигурациями.',
    imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    features: [
      'Индивидуальный дизайн-проект',
      '3D-визуализация',
      'Выбор породы дерева',
      'Установка и монтаж',
    ],
  },
  {
    title: 'Реставрация мебели',
    description:
      'Вернем жизнь вашей старой мебели. Реставрируем антикварные предметы, восстанавливаем поврежденные элементы, обновляем покрытие.',
    imageUrl: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    features: [
      'Восстановление повреждений',
      'Реставрация фурнитуры',
      'Обновление покрытия',
      'Консервация антиквариата',
    ],
  },
  {
    title: 'Мебель для ресторанов (HoReCa)',
    description:
      'Специализируемся на изготовлении мебели для ресторанов, кафе, отелей. Создаем функциональные и стильные решения, соответствующие санитарным нормам.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    features: [
      'Сертифицированные материалы',
      'Устойчивость к нагрузкам',
      'Легкая очистка и уход',
      'Соблюдение сроков',
    ],
  },
  {
    title: 'Корпусная мебель на заказ',
    description:
      'Шкафы, комоды, стеллажи — любые предметы корпусной мебели по вашим размерам и дизайну.',
    imageUrl: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    features: [
      'Любые размеры',
      'Выбор внутренней планировки',
      'Различные стили',
      'Долговечность и надежность',
    ],
  },
];

export const companyValues = [
  {
    icon: Heart,
    title: 'Любовь к дереву',
    description:
      'Мы искренне любим свою работу и относимся к каждому изделию с особым трепетом.',
  },
  {
    icon: Award,
    title: 'Высокое качество',
    description:
      'Не идем на компромиссы в качестве. Используем только лучшие материалы и проверенные технологии.',
  },
  {
    icon: Users,
    title: 'Индивидуальный подход',
    description:
      'Каждый клиент для нас важен. Учитываем все пожелания и создаем именно то, что нужно вам.',
  },
  {
    icon: CheckCircle,
    title: 'Честность и прозрачность',
    description:
      'Честные цены, прозрачные сроки, открытое общение на всех этапах работы.',
  },
];

export const companyInfo = {
  name: 'ЦЕХ "Деревянное дело"',
  address: 'г. Москва, ул. Деревянная, д. 15',
  phone: '+7 (495) 123-45-67',
  email: 'info@masterwood.ru',
  workingHours: 'Пн-Пт: 9:00 - 19:00, Сб: 10:00 - 16:00',
  description:
    'Мы — команда мастеров, которые создают мебель и предметы интерьера из натурального дерева. Наша мастерская работает с 2015 года, и за это время мы реализовали сотни проектов: от небольших декоративных элементов до полной меблировки ресторанов.',
  history:
    'Все началось с любви к дереву и желания создавать что-то настоящее, долговечное, с душой. Основатель мастерской, опытный столяр с 20-летним стажем, решил объединить традиционные техники работы с деревом и современный дизайн. Сегодня наша команда — это 8 мастеров, каждый из которых является профессионалом в своем деле.',
};

