import CatalogContent from './CatalogContent';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import { getContactsData } from '@/lib/getContacts';
import { getCatalogData } from '@/lib/getCatalogData';

export default async function CatalogPage() {
  const [contacts, catalogData] = await Promise.all([
    getContactsData(),
    getCatalogData(),
  ]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <ScrollProgress />
      <Header />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <CatalogContent 
          initialCategories={catalogData.categories}
          initialProducts={catalogData.products}
        />
      </main>
      <Footer {...contacts} />
    </div>
  );
}

