'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ContactsContent } from '@/types/database';
import ContactsForm from './ContactsForm';

export default function ContactsTab() {
  const [content, setContent] = useState<ContactsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      const { data, error: fetchError } = await supabase
        .from('contacts_content')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setContent(data);
    } catch (err) {
      console.error('Ошибка загрузки контента:', err);
      setError('Ошибка при загрузке контента страницы контактов');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await loadContent();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-wood border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600">Загрузка контента...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-wood mb-2">Редактирование страницы контактов</h2>
        <p className="text-gray-600">
          Здесь вы можете изменить контактную информацию, координаты карты, социальные сети и другие данные.
        </p>
      </div>

      <ContactsForm content={content} onSave={handleSave} />
    </div>
  );
}





