-- ============================================
-- ИСПРАВЛЕНИЕ ОШИБКИ 403 FORBIDDEN ДЛЯ ЗАКАЗОВ
-- ============================================
-- Выполните этот скрипт в Supabase SQL Editor, если получаете ошибку 403 при загрузке заказов

-- 1. Удаляем существующие политики для orders
DROP POLICY IF EXISTS "Админ может читать заказы" ON orders;
DROP POLICY IF EXISTS "Админ может обновлять заказы" ON orders;

-- 2. Удаляем существующие политики для order_items
DROP POLICY IF EXISTS "Админ может читать позиции заказа" ON order_items;

-- 3. Убеждаемся, что RLS включен
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 4. Создаем политику для чтения заказов (только для авторизованных пользователей)
CREATE POLICY "Админ может читать заказы"
    ON orders FOR SELECT
    TO authenticated
    USING (auth.uid() IS NOT NULL);

-- 5. Создаем политику для обновления заказов (только для авторизованных пользователей)
CREATE POLICY "Админ может обновлять заказы"
    ON orders FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- 6. Создаем политику для чтения позиций заказа (только для авторизованных пользователей)
CREATE POLICY "Админ может читать позиции заказа"
    ON order_items FOR SELECT
    TO authenticated
    USING (auth.uid() IS NOT NULL);

-- ============================================
-- ПРОВЕРКА ПОЛИТИК
-- ============================================
-- Выполните эти команды для проверки:

-- Проверка, что RLS включен:
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename IN ('orders', 'order_items');
-- Должно вернуть: rowsecurity = true для обеих таблиц

-- Проверка политик:
-- SELECT schemaname, tablename, policyname, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('orders', 'order_items');
-- Должны быть видны все созданные политики

