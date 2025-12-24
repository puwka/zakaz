'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2 } from 'lucide-react';
import type { CheckoutContent } from '@/types/database';

const checkoutContentSchema = z.object({
  advantages: z.array(z.object({
    icon: z.string().min(1, 'Иконка обязательна'),
    title: z.string().min(1, 'Заголовок обязателен'),
    description: z.string().min(1, 'Описание обязательно'),
  })),
});

type CheckoutFormData = z.infer<typeof checkoutContentSchema>;

interface CheckoutFormProps {
  content: CheckoutContent | null;
  onSave: () => void;
}

const ICON_OPTIONS = [
  { value: 'Shield', label: 'Щит (Гарантия)' },
  { value: 'Truck', label: 'Грузовик (Доставка)' },
  { value: 'CreditCard', label: 'Карта (Оплата)' },
  { value: 'CheckCircle', label: 'Галочка' },
  { value: 'Clock', label: 'Часы' },
  { value: 'Package', label: 'Коробка' },
  { value: 'Star', label: 'Звезда' },
  { value: 'Award', label: 'Награда' },
  { value: 'Heart', label: 'Сердце' },
  { value: 'Zap', label: 'Молния' },
];

export default function CheckoutForm({ content, onSave }: CheckoutFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultAdvantages = content?.advantages 
    ? (Array.isArray(content.advantages) ? content.advantages : [])
    : [
        { icon: 'Shield', title: 'Гарантия качества', description: '5 лет гарантии на всю продукцию' },
        { icon: 'Truck', title: 'Доставка и монтаж', description: 'Бесплатная доставка по Москве от 50 000 ₽' },
        { icon: 'CreditCard', title: 'Безопасная оплата', description: 'Оплата при получении или онлайн' },
      ];

  const defaultValues: CheckoutFormData = {
    advantages: defaultAdvantages as any,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutContentSchema),
    defaultValues,
  });

  const {
    fields: advantagesFields,
    append: appendAdvantage,
    remove: removeAdvantage,
  } = useFieldArray({ control, name: 'advantages' });

  const onSubmit = async (data: CheckoutFormData) => {
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const contentId = content?.id || '00000000-0000-0000-0000-000000000005';

      const { error: upsertError } = await supabase
        .from('checkout_content')
        .upsert({
          id: contentId,
          advantages: data.advantages,
        }, {
          onConflict: 'id',
        });

      if (upsertError) throw upsertError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSave();
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      setError('Ошибка при сохранении контента');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Преимущества заказа */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-wood">Преимущества заказа</h3>
          <button
            type="button"
            onClick={() => appendAdvantage({ icon: 'Shield', title: '', description: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить преимущество
          </button>
        </div>

        <div className="space-y-4">
          {advantagesFields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-700">Преимущество {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeAdvantage(index)}
                  className="flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Удалить
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Иконка *
                  </label>
                  <select
                    {...register(`advantages.${index}.icon`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.advantages?.[index]?.icon && (
                    <p className="mt-1 text-sm text-red-600">{errors.advantages[index]?.icon?.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Заголовок *
                  </label>
                  <input
                    type="text"
                    {...register(`advantages.${index}.title`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Например: Гарантия качества"
                  />
                  {errors.advantages?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.advantages[index]?.title?.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание *
                  </label>
                  <textarea
                    {...register(`advantages.${index}.description`)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Например: 5 лет гарантии на всю продукцию"
                  />
                  {errors.advantages?.[index]?.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.advantages[index]?.description?.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Контент успешно сохранен!
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
}




