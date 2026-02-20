import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

import Preloader from "@/components/Preloader/Preloader";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import MobileBottomNav from "@/components/MobileBottomNav/MobileBottomNav";

export const metadata: Metadata = {
  title: "HireZone - O'zbekistondagi eng yirik ish e'lonlari portali",
  description: "Ish qidirish va xodimlarni yollash uchun eng qulay platforma. Professional rezyume yaratish, vakansiyalar va HR yechimlar bir joyda.",
  keywords: ["ish qidirish", "vakansiyalar", "rezyume yaratish", "rekruting", "Toshkent ish", "ish bor", "rezyume builder", "hirezone"],
  authors: [{ name: "HireZone Team" }],
  openGraph: {
    title: "HireZone - Professional Ish va Karyera Platformasi",
    description: "Orzuingizdagi ishni toping yoki eng yaxshi mutaxassislarni yollang.",
    url: "https://hirezone.uz",
    siteName: "HireZone",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 600,
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireZone - Job Board & Hiring Platform",
    description: "Professional rezyume yaratish va ish topish platformasi.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <Preloader />
          {children}
          <ScrollToTop />
          <MobileBottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
