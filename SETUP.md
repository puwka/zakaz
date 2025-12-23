# Инструкция по настройке проекта

## Шаг 1: Установка зависимостей

```bash
npm install
```

## Шаг 2: Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Скопируйте URL проекта и Anon Key из настроек проекта
3. Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Шаг 3: Настройка базы данных

1. Откройте Supabase Dashboard → SQL Editor
2. Скопируйте и выполните скрипт из файла `supabase/schema.sql`
3. Проверьте, что все таблицы созданы успешно

## Шаг 4: Настройка Storage

1. В Supabase Dashboard перейдите в Storage
2. Создайте новый bucket с именем `products`
3. Установите bucket как публичный (Public bucket)
4. Настройте политики доступа (они уже включены в SQL скрипт)

## Шаг 5: Настройка Service Role Key

1. В Supabase Dashboard перейдите в **Settings** → **API**
2. Найдите раздел **Project API keys**
3. Скопируйте **`service_role` key** (⚠️ **НЕ** `anon` key!)
4. Добавьте в `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

## Шаг 6: Создание пользователя-админа

### Вариант 1: Через скрипт (рекомендуется)

1. Установите зависимости (если еще не установлены):
   ```bash
   npm install
   ```

2. Запустите скрипт создания администратора:
   ```bash
   node scripts/create-admin.js your-email@example.com your-password
   ```

   Пример:
   ```bash
   node scripts/create-admin.js admin@example.com mypassword123
   ```

### Вариант 2: Через Supabase Dashboard

1. В Supabase Dashboard перейдите в **Authentication** → **Users**
2. Нажмите **"Add user"** → **"Create new user"**
3. Введите email и пароль для админа
4. ⚠️ **Важно:** Убедитесь, что email подтвержден (email_confirm: true)
5. Сохраните учетные данные для входа в админ-панель

## Шаг 7: Запуск проекта

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Шаг 8: Тестирование

1. **Публичная часть:**
   - Откройте главную страницу
   - Перейдите в каталог
   - Добавьте товары в корзину
   - Оформите тестовый заказ

2. **Админ-панель:**
   - Перейдите на `/admin/login`
   - Войдите с учетными данными админа
   - Добавьте несколько товаров через админ-панель
   - Проверьте отображение заказов

## Решение проблем

### Ошибка "Invalid login credentials"

Если вы не можете войти в админ-панель:

1. **Проверьте настройки Supabase Auth:**
   - Откройте Supabase Dashboard → **Authentication** → **Settings**
   - Убедитесь, что **"Enable email confirmations"** отключено (для тестирования)
   - Или убедитесь, что email пользователя подтвержден

2. **Создайте администратора через скрипт:**
   ```bash
   node scripts/create-admin.js your-email@example.com your-password
   ```

3. **Проверьте переменные окружения:**
   - Убедитесь, что `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` правильные
   - Проверьте, что `SUPABASE_SERVICE_ROLE_KEY` добавлен в `.env.local`

4. **Проверьте пользователя в Supabase:**
   - Откройте Supabase Dashboard → **Authentication** → **Users**
   - Убедитесь, что пользователь существует и email подтвержден

### Ошибка 401 при работе с API

Если API routes возвращают 401:
- Убедитесь, что вы залогинены в админ-панели
- Проверьте, что cookies передаются в запросах (должно быть `credentials: 'include'`)
- Проверьте логи в консоли браузера и на сервере

## Примечания

- Для загрузки изображений товаров используйте формат JPG, PNG или WebP
- Рекомендуемый размер изображений: 800x800px или больше
- Все изображения автоматически загружаются в Supabase Storage bucket `products`
- **Service Role Key** имеет полный доступ к базе данных - храните его в безопасности!



