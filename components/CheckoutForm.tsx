'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  User, 
  Phone, 
  ShoppingBag, 
  Shield, 
  Truck, 
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

const checkoutSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное'),
  customer_phone: z
    .string()
    .regex(phoneRegex, 'Введите корректный номер телефона'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const clearCart = useCartStore((state) => state.clearCart);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.startsWith('8')) {
      return numbers.replace(/^8/, '+7');
    }
    if (!numbers.startsWith('7') && !numbers.startsWith('8')) {
      return '+7' + numbers;
    }
    return '+' + numbers;
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      setError('Корзина пуста');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const totalPrice = getTotalPrice();

      // Создаем заказ
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: data.customer_name,
          customer_phone: formatPhoneNumber(data.customer_phone),
          total_price: totalPrice,
          status: 'new',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Создаем позиции заказа
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_purchase: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Очищаем корзину
      clearCart();

      // Редирект на страницу благодарности
      router.push(`/thank-you?orderId=${order.id}`);
    } catch (err) {
      console.error('Ошибка при создании заказа:', err);
      setError('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  // Если корзина пуста, показываем сообщение
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-12 text-center"
      >
        <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          Корзина пуста
        </h2>
        <p className="text-text-secondary mb-8">
          Добавьте товары в корзину, чтобы оформить заказ
        </p>
        <Link
          href="/catalog"
          className="inline-block px-8 py-3 bg-wood text-white rounded-xl hover:bg-wood-dark transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
        >
          Перейти в каталог
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Левая колонка - Форма */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-2"
      >
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Заголовок формы */}
          <div className="bg-gradient-to-r from-wood to-wood-dark p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <User className="w-6 h-6" />
              Контактные данные
            </h2>
            <p className="text-white/90 mt-2 text-sm">
              Мы свяжемся с вами для подтверждения заказа
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            {/* Поле ФИО */}
            <div>
              <label
                htmlFor="customer_name"
                className="block text-sm font-semibold text-text-primary mb-2 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-wood" />
                ФИО *
              </label>
              <input
                id="customer_name"
                type="text"
                {...register('customer_name')}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                  errors.customer_name
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-wood focus:ring-4 focus:ring-wood/10'
                }`}
                placeholder="Иванов Иван Иванович"
              />
              {errors.customer_name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.customer_name.message}
                </motion.p>
              )}
            </div>

            {/* Поле Телефон */}
            <div>
              <label
                htmlFor="customer_phone"
                className="block text-sm font-semibold text-text-primary mb-2 flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-wood" />
                Телефон *
              </label>
              <input
                id="customer_phone"
                type="tel"
                {...register('customer_phone')}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                  errors.customer_phone
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-wood focus:ring-4 focus:ring-wood/10'
                }`}
                placeholder="+7 (999) 123-45-67"
              />
              {errors.customer_phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.customer_phone.message}
                </motion.p>
              )}
            </div>

            {/* Сообщение об ошибке */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {/* Кнопка отправки */}
            <motion.button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              whileHover={{ scale: isSubmitting || items.length === 0 ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting || items.length === 0 ? 1 : 0.98 }}
              className="w-full px-6 py-4 bg-wood text-white rounded-xl hover:bg-wood-dark transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Оформление заказа...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Оформить заказ
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Правая колонка - Информация о заказе */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Сводка заказа */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-wood to-wood-dark p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              Ваш заказ
            </h2>
            <p className="text-white/90 mt-2 text-sm">
              {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}
            </p>
          </div>

          <div className="p-6">
            {/* Список товаров */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {items.map((item, index) => {
                const hasImage =
                  item.product.images && item.product.images.length > 0;
                const imageUrl = hasImage ? item.product.images[0] : null;
                const itemTotal = item.product.price * item.quantity;

                return (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 p-3 bg-bg-secondary rounded-xl"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">
                          <ShoppingBag className="w-6 h-6 opacity-30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary text-sm mb-1 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">
                          {item.quantity} × {item.product.price.toLocaleString('ru-RU')} ₽
                        </span>
                        <span className="font-bold text-wood text-sm">
                          {itemTotal.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Итого */}
            <div className="border-t-2 border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-text-primary">
                  Итого:
                </span>
                <span className="text-3xl font-bold text-wood">
                  {totalPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <p className="text-xs text-text-secondary text-center">
                Доставка рассчитывается отдельно
              </p>
            </div>
          </div>
        </div>

        {/* Преимущества */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-text-primary mb-4">
            Преимущества заказа
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-wood/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-wood" />
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm mb-1">
                  Гарантия качества
                </p>
                <p className="text-xs text-text-secondary">
                  5 лет гарантии на всю продукцию
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-wood/10 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-wood" />
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm mb-1">
                  Доставка и монтаж
                </p>
                <p className="text-xs text-text-secondary">
                  Бесплатная доставка по Москве от 50 000 ₽
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-wood/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-wood" />
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm mb-1">
                  Безопасная оплата
                </p>
                <p className="text-xs text-text-secondary">
                  Оплата при получении или онлайн
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
