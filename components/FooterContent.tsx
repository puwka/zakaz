import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';
import { companyInfo } from '@/lib/data';

interface FooterContentProps {
  address: string;
  phone: string;
  email: string;
}

export default function FooterContent({ address, phone, email }: FooterContentProps) {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="ЦЕХ 'Деревянное дело'"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-wood-400">
                ЦЕХ "Деревянное дело"
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              Премиальная мебель из натурального дерева ручной работы
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/catalog" className="hover:text-wood-400 transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-wood-400 transition-colors">
                  Услуги
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-wood-400 transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-wood-400 transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-wood-400" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-wood-400" />
                <a href={`tel:${phone}`} className="hover:text-wood-400 transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-wood-400" />
                <a href={`mailto:${email}`} className="hover:text-wood-400 transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 ЦЕХ "Деревянное дело". Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

