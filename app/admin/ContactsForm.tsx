'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, MapPin } from 'lucide-react';
import type { ContactsContent } from '@/types/database';
import { companyInfo } from '@/lib/data';
import { isValidPhone, formatPhoneInput } from '@/lib/phoneValidation';

const contactsSchema = z.object({
  hero_title: z.string().min(1, 'Заголовок обязателен'),
  hero_subtitle: z.string().optional(),
  address: z.string().min(1, 'Адрес обязателен'),
  phone: z.string()
    .min(1, 'Телефон обязателен')
    .refine((phone) => isValidPhone(phone), {
      message: 'Введите корректный номер телефона (например: +7 (999) 123-45-67)',
    }),
  email: z.string().email('Некорректный email').min(1, 'Email обязателен'),
  working_hours: z.string().optional(),
  instagram_url: z.string().optional(),
  facebook_url: z.string().optional(),
  telegram_url: z.string().optional(),
  telegram_chat_id: z.string().optional(),
  map_address: z.string().min(1, 'Адрес для карты обязателен'),
  map_latitude: z.number().min(-90).max(90, 'Широта должна быть от -90 до 90'),
  map_longitude: z.number().min(-180).max(180, 'Долгота должна быть от -180 до 180'),
  map_zoom: z.number().min(1).max(20).optional(),
  advantages: z.array(z.object({
    icon: z.string(),
    title: z.string().min(1, 'Заголовок обязателен'),
    description: z.string().min(1, 'Описание обязательно'),
  })),
});

type ContactsFormData = z.infer<typeof contactsSchema>;

interface ContactsFormProps {
  content: ContactsContent | null;
  onSave: () => void;
}

const ICON_OPTIONS = [
  { value: 'Clock', label: 'Часы' },
  { value: 'MessageCircle', label: 'Сообщение' },
  { value: 'MapPin', label: 'Метка на карте' },
  { value: 'Phone', label: 'Телефон' },
  { value: 'Mail', label: 'Почта' },
  { value: 'CheckCircle', label: 'Галочка' },
];

export default function ContactsForm({ content, onSave }: ContactsFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultValues: ContactsFormData = {
    hero_title: content?.hero_title || 'Контакты',
    hero_subtitle: content?.hero_subtitle || 'Свяжитесь с нами любым удобным способом. Мы всегда рады ответить на ваши вопросы и обсудить ваш проект',
    address: content?.address || companyInfo.address,
    phone: content?.phone || companyInfo.phone,
    email: content?.email || companyInfo.email,
    working_hours: content?.working_hours || companyInfo.workingHours,
    instagram_url: content?.instagram_url || '',
    facebook_url: content?.facebook_url || '',
    telegram_url: content?.telegram_url || '',
    telegram_chat_id: content?.telegram_chat_id || '',
    map_address: content?.map_address || companyInfo.address,
    map_latitude: content?.map_latitude || 55.7558,
    map_longitude: content?.map_longitude || 37.6173,
    map_zoom: content?.map_zoom || 15,
    advantages: (content?.advantages as any) || [
      { icon: 'Clock', title: 'Быстрый ответ', description: 'Отвечаем на звонки и сообщения в течение часа в рабочее время' },
      { icon: 'MessageCircle', title: 'Консультация', description: 'Бесплатная консультация по телефону или в мастерской' },
      { icon: 'MapPin', title: 'Выезд мастера', description: 'Бесплатный выезд мастера для замера в пределах города' },
    ],
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
  } = useForm<ContactsFormData>({
    resolver: zodResolver(contactsSchema),
    defaultValues,
  });

  const phoneValue = watch('phone');

  // Обработчик изменения телефона с маской
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setValue('phone', formatted, { shouldValidate: false });
  };

  const {
    fields: advantagesFields,
    append: appendAdvantage,
    remove: removeAdvantage,
  } = useFieldArray({ control, name: 'advantages' });

  const mapLatitude = watch('map_latitude');
  const mapLongitude = watch('map_longitude');

  const onSubmit = async (data: ContactsFormData) => {
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const contentId = content?.id || '00000000-0000-0000-0000-000000000004';

      // Убеждаемся, что координаты сохраняются как числа
      const dataToSave = {
        ...data,
        map_latitude: typeof data.map_latitude === 'number' 
          ? data.map_latitude 
          : parseFloat(String(data.map_latitude || 0)),
        map_longitude: typeof data.map_longitude === 'number'
          ? data.map_longitude
          : parseFloat(String(data.map_longitude || 0)),
        map_zoom: typeof data.map_zoom === 'number'
          ? data.map_zoom
          : parseInt(String(data.map_zoom || 15)),
      };

      const { error: upsertError } = await supabase
        .from('contacts_content')
        .upsert({
          id: contentId,
          ...dataToSave,
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

      {/* Contact Info */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-wood mb-4">Контактная информация</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Адрес *
            </label>
            <input
              type="text"
              {...register('address')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Телефон *
            </label>
            <input
              type="tel"
              {...register('phone')}
              value={phoneValue || ''}
              onChange={handlePhoneChange}
              onBlur={() => {
                // Валидация при потере фокуса
                if (phoneValue) {
                  setValue('phone', phoneValue, { shouldValidate: true });
                }
              }}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="+7 (999) 123-45-67"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Режим работы
            </label>
            <input
              type="text"
              {...register('working_hours')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-wood mb-4">Социальные сети</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              {...register('instagram_url')}
              placeholder="https://instagram.com/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              {...register('facebook_url')}
              placeholder="https://facebook.com/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telegram URL
            </label>
            <input
              type="url"
              {...register('telegram_url')}
              placeholder="https://t.me/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telegram Chat ID (для получения заявок)
            </label>
            <input
              type="text"
              {...register('telegram_chat_id')}
              placeholder="123456789"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <p className="mt-1 text-xs text-gray-500">
              ID чата или группы в Telegram, куда будут отправляться заявки с формы обратной связи. 
              Если не указан, будет использоваться значение из переменных окружения.
            </p>
          </div>
        </div>
      </section>

      {/* Map Settings */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-6 h-6 text-wood" />
          <h3 className="text-xl font-bold text-wood">Настройки карты</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Адрес для карты *
            </label>
            <input
              type="text"
              {...register('map_address')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {errors.map_address && (
              <p className="mt-1 text-sm text-red-600">{errors.map_address.message}</p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Широта (latitude) *
              </label>
              <input
                type="number"
                step="0.00000001"
                {...register('map_latitude', { 
                  valueAsNumber: true,
                  required: 'Широта обязательна'
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="55.7558"
              />
              {errors.map_latitude && (
                <p className="mt-1 text-sm text-red-600">{errors.map_latitude.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Долгота (longitude) *
              </label>
              <input
                type="number"
                step="0.00000001"
                {...register('map_longitude', { 
                  valueAsNumber: true,
                  required: 'Долгота обязательна'
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="37.6173"
              />
              {errors.map_longitude && (
                <p className="mt-1 text-sm text-red-600">{errors.map_longitude.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Масштаб (zoom)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                {...register('map_zoom', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Как получить координаты:</strong>
            </p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Откройте <a href="https://yandex.ru/maps" target="_blank" rel="noopener noreferrer" className="underline">Яндекс.Карты</a></li>
              <li>Найдите ваш адрес на карте</li>
              <li>Кликните правой кнопкой мыши на нужное место</li>
              <li>Выберите "Что здесь?" и скопируйте координаты</li>
              <li>Формат: <strong>широта, долгота</strong> (например: 55.7558, 37.6173)</li>
            </ol>
            {mapLatitude && mapLongitude && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Текущие координаты:</strong> {mapLatitude}, {mapLongitude}
                </p>
                <a
                  href={`https://yandex.ru/maps/?pt=${mapLongitude},${mapLatitude}&z=${watch('map_zoom') || 15}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
                >
                  Открыть на карте →
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-wood">Преимущества</h3>
          <button
            type="button"
            onClick={() => appendAdvantage({ icon: 'Clock', title: '', description: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
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

