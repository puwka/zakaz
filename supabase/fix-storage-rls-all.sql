-- ============================================
-- ИСПРАВЛЕНИЕ ОШИБКИ RLS ДЛЯ ВСЕХ STORAGE БАКЕТОВ
-- ============================================
-- Выполните этот скрипт в Supabase SQL Editor, если получаете ошибку
-- "new row violates row-level security policy" при загрузке изображений

-- ============================================
-- СОЗДАНИЕ БАКЕТОВ (если не существуют)
-- ============================================

-- Создаем бакет products
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Создаем бакет homepage
INSERT INTO storage.buckets (id, name, public)
VALUES ('homepage', 'homepage', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ============================================
-- 1. БАКЕТ 'products' - для изображений товаров
-- ============================================

-- Удаляем ВСЕ существующие политики для products (включая старые с разными именами)
DROP POLICY IF EXISTS "Публичное чтение изображений товаров" ON storage.objects;
DROP POLICY IF EXISTS "Админ может загружать изображения товаров" ON storage.objects;
DROP POLICY IF EXISTS "Админ может обновлять изображения товаров" ON storage.objects;
DROP POLICY IF EXISTS "Админ может удалять изображения товаров" ON storage.objects;
DROP POLICY IF EXISTS "Публичное чтение изображений" ON storage.objects;
DROP POLICY IF EXISTS "Админ может загружать изображения" ON storage.objects;
DROP POLICY IF EXISTS "Админ может обновлять изображения" ON storage.objects;
DROP POLICY IF EXISTS "Админ может удалять изображения" ON storage.objects;

-- Публичное чтение изображений товаров
CREATE POLICY "Публичное чтение изображений товаров"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'products');

-- Админ может загружать изображения товаров
CREATE POLICY "Админ может загружать изображения товаров"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'products' AND
        auth.uid() IS NOT NULL
    );

-- Админ может обновлять изображения товаров
CREATE POLICY "Админ может обновлять изображения товаров"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'products' AND
        auth.uid() IS NOT NULL
    )
    WITH CHECK (
        bucket_id = 'products' AND
        auth.uid() IS NOT NULL
    );

-- Админ может удалять изображения товаров
CREATE POLICY "Админ может удалять изображения товаров"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'products' AND
        auth.uid() IS NOT NULL
    );

-- ============================================
-- 2. БАКЕТ 'homepage' - для изображений главной, услуг, о нас
-- ============================================

-- Удаляем ВСЕ существующие политики для homepage (включая старые с разными именами)
DROP POLICY IF EXISTS "Публичное чтение изображений главной" ON storage.objects;
DROP POLICY IF EXISTS "Админ может загружать изображения главной" ON storage.objects;
DROP POLICY IF EXISTS "Админ может обновлять изображения главной" ON storage.objects;
DROP POLICY IF EXISTS "Админ может удалять изображения главной" ON storage.objects;
DROP POLICY IF EXISTS "Публичное чтение изображений главной страницы" ON storage.objects;
DROP POLICY IF EXISTS "Админ может загружать изображения главной страницы" ON storage.objects;
DROP POLICY IF EXISTS "Админ может обновлять изображения главной страницы" ON storage.objects;
DROP POLICY IF EXISTS "Админ может удалять изображения главной страницы" ON storage.objects;
DROP POLICY IF EXISTS "homepage_public_read" ON storage.objects;
DROP POLICY IF EXISTS "homepage_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "homepage_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "homepage_authenticated_delete" ON storage.objects;

-- Публичное чтение изображений главной
CREATE POLICY "Публичное чтение изображений главной"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'homepage');

-- Админ может загружать изображения главной
CREATE POLICY "Админ может загружать изображения главной"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'homepage' AND
        auth.uid() IS NOT NULL
    );

-- Админ может обновлять изображения главной
CREATE POLICY "Админ может обновлять изображения главной"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'homepage' AND
        auth.uid() IS NOT NULL
    )
    WITH CHECK (
        bucket_id = 'homepage' AND
        auth.uid() IS NOT NULL
    );

-- Админ может удалять изображения главной
CREATE POLICY "Админ может удалять изображения главной"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'homepage' AND
        auth.uid() IS NOT NULL
    );

-- ============================================
-- ПРОВЕРКА БАКЕТОВ
-- ============================================
-- Убедитесь, что бакеты существуют:

-- Проверка бакета products
-- SELECT id, name, public FROM storage.buckets WHERE id = 'products';
-- Если не существует, создайте:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('products', 'products', true)
-- ON CONFLICT (id) DO NOTHING;

-- Проверка бакета homepage
-- SELECT id, name, public FROM storage.buckets WHERE id = 'homepage';
-- Если не существует, создайте:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('homepage', 'homepage', true)
-- ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ПРОВЕРКА БАКЕТОВ И ПОЛИТИК
-- ============================================
-- Выполните эти команды для проверки после выполнения скрипта:

-- 1. Проверка существования бакетов:
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id IN ('products', 'homepage');

-- 2. Проверка политик для products:
SELECT policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' 
  AND tablename = 'objects' 
  AND (policyname LIKE '%товаров%' OR qual::text LIKE '%products%');

-- 3. Проверка политик для homepage:
SELECT policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' 
  AND tablename = 'objects' 
  AND (policyname LIKE '%главной%' OR qual::text LIKE '%homepage%');

-- 4. Проверка всех политик для storage.objects:
SELECT policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

