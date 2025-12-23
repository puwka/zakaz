'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { OrderWithItems } from '@/types/database';

export default function OrdersTab() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          order_items (
            *,
            products (*)
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Ошибка загрузки заказов:', error);
        setError(error.message || 'Не удалось загрузить заказы');
      } else {
        setOrders((data as OrderWithItems[]) || []);
      }
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
      setError('Произошла ошибка при загрузке заказов');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: 'new' | 'processed') => {
    const supabase = createClient();
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('Ошибка при обновлении статуса');
    } else {
      loadOrders();
    }
  };

  if (loading) {
    return <div className="text-center py-12">Загрузка заказов...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadOrders}
          className="px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Заказы</h2>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Заказы не найдены</div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Заказ #{order.id.slice(0, 8)}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        order.status === 'new'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {order.status === 'new' ? 'Новый' : 'Обработан'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Дата: {new Date(order.created_at).toLocaleString('ru-RU')}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Клиент:</strong> {order.customer_name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Телефон:</strong> {order.customer_phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-wood">
                    {order.total_price.toLocaleString('ru-RU')} ₽
                  </p>
                  {order.status === 'new' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'processed')}
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Отметить обработанным
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-2">Состав заказа:</h4>
                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>
                        {item.products?.name || 'Товар удален'} × {item.quantity}
                      </span>
                      <span>
                        {item.price_at_purchase.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


