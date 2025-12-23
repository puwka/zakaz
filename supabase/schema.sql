-- ============================================
-- СХЕМА БАЗЫ ДАННЫХ ДЛЯ СТОЛЯРНОГО ЦЕХА
-- ============================================

-- 1. Создание ENUM для статуса заказа
CREATE TYPE order_status AS ENUM ('new', 'processed');

-- 2. Таблица категорий
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Таблица товаров
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Таблица заказов
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    status order_status DEFAULT 'new',
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0)
);

-- 5. Таблица позиций заказа
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10, 2) NOT NULL CHECK (price_at_purchase >= 0)
);

-- 6. Индексы для оптимизации
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- 7. Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Триггеры для updated_at
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) ПОЛИТИКИ
-- ============================================

-- Включаем RLS для всех таблиц
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- КАТЕГОРИИ: Публичное чтение, админ - полный доступ
-- ============================================

-- Публичное чтение категорий
CREATE POLICY "Публичное чтение категорий"
    ON categories FOR SELECT
    USING (true);

-- Админ может вставлять категории
CREATE POLICY "Админ может создавать категории"
    ON categories FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            -- Здесь можно добавить проверку на роль админа через metadata
            -- Например: auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Админ может обновлять категории
CREATE POLICY "Админ может обновлять категории"
    ON categories FOR UPDATE
    USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- Админ может удалять категории
CREATE POLICY "Админ может удалять категории"
    ON categories FOR DELETE
    USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- ============================================
-- ТОВАРЫ: Публичное чтение активных, админ - полный доступ
-- ============================================

-- Публичное чтение активных товаров
CREATE POLICY "Публичное чтение активных товаров"
    ON products FOR SELECT
    USING (is_active = true);

-- Админ может читать все товары (включая неактивные)
CREATE POLICY "Админ может читать все товары"
    ON products FOR SELECT
    USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- Админ может создавать товары
CREATE POLICY "Админ может создавать товары"
    ON products FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- Админ может обновлять товары
CREATE POLICY "Админ может обновлять товары"
    ON products FOR UPDATE
    USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- Админ может удалять товары
CREATE POLICY "Админ может удалять товары"
    ON products FOR DELETE
    USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- ============================================
-- ЗАКАЗЫ: Анонимные могут создавать, админ - полный доступ
-- ============================================

-- Анонимные пользователи могут создавать заказы
CREATE POLICY "Анонимные могут создавать заказы"
    ON orders FOR INSERT
    WITH CHECK (true);

-- Админ может читать все заказы
CREATE POLICY "Админ может читать заказы"
    ON orders FOR SELECT
    USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- Админ может обновлять заказы (изменять статус)
CREATE POLICY "Админ может обновлять заказы"
    ON orders FOR UPDATE
    USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- ============================================
-- ПОЗИЦИИ ЗАКАЗА: Анонимные могут создавать, админ - полный доступ
-- ============================================

-- Анонимные пользователи могут создавать позиции заказа
CREATE POLICY "Анонимные могут создавать позиции заказа"
    ON order_items FOR INSERT
    WITH CHECK (true);

-- Админ может читать все позиции заказа
CREATE POLICY "Админ может читать позиции заказа"
    ON order_items FOR SELECT
    USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- ============================================
-- STORAGE: Настройка bucket для изображений товаров
-- ============================================

-- Создание bucket для изображений товаров (выполнить в Supabase Dashboard -> Storage)
-- Или через SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Политика для публичного чтения изображений
CREATE POLICY "Публичное чтение изображений товаров"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');

-- Политика для загрузки изображений (только для авторизованных админов)
CREATE POLICY "Админ может загружать изображения"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'products' AND
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- Политика для обновления изображений (только для авторизованных админов)
CREATE POLICY "Админ может обновлять изображения"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'products' AND
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- Политика для удаления изображений (только для авторизованных админов)
CREATE POLICY "Админ может удалять изображения"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'products' AND
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        )
    );

-- ============================================
-- ПРИМЕЧАНИЯ:
-- ============================================
-- 1. После выполнения скрипта создайте пользователя-админа в Supabase Auth
-- 2. Для более строгой проверки админа можно использовать:
--    - Таблицу admin_users с user_id
--    - Или metadata пользователя: auth.users.raw_user_meta_data->>'role' = 'admin'
-- 3. Bucket 'products' должен быть создан вручную в Supabase Dashboard -> Storage,
--    если INSERT не сработает
-- ============================================

