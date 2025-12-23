import FooterContent from './FooterContent';
import { companyInfo } from '@/lib/data';

interface FooterProps {
  address?: string;
  phone?: string;
  email?: string;
}

export default function Footer({ 
  address = companyInfo.address,
  phone = companyInfo.phone,
  email = companyInfo.email
}: FooterProps) {
  return <FooterContent address={address} phone={phone} email={email} />;
}
