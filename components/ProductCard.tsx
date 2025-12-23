'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import type { Product } from '@/types/database';

interface ProductCardProps {
  product: Product;
  index?: number;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, index = 0, viewMode = 'grid' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const hasImage = product.images && product.images.length > 0;
  const imageUrl = hasImage ? product.images[0] : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:border-wood/50 hover:shadow-lg transition-all duration-300"
      >
        <div className="flex flex-col md:flex-row">
          {/* Изображение */}
          <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 bg-bg-secondary">
            {imageUrl ? (
              <motion.div
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 200px"
                />
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-secondary">
                <span className="text-sm">Нет изображения</span>
              </div>
            )}
          </div>

          {/* Контент */}
          <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-wood transition-colors duration-300">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                  {product.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-wood whitespace-nowrap">
                {product.price.toLocaleString('ru-RU')} ₽
              </span>
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-wood text-white rounded-xl hover:bg-wood-dark transition-all duration-300 font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>В корзину</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer border-2 border-gray-100 hover:border-wood/50 hover:shadow-xl transition-all duration-300"
    >
      {/* Изображение */}
      <div className="aspect-square relative overflow-hidden bg-bg-secondary">
        {imageUrl ? (
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-secondary bg-gradient-to-br from-gray-50 to-gray-100">
            <span className="text-sm">Нет изображения</span>
          </div>
        )}
        
        {/* Overlay при наведении */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
        />
      </div>

      {/* Контент */}
      <div className="p-5 md:p-6 space-y-3">
        <h3 className="text-lg font-bold text-text-primary line-clamp-2 group-hover:text-wood transition-colors duration-300">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-text-secondary line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-2xl font-bold text-wood">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          
          {/* Кнопка корзины - появляется при ховере на десктопе */}
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`hidden md:block px-4 py-2 bg-wood text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>
          
          {/* Кнопка для мобильных - всегда видна */}
          <button
            onClick={handleAddToCart}
            className="md:hidden px-4 py-2 bg-wood text-white rounded-xl hover:bg-wood-dark transition-colors duration-300 shadow-md"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Декоративная линия снизу */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-wood origin-left"
      />
    </motion.div>
  );
}
