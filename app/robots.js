export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://galeria-mentis.vercel.app';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/private/', '/dashboard/', '/studio/', '/api/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}