'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import CheckoutForm from './CheckoutForm';
import type { CheckoutContent } from '@/types/database';

export default function CheckoutTab() {
  const [content, setContent] = useState<CheckoutContent | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContent = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('checkout_content')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Ошибка загрузки контента:', error);
      }

      setContent(data);
    } catch (err) {
      console.error('Ошибка загрузки контента:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-wood border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-wood mb-2">Оформление заказа</h2>
        <p className="text-gray-600">Редактируйте преимущества заказа, которые отображаются на странице оформления</p>
      </div>
      <CheckoutForm content={content} onSave={loadContent} />
    </div>
  );
}

