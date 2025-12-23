'use client';

import { useEffect, useRef, useState } from 'react';

interface YandexMapProps {
  address: string;
  center?: [number, number]; // [широта, долгота] - формат Яндекс.Карт
  zoom?: number;
}

export default function YandexMap({ 
  address, 
  center = [55.7558, 37.6173], // [широта, долгота] - Москва по умолчанию
  zoom = 15 
}: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const placemarkRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const initAttemptedRef = useRef(false);

  // Загрузка API Яндекс.Карт
  useEffect(() => {
    // Сбрасываем состояние при монтировании компонента
    setIsLoaded(false);
    initAttemptedRef.current = false;

    // Проверяем, загружен ли API
    if (window.ymaps && window.ymaps.ready) {
      window.ymaps.ready(() => {
        setApiReady(true);
      });
      return;
    }

    // Если скрипт уже добавлен, ждем его загрузки
    const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
    if (existingScript) {
      const checkApi = setInterval(() => {
        if (window.ymaps && window.ymaps.ready) {
          clearInterval(checkApi);
          window.ymaps.ready(() => {
            setApiReady(true);
          });
        }
      }, 100);

      return () => {
        clearInterval(checkApi);
      };
    }

    // Загружаем скрипт
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
    script.async = true;

    script.onload = () => {
      if (window.ymaps && window.ymaps.ready) {
        window.ymaps.ready(() => {
          setApiReady(true);
        });
      }
    };

    script.onerror = () => {
      console.error('Ошибка загрузки Яндекс.Карт');
      setIsLoaded(true); // Скрываем индикатор загрузки при ошибке
    };

    document.head.appendChild(script);

    return () => {
      // Очистка при размонтировании
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
          placemarkRef.current = null;
        } catch (e) {
          // Игнорируем ошибки при уничтожении
        }
      }
      setIsLoaded(false);
      setApiReady(false);
      initAttemptedRef.current = false;
    };
  }, []);

  // Инициализация карты
  useEffect(() => {
    if (!mapRef.current || !apiReady || !window.ymaps || initAttemptedRef.current) return;

    // Небольшая задержка для гарантии, что DOM готов
    const initTimer = setTimeout(() => {
      if (!mapRef.current || !apiReady || !window.ymaps) {
        clearTimeout(initTimer);
        return;
      }

      try {
        // Уничтожаем предыдущий экземпляр, если есть
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.destroy();
          } catch (e) {
            // Игнорируем ошибки
          }
          mapInstanceRef.current = null;
          placemarkRef.current = null;
        }

        mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
          center: center,
          zoom: zoom,
          controls: ['zoomControl', 'fullscreenControl', 'typeSelector'],
        });

        // Добавляем метку
        placemarkRef.current = new window.ymaps.Placemark(
          center,
          {
            balloonContent: `<strong>ЦЕХ "Деревянное дело"</strong><br>${address}`,
            iconCaption: 'ЦЕХ "Деревянное дело"',
          },
          {
            preset: 'islands#redDotIcon',
          }
        );

        mapInstanceRef.current.geoObjects.add(placemarkRef.current);

        // Открываем балун при клике
        placemarkRef.current.events.add('click', () => {
          placemarkRef.current.balloon.open();
        });

        setIsLoaded(true);
        initAttemptedRef.current = true;
      } catch (error) {
        console.error('Ошибка инициализации карты:', error);
        setIsLoaded(true); // Скрываем индикатор загрузки при ошибке
      }
    }, 100);

    return () => {
      clearTimeout(initTimer);
    };
  }, [apiReady, center, zoom, address]);

  // Обновление карты при изменении координат или адреса (только если карта уже инициализирована)
  useEffect(() => {
    if (!mapInstanceRef.current || !placemarkRef.current || !isLoaded || !apiReady) return;

    try {
      // Обновляем центр карты
      mapInstanceRef.current.setCenter(center, zoom);
      
      // Обновляем позицию метки
      placemarkRef.current.geometry.setCoordinates(center);
      
      // Обновляем содержимое балуна
      placemarkRef.current.properties.set({
        balloonContent: `<strong>ЦЕХ "Деревянное дело"</strong><br>${address}`,
        iconCaption: 'ЦЕХ "Деревянное дело"',
      });
    } catch (error) {
      console.error('Ошибка обновления карты:', error);
    }
  }, [center, zoom, address, isLoaded, apiReady]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-2xl overflow-hidden"
        style={{ minHeight: '500px' }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary rounded-2xl">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-wood border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Загрузка карты...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Расширяем Window для TypeScript
declare global {
  interface Window {
    ymaps: any;
  }
}
