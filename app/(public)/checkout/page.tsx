import CheckoutForm from '@/components/CheckoutForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import { getContactsData } from '@/lib/getContacts';

export default async function CheckoutPage() {
  const contacts = await getContactsData();

  return (
    <div className="min-h-screen bg-bg-primary">
      <ScrollProgress />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-3">
                Оформление заказа
              </h1>
              <p className="text-lg text-text-secondary">
                Заполните форму ниже, и мы свяжемся с вами для подтверждения заказа
              </p>
            </div>
            <CheckoutForm />
          </div>
        </div>
      </main>
      <Footer {...contacts} />
    </div>
  );
}
