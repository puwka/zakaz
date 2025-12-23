# Инструкция по деплою на Vercel

Это руководство поможет вам развернуть проект "ЦЕХ 'Деревянное дело'" на Vercel.

## Предварительные требования

1. **Аккаунт Vercel** - зарегистрируйтесь на [vercel.com](https://vercel.com)
2. **Аккаунт Supabase** - проект должен быть настроен и база данных должна быть создана
3. **GitHub/GitLab/Bitbucket** - репозиторий с вашим кодом (рекомендуется)

## Шаг 1: Подготовка базы данных Supabase

Перед деплоем убедитесь, что база данных полностью настроена:

1. **Выполните SQL скрипты** в Supabase Dashboard → SQL Editor:
   - `supabase/schema.sql` - основная схема
   - `supabase/homepage-schema.sql` - схема для главной страницы
   - `supabase/services-schema.sql` - схема для страницы услуг
   - `supabase/about-schema.sql` - схема для страницы "О нас"
   - `supabase/contacts-schema.sql` - схема для страницы контактов
   - `supabase/fix-storage-rls-simple.sql` - политики для Storage (важно!)

2. **Создайте Storage buckets**:
   - `products` - для изображений товаров (публичный)
   - `homepage` - для изображений главной страницы, услуг, о нас (публичный)

3. **Создайте пользователя-админа**:
   - В Supabase Dashboard → Authentication создайте пользователя
   - Запомните email и пароль для входа в админку

## Шаг 2: Настройка переменных окружения

### Локально (для тестирования)

Создайте файл `.env.local` на основе `.env.example`:

```bash
cp .env.example .env.local
```

Заполните переменные:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
TELEGRAM_BOT_TOKEN=your-telegram-bot-token  # опционально
TELEGRAM_CHAT_ID=your-telegram-chat-id      # опционально
```

### На Vercel

1. Перейдите в настройки проекта на Vercel
2. Откройте раздел **Environment Variables**
3. Добавьте следующие переменные:

| Переменная | Описание | Обязательно |
|-----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL вашего Supabase проекта | ✅ Да |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key из Supabase | ✅ Да |
| `TELEGRAM_BOT_TOKEN` | Токен Telegram бота | ❌ Нет |
| `TELEGRAM_CHAT_ID` | ID чата для Telegram | ❌ Нет |

**Важно:** 
- Переменные с префиксом `NEXT_PUBLIC_` доступны в браузере
- Переменные без префикса доступны только на сервере
- После добавления переменных нужно пересобрать проект

## Шаг 3: Деплой на Vercel

### Вариант 1: Через Vercel Dashboard (рекомендуется)

1. **Подключите репозиторий:**
   - Войдите в [Vercel Dashboard](https://vercel.com/dashboard)
   - Нажмите **Add New Project**
   - Выберите ваш Git репозиторий
   - Импортируйте проект

2. **Настройте проект:**
   - **Framework Preset:** Next.js (определится автоматически)
   - **Root Directory:** `./` (если проект в корне репозитория)
   - **Build Command:** `npm run build` (по умолчанию)
   - **Output Directory:** `.next` (по умолчанию)
   - **Install Command:** `npm install` (по умолчанию)

3. **Добавьте переменные окружения:**
   - В разделе **Environment Variables** добавьте все необходимые переменные
   - Убедитесь, что они добавлены для всех окружений (Production, Preview, Development)

4. **Деплой:**
   - Нажмите **Deploy**
   - Дождитесь завершения сборки
   - После успешного деплоя вы получите URL вашего сайта

### Вариант 2: Через Vercel CLI

1. **Установите Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Войдите в Vercel:**
   ```bash
   vercel login
   ```

3. **Деплой:**
   ```bash
   vercel
   ```
   
   Следуйте инструкциям:
   - Выберите проект или создайте новый
   - Подтвердите настройки
   - После деплоя переменные окружения можно добавить через Dashboard

## Шаг 4: Проверка после деплоя

После успешного деплоя проверьте:

1. **Главная страница** - должна загружаться без ошибок
2. **Каталог** - товары должны отображаться
3. **Админка** - `/admin/login` должна работать
4. **Загрузка изображений** - проверьте в админке
5. **Форма обратной связи** - если настроен Telegram

## Шаг 5: Настройка домена (опционально)

1. В Vercel Dashboard → Settings → Domains
2. Добавьте ваш домен
3. Следуйте инструкциям для настройки DNS

## Решение проблем

### Ошибка "Failed to fetch" при загрузке данных

- Проверьте, что `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` правильно настроены
- Убедитесь, что RLS политики в Supabase настроены правильно

### Ошибка 403 при загрузке изображений

- Выполните скрипт `supabase/fix-storage-rls-simple.sql` в Supabase
- Проверьте, что бакеты `products` и `homepage` созданы и публичные

### Ошибка при отправке формы в Telegram

- Проверьте, что `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` настроены
- Убедитесь, что бот добавлен в чат/группу
- См. инструкции в `TELEGRAM_SETUP.md`

### Белая страница после деплоя

- Проверьте логи сборки в Vercel Dashboard
- Убедитесь, что все зависимости установлены
- Проверьте, что нет ошибок TypeScript

## Полезные ссылки

- [Документация Vercel](https://vercel.com/docs)
- [Документация Next.js](https://nextjs.org/docs)
- [Документация Supabase](https://supabase.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Поддержка

Если возникли проблемы:
1. Проверьте логи в Vercel Dashboard → Deployments
2. Проверьте консоль браузера на наличие ошибок
3. Убедитесь, что все переменные окружения настроены правильно

