import { createClient } from '@/lib/supabase/server';
import type { Product, Category } from '@/types/database';

export async function getCatalogData() {
  try {
    const supabase = await createClient();
    
    // Загружаем категории и товары параллельно
    const [categoriesResult, productsResult] = await Promise.all([
      supabase
        .from('categories')
        .select('id, name, slug, image_url')
        .order('name'),
      supabase
        .from('products')
        .select('id, name, description, price, images, category_id, is_active, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
    ]);

    return {
      categories: (categoriesResult.data || []) as Category[],
      products: (productsResult.data || []) as Product[],
    };
  } catch (err) {
    console.error('Ошибка загрузки данных каталога:', err);
    return {
      categories: [] as Category[],
      products: [] as Product[],
    };
  }
}


