import { createClient } from '@/lib/supabase/server';
import type { HomepageContent } from '@/types/database';
import HomePageClient from './HomePageClient';
import Footer from '@/components/Footer';
import { getContactsData } from '@/lib/getContacts';
import {
  advantages as defaultAdvantages,
  workSteps as defaultWorkSteps,
  popularCategories as defaultPopularCategories,
  faqData as defaultFAQ,
} from '@/lib/data';

async function getHomepageContent(): Promise<HomepageContent | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('homepage_content')
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

export default async function HomePage() {
  const content = await getHomepageContent();
  const contacts = await getContactsData();

  return (
    <>
      <HomePageClient content={content} />
      <Footer {...contacts} />
    </>
  );
}
