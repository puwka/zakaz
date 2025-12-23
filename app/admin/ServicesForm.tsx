'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2 } from 'lucide-react';
import type { ServicesContent } from '@/types/database';

const servicesSchema = z.object({
  hero_title: z.string().min(1, 'Заголовок обязателен'),
  hero_subtitle: z.string().optional(),
  services: z.array(z.object({
    title: z.string().min(1, 'Название обязательно'),
    description: z.string().min(1, 'Описание обязательно'),
    imageUrl: z.string().optional(),
    features: z.array(z.string()).optional(),
  })),
  cta_title: z.string().optional(),
  cta_subtitle: z.string().optional(),
  cta_button_text: z.string().optional(),
  cta_button_link: z.string().optional(),
});

type ServicesFormData = z.infer<typeof servicesSchema>;

interface ServicesFormProps {
  content: ServicesContent | null;
  onSave: () => void;
}

export default function ServicesForm({ content, onSave }: ServicesFormProps) {
  const [uploading, setUploading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultValues: ServicesFormData = {
    hero_title: content?.hero_title || 'Наши услуги',
    hero_subtitle: content?.hero_subtitle || 'Полный спектр столярных услуг: от индивидуальных проектов до комплексной меблировки помещений',
    services: (content?.services as any) || [
      {
        title: 'Изготовление кухонь на заказ',
        description: 'Создаем кухни мечты из массива дерева. Учитываем все ваши пожелания: от планировки до выбора фурнитуры.',
        imageUrl: '',
        features: ['Индивидуальный дизайн-проект', '3D-визуализация', 'Выбор породы дерева', 'Установка и монтаж'],
      },
    ],
    cta_title: content?.cta_title || 'Не нашли нужную услугу?',
    cta_subtitle: content?.cta_subtitle || 'Свяжитесь с нами, и мы обсудим ваш проект индивидуально',
    cta_button_text: content?.cta_button_text || 'Связаться с нами',
    cta_button_link: content?.cta_button_link || '/contacts',
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
  } = useForm<ServicesFormData>({
    resolver: zodResolver(servicesSchema),
    defaultValues,
  });

  const {
    fields: servicesFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({ control, name: 'services' });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    serviceIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(serviceIndex);
    setError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('homepage')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('homepage').getPublicUrl(filePath);

      setValue(`services.${serviceIndex}.imageUrl`, publicUrl);
    } catch (err) {
      console.error('Ошибка загрузки изображения:', err);
      setError('Ошибка при загрузке изображения');
    } finally {
      setUploading(null);
    }
  };

  const handleAddFeature = (serviceIndex: number) => {
    const currentFeatures = watch(`services.${serviceIndex}.features`) || [];
    setValue(`services.${serviceIndex}.features`, [...currentFeatures, '']);
  };

  const handleRemoveFeature = (serviceIndex: number, featureIndex: number) => {
    const currentFeatures = watch(`services.${serviceIndex}.features`) || [];
    setValue(`services.${serviceIndex}.features`, currentFeatures.filter((_, i) => i !== featureIndex));
  };

  const handleFeatureChange = (serviceIndex: number, featureIndex: number, value: string) => {
    const currentFeatures = watch(`services.${serviceIndex}.features`) || [];
    const newFeatures = [...currentFeatures];
    newFeatures[featureIndex] = value;
    setValue(`services.${serviceIndex}.features`, newFeatures);
  };

  const onSubmit = async (data: ServicesFormData) => {
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const contentId = content?.id || '00000000-0000-0000-0000-000000000002';

      const { error: upsertError } = await supabase
        .from('services_content')
        .upsert({
          id: contentId,
          ...data,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Hero Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-wood mb-4">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок *
            </label>
            <input
              type="text"
              {...register('hero_title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood"
            />
            {errors.hero_title && (
              <p className="mt-1 text-sm text-red-600">{errors.hero_title.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подзаголовок
            </label>
            <textarea
              {...register('hero_subtitle')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-wood">Услуги</h3>
          <button
            type="button"
            onClick={() => appendService({ title: '', description: '', imageUrl: '', features: [] })}
            className="flex items-center gap-2 px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark"
          >
            <Plus className="w-4 h-4" />
            Добавить услугу
          </button>
        </div>
        <div className="space-y-6">
          {servicesFields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Услуга {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название *
                  </label>
                  <input
                    type="text"
                    {...register(`services.${index}.title`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание *
                  </label>
                  <textarea
                    {...register(`services.${index}.description`)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Изображение
                  </label>
                  <div className="flex gap-4 items-start">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      disabled={uploading === index}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-wood/10 file:text-wood hover:file:bg-wood/20"
                    />
                    {watch(`services.${index}.imageUrl`) && (
                      <img
                        src={watch(`services.${index}.imageUrl`) || ''}
                        alt="Service"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  {uploading === index && (
                    <p className="mt-2 text-sm text-gray-500">Загрузка...</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Особенности
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddFeature(index)}
                      className="text-sm text-wood hover:text-wood-dark"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Добавить
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(watch(`services.${index}.features`) || []).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, featureIndex, e.target.value)}
                          placeholder="Особенность услуги"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index, featureIndex)}
                          className="px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-wood mb-4">CTA Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок
            </label>
            <input
              type="text"
              {...register('cta_title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подзаголовок
            </label>
            <textarea
              {...register('cta_subtitle')}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текст кнопки
              </label>
              <input
                type="text"
                {...register('cta_button_text')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ссылка кнопки
              </label>
              <input
                type="text"
                {...register('cta_button_link')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
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
          className="flex-1 px-6 py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить все изменения'}
        </button>
      </div>
    </form>
  );
}


