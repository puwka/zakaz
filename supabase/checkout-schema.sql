-- ============================================
-- СХЕМА ДЛЯ РЕДАКТИРОВАНИЯ СТРАНИЦЫ ОФОРМЛЕНИЯ ЗАКАЗА
-- ============================================

-- Таблица для хранения контента страницы оформления заказа
CREATE TABLE IF NOT EXISTS checkout_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Преимущества заказа
    advantages JSONB DEFAULT '[]'::jsonb, -- [{icon: string, title: string, description: string}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_checkout_content_updated_at ON checkout_content(updated_at DESC);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_checkout_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_checkout_content_updated_at
    BEFORE UPDATE ON checkout_content
    FOR EACH ROW
    EXECUTE FUNCTION update_checkout_content_updated_at();

-- Вставляем начальные данные (если их еще нет)
INSERT INTO checkout_content (id, advantages)
VALUES (
    '00000000-0000-0000-0000-000000000005',
    '[
        {
            "icon": "Shield",
            "title": "Гарантия качества",
            "description": "5 лет гарантии на всю продукцию"
        },
        {
            "icon": "Truck",
            "title": "Доставка и монтаж",
            "description": "Бесплатная доставка по Москве от 50 000 ₽"
        },
        {
            "icon": "CreditCard",
            "title": "Безопасная оплата",
            "description": "Оплата при получении или онлайн"
        }
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Включаем RLS
ALTER TABLE checkout_content ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики, если они есть
DROP POLICY IF EXISTS "Публичное чтение страницы оформления заказа" ON checkout_content;
DROP POLICY IF EXISTS "Админ может обновлять страницу оформления заказа" ON checkout_content;
DROP POLICY IF EXISTS "Админ может создавать контент страницы оформления заказа" ON checkout_content;

-- Публичное чтение
CREATE POLICY "Публичное чтение страницы оформления заказа"
    ON checkout_content FOR SELECT
    USING (true);

-- Админ может обновлять (с WITH CHECK для upsert)
CREATE POLICY "Админ может обновлять страницу оформления заказа"
    ON checkout_content FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Админ может вставлять
CREATE POLICY "Админ может создавать контент страницы оформления заказа"
    ON checkout_content FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

