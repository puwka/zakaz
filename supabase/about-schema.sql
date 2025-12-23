-- ============================================
-- СХЕМА ДЛЯ РЕДАКТИРОВАНИЯ СТРАНИЦЫ О НАС
-- ============================================

-- Таблица для хранения контента страницы "О нас"
CREATE TABLE IF NOT EXISTS about_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Hero Section
    hero_title TEXT,
    hero_description TEXT,
    -- History Section
    history_title TEXT,
    history_text TEXT,
    history_image_url TEXT,
    history_year TEXT,
    -- Team Section
    team_title TEXT,
    team_subtitle TEXT,
    team_members JSONB DEFAULT '[]'::jsonb, -- [{name: string, role: string, experience: string, specialization: string, imageUrl: string}]
    -- Values Section
    values_title TEXT,
    values_subtitle TEXT,
    values_items JSONB DEFAULT '[]'::jsonb, -- [{icon: string, title: string, description: string}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_about_content_updated_at ON about_content(updated_at DESC);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_about_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_about_content_updated_at
    BEFORE UPDATE ON about_content
    FOR EACH ROW
    EXECUTE FUNCTION update_about_content_updated_at();

-- Вставляем начальные данные (если их еще нет)
INSERT INTO about_content (id)
VALUES ('00000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Включаем RLS
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики, если они есть
DROP POLICY IF EXISTS "Публичное чтение страницы О нас" ON about_content;
DROP POLICY IF EXISTS "Админ может обновлять страницу О нас" ON about_content;
DROP POLICY IF EXISTS "Админ может создавать контент страницы О нас" ON about_content;

-- Публичное чтение
CREATE POLICY "Публичное чтение страницы О нас"
    ON about_content FOR SELECT
    USING (true);

-- Админ может обновлять (с WITH CHECK для upsert)
CREATE POLICY "Админ может обновлять страницу О нас"
    ON about_content FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Админ может вставлять
CREATE POLICY "Админ может создавать контент страницы О нас"
    ON about_content FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- STORAGE: Используем существующий bucket homepage для изображений
-- ============================================
-- Изображения будут загружаться в bucket 'homepage' в папку 'about/'
-- Политики уже настроены в homepage-schema.sql

