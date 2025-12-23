-- ============================================
-- ИСПРАВЛЕНИЕ ОШИБКИ 403 FORBIDDEN ДЛЯ ТОВАРОВ
-- ============================================
-- Выполните этот скрипт в Supabase SQL Editor, если получаете ошибку 403 при загрузке товаров

-- 1. Удаляем существующие политики для товаров
DROP POLICY IF EXISTS "Публичное чтение активных товаров" ON products;
DROP POLICY IF EXISTS "Админ может читать все товары" ON products;

-- 2. Убеждаемся, что RLS включен
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Создаем политику для публичного чтения активных товаров
-- ВАЖНО: Явно указываем роли anon и authenticated
CREATE POLICY "Публичное чтение активных товаров"
    ON products FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- 4. Политика для админов (читают все товары, включая неактивные)
-- Эта политика должна быть после публичной, чтобы админы могли видеть все
CREATE POLICY "Админ может читать все товары"
    ON products FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- ============================================
-- ПРОВЕРКА ПОЛИТИК
-- ============================================
-- Выполните эти команды для проверки:

-- Проверка, что RLS включен:
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename = 'products';
-- Должно вернуть: rowsecurity = true

-- Проверка политик:
-- SELECT schemaname, tablename, policyname, roles, cmd, qual
-- FROM pg_policies 
-- WHERE tablename = 'products';
-- Должны быть видны обе политики

-- Тестовый запрос (должен работать для анонимных пользователей):
-- SELECT COUNT(*) FROM products WHERE is_active = true;

-- ============================================
-- ДОПОЛНИТЕЛЬНО: Исправление политик для категорий
-- ============================================
-- Если категории тоже не загружаются, выполните:

DROP POLICY IF EXISTS "Публичное чтение категорий" ON categories;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Публичное чтение категорий"
    ON categories FOR SELECT
    TO anon, authenticated
    USING (true);

