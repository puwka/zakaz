'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import ScrollProgress from '@/components/ScrollProgress';

import YandexMap from '@/components/YandexMap';
import type { ContactsContent } from '@/types/database';
import { companyInfo } from '@/lib/data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Clock,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
};

interface ContactsPageClientProps {
  content: ContactsContent | null;
}

export default function ContactsPageClient({ content }: ContactsPageClientProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Используем данные из базы или дефолтные значения
  const heroTitle = content?.hero_title || 'Контакты';
  const heroSubtitle = content?.hero_subtitle || 'Свяжитесь с нами любым удобным способом. Мы всегда рады ответить на ваши вопросы и обсудить ваш проект';
  const address = content?.address || companyInfo.address;
  const phone = content?.phone || companyInfo.phone;
  const email = content?.email || companyInfo.email;
  const workingHours = content?.working_hours || companyInfo.workingHours;
  const mapAddress = content?.map_address || companyInfo.address;
  // Преобразуем координаты в числа, если они пришли как строки
  const mapLatitude = typeof content?.map_latitude === 'number' 
    ? content.map_latitude 
    : (content?.map_latitude ? parseFloat(String(content.map_latitude)) : 55.7558);
  const mapLongitude = typeof content?.map_longitude === 'number'
    ? content.map_longitude
    : (content?.map_longitude ? parseFloat(String(content.map_longitude)) : 37.6173);
  const mapZoom = typeof content?.map_zoom === 'number'
    ? content.map_zoom
    : (content?.map_zoom ? parseInt(String(content.map_zoom)) : 15);
  const advantages = (content?.advantages as any) || [
    { icon: 'Clock', title: 'Быстрый ответ', description: 'Отвечаем на звонки и сообщения в течение часа в рабочее время' },
    { icon: 'MessageCircle', title: 'Консультация', description: 'Бесплатная консультация по телефону или в мастерской' },
    { icon: 'MapPin', title: 'Выезд мастера', description: 'Бесплатный выезд мастера для замера в пределах города' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    // Валидация
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'Пожалуйста, заполните все поля',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Показываем детальное сообщение об ошибке
        const errorMessage = data.error || data.details || 'Ошибка при отправке сообщения';
        throw new Error(errorMessage);
      }

      // Успешная отправка
      setSubmitStatus({
        type: 'success',
        message: 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.',
      });
      setFormData({ name: '', phone: '', message: '' });

      // Скрываем сообщение через 5 секунд
      setTimeout(() => {
        setSubmitStatus({ type: null, message: '' });
      }, 5000);
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error 
          ? error.message 
          : 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactItems = [
    {
      icon: MapPin,
      title: 'Адрес',
      content: address,
      link: null,
    },
    {
      icon: Phone,
      title: 'Телефон',
      content: phone,
      link: `tel:${phone}`,
    },
    {
      icon: Mail,
      title: 'Email',
      content: email,
      link: `mailto:${email}`,
    },
    {
      icon: Clock,
      title: 'Режим работы',
      content: workingHours,
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <ScrollProgress />
      <Header />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-wood/5 to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
              {heroTitle}
            </h1>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
              {heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Контакты и форма */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Контактная информация */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">
                Наши контакты
              </h2>
              <div className="space-y-6 mb-8">
                {contactItems.map((item, index) => {
                  const Icon = item.icon;
                  const content = item.link ? (
                    <a
                      href={item.link}
                      className="text-wood hover:text-wood-dark transition-colors duration-200"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <span className="text-text-secondary">{item.content}</span>
                  );

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-bg-secondary transition-colors duration-200 group"
                    >
                      <div className="w-14 h-14 bg-wood/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-wood/20 transition-colors duration-200">
                        <Icon className="w-7 h-7 text-wood" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1 text-lg">
                          {item.title}
                        </h3>
                        <div className="text-base">{content}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Форма обратной связи */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <div className="bg-bg-secondary rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                  Напишите нам
                </h2>
                <p className="text-text-secondary mb-8">
                  Заполните форму, и мы свяжемся с вами в течение часа
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent transition-all duration-200"
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent transition-all duration-200"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Сообщение *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Расскажите о вашем проекте, размерах, стиле..."
                    />
                  </div>

                  {/* Уведомления об успехе/ошибке */}
                  {submitStatus.type && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-lg ${
                        submitStatus.type === 'success'
                          ? 'bg-green-50 border border-green-200 text-green-800'
                          : 'bg-red-50 border border-red-200 text-red-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {submitStatus.type === 'success' ? (
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm font-medium">{submitStatus.message}</p>
                      </div>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-wood text-white rounded-lg hover:bg-wood-dark transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Отправка...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Отправить сообщение</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Карта */}
      <section className="py-16 md:py-24 bg-bg-secondary">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 text-center">
              Как нас найти
            </h2>
            <p className="text-center text-text-secondary mb-8 max-w-2xl mx-auto">
              Мы находимся в центре города, к нам легко добраться на любом транспорте
            </p>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
              <div className="relative" style={{ height: '500px' }}>
                <YandexMap 
                  key={`${mapLatitude}-${mapLongitude}-${mapZoom}`}
                  address={mapAddress}
                  center={[mapLatitude, mapLongitude]} // [широта, долгота] - правильный формат для Yandex Maps
                  zoom={mapZoom}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Дополнительная информация */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {advantages.map((advantage: any, index: number) => {
              const Icon = iconMap[advantage.icon] || Clock;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
                  className="text-center p-6 rounded-lg bg-bg-secondary"
                >
                  <Icon className="w-12 h-12 text-wood mx-auto mb-4" />
                  <h3 className="font-bold text-text-primary mb-2">{advantage.title}</h3>
                  <p className="text-text-secondary text-sm">
                    {advantage.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
