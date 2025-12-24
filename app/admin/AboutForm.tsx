'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2 } from 'lucide-react';
import type { AboutContent } from '@/types/database';
import { companyInfo, companyValues } from '@/lib/data';

const aboutSchema = z.object({
  hero_title: z.string().min(1, 'Заголовок обязателен'),
  hero_description: z.string().optional(),
  history_title: z.string().optional(),
  history_text: z.string().optional(),
  history_image_url: z.string().optional(),
  history_year: z.string().optional(),
  team_title: z.string().optional(),
  team_subtitle: z.string().optional(),
  team_members: z.array(z.object({
    name: z.string().min(1, 'Имя обязательно'),
    role: z.string().min(1, 'Роль обязательна'),
    experience: z.string().optional(),
    specialization: z.string().optional(),
    imageUrl: z.string().optional(),
  })),
  values_title: z.string().optional(),
  values_subtitle: z.string().optional(),
  values_items: z.array(z.object({
    icon: z.string(),
    title: z.string().min(1, 'Заголовок обязателен'),
    description: z.string().min(1, 'Описание обязательно'),
  })),
});

type AboutFormData = z.infer<typeof aboutSchema>;

interface AboutFormProps {
  content: AboutContent | null;
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

export default function AboutForm({ content, onSave }: AboutFormProps) {
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultValues: AboutFormData = {
    hero_title: content?.hero_title || 'О нас',
    hero_description: content?.hero_description || companyInfo.description,
    history_title: content?.history_title || 'Наша история',
    history_text: content?.history_text || companyInfo.history,
    history_image_url: content?.history_image_url || '',
    history_year: content?.history_year || '2015',
    team_title: content?.team_title || 'Наша команда',
    team_subtitle: content?.team_subtitle || 'Профессионалы, которые любят свое дело и создают мебель с душой',
    team_members: (content?.team_members as any) || [
      {
        name: 'Иван Петров',
        role: 'Главный мастер',
        experience: 'Опыт работы 15+ лет',
        specialization: 'корпусной мебели',
        imageUrl: '',
      },
    ],
    values_title: content?.values_title || 'Наши ценности',
    values_subtitle: content?.values_subtitle || 'Принципы, которыми мы руководствуемся в работе',
    values_items: (content?.values_items as any) || companyValues.map(v => ({
      icon: 'Heart',
      title: v.title,
      description: v.description,
    })),
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues,
  });

  const {
    fields: teamFields,
    append: appendTeamMember,
    remove: removeTeamMember,
  } = useFieldArray({ control, name: 'team_members' });

  const {
    fields: valuesFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({ control, name: 'values_items' });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'history_image_url' | number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadId = fieldName === 'history_image_url' ? 'history' : `team-${fieldName}`;
    setUploading(uploadId);
    setError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `about/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('homepage')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('homepage').getPublicUrl(filePath);

      if (fieldName === 'history_image_url') {
        setValue('history_image_url', publicUrl);
      } else {
        setValue(`team_members.${fieldName}.imageUrl`, publicUrl);
      }
    } catch (err) {
      console.error('Ошибка загрузки изображения:', err);
      setError('Ошибка при загрузке изображения');
    } finally {
      setUploading(null);
    }
  };

  const onSubmit = async (data: AboutFormData) => {
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const contentId = content?.id || '00000000-0000-0000-0000-000000000003';

      const { error: upsertError } = await supabase
        .from('about_content')
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
              Описание
            </label>
            <textarea
              {...register('hero_description')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood"
            />
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-wood mb-4">История</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок
            </label>
            <input
              type="text"
              {...register('history_title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Текст истории
            </label>
            <textarea
              {...register('history_text')}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Год основания
              </label>
              <input
                type="text"
                {...register('history_year')}
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
                  onChange={(e) => handleImageUpload(e, 'history_image_url')}
                  disabled={uploading === 'history'}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-wood/10 file:text-wood hover:file:bg-wood/20"
                />
                {watch('history_image_url') && (
                  <img
                    src={watch('history_image_url') || ''}
                    alt="History"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
              </div>
              {uploading === 'history' && (
                <p className="mt-2 text-sm text-gray-500">Загрузка...</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-wood">Команда</h3>
          <button
            type="button"
            onClick={() => appendTeamMember({ name: '', role: '', experience: '', specialization: '', imageUrl: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark"
          >
            <Plus className="w-4 h-4" />
            Добавить члена команды
          </button>
        </div>
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок секции
            </label>
            <input
              type="text"
              {...register('team_title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подзаголовок секции
            </label>
            <textarea
              {...register('team_subtitle')}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="space-y-6">
          {teamFields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Член команды {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeTeamMember(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Имя *
                    </label>
                    <input
                      type="text"
                      {...register(`team_members.${index}.name`)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Роль *
                    </label>
                    <input
                      type="text"
                      {...register(`team_members.${index}.role`)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Опыт работы
                    </label>
                    <input
                      type="text"
                      {...register(`team_members.${index}.experience`)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Специализация
                    </label>
                    <input
                      type="text"
                      {...register(`team_members.${index}.specialization`)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Фото
                  </label>
                  <div className="flex gap-4 items-start">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      disabled={uploading === `team-${index}`}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-wood/10 file:text-wood hover:file:bg-wood/20"
                    />
                    {watch(`team_members.${index}.imageUrl`) && (
                      <img
                        src={watch(`team_members.${index}.imageUrl`) || ''}
                        alt="Team member"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  {uploading === `team-${index}` && (
                    <p className="mt-2 text-sm text-gray-500">Загрузка...</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-wood">Ценности</h3>
          <button
            type="button"
            onClick={() => appendValue({ icon: 'Heart', title: '', description: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark"
          >
            <Plus className="w-4 h-4" />
            Добавить ценность
          </button>
        </div>
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок секции
            </label>
            <input
              type="text"
              {...register('values_title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подзаголовок секции
            </label>
            <textarea
              {...register('values_subtitle')}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="space-y-4">
          {valuesFields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Ценность {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeValue(index)}
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
                    {...register(`values_items.${index}.icon`)}
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
                    {...register(`values_items.${index}.title`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание *
                  </label>
                  <textarea
                    {...register(`values_items.${index}.description`)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
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
          className="flex-1 px-6 py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить все изменения'}
        </button>
      </div>
    </form>
  );
}





