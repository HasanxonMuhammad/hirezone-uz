import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Vakansiyalar va Bo'sh ish o'rinlari - HireZone",
    description: "Toshkent va O'zbekiston bo'ylab eng yangi vakansiyalar. IT, Marketing, Moliya va boshqa sohalarda ish toping.",
    openGraph: {
        title: "HireZone Vakansiyalar Markazi",
        description: "Siz uchun eng mos keladigan ishni saralash orqali toping.",
    }
};

export default function JobsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
