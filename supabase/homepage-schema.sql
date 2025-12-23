-- ============================================
-- СХЕМА ДЛЯ РЕДАКТИРОВАНИЯ ГЛАВНОЙ СТРАНИЦЫ
-- ============================================

-- Таблица для хранения контента главной страницы
CREATE TABLE IF NOT EXISTS homepage_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Hero Section
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_background_image_url TEXT,
    hero_button1_text TEXT DEFAULT 'Перейти в каталог',
    hero_button1_link TEXT DEFAULT '/catalog',
    hero_button2_text TEXT DEFAULT 'Заказать проект',
    hero_button2_link TEXT DEFAULT '/contacts',
    -- Advantages Section
    advantages_title TEXT,
    advantages_subtitle TEXT,
    advantages JSONB DEFAULT '[]'::jsonb, -- [{icon: string, title: string, description: string}]
    -- Work Steps Section
    work_steps_title TEXT,
    work_steps_subtitle TEXT,
    work_steps JSONB DEFAULT '[]'::jsonb, -- [{number: string, title: string, description: string}]
    -- Popular Categories Section
    popular_categories_title TEXT,
    popular_categories_subtitle TEXT,
    popular_categories JSONB DEFAULT '[]'::jsonb, -- [{name, slug, description, imageUrl, count, priceRange, features: []}]
    -- FAQ Section
    faq_title TEXT,
    faq_subtitle TEXT,
    faq_items JSONB DEFAULT '[]'::jsonb, -- [{question: string, answer: string}]
    -- CTA Section
    cta_title TEXT,
    cta_subtitle TEXT,
    cta_button1_text TEXT,
    cta_button1_link TEXT,
    cta_button2_text TEXT,
    cta_button2_link TEXT,
    cta_background_color TEXT DEFAULT 'wood',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_homepage_content_updated_at ON homepage_content(updated_at DESC);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_homepage_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_homepage_content_updated_at
    BEFORE UPDATE ON homepage_content
    FOR EACH ROW
    EXECUTE FUNCTION update_homepage_content_updated_at();

-- Вставляем начальные данные (если их еще нет)
INSERT INTO homepage_content (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Включаем RLS
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики, если они есть
DROP POLICY IF EXISTS "Публичное чтение главной страницы" ON homepage_content;
DROP POLICY IF EXISTS "Админ может обновлять главную страницу" ON homepage_content;
DROP POLICY IF EXISTS "Админ может создавать контент главной страницы" ON homepage_content;

-- Публичное чтение
CREATE POLICY "Публичное чтение главной страницы"
    ON homepage_content FOR SELECT
    USING (true);

-- Админ может обновлять
-- Используем простую проверку auth.uid() без доступа к auth.users
CREATE POLICY "Админ может обновлять главную страницу"
    ON homepage_content FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Админ может вставлять
CREATE POLICY "Админ может создавать контент главной страницы"
    ON homepage_content FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- STORAGE: Bucket для изображений главной страницы
-- ============================================

-- Создание bucket для изображений главной страницы
INSERT INTO storage.buckets (id, name, public)
VALUES ('homepage', 'homepage', true)
ON CONFLICT (id) DO NOTHING;

-- Удаляем существующие политики для storage.objects, если они есть
DROP POLICY IF EXISTS "Публичное чтение изображений главной страницы" ON storage.objects;
DROP POLICY IF EXISTS "Админ может загружать изображения главной страницы" ON storage.objects;
DROP POLICY IF EXISTS "Админ может обновлять изображения главной страницы" ON storage.objects;
DROP POLICY IF EXISTS "Админ может удалять изображения главной страницы" ON storage.objects;
DROP POLICY IF EXISTS "homepage_public_read" ON storage.objects;
DROP POLICY IF EXISTS "homepage_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "homepage_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "homepage_authenticated_delete" ON storage.objects;

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

