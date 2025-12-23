import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "ЦЕХ 'Деревянное дело' - Премиальная мебель из дерева",
  description: "Премиальная столярная мастерская. Мебель из натурального дерева ручной работы",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className="antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}

