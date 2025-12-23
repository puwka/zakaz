import { Suspense } from 'react';
import Footer from './Footer';
import { getContactsData } from '@/lib/getContacts';

async function FooterWithData() {
  const contacts = await getContactsData();
  return <Footer {...contacts} />;
}

export default function FooterWrapper() {
  return (
    <Suspense fallback={
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-gray-400">Загрузка...</div>
        </div>
      </footer>
    }>
      <FooterWithData />
    </Suspense>
  );
}

