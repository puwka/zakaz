# Структура проекта

## Основные директории

```
zakaz/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Публичные страницы (группа маршрутов)
│   │   ├── page.tsx             # Главная страница
│   │   ├── catalog/             # Каталог товаров
│   │   │   ├── page.tsx
│   │   │   └── CatalogContent.tsx
│   │   ├── checkout/            # Оформление заказа
│   │   │   └── page.tsx
│   │   └── thank-you/           # Страница благодарности
│   │       └── page.tsx
│   ├── admin/                    # Админ-панель
│   │   ├── layout.tsx           # Защита маршрутов
│   │   ├── login/               # Страница входа
│   │   │   └── page.tsx
│   │   ├── page.tsx             # Дашборд
│   │   ├── AdminDashboard.tsx   # Компонент дашборда
│   │   ├── ProductsTab.tsx       # Вкладка товаров
│   │   ├── ProductForm.tsx       # Форма товара
│   │   └── OrdersTab.tsx         # Вкладка заказов
│   ├── globals.css              # Глобальные стили
│   └── layout.tsx               # Корневой layout
│
├── components/                   # React компоненты
│   ├── ProductCard.tsx          # Карточка товара
│   ├── CartDrawer.tsx           # Корзина (drawer)
│   └── CheckoutForm.tsx         # Форма оформления заказа
│
├── lib/                          # Утилиты и конфигурация
│   └── supabase/
│       ├── client.ts            # Клиент для браузера
│       ├── server.ts            # Клиент для сервера
│       └── middleware.ts       # Middleware для сессий
│
├── store/                        # Zustand stores
│   └── cart.ts                  # Store корзины
│
├── types/                        # TypeScript типы
│   └── database.ts              # Типы базы данных
│
├── supabase/                     # SQL скрипты
│   └── schema.sql               # Схема БД и RLS политики
│
├── public/                       # Статические файлы
│
├── middleware.ts                 # Next.js middleware
├── tailwind.config.ts           # Конфигурация Tailwind
├── next.config.js               # Конфигурация Next.js
├── tsconfig.json                # TypeScript конфигурация
├── package.json                 # Зависимости проекта
├── README.md                    # Основная документация
└── SETUP.md                     # Инструкция по настройке
```

## Ключевые особенности

### Публичная часть
- **Главная страница**: Hero-блок, преимущества, навигация
- **Каталог**: Сетка товаров, фильтры по категориям, поиск
- **Корзина**: Drawer с управлением товарами
- **Оформление заказа**: Форма без регистрации
- **Страница благодарности**: Подтверждение заказа

### Админ-панель
- **Аутентификация**: Supabase Auth (email/password)
- **Управление товарами**: CRUD операции, загрузка изображений
- **Управление заказами**: Просмотр, изменение статуса

### Технологии
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State**: Zustand (корзина)
- **Forms**: React Hook Form + Zod




