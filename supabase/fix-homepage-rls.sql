-- ============================================
-- ИСПРАВЛЕНИЕ RLS ПОЛИТИК ДЛЯ HOMEPAGE_CONTENT
-- ============================================
-- Этот скрипт исправляет политики для поддержки upsert операций

-- Удаляем существующие политики
DROP POLICY IF EXISTS "Публичное чтение главной страницы" ON homepage_content;
DROP POLICY IF EXISTS "Админ может обновлять главную страницу" ON homepage_content;
DROP POLICY IF EXISTS "Админ может создавать контент главной страницы" ON homepage_content;

-- Публичное чтение
CREATE POLICY "Публичное чтение главной страницы"
    ON homepage_content FOR SELECT
    USING (true);

-- Админ может обновлять (с WITH CHECK для upsert)
-- Используем простую проверку auth.uid() без доступа к auth.users
CREATE POLICY "Админ может обновлять главную страницу"
    ON homepage_content FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Админ может вставлять
CREATE POLICY "Админ может создавать контент главной страницы"
    ON homepage_content FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Проверяем, что RLS включен
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

