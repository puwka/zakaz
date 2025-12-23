'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import CartDrawer from './CartDrawer';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Каталог' },
    { href: '/services', label: 'Услуги' },
    { href: '/about', label: 'О нас' },
    { href: '/contacts', label: 'Контакты' },
  ];

  // Определяем, нужен ли светлый текст (на главной странице над Hero)
  const needsLightText = isHomePage && !isScrolled;

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: 0,
        opacity: 1,
        backdropFilter: 'blur(12px)',
        backgroundColor: isScrolled 
          ? 'rgba(255, 255, 255, 0.95)' 
          : isHomePage 
            ? 'rgba(0, 0, 0, 0.3)' // Темный полупрозрачный фон на главной
            : 'rgba(255, 255, 255, 0.95)', // Белый фон на других страницах
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 right-0 z-40 ${
        isScrolled
          ? 'border-b border-gray-200/50 shadow-sm'
          : ''
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-80"
          >
            <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0">
              <Image
                src="/logo.jpg"
                alt="ЦЕХ 'Деревянное дело'"
                fill
                className="rounded-full object-cover"
                priority
              />
            </div>
            <span className={`text-lg md:text-xl font-bold whitespace-nowrap ${
              needsLightText ? 'text-white' : 'text-wood'
            }`}>
              ЦЕХ "Деревянное дело"
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group"
                >
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      needsLightText
                        ? isActive
                          ? 'text-white'
                          : 'text-white/80 hover:text-white'
                        : isActive
                          ? 'text-wood'
                          : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                        needsLightText ? 'bg-white' : 'bg-wood'
                      }`}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  {!isActive && (
                    <span 
                      className={`absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${
                        needsLightText ? 'bg-white/60' : 'bg-wood'
                      }`} 
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-4">
            <CartDrawer needsLightText={needsLightText} />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
