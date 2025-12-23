'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ScrollProgress from '@/components/ScrollProgress';
import type { AboutContent } from '@/types/database';
import { companyInfo, companyValues } from '@/lib/data';
import {
  Heart,
  Award,
  Users,
  CheckCircle,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Award,
  Users,
  CheckCircle,
};

interface AboutPageClientProps {
  content: AboutContent | null;
}

export default function AboutPageClient({ content }: AboutPageClientProps) {
  // Используем данные из базы или дефолтные значения
  const heroTitle = content?.hero_title || 'О нас';
  const heroDescription = content?.hero_description || companyInfo.description;
  const historyTitle = content?.history_title || 'Наша история';
  const historyText = content?.history_text || companyInfo.history;
  const historyImageUrl = content?.history_image_url || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  const historyYear = content?.history_year || '2015';
  const teamTitle = content?.team_title || 'Наша команда';
  const teamSubtitle = content?.team_subtitle || 'Профессионалы, которые любят свое дело и создают мебель с душой';
  const teamMembers = (content?.team_members as any) || [
    {
      name: 'Иван Петров',
      role: 'Главный мастер',
      experience: 'Опыт работы 15+ лет',
      specialization: 'корпусной мебели',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Алексей Смирнов',
      role: 'Мастер-столяр',
      experience: 'Опыт работы 12+ лет',
      specialization: 'столов и стульев',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Дмитрий Козлов',
      role: 'Мастер-резчик',
      experience: 'Опыт работы 10+ лет',
      specialization: 'декоративных элементов',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
  ];
  const valuesTitle = content?.values_title || 'Наши ценности';
  const valuesSubtitle = content?.values_subtitle || 'Принципы, которыми мы руководствуемся в работе';
  const valuesItems = (content?.values_items as any) || companyValues.map(v => ({
    icon: 'Heart',
    title: v.title,
    description: v.description,
  }));

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
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-text-primary mb-4">
              {heroTitle}
            </h1>
            <p className="text-center text-text-secondary max-w-3xl mx-auto text-lg leading-relaxed">
              {heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* История */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
                {historyTitle}
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed text-lg">
                {historyText.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={historyImageUrl}
                alt="Мастерская столярного цеха"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <div className="text-6xl font-bold mb-2">{historyYear}</div>
                  <p className="text-xl">Год основания мастерской</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Команда */}
      <section className="py-16 md:py-24 bg-bg-secondary">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              {teamTitle}
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {teamSubtitle}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={member.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-primary mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-wood mb-2">{member.role}</p>
                  {member.experience && (
                    <p className="text-sm text-text-secondary mb-3">
                      {member.experience}
                    </p>
                  )}
                  {member.specialization && (
                    <p className="text-sm text-text-secondary">
                      Специализируется на изготовлении {member.specialization}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ценности */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              {valuesTitle}
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {valuesSubtitle}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valuesItems.map((value: any, index: number) => {
              const Icon = iconMap[value.icon] || Heart;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="text-center p-6 rounded-lg bg-bg-secondary hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-16 h-16 bg-wood/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-wood" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {value.description}
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

