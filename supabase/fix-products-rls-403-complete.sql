-- ============================================
-- ПОЛНОЕ ИСПРАВЛЕНИЕ ОШИБКИ 403 FORBIDDEN
-- ============================================
-- Этот скрипт полностью пересоздает политики для товаров
-- Выполните его в Supabase SQL Editor

-- ШАГ 1: Отключаем RLS временно для очистки
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- ШАГ 2: Удаляем ВСЕ существующие политики для товаров
DROP POLICY IF EXISTS "Публичное чтение активных товаров" ON products;
DROP POLICY IF EXISTS "Админ может читать все товары" ON products;
DROP POLICY IF EXISTS "products_select_policy" ON products;
DROP POLICY IF EXISTS "products_select_anon" ON products;
DROP POLICY IF EXISTS "products_select_authenticated" ON products;

-- ШАГ 3: Включаем RLS обратно
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ШАГ 4: Создаем простую политику для публичного чтения активных товаров
-- Используем FOR ALL вместо FOR SELECT для максимальной совместимости
CREATE POLICY "products_public_read_active"
    ON products
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- ШАГ 5: Политика для админов (читают все товары)
CREATE POLICY "products_admin_read_all"
    ON products
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- ============================================
-- ПРОВЕРКА И ИСПРАВЛЕНИЕ КАТЕГОРИЙ
-- ============================================

-- Отключаем RLS для категорий
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Удаляем все политики для категорий
DROP POLICY IF EXISTS "Публичное чтение категорий" ON categories;
DROP POLICY IF EXISTS "categories_select_policy" ON categories;
DROP POLICY IF EXISTS "categories_select_anon" ON categories;

-- Включаем RLS обратно
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Создаем политику для публичного чтения категорий
CREATE POLICY "categories_public_read"
    ON categories
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- ============================================
-- ДИАГНОСТИКА
-- ============================================
-- Выполните эти запросы для проверки:

-- 1. Проверка RLS:
SELECT 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('products', 'categories');

-- 2. Проверка политик для products:
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    roles, 
    cmd, 
    qual
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- 3. Проверка политик для categories:
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    roles, 
    cmd, 
    qual
FROM pg_policies 
WHERE tablename = 'categories'
ORDER BY policyname;

-- 4. Тестовый запрос (должен работать):
-- SELECT COUNT(*) FROM products WHERE is_active = true;
-- SELECT COUNT(*) FROM categories;

-- ============================================
-- ЕСЛИ ВСЕ ЕЩЕ НЕ РАБОТАЕТ
-- ============================================
-- Попробуйте временно отключить RLS для тестирования:
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;
-- 
-- Если это работает, значит проблема в политиках.
-- Если не работает, значит проблема в другом месте (API ключи, настройки проекта и т.д.)

