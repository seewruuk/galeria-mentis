import {SITE_URL} from "@/lib/generateSEO";

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/private/', '/dashboard/', '/studio/', '/api/', '/cart', '/wishlist', '/login', '/register', '/success', '/cancel'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
