import {getProductsByCategory} from "@/sanity/getSanity/getProductsByCategory";
import {getProductCategories} from "@/sanity/getSanity/getProductCategories";
import {getArtists} from "@/sanity/getSanity/getArtists";

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const artworks = await getProductsByCategory("all");
    const categories = await getProductCategories();
    const artists = await getArtists();

    const productsUrl = artworks.map((item) => {
        return {
            url: `${baseUrl}/products/${item.slug.current}`,
            lastModified: new Date(item._createdAt).toISOString()
        };
    }) ?? [];

    const categoriesUrl = categories.map((item) => {
        return {
            url: `${baseUrl}/categories/${item.slug}`,
            lastModified: new Date(item._createdAt).toISOString() // ISO 8601 format
        };
    }) ?? [];

    const artistsUrl = artists.map((item) => {
        return {
            url: `${baseUrl}/artists/${item.slug}`,
            lastModified: new Date(item._createdAt).toISOString() // ISO 8601 format
        };
    }) ?? [];

    return [
        {
            url: baseUrl,
            lastModified: new Date().toISOString() // Updated format for homepage
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date().toISOString()
        },
        ...productsUrl,
        ...categoriesUrl,
        ...artistsUrl,
        {
            url: `${baseUrl}/artists`,
            lastModified: new Date().toISOString()
        },
        // {
        //     url: `${baseUrl}/categories`,
        //     lastModified: new Date().toISOString()
        // }
    ];
}
