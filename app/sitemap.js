import {getProductsByCategory} from "@/sanity/getSanity/getProductsByCategory";
import {getProductCategories} from "@/sanity/getSanity/getProductCategories";
import {getArtists} from "@/sanity/getSanity/getArtists";

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://galeria-mentis.vercel.app';
    const artworks = await getProductsByCategory("all");
    const categories = await getProductCategories();
    const artists = await getArtists();

    const productsUrl = artworks.map((item) => {
        return {
            url: `${baseUrl}/products/${item.slug.current}`,
            lastModified: new Date(item._createdAt).toISOString(),
            changeFrequency: 'weekly',
            priority: 0.8,
        };
    }) ?? [];

    const categoriesUrl = categories.map((item) => {
        return {
            url: `${baseUrl}/categories/${item.slug}`,
            lastModified: new Date(item._createdAt).toISOString(),
            changeFrequency: 'weekly',
            priority: 0.7,
        };
    }) ?? [];

    const artistsUrl = artists.map((item) => {
        return {
            url: `${baseUrl}/artists/${item.slug}`,
            lastModified: new Date(item._createdAt).toISOString(),
            changeFrequency: 'monthly',
            priority: 0.7,
        };
    }) ?? [];

    return [
        {
            url: baseUrl,
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/artists`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...productsUrl,
        ...categoriesUrl,
        ...artistsUrl,
    ];
}
