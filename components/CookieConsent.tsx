'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Проверяем, было ли уже дано согласие
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Показываем баннер с небольшой задержкой для лучшего UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              {/* Иконка */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-wood/10 rounded-full flex items-center justify-center">
                  <Cookie className="w-6 h-6 md:w-7 md:h-7 text-wood" />
                </div>
              </div>

              {/* Текст */}
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-text-primary mb-2">
                  Мы используем cookies
                </h3>
                <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                  Этот сайт использует cookies для улучшения работы и персонализации контента. 
                  Продолжая использовать сайт, вы соглашаетесь с использованием cookies.
                </p>
              </div>

              {/* Кнопки */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={handleAccept}
                  className="px-6 py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors font-medium text-sm md:text-base whitespace-nowrap"
                >
                  Принять
                </button>
                <button
                  onClick={handleDecline}
                  className="px-6 py-3 bg-gray-100 text-text-primary rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm md:text-base whitespace-nowrap"
                >
                  Отклонить
                </button>
              </div>

              {/* Кнопка закрытия */}
              <button
                onClick={handleDecline}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

