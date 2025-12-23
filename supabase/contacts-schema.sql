-- ============================================
-- СХЕМА ДЛЯ РЕДАКТИРОВАНИЯ СТРАНИЦЫ КОНТАКТОВ
-- ============================================

-- Таблица для хранения контента страницы контактов
CREATE TABLE IF NOT EXISTS contacts_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Hero Section
    hero_title TEXT,
    hero_subtitle TEXT,
    -- Contact Info
    address TEXT,
    phone TEXT,
    email TEXT,
    working_hours TEXT,
    -- Social Links
    instagram_url TEXT,
    facebook_url TEXT,
    telegram_url TEXT,
    -- Map Settings
    map_address TEXT,
    map_latitude DECIMAL(10, 8), -- Широта
    map_longitude DECIMAL(11, 8), -- Долгота
    map_zoom INTEGER DEFAULT 15,
    -- Advantages Section
    advantages JSONB DEFAULT '[]'::jsonb, -- [{icon: string, title: string, description: string}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_contacts_content_updated_at ON contacts_content(updated_at DESC);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_contacts_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contacts_content_updated_at
    BEFORE UPDATE ON contacts_content
    FOR EACH ROW
    EXECUTE FUNCTION update_contacts_content_updated_at();

-- Вставляем начальные данные (если их еще нет)
INSERT INTO contacts_content (id)
VALUES ('00000000-0000-0000-0000-000000000004')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Включаем RLS
ALTER TABLE contacts_content ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики, если они есть
DROP POLICY IF EXISTS "Публичное чтение страницы контактов" ON contacts_content;
DROP POLICY IF EXISTS "Админ может обновлять страницу контактов" ON contacts_content;
DROP POLICY IF EXISTS "Админ может создавать контент страницы контактов" ON contacts_content;

-- Публичное чтение
CREATE POLICY "Публичное чтение страницы контактов"
    ON contacts_content FOR SELECT
    USING (true);

-- Админ может обновлять (с WITH CHECK для upsert)
CREATE POLICY "Админ может обновлять страницу контактов"
    ON contacts_content FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Админ может вставлять
CREATE POLICY "Админ может создавать контент страницы контактов"
    ON contacts_content FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

