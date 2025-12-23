-- ============================================
-- ИСПРАВЛЕНИЕ RLS ПОЛИТИК ДЛЯ STORAGE HOMEPAGE BUCKET
-- ============================================
-- Этот скрипт исправляет политики для загрузки изображений главной страницы

-- Убеждаемся, что bucket существует
INSERT INTO storage.buckets (id, name, public)
VALUES ('homepage', 'homepage', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Удаляем все существующие политики для homepage bucket
DROP POLICY IF EXISTS "Публичное чтение изображений главной страницы" ON storage.objects;
DROP POLICY IF EXISTS "Админ может загружать изображения главной страницы" ON storage.objects;
DROP POLICY IF EXISTS "Админ может обновлять изображения главной страницы" ON storage.objects;
DROP POLICY IF EXISTS "Админ может удалять изображения главной страницы" ON storage.objects;

-- Политика для публичного чтения изображений (для всех)
CREATE POLICY "homepage_public_read"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'homepage');

-- Политика для загрузки изображений (только для авторизованных)
CREATE POLICY "homepage_authenticated_insert"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'homepage' AND
        auth.uid() IS NOT NULL
    );

-- Политика для обновления изображений (только для авторизованных)
CREATE POLICY "homepage_authenticated_update"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'homepage' AND
        auth.uid() IS NOT NULL
    )
    WITH CHECK (
        bucket_id = 'homepage' AND
        auth.uid() IS NOT NULL
    );

-- Политика для удаления изображений (только для авторизованных)
CREATE POLICY "homepage_authenticated_delete"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'homepage' AND
        auth.uid() IS NOT NULL
    );

-- Проверяем, что RLS включен для storage.objects
-- (RLS всегда включен для storage.objects в Supabase)

