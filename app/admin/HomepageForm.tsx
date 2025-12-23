'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import type { HomepageContent } from '@/types/database';

const homepageSchema = z.object({
  hero_title: z.string().min(1, 'Заголовок обязателен'),
  hero_subtitle: z.string().optional(),
  hero_background_image_url: z.string().optional(),
  hero_button1_text: z.string().optional(),
  hero_button1_link: z.string().optional(),
  hero_button2_text: z.string().optional(),
  hero_button2_link: z.string().optional(),
  advantages_title: z.string().optional(),
  advantages_subtitle: z.string().optional(),
  advantages: z.array(z.object({
    icon: z.string(),
    title: z.string().min(1, 'Заголовок обязателен'),
    description: z.string().min(1, 'Описание обязательно'),
  })),
  work_steps_title: z.string().optional(),
  work_steps_subtitle: z.string().optional(),
  work_steps: z.array(z.object({
    number: z.string().min(1, 'Номер обязателен'),
    title: z.string().min(1, 'Заголовок обязателен'),
    description: z.string().min(1, 'Описание обязательно'),
  })),
  popular_categories_title: z.string().optional(),
  popular_categories_subtitle: z.string().optional(),
  popular_categories: z.array(z.object({
    name: z.string().min(1, 'Название обязательно'),
    slug: z.string().min(1, 'Slug обязателен'),
    description: z.string().min(1, 'Описание обязательно'),
    imageUrl: z.string().optional(),
    count: z.number().optional(),
    priceRange: z.string().optional(),
    features: z.array(z.string()).optional(),
  })),
  faq_title: z.string().optional(),
  faq_subtitle: z.string().optional(),
  faq_items: z.array(z.object({
    question: z.string().min(1, 'Вопрос обязателен'),
    answer: z.string().min(1, 'Ответ обязателен'),
  })),
  cta_title: z.string().optional(),
  cta_subtitle: z.string().optional(),
  cta_button1_text: z.string().optional(),
  cta_button1_link: z.string().optional(),
  cta_button2_text: z.string().optional(),
  cta_button2_link: z.string().optional(),
  cta_background_color: z.string().optional(),
});

type HomepageFormData = z.infer<typeof homepageSchema>;

interface HomepageFormProps {
  content: HomepageContent | null;
  onSave: () => void;
}

const ICON_OPTIONS = [
  { value: 'TreePine', label: 'Дерево' },
  { value: 'Shield', label: 'Щит' },
  { value: 'Ruler', label: 'Линейка' },
  { value: 'Leaf', label: 'Лист' },
  { value: 'FileText', label: 'Документ' },
  { value: 'Wrench', label: 'Гаечный ключ' },
  { value: 'Truck', label: 'Грузовик' },
  { value: 'CheckCircle', label: 'Галочка' },
  { value: 'Heart', label: 'Сердце' },
  { value: 'Award', label: 'Награда' },
  { value: 'Users', label: 'Пользователи' },
  { value: 'Table', label: 'Стол' },
  { value: 'Sofa', label: 'Диван' },
  { value: 'Palette', label: 'Палитра' },
  { value: 'BookOpen', label: 'Книга' },
];

export default function HomepageForm({ content, onSave }: HomepageFormProps) {
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultValues: HomepageFormData = {
    hero_title: content?.hero_title || 'Мебель, которая хранит тепло рук',
    hero_subtitle: content?.hero_subtitle || 'Премиальная столярная мастерская. Создаем мебель из натурального дерева, которая становится частью вашего дома на десятилетия',
    hero_background_image_url: content?.hero_background_image_url || '',
    hero_button1_text: content?.hero_button1_text || 'Перейти в каталог',
    hero_button1_link: content?.hero_button1_link || '/catalog',
    hero_button2_text: content?.hero_button2_text || 'Заказать проект',
    hero_button2_link: content?.hero_button2_link || '/contacts',
    advantages_title: content?.advantages_title || 'Почему мы',
    advantages_subtitle: content?.advantages_subtitle || 'Мы не просто изготавливаем мебель — мы создаем произведения, которые передаются из поколения в поколение',
    advantages: (content?.advantages as any) || [
      { icon: 'TreePine', title: 'Натуральное дерево', description: 'Работаем только с экологически чистой древесиной премиальных пород' },
      { icon: 'Shield', title: 'Гарантия 5 лет', description: 'Даем официальную гарантию на все изделия' },
      { icon: 'Ruler', title: 'Индивидуальные размеры', description: 'Изготавливаем мебель по вашим размерам' },
      { icon: 'Leaf', title: 'Экологичные масла', description: 'Используем только натуральные масла и воски' },
    ],
    work_steps_title: content?.work_steps_title || 'Как мы работаем',
    work_steps_subtitle: content?.work_steps_subtitle || 'Простой и понятный процесс от заявки до установки готового изделия',
    work_steps: (content?.work_steps as any) || [
      { number: '01', title: 'Заявка', description: 'Вы оставляете заявку на сайте или звоните нам' },
      { number: '02', title: 'Замер и эскиз', description: 'Наш мастер приезжает к вам для замера' },
      { number: '03', title: 'Производство', description: 'Изготавливаем изделие в нашей мастерской' },
      { number: '04', title: 'Доставка и монтаж', description: 'Доставляем готовое изделие и устанавливаем его' },
    ],
    popular_categories_title: content?.popular_categories_title || 'Популярные категории',
    popular_categories_subtitle: content?.popular_categories_subtitle || 'Выберите категорию или закажите индивидуальный проект',
    popular_categories: (content?.popular_categories as any) || [],
    faq_title: content?.faq_title || 'Часто задаваемые вопросы',
    faq_subtitle: content?.faq_subtitle || 'Ответы на самые популярные вопросы наших клиентов',
    faq_items: (content?.faq_items as any) || [
      { question: 'Какие сроки изготовления?', answer: 'Сроки зависят от сложности проекта. Простые изделия изготавливаются за 2-3 недели' },
      { question: 'Как происходит доставка?', answer: 'Доставка осуществляется по Москве и области нашим транспортом' },
    ],
    cta_title: content?.cta_title || 'Готовы обсудить ваш проект?',
    cta_subtitle: content?.cta_subtitle || 'Оставьте заявку на консультацию, и мы свяжемся с вами в течение часа',
    cta_button1_text: content?.cta_button1_text || 'Оставить заявку',
    cta_button1_link: content?.cta_button1_link || '/contacts',
    cta_button2_text: content?.cta_button2_text || 'Позвонить нам',
    cta_button2_link: content?.cta_button2_link || 'tel:+74951234567',
    cta_background_color: content?.cta_background_color || 'wood',
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
  } = useForm<HomepageFormData>({
    resolver: zodResolver(homepageSchema),
    defaultValues,
  });

  const {
    fields: advantagesFields,
    append: appendAdvantage,
    remove: removeAdvantage,
  } = useFieldArray({ control, name: 'advantages' });

  const {
    fields: workStepsFields,
    append: appendWorkStep,
    remove: removeWorkStep,
  } = useFieldArray({ control, name: 'work_steps' });

  const {
    fields: categoriesFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({ control, name: 'popular_categories' });

  const {
    fields: faqFields,
    append: appendFAQ,
    remove: removeFAQ,
  } = useFieldArray({ control, name: 'faq_items' });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string | number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadKey = fieldName === 'hero_background_image_url' ? 'hero' : 'category';
    const uploadId = fieldName === 'hero_background_image_url' ? 'hero' : `category-${fieldName}`;
    setUploading(uploadId);
    setError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${uploadKey}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('homepage')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('homepage').getPublicUrl(filePath);

      if (fieldName === 'hero_background_image_url') {
        setValue('hero_background_image_url', publicUrl);
      } else {
        // Для категорий
        const categoryIndex = typeof fieldName === 'number' ? fieldName : parseInt(String(fieldName));
        setValue(`popular_categories.${categoryIndex}.imageUrl` as any, publicUrl);
      }
    } catch (err) {
      console.error('Ошибка загрузки изображения:', err);
      setError('Ошибка при загрузке изображения');
    } finally {
      setUploading(null);
    }
  };

  const onSubmit = async (data: HomepageFormData) => {
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const contentId = content?.id || '00000000-0000-0000-0000-000000000001';

      const { error: upsertError } = await supabase
        .from('homepage_content')
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фоновое изображение
            </label>
            <div className="flex gap-4 items-start">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(e, 'hero_background_image_url' as any);
                  }
                }}
                disabled={uploading === 'hero'}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-wood/10 file:text-wood hover:file:bg-wood/20"
              />
              {watch('hero_background_image_url') && (
                <img
                  src={watch('hero_background_image_url') || ''}
                  alt="Hero background"
                  className="w-32 h-20 object-cover rounded-lg"
                />
              )}
            </div>
            {uploading === 'hero' && (
              <p className="mt-2 text-sm text-gray-500">Загрузка...</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текст кнопки 1
              </label>
              <input
                type="text"
                {...register('hero_button1_text')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ссылка кнопки 1
              </label>
              <input
                type="text"
                {...register('hero_button1_link')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текст кнопки 2
              </label>
              <input
                type="text"
                {...register('hero_button2_text')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ссылка кнопки 2
              </label>
              <input
                type="text"
                {...register('hero_button2_link')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-wood">Преимущества</h3>
          <button
            type="button"
            onClick={() => appendAdvantage({ icon: 'TreePine', title: '', description: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок секции
            </label>
            <input
              type="text"
              {...register('advantages_title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подзаголовок секции
            </label>
            <textarea
              {...register('advantages_subtitle')}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="space-y-4">
          {advantagesFields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Преимущество {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeAdvantage(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Иконка
                  </label>
                  <select
                    {...register(`advantages.${index}.icon`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Заголовок *
                  </label>
                  <input
                    type="text"
                    {...register(`advantages.${index}.title`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание *
                  </label>
                  <textarea
                    {...register(`advantages.${index}.description`)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Work Steps Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-wood">Шаги работы</h3>
          <button
            type="button"
            onClick={() => appendWorkStep({ number: '', title: '', description: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок секции
            </label>
            <input
              type="text"
              {...register('work_steps_title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подзаголовок секции
            </label>
            <textarea
              {...register('work_steps_subtitle')}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="space-y-4">
          {workStepsFields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Шаг {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeWorkStep(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Номер *
                  </label>
                  <input
                    type="text"
                    {...register(`work_steps.${index}.number`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Заголовок *
                  </label>
                  <input
                    type="text"
                    {...register(`work_steps.${index}.title`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание *
                  </label>
                  <textarea
                    {...register(`work_steps.${index}.description`)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-wood">Популярные категории</h3>
          <button
            type="button"
            onClick={() => appendCategory({ name: '', slug: '', description: '', imageUrl: '', count: 0, priceRange: '', features: [] })}
            className="flex items-center gap-2 px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок секции
            </label>
            <input
              type="text"
              {...register('popular_categories_title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подзаголовок секции
            </label>
            <textarea
              {...register('popular_categories_subtitle')}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="space-y-4">
          {categoriesFields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Категория {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название *
                    </label>
                    <input
                      type="text"
                      {...register(`popular_categories.${index}.name`)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      {...register(`popular_categories.${index}.slug`)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание *
                  </label>
                  <textarea
                    {...register(`popular_categories.${index}.description`)}
                    rows={2}
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
                      disabled={uploading === `category-${index}`}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-wood/10 file:text-wood hover:file:bg-wood/20"
                    />
                    {watch(`popular_categories.${index}.imageUrl`) && (
                      <img
                        src={watch(`popular_categories.${index}.imageUrl`) || ''}
                        alt="Category"
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  {uploading === `category-${index}` && (
                    <p className="mt-2 text-sm text-gray-500">Загрузка...</p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Количество товаров
                    </label>
                    <input
                      type="number"
                      {...register(`popular_categories.${index}.count`, { valueAsNumber: true })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Диапазон цен
                    </label>
                    <input
                      type="text"
                      {...register(`popular_categories.${index}.priceRange`)}
                      placeholder="от 45 000 ₽"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-wood">FAQ</h3>
          <button
            type="button"
            onClick={() => appendFAQ({ question: '', answer: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок секции
            </label>
            <input
              type="text"
              {...register('faq_title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подзаголовок секции
            </label>
            <textarea
              {...register('faq_subtitle')}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="space-y-4">
          {faqFields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Вопрос {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeFAQ(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Вопрос *
                  </label>
                  <input
                    type="text"
                    {...register(`faq_items.${index}.question`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ответ *
                  </label>
                  <textarea
                    {...register(`faq_items.${index}.answer`)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
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
                Текст кнопки 1
              </label>
              <input
                type="text"
                {...register('cta_button1_text')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ссылка кнопки 1
              </label>
              <input
                type="text"
                {...register('cta_button1_link')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текст кнопки 2
              </label>
              <input
                type="text"
                {...register('cta_button2_text')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ссылка кнопки 2
              </label>
              <input
                type="text"
                {...register('cta_button2_link')}
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

