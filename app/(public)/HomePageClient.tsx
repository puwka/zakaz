'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Phone, Table } from 'lucide-react';
import Header from '@/components/Header';
import ScrollProgress from '@/components/ScrollProgress';

import Accordion from '@/components/Accordion';
import type { HomepageContent } from '@/types/database';
import {
  advantages as defaultAdvantages,
  workSteps as defaultWorkSteps,
  popularCategories as defaultPopularCategories,
  faqData as defaultFAQ,
} from '@/lib/data';

// Импорт иконок
import {
  TreePine,
  Shield,
  Ruler,
  Leaf,
  FileText as FileTextIcon,
  Wrench,
  Truck,
  CheckCircle,
  Heart,
  Award,
  Users,
  Table as TableIcon,
  Sofa,
  Palette,
  BookOpen,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TreePine,
  Shield,
  Ruler,
  Leaf,
  FileText: FileTextIcon,
  Wrench,
  Truck,
  CheckCircle,
  Heart,
  Award,
  Users,
  Table: TableIcon,
  Sofa,
  Palette,
  BookOpen,
};

// Анимации для контейнеров
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

interface HomePageClientProps {
  content: HomepageContent | null;
}

export default function HomePageClient({ content }: HomePageClientProps) {
  // Используем данные из базы или дефолтные значения
  const heroTitle = content?.hero_title || 'Мебель, которая хранит\nтепло рук';
  const heroSubtitle = content?.hero_subtitle || 'Премиальная столярная мастерская. Создаем мебель из натурального дерева, которая становится частью вашего дома на десятилетия';
  const heroBackgroundImage = content?.hero_background_image_url || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920';
  const heroButton1Text = content?.hero_button1_text || 'Перейти в каталог';
  const heroButton1Link = content?.hero_button1_link || '/catalog';
  const heroButton2Text = content?.hero_button2_text || 'Заказать проект';
  const heroButton2Link = content?.hero_button2_link || '/contacts';

  const advantagesTitle = content?.advantages_title || 'Почему мы';
  const advantagesSubtitle = content?.advantages_subtitle || 'Мы не просто изготавливаем мебель — мы создаем произведения, которые передаются из поколения в поколение';
  const advantages = (content?.advantages as any) || defaultAdvantages.map(a => ({
    icon: 'TreePine',
    title: a.title,
    description: a.description,
  }));

  const workStepsTitle = content?.work_steps_title || 'Как мы работаем';
  const workStepsSubtitle = content?.work_steps_subtitle || 'Простой и понятный процесс от заявки до установки готового изделия';
  const workSteps = (content?.work_steps as any) || defaultWorkSteps;

  const popularCategoriesTitle = content?.popular_categories_title || 'Популярные категории';
  const popularCategoriesSubtitle = content?.popular_categories_subtitle || 'Выберите категорию или закажите индивидуальный проект';
  const popularCategories = (content?.popular_categories as any) || defaultPopularCategories;

  const faqTitle = content?.faq_title || 'Часто задаваемые вопросы';
  const faqSubtitle = content?.faq_subtitle || 'Ответы на самые популярные вопросы наших клиентов';
  const faqItems = (content?.faq_items as any) || defaultFAQ;

  const ctaTitle = content?.cta_title || 'Готовы обсудить ваш проект?';
  const ctaSubtitle = content?.cta_subtitle || 'Оставьте заявку на консультацию, и мы свяжемся с вами в течение часа';
  const ctaButton1Text = content?.cta_button1_text || 'Оставить заявку';
  const ctaButton1Link = content?.cta_button1_link || '/contacts';
  const ctaButton2Text = content?.cta_button2_text || 'Позвонить нам';
  const ctaButton2Link = content?.cta_button2_link || 'tel:+74951234567';

  return (
    <div className="min-h-screen bg-bg-primary">
      <ScrollProgress />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Фоновое изображение с эффектом параллакса */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: heroBackgroundImage ? `url(${heroBackgroundImage})` : undefined,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wood-dark/90 via-wood-dark/80 to-wood-dark/70 z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 container mx-auto px-4 md:px-6 lg:px-8 text-center text-white"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight px-4"
          >
            {heroTitle.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < heroTitle.split('\n').length - 1 && <br />}
              </span>
            ))}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
          >
            {heroSubtitle}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={heroButton1Link}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-wood text-white rounded-lg hover:bg-wood-dark transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                {heroButton1Text}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={heroButton2Link}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg hover:bg-white/20 transition-all duration-300 text-lg font-medium"
              >
                <Phone className="w-5 h-5" />
                {heroButton2Text}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Почему мы */}
      <section className="py-24 md:py-32 bg-bg-primary">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
              {advantagesTitle}
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {advantagesSubtitle}
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {advantages.map((advantage: any, index: number) => {
              const Icon = iconMap[advantage.icon] || TreePine;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="text-center p-8 rounded-lg bg-bg-secondary hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="w-20 h-20 bg-wood/10 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Icon className="w-10 h-10 text-wood" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    {advantage.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {advantage.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Как мы работаем */}
      <section className="py-24 md:py-32 bg-bg-secondary">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
              {workStepsTitle}
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {workStepsSubtitle}
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {workSteps.map((step: any, index: number) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="relative bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-6xl font-bold font-bold text-wood/20 mb-6">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {step.description}
                </p>
                {index < workSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-wood/20 transform -translate-y-1/2">
                    <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full w-4 h-4 text-wood/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Популярные категории */}
      <section className="py-24 md:py-32 bg-bg-primary">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
              {popularCategoriesTitle}
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {popularCategoriesSubtitle}
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {popularCategories.map((category: any, index: number) => {
              const Icon = category.icon ? iconMap[category.icon] : Table;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={`/catalog?category=${category.slug}`}
                    className="group relative block h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
                  >
                    {/* Верхняя часть с изображением */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-wood/10 via-wood/5 to-bg-secondary">
                      {category.imageUrl ? (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0"
                        >
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        </motion.div>
                      ) : (
                        <div className="absolute inset-0">
                          <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-wood rounded-full -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-wood-dark rounded-full -ml-12 -mb-12" />
                          </div>
                        </div>
                      )}
                      
                      {category.count && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-wood z-10 shadow-sm">
                          {category.count} товаров
                        </div>
                      )}
                    </div>

                    {/* Контент */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-wood transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {category.description}
                        </p>
                      </div>

                      {category.priceRange && (
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-lg font-bold text-wood">
                            {category.priceRange}
                          </p>
                        </div>
                      )}

                      {category.features && category.features.length > 0 && (
                        <ul className="space-y-2 pt-2">
                          {category.features.slice(0, 2).map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-text-secondary">
                              <div className="w-1.5 h-1.5 rounded-full bg-wood" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="pt-4"
                      >
                        <div className="flex items-center gap-2 text-wood font-medium text-sm group-hover:gap-3 transition-all">
                          <span>Смотреть товары</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-0 left-0 right-0 h-1 bg-wood origin-left"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 bg-bg-secondary">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
              {faqTitle}
            </h2>
            <p className="text-lg text-text-secondary">
              {faqSubtitle}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 md:p-8"
          >
            <Accordion items={faqItems.map((item: any) => ({
              question: item.question,
              answer: item.answer,
            }))} />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-wood text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-bold mb-6">
              {ctaTitle}
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              {ctaSubtitle}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={ctaButton1Link}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-wood rounded-lg hover:bg-white/90 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-5 h-5" />
                  {ctaButton1Text}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href={ctaButton2Link}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-wood-dark text-white rounded-lg hover:bg-wood-dark/90 transition-all duration-300 text-lg font-medium"
                >
                  <Phone className="w-5 h-5" />
                  {ctaButton2Text}
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

