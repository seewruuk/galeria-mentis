import {getProductsByCategory} from "@/sanity/getSanity/getProductsByCategory";
import {getProductCategories} from "@/sanity/getSanity/getProductCategories";
import {getArtists} from "@/sanity/getSanity/getArtists";
import {getBlogPosts} from "@/sanity/getSanity/getBlogPosts";
import {SITE_URL} from "@/lib/generateSEO";

export const revalidate = 3600;

const POLICY_PAGES = ["faq", "privacyPolicy", "termsConditions", "shippingReturns", "cookies", "cookiesConsent", "artistTerms"];

function toDate(value) {
    const date = value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined;
}

export default async function sitemap() {
    const baseUrl = SITE_URL;
    const [artworks, categories, artists, posts] = await Promise.all([
        getProductsByCategory("all").catch(() => []),
        getProductCategories().catch(() => []),
        getArtists().catch(() => []),
        getBlogPosts().catch(() => []),
    ]);
    const now = new Date().toISOString();

    const productsUrl = (artworks || []).filter((item) => item.slug?.current).map((item) => ({
        url: `${baseUrl}/products/${item.slug.current}`,
        lastModified: toDate(item._updatedAt || item._createdAt),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const categoriesUrl = (categories || []).filter((item) => item.slug).map((item) => ({
        url: `${baseUrl}/categories/${item.slug}`,
        lastModified: toDate(item._updatedAt || item._createdAt),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    const artistsUrl = (artists || []).filter((item) => item.slug).map((item) => ({
        url: `${baseUrl}/artists/${item.slug}`,
        lastModified: toDate(item._createdAt),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    const postsUrl = (posts || []).filter((item) => item.slug).map((item) => ({
        url: `${baseUrl}/blog/${item.slug}`,
        lastModified: toDate(item._createdAt),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    const policiesUrl = POLICY_PAGES.map((page) => ({
        url: `${baseUrl}/links/${page}`,
        changeFrequency: 'yearly',
        priority: 0.3,
    }));

    return [
        {url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0},
        {url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8},
        {url: `${baseUrl}/artists`, lastModified: now, changeFrequency: 'weekly', priority: 0.8},
        ...productsUrl,
        ...categoriesUrl,
        ...artistsUrl,
        ...postsUrl,
        ...policiesUrl,
    ];
}
