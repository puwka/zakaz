import { createClient } from './supabase/server';
import type { CheckoutContent } from '@/types/database';

export async function getCheckoutContent(): Promise<CheckoutContent | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('checkout_content')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    return data;
  } catch (err) {
    console.error('Ошибка загрузки контента оформления заказа:', err);
    return null;
  }
}




