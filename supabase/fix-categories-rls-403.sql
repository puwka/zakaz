-- ============================================
-- ИСПРАВЛЕНИЕ ОШИБКИ 403 FORBIDDEN ДЛЯ КАТЕГОРИЙ
-- ============================================
-- Выполните этот скрипт в Supabase SQL Editor, если получаете ошибку 403 при работе с категориями

-- 1. Удаляем существующие политики для categories
DROP POLICY IF EXISTS "Публичное чтение категорий" ON categories;
DROP POLICY IF EXISTS "Админ может создавать категории" ON categories;
DROP POLICY IF EXISTS "Админ может обновлять категории" ON categories;
DROP POLICY IF EXISTS "Админ может удалять категории" ON categories;

-- 2. Убеждаемся, что RLS включен
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 3. Создаем политику для публичного чтения категорий
CREATE POLICY "Публичное чтение категорий"
    ON categories FOR SELECT
    TO anon, authenticated
    USING (true);

-- 4. Создаем политику для создания категорий (только для авторизованных пользователей)
CREATE POLICY "Админ может создавать категории"
    ON categories FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- 5. Создаем политику для обновления категорий (только для авторизованных пользователей)
CREATE POLICY "Админ может обновлять категории"
    ON categories FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- 6. Создаем политику для удаления категорий (только для авторизованных пользователей)
CREATE POLICY "Админ может удалять категории"
    ON categories FOR DELETE
    TO authenticated
    USING (auth.uid() IS NOT NULL);

-- ============================================
-- ПРОВЕРКА ПОЛИТИК
-- ============================================
-- Выполните эти команды для проверки:

-- Проверка, что RLS включен:
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename = 'categories';
-- Должно вернуть: rowsecurity = true

-- Проверка политик:
-- SELECT schemaname, tablename, policyname, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'categories';
-- Должны быть видны все созданные политики

