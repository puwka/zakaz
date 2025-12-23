'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import CartDrawer from './CartDrawer';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Закрываем мобильное меню при изменении маршрута
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Блокируем скролл при открытом мобильном меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            className="flex items-center gap-2 md:gap-3 transition-opacity duration-300 hover:opacity-80 z-50"
          >
            <div className="relative w-10 h-10 md:w-14 md:h-14 flex-shrink-0">
              <Image
                src="/logo.jpg"
                alt="ЦЕХ 'Деревянное дело'"
                fill
                className="rounded-full object-cover"
                priority
              />
            </div>
            <span className={`text-base md:text-xl font-bold whitespace-nowrap ${
              needsLightText ? 'text-white' : 'text-wood'
            }`}>
              <span className="hidden sm:inline">ЦЕХ "Деревянное дело"</span>
              <span className="sm:hidden">ЦЕХ</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
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
          
          <div className="flex items-center gap-2 md:gap-4">
            <CartDrawer needsLightText={needsLightText} />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors z-50 ${
                needsLightText ? 'text-white hover:bg-white/10' : 'text-text-primary hover:bg-gray-100'
              }`}
              aria-label="Меню"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6 pt-20">
                <ul className="space-y-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                            isActive
                              ? 'bg-wood text-white'
                              : 'text-text-primary hover:bg-gray-100'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
