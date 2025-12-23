'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import Link from 'next/link';

interface CartDrawerProps {
  needsLightText?: boolean;
}

export default function CartDrawer({ needsLightText = false }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const totalItems = mounted ? getTotalItems() : 0;
  const totalPrice = mounted ? getTotalPrice() : 0;

  return (
    <>
      {/* Кнопка открытия корзины */}
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            needsLightText
              ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
              : 'bg-wood text-white hover:bg-wood-dark'
          }`}
        >
          <motion.div
            animate={totalItems > 0 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <ShoppingBag className="w-5 h-5" />
          </motion.div>
          <span className="hidden sm:inline">Корзина</span>
        </motion.button>
        {/* Бейдж с количеством */}
        {mounted && totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-lg"
          >
            {totalItems > 99 ? '99+' : totalItems}
          </motion.span>
        )}
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[420px] lg:w-[480px] bg-white shadow-2xl z-[101] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
              <h2 className="text-2xl font-bold text-text-primary">
                Корзина
              </h2>
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Закрыть корзину"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </motion.button>
            </div>

            {/* Items - Scrollable Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full px-6 py-12 text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-xl font-semibold text-text-primary mb-2">
                    Корзина пуста
                  </p>
                  <p className="text-sm text-text-secondary mb-6 max-w-xs">
                    Добавьте товары из каталога, чтобы оформить заказ
                  </p>
                  <Link
                    href="/catalog"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                  >
                    Перейти в каталог
                  </Link>
                </motion.div>
              ) : (
                <div className="p-6 space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => {
                      const hasImage =
                        item.product.images && item.product.images.length > 0;
                      const imageUrl = hasImage ? item.product.images[0] : null;
                      const itemTotal = item.product.price * item.quantity;

                      return (
                        <motion.div
                          key={item.product.id}
                          layout
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -20, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="group relative flex gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-md transition-all duration-300"
                        >
                          {/* Изображение товара */}
                          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={item.product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="96px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs bg-gradient-to-br from-gray-50 to-gray-100">
                                <ShoppingBag className="w-8 h-8 opacity-30" />
                              </div>
                            )}
                          </div>

                          {/* Информация о товаре */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h3 className="font-semibold text-text-primary mb-1 line-clamp-2 leading-snug">
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-text-secondary mb-2">
                                {item.product.price.toLocaleString('ru-RU')} ₽ / шт.
                              </p>
                            </div>

                            {/* Управление количеством */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                <motion.button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1.5 hover:bg-white rounded-md transition-colors text-text-secondary hover:text-text-primary"
                                  aria-label="Уменьшить количество"
                                >
                                  <Minus className="w-4 h-4" />
                                </motion.button>
                                <span className="w-10 text-center font-semibold text-text-primary text-sm">
                                  {item.quantity}
                                </span>
                                <motion.button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1.5 hover:bg-white rounded-md transition-colors text-text-secondary hover:text-text-primary"
                                  aria-label="Увеличить количество"
                                >
                                  <Plus className="w-4 h-4" />
                                </motion.button>
                              </div>

                              {/* Цена за позицию */}
                              <div className="text-right">
                                <p className="text-sm text-text-secondary mb-0.5">
                                  Сумма
                                </p>
                                <p className="text-base font-bold text-wood">
                                  {itemTotal.toLocaleString('ru-RU')} ₽
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Кнопка удаления */}
                          <motion.button
                            onClick={() => removeItem(item.product.id)}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-2 right-2 p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Удалить товар"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer с итогом */}
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-gray-200 bg-white p-6 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
              >
                <div className="flex items-center justify-between pb-2">
                  <span className="text-lg font-semibold text-text-primary">
                    Итого:
                  </span>
                  <span className="text-2xl font-bold text-wood">
                    {totalPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-6 py-4 bg-wood text-white rounded-xl hover:bg-wood-dark transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Оформить заказ
                </Link>
                <p className="text-xs text-center text-text-secondary">
                  Доставка рассчитывается при оформлении
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
