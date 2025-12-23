import { createClient } from '@/lib/supabase/server';
import type { AboutContent } from '@/types/database';
import AboutPageClient from './AboutPageClient';
import Footer from '@/components/Footer';
import { getContactsData } from '@/lib/getContacts';
import { companyInfo, companyValues } from '@/lib/data';

async function getAboutContent(): Promise<AboutContent | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('about_content')
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

export default async function AboutPage() {
  const content = await getAboutContent();
  const contacts = await getContactsData();

  return (
    <>
      <AboutPageClient content={content} />
      <Footer {...contacts} />
    </>
  );
}
