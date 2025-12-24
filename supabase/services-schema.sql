-- ============================================
-- СХЕМА ДЛЯ РЕДАКТИРОВАНИЯ СТРАНИЦЫ УСЛУГ
-- ============================================

-- Таблица для хранения контента страницы услуг
CREATE TABLE IF NOT EXISTS services_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Hero Section
    hero_title TEXT,
    hero_subtitle TEXT,
    -- Services Section
    services JSONB DEFAULT '[]'::jsonb, -- [{title: string, description: string, imageUrl: string, features: string[]}]
    -- CTA Section
    cta_title TEXT,
    cta_subtitle TEXT,
    cta_button_text TEXT,
    cta_button_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_services_content_updated_at ON services_content(updated_at DESC);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_services_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_content_updated_at
    BEFORE UPDATE ON services_content
    FOR EACH ROW
    EXECUTE FUNCTION update_services_content_updated_at();

-- Вставляем начальные данные (если их еще нет)
INSERT INTO services_content (id)
VALUES ('00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Включаем RLS
ALTER TABLE services_content ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики, если они есть
DROP POLICY IF EXISTS "Публичное чтение страницы услуг" ON services_content;
DROP POLICY IF EXISTS "Админ может обновлять страницу услуг" ON services_content;
DROP POLICY IF EXISTS "Админ может создавать контент страницы услуг" ON services_content;

-- Публичное чтение
CREATE POLICY "Публичное чтение страницы услуг"
    ON services_content FOR SELECT
    USING (true);

-- Админ может обновлять (с WITH CHECK для upsert)
CREATE POLICY "Админ может обновлять страницу услуг"
    ON services_content FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Админ может вставлять
CREATE POLICY "Админ может создавать контент страницы услуг"
    ON services_content FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- STORAGE: Используем существующий bucket homepage для изображений услуг
-- ============================================
-- Изображения услуг будут загружаться в bucket 'homepage' в папку 'services/'
-- Политики уже настроены в homepage-schema.sql





