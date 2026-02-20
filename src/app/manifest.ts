import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'HireZone Platform',
        short_name: 'HireZone',
        description: 'Find your dream job or the perfect candidate with HireZone.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4bcc5a',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
