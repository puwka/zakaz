import { createClient } from '@/lib/supabase/server';
import type { ContactsContent } from '@/types/database';
import ContactsPageClient from './ContactsPageClient';
import Footer from '@/components/Footer';
import { getContactsData } from '@/lib/getContacts';
import { companyInfo } from '@/lib/data';

async function getContactsContent(): Promise<ContactsContent | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('contacts_content')
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

// Отключаем кэширование для этой страницы, чтобы всегда получать свежие данные
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
  const content = await getContactsContent();
  const contacts = await getContactsData();

  return (
    <>
      <ContactsPageClient content={content} />
      <Footer {...contacts} />
    </>
  );
}
