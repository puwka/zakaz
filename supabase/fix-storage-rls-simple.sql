-- ============================================
-- ПРОСТОЕ ИСПРАВЛЕНИЕ RLS ДЛЯ STORAGE
-- ============================================
-- Этот скрипт создает правильные политики для загрузки изображений
-- Выполните его в Supabase SQL Editor

-- 1. Создаем бакеты (если не существуют)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('homepage', 'homepage', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Удаляем ВСЕ старые политики для storage.objects
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON storage.objects';
    END LOOP;
END $$;

-- 3. Создаем новые политики для products bucket

-- Публичное чтение
CREATE POLICY "products_public_read"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'products');

-- Загрузка для авторизованных
CREATE POLICY "products_authenticated_insert"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'products' AND auth.uid() IS NOT NULL);

-- Обновление для авторизованных
CREATE POLICY "products_authenticated_update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'products' AND auth.uid() IS NOT NULL)
    WITH CHECK (bucket_id = 'products' AND auth.uid() IS NOT NULL);

-- Удаление для авторизованных
CREATE POLICY "products_authenticated_delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'products' AND auth.uid() IS NOT NULL);

-- 4. Создаем новые политики для homepage bucket

-- Публичное чтение
CREATE POLICY "homepage_public_read"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'homepage');

-- Загрузка для авторизованных
CREATE POLICY "homepage_authenticated_insert"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'homepage' AND auth.uid() IS NOT NULL);

-- Обновление для авторизованных
CREATE POLICY "homepage_authenticated_update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'homepage' AND auth.uid() IS NOT NULL)
    WITH CHECK (bucket_id = 'homepage' AND auth.uid() IS NOT NULL);

-- Удаление для авторизованных
CREATE POLICY "homepage_authenticated_delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'homepage' AND auth.uid() IS NOT NULL);

-- ============================================
-- ПРОВЕРКА
-- ============================================
-- После выполнения проверьте:

-- 1. Бакеты созданы:
SELECT id, name, public FROM storage.buckets WHERE id IN ('products', 'homepage');

-- 2. Политики созданы:
SELECT policyname, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

