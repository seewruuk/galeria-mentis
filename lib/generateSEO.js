export const generateSEO = (data) => {
    return {
        title: data?.seo?.metaTitle || "Default Title",
        description: data?.seo?.metaDescription || "Default Description",
        keywords: data?.seo?.keywords ? data.seo.keywords.map((item) => item).join(", ") : "Default Keywords",
        openGraph: {
            title: data?.seo?.metaTitle || "Default Title",
            description: data?.seo?.metaDescription || "Default Description",
            url: data?.seo?.url || "https://default-url.com",
            images: data?.seo?.images || [],
            type: 'website',
            siteName: 'Default Site Name',
        },
        twitter: {
            card: 'summary_large_image',
            title: data?.seo?.metaTitle || "Default Title",
            description: data?.seo?.metaDescription || "Default Description",
            images: data?.seo?.images || [],
        },
    };
}