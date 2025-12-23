'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/types/database';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  slug: z.string().min(1, 'Slug обязателен').regex(/^[a-z0-9-]+$/, 'Slug может содержать только строчные буквы, цифры и дефисы'),
  icon: z.string().min(1, 'Иконка обязательна'),
});

const ICON_OPTIONS = [
  { value: 'Table', label: 'Стол' },
  { value: 'Sofa', label: 'Диван' },
  { value: 'Chair', label: 'Стул' },
  { value: 'Bed', label: 'Кровать' },
  { value: 'BookOpen', label: 'Книга' },
  { value: 'Lamp', label: 'Лампа' },
  { value: 'Package', label: 'Коробка' },
  { value: 'Palette', label: 'Палитра' },
  { value: 'Hammer', label: 'Молоток' },
  { value: 'Wrench', label: 'Гаечный ключ' },
  { value: 'Ruler', label: 'Линейка' },
  { value: 'TreePine', label: 'Дерево' },
  { value: 'Leaf', label: 'Лист' },
  { value: 'Shield', label: 'Щит' },
  { value: 'Award', label: 'Награда' },
  { value: 'Heart', label: 'Сердце' },
  { value: 'Star', label: 'Звезда' },
  { value: 'Box', label: 'Ящик' },
  { value: 'Grid3x3', label: 'Сетка' },
  { value: 'Layout', label: 'Макет' },
];

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) {
      setCategories(data);
    }
    setLoading(false);
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const supabase = createClient();
      
      const categoryData: any = {
        name: data.name,
        slug: data.slug,
        image_url: data.icon, // Сохраняем название иконки в image_url
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(categoryData);

        if (error) throw error;
      }

      handleFormClose();
      loadCategories();
    } catch (err) {
      console.error('Ошибка сохранения категории:', err);
      alert('Ошибка при сохранении категории');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию? Товары в этой категории останутся без категории.')) return;

    const supabase = createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      alert('Ошибка при удалении категории');
    } else {
      loadCategories();
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setValue('slug', category.slug);
    setValue('icon', category.image_url || 'Table'); // Используем image_url для хранения названия иконки
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
    reset();
  };

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Управление категориями</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить категорию</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
              </h3>
              <button
                onClick={handleFormClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  {...register('slug')}
                  placeholder="stoly"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Только строчные буквы, цифры и дефисы (например: stoly, stulya)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Иконка *
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {ICON_OPTIONS.map((option) => {
                    const IconComponent = (LucideIcons as any)[option.value] || LucideIcons.Package;
                    const isSelected = watch('icon') === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setValue('icon', option.value)}
                        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                          isSelected
                            ? 'border-wood bg-wood/10'
                            : 'border-gray-200 hover:border-wood/50 bg-white'
                        }`}
                      >
                        <IconComponent className={`w-6 h-6 mx-auto ${
                          isSelected ? 'text-wood' : 'text-gray-600'
                        }`} />
                        <p className={`text-xs mt-2 ${
                          isSelected ? 'text-wood font-medium' : 'text-gray-600'
                        }`}>
                          {option.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {errors.icon && (
                  <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  type="button"
                  onClick={handleFormClose}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Иконка
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Название
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Slug
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => {
              const IconName = category.image_url || 'Package';
              const IconComponent = (LucideIcons as any)[IconName] || LucideIcons.Package;
              return (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="w-12 h-12 bg-wood/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-wood" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{category.name}</div>
                </td>
                <td className="px-4 py-3">
                  <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {category.slug}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Категории не найдены
          </div>
        )}
      </div>
    </div>
  );
}

