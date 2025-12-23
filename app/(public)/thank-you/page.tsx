import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Спасибо за заказ!
        </h1>
        <p className="text-gray-600 mb-6">
          Ваш заказ успешно оформлен. Мы свяжемся с вами в ближайшее время для
          подтверждения.
        </p>
        {searchParams.orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Номер заказа: <span className="font-mono">{searchParams.orderId}</span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors font-medium text-center"
          >
            На главную
          </Link>
          <Link
            href="/catalog"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center"
          >
            Вернуться в каталог
          </Link>
        </div>
      </div>
    </div>
  );
}



