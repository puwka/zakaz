import { createClient } from '@/lib/supabase/server';
import type { ServicesContent } from '@/types/database';
import ServicesPageClient from './ServicesPageClient';
import Footer from '@/components/Footer';
import { getContactsData } from '@/lib/getContacts';
import { services as defaultServices } from '@/lib/data';

async function getServicesContent(): Promise<ServicesContent | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('services_content')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    return data;
  } catch (err) {
    console.error('Ошибка загрузки контента:', err);
    return null;
  }
}

export default async function ServicesPage() {
  const content = await getServicesContent();
  const contacts = await getContactsData();

  return (
    <>
      <ServicesPageClient content={content} />
      <Footer {...contacts} />
    </>
  );
}
