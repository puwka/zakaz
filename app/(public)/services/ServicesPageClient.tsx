'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Header from '@/components/Header';
import ScrollProgress from '@/components/ScrollProgress';
import type { ServicesContent } from '@/types/database';
import { services as defaultServices } from '@/lib/data';

interface ServicesPageClientProps {
  content: ServicesContent | null;
}

export default function ServicesPageClient({ content }: ServicesPageClientProps) {
  // Используем данные из базы или дефолтные значения
  const heroTitle = content?.hero_title || 'Наши услуги';
  const heroSubtitle = content?.hero_subtitle || 'Полный спектр столярных услуг: от индивидуальных проектов до комплексной меблировки помещений';
  const services = (content?.services as any) || defaultServices;
  const ctaTitle = content?.cta_title || 'Не нашли нужную услугу?';
  const ctaSubtitle = content?.cta_subtitle || 'Свяжитесь с нами, и мы обсудим ваш проект индивидуально';
  const ctaButtonText = content?.cta_button_text || 'Связаться с нами';
  const ctaButtonLink = content?.cta_button_link || '/contacts';

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
            transition={{ duration: 0.6 }}
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

      {/* Услуги */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="aspect-square rounded-2xl overflow-hidden shadow-xl relative"
                  >
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-wood/20 to-wood-dark/30 flex items-center justify-center">
                        <div className="text-center text-wood p-8">
                          <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </motion.div>
                </div>
                <div
                  className={`order-1 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-text-secondary leading-relaxed mb-6">
                    {service.description}
                  </p>
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature: string, featureIndex: number) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-3 text-text-secondary"
                        >
                          <Check className="w-6 h-6 text-wood flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/contacts"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                    >
                      Обсудить проект
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-bg-secondary">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              {ctaTitle}
            </h2>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              {ctaSubtitle}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={ctaButtonLink}
                className="inline-flex items-center gap-2 px-8 py-4 bg-wood text-white rounded-lg hover:bg-wood-dark transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                {ctaButtonText}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

