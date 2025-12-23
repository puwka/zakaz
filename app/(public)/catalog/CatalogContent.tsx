'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Grid, List, ArrowUpDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ProductCard from '@/components/ProductCard';
import type { Product, Category } from '@/types/database';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface CatalogContentProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

export default function CatalogContent({ 
  initialCategories, 
  initialProducts 
}: CatalogContentProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name-asc'>('newest');

  // Debounce поиска для оптимизации
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Клиентская фильтрация и сортировка товаров (все данные уже загружены на сервере)
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = initialProducts;

    // Фильтр по категории
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    // Фильтр по поисковому запросу
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))
      );
    }

    // Сортировка
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name, 'ru');
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return sorted;
  }, [initialProducts, selectedCategory, debouncedSearchQuery, sortBy]);

  // Обновляем состояние products при изменении фильтров и сортировки
  useEffect(() => {
    setProducts(filteredAndSortedProducts);
  }, [filteredAndSortedProducts]);

  const selectedCategoryData = useMemo(
    () => categories.find(c => c.id === selectedCategory),
    [categories, selectedCategory]
  );
  const totalProducts = products.length;

  return (
    <div>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-4">
          Каталог товаров
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl">
          Премиальная мебель из натурального дерева ручной работы. 
          Каждое изделие создается с любовью и вниманием к деталям.
        </p>
      </motion.div>

      {/* Категории - Карточки */}
      {categories.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Категории
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="group relative"
              >
                <button
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full p-3 md:p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'border-wood bg-wood/5 shadow-md'
                      : 'border-gray-200 bg-white hover:border-wood/50 hover:shadow-sm'
                  }`}
                >
                  <div className="relative w-full h-16 md:h-20 mb-2 rounded-lg bg-wood/5 flex items-center justify-center group-hover:bg-wood/10 transition-colors duration-300">
                    {(() => {
                      const IconName = category.image_url || 'Package';
                      const IconComponent = (LucideIcons as any)[IconName] || LucideIcons.Package;
                      return (
                        <IconComponent className={`w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110 ${
                          selectedCategory === category.id ? 'text-wood' : 'text-wood/70'
                        }`} />
                      );
                    })()}
                  </div>
                  <h3 className={`font-semibold text-sm md:text-base mb-1 text-center ${
                    selectedCategory === category.id ? 'text-wood' : 'text-text-primary'
                  }`}>
                    {category.name}
                  </h3>
                  {selectedCategory === category.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-text-secondary text-center"
                    >
                      {totalProducts} товаров
                    </motion.div>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Поиск и фильтры */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8 space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Поиск */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск товаров по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-wood/10 focus:border-wood transition-all duration-300 text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Кнопки управления */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-2 ${
                showFilters || selectedCategory
                  ? 'border-wood bg-wood text-white'
                  : 'border-gray-200 bg-white text-text-secondary hover:border-wood/50'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Фильтры</span>
            </button>
            
            {/* Сортировка */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none px-6 py-4 pr-10 rounded-xl border-2 border-gray-200 bg-white text-text-secondary hover:border-wood/50 focus:border-wood focus:ring-4 focus:ring-wood/10 transition-all duration-300 cursor-pointer"
              >
                <option value="newest">Сначала новые</option>
                <option value="price-asc">Цена: по возрастанию</option>
                <option value="price-desc">Цена: по убыванию</option>
                <option value="name-asc">По названию (А-Я)</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-4 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-wood text-white'
                    : 'bg-white text-text-secondary hover:bg-gray-50'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-4 transition-colors border-l border-gray-200 ${
                  viewMode === 'list'
                    ? 'bg-wood text-white'
                    : 'bg-white text-text-secondary hover:bg-gray-50'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Панель фильтров с правильной анимацией */}
        <AnimatePresence mode="wait">
          {showFilters && (
            <motion.div
              key="filters-panel"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">Фильтры</h3>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery('');
                    }}
                    className="text-sm text-wood hover:text-wood-dark transition-colors"
                  >
                    Сбросить все
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      selectedCategory === null
                        ? 'bg-wood text-white shadow-md'
                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    Все категории
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        selectedCategory === category.id
                          ? 'bg-wood text-white shadow-md'
                          : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Активные фильтры */}
        {(selectedCategory || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-text-secondary">Активные фильтры:</span>
            {selectedCategory && selectedCategoryData && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-wood/10 text-wood rounded-lg text-sm font-medium">
                {selectedCategoryData.name}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="hover:bg-wood/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-wood/10 text-wood rounded-lg text-sm font-medium">
                Поиск: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:bg-wood/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Информация о результатах */}
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>
            Найдено товаров: <span className="font-semibold text-text-primary">{totalProducts}</span>
          </span>
          {selectedCategory && selectedCategoryData && (
            <span>
              Категория: <span className="font-semibold text-wood">{selectedCategoryData.name}</span>
            </span>
          )}
        </div>
      </motion.div>

      {/* Сетка товаров */}
      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-bg-secondary rounded-2xl"
        >
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">
              Товары не найдены
            </h3>
            <p className="text-text-secondary mb-6">
              {searchQuery || selectedCategory
                ? 'Попробуйте изменить параметры поиска или выбрать другую категорию'
                : 'В каталоге пока нет товаров'}
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="px-6 py-3 bg-wood text-white rounded-xl hover:bg-wood-dark transition-colors font-medium"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'
              : 'space-y-4'
          }
        >
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              viewMode={viewMode}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
