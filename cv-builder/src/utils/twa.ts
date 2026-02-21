
export const isTWA = () => {
    return typeof window !== 'undefined' && !!(window as any).Telegram?.WebApp?.initData;
};

export const getTWAColorScheme = () => {
    if (typeof window === 'undefined') return 'dark';
    return (window as any).Telegram?.WebApp?.colorScheme || 'dark';
};

export const expandTWA = () => {
    if (typeof window !== 'undefined') {
        (window as any).Telegram?.WebApp?.expand?.();
    }
};
