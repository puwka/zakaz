-- ============================================
-- ПРОСТОЕ РЕШЕНИЕ: ВРЕМЕННОЕ ОТКЛЮЧЕНИЕ RLS
-- ============================================
-- ВНИМАНИЕ: Это временное решение для диагностики!
-- Используйте только для проверки, работает ли проблема в RLS

-- Вариант 1: Полностью отключить RLS для товаров (НЕ БЕЗОПАСНО для продакшена!)
-- Раскомментируйте следующую строку для тестирования:
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- ============================================
-- ВАРИАНТ 2: Политика, разрешающая ВСЕ для анонимных (только для тестирования!)
-- ============================================
-- Раскомментируйте этот блок для тестирования:

/*
-- Удаляем все политики
DROP POLICY IF EXISTS "Публичное чтение активных товаров" ON products;
DROP POLICY IF EXISTS "Админ может читать все товары" ON products;
DROP POLICY IF EXISTS "products_public_read_active" ON products;
DROP POLICY IF EXISTS "products_admin_read_all" ON products;

-- Создаем политику, разрешающую ВСЕ для всех
CREATE POLICY "products_allow_all"
    ON products
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
*/

-- ============================================
-- ВАРИАНТ 3: Правильное решение (выполните этот блок)
-- ============================================

-- 1. Удаляем все существующие политики
DROP POLICY IF EXISTS "Публичное чтение активных товаров" ON products;
DROP POLICY IF EXISTS "Админ может читать все товары" ON products;
DROP POLICY IF EXISTS "products_public_read_active" ON products;
DROP POLICY IF EXISTS "products_admin_read_all" ON products;
DROP POLICY IF EXISTS "products_allow_all" ON products;

-- 2. Убеждаемся, что RLS включен
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Создаем политику с явным указанием ролей и без условий (для теста)
-- Это должно работать для всех анонимных пользователей
CREATE POLICY "products_select_anon_test"
    ON products
    FOR SELECT
    TO anon
    USING (is_active = true);

-- 4. Политика для авторизованных пользователей
CREATE POLICY "products_select_authenticated_test"
    ON products
    FOR SELECT
    TO authenticated
    USING (true);

-- ============================================
-- ПРОВЕРКА
-- ============================================
-- После выполнения проверьте:
-- 1. Откройте браузер в режиме инкогнито (чтобы быть анонимным)
-- 2. Откройте консоль разработчика
-- 3. Попробуйте загрузить каталог
-- 4. Если все еще 403, попробуйте Вариант 1 (отключить RLS)

-- ============================================
-- ЕСЛИ НИЧЕГО НЕ ПОМОГАЕТ
-- ============================================
-- Проверьте в Supabase Dashboard:
-- 1. Settings → API → убедитесь, что anon key правильный
-- 2. Authentication → Policies → проверьте, что RLS включен
-- 3. Database → Tables → products → Policies → проверьте список политик


