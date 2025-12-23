'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Package, ShoppingCart, LogOut, Home, Wrench, Users, Phone, FolderTree, Lock, UserPlus } from 'lucide-react';
import ProductsTab from './ProductsTab';
import OrdersTab from './OrdersTab';
import HomepageTab from './HomepageTab';
import ServicesTab from './ServicesTab';
import AboutTab from './AboutTab';
import ContactsTab from './ContactsTab';
import CategoriesTab from './CategoriesTab';
import ChangePasswordTab from './ChangePasswordTab';
import AdminsTab from './AdminsTab';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'homepage' | 'services' | 'about' | 'contacts' | 'products' | 'orders' | 'categories' | 'password' | 'admins'>('homepage');

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-wood">Админ-панель</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('homepage')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'homepage'
                  ? 'border-wood text-wood'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Главная</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'services'
                  ? 'border-wood text-wood'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Wrench className="w-5 h-5" />
              <span>Услуги</span>
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'about'
                  ? 'border-wood text-wood'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>О нас</span>
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'contacts'
                  ? 'border-wood text-wood'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Phone className="w-5 h-5" />
              <span>Контакты</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'categories'
                  ? 'border-wood text-wood'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <FolderTree className="w-5 h-5" />
              <span>Категории</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-wood text-wood'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Товары</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-wood text-wood'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Заказы</span>
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'password'
                  ? 'border-wood text-wood'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Lock className="w-5 h-5" />
              <span>Пароль</span>
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'admins'
                  ? 'border-wood text-wood'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <UserPlus className="w-5 h-5" />
              <span>Администраторы</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'homepage' && <HomepageTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'about' && <AboutTab />}
        {activeTab === 'contacts' && <ContactsTab />}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'password' && <ChangePasswordTab />}
        {activeTab === 'admins' && <AdminsTab />}
      </main>
    </div>
  );
}


