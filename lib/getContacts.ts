import { createClient } from '@/lib/supabase/server';
import { companyInfo } from '@/lib/data';
import type { ContactsContent } from '@/types/database';

export async function getContactsData() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('contacts_content')
      .select('address, phone, email, working_hours')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    return {
      address: data?.address || companyInfo.address,
      phone: data?.phone || companyInfo.phone,
      email: data?.email || companyInfo.email,
    };
  } catch (err) {
    console.error('Ошибка загрузки контактов:', err);
    return {
      address: companyInfo.address,
      phone: companyInfo.phone,
      email: companyInfo.email,
    };
  }
}





