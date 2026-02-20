import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Professional CV yaratish (Onlayn) - HireZone Rezyume Builder",
    description: "Bepul va professional rezyume (CV) yarating. Tayyor shablonlardan foydalaning va PDF shaklida yuklab oling.",
    openGraph: {
        title: "HireZone Rezyume Builder - 5 daqiqada CV yarating",
        description: "Zamonaviy dizayndagi professional rezyume shablonlari.",
    }
};

export default function CVBuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
