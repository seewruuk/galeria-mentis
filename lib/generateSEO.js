/**
 * Generates comprehensive SEO metadata for a page
 * @param {Object} data - Data containing SEO and page information
 * @param {string} url - Page URL (optional, for canonical and OG)
 * @returns {Object} Complete SEO metadata for Next.js
 */
export const generateSEO = (data, url = null) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const seo = data?.seo || {};
    
    // Prepare OG image
    // Handle different image formats from Sanity
    let ogImageUrl = null;
    
    if (seo?.ogImage) {
        // If ogImage is already a URL (from GROQ query)
        if (typeof seo.ogImage === 'string') {
            ogImageUrl = seo.ogImage.startsWith('http') ? seo.ogImage : `${baseUrl}${seo.ogImage}`;
        }
        // If ogImage is a Sanity object with asset
        else if (seo.ogImage.asset?.url) {
            ogImageUrl = seo.ogImage.asset.url.startsWith('http') 
                ? seo.ogImage.asset.url 
                : `${baseUrl}${seo.ogImage.asset.url}`;
        }
        // If ogImage is an object with url
        else if (seo.ogImage.url) {
            ogImageUrl = seo.ogImage.url.startsWith('http') 
                ? seo.ogImage.url 
                : `${baseUrl}${seo.ogImage.url}`;
        }
    }
    
    // Fallback: use product/article image if no ogImage
    if (!ogImageUrl && data?.thumbnail) {
        ogImageUrl = data.thumbnail.startsWith('http') ? data.thumbnail : `${baseUrl}${data.thumbnail}`;
    }
    if (!ogImageUrl && data?.mainImage) {
        ogImageUrl = data.mainImage.startsWith('http') ? data.mainImage : `${baseUrl}${data.mainImage}`;
    }
    if (!ogImageUrl && data?.images?.[0]) {
        ogImageUrl = data.images[0].startsWith('http') ? data.images[0] : `${baseUrl}${data.images[0]}`;
    }
    
    const ogImages = ogImageUrl ? [
        {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: seo?.metaTitle || data?.title || 'Galeria Mentis',
        }
    ] : [];
    
    // Prepare meta robots
    const robotsIndex = seo?.metaRobots?.index !== false ? 'index' : 'noindex';
    const robotsFollow = seo?.metaRobots?.follow !== false ? 'follow' : 'nofollow';
    const robotsValue = `${robotsIndex}, ${robotsFollow}`;
    
    // Canonical URL
    const canonicalUrl = seo?.canonicalUrl || url || baseUrl;
    
    // Open Graph Type
    const ogType = seo?.ogType || 'website';
    
    // Twitter Card
    const twitterCard = seo?.twitterCard || 'summary_large_image';
    
    // Keywords as string
    const keywordsString = seo?.keywords 
        ? seo.keywords.map((item) => item).join(", ")
        : seo?.focusKeyword || "";
    
    // Alternate languages
    const alternates = {};
    if (seo?.alternateLanguages && seo.alternateLanguages.length > 0) {
        alternates.languages = {};
        seo.alternateLanguages.forEach((alt) => {
            if (alt.lang && alt.url) {
                alternates.languages[alt.lang] = alt.url;
            }
        });
    }
    
    // Build metadata
    const metadata = {
        title: seo?.metaTitle || data?.title || "Galeria Mentis - Contemporary Art",
        description: seo?.metaDescription || data?.description || "Discover exceptional contemporary art at Galeria Mentis",
        keywords: keywordsString,
        robots: {
            index: seo?.metaRobots?.index !== false,
            follow: seo?.metaRobots?.follow !== false,
            googleBot: {
                index: seo?.metaRobots?.index !== false,
                follow: seo?.metaRobots?.follow !== false,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            title: seo?.metaTitle || data?.title || "Galeria Mentis",
            description: seo?.metaDescription || data?.description || "Discover exceptional contemporary art",
            url: canonicalUrl,
            siteName: "Galeria Mentis",
            images: ogImages,
            locale: 'en_US',
            type: ogType,
        },
        twitter: {
            card: twitterCard,
            title: seo?.metaTitle || data?.title || "Galeria Mentis",
            description: seo?.metaDescription || data?.description || "Discover exceptional contemporary art",
            images: ogImages,
        },
        alternates: Object.keys(alternates).length > 0 ? alternates : undefined,
        metadataBase: new URL(baseUrl),
    };
    
    // Add canonical URL if available
    if (canonicalUrl) {
        metadata.alternates = metadata.alternates || {};
        metadata.alternates.canonical = canonicalUrl;
    }
    
    // Structured Data (JSON-LD) will be handled separately in components
    
    return metadata;
};

/**
 * Generates structured data (JSON-LD) for different content types
 * @param {Object} data - Content data
 * @param {string} type - Structured data type ('Product', 'Article', 'Person', etc.)
 * @returns {Object|null} JSON-LD structured data
 */
export const generateStructuredData = (data, type = null) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const seo = data?.seo || {};
    
    // Check if there's custom JSON-LD
    if (seo?.structuredData?.customJsonLd) {
        try {
            return JSON.parse(seo.structuredData.customJsonLd);
        } catch (e) {
            console.error('Error parsing custom JSON-LD:', e);
        }
    }
    
    const schemaType = type || seo?.structuredData?.type || null;
    if (!schemaType) return null;
    
    const context = 'https://schema.org';
    
    switch (schemaType) {
        case 'Product':
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
            const productImage = data?.images?.[0] || data?.thumbnail || '';
            const fullProductImage = productImage && !productImage.startsWith('http') 
                ? `${baseUrl}${productImage}` 
                : productImage;
            
            return {
                '@context': context,
                '@type': 'Product',
                name: data?.name || data?.title || '',
                description: seo?.metaDescription || data?.description || '',
                ...(fullProductImage && { image: fullProductImage }),
                ...(data?.price && {
                    offers: {
                        '@type': 'Offer',
                        price: parseFloat(data.price) || 0,
                        priceCurrency: 'PLN',
                        availability: data?.quantity > 0 
                            ? 'https://schema.org/InStock' 
                            : 'https://schema.org/OutOfStock',
                        url: `${baseUrl}/products/${data?.slug}`,
                    }
                }),
                ...(data?.artist?.name && {
                    brand: {
                        '@type': 'Brand',
                        name: data.artist.name,
                    }
                }),
            };
            
        case 'Article':
            const articleBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
            const articleImage = data?.mainImage || '';
            const fullArticleImage = articleImage && !articleImage.startsWith('http') 
                ? `${articleBaseUrl}${articleImage}` 
                : articleImage;
            
            return {
                '@context': context,
                '@type': 'Article',
                headline: data?.title || '',
                description: seo?.metaDescription || data?.description || '',
                ...(fullArticleImage && { image: fullArticleImage }),
                datePublished: data?.publishedAt || data?._createdAt || new Date().toISOString(),
                dateModified: data?.updatedAt || data?.publishedAt || data?._createdAt || new Date().toISOString(),
                author: {
                    '@type': 'Organization',
                    name: 'Galeria Mentis',
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'Galeria Mentis',
                    ...(fullArticleImage && { logo: { '@type': 'ImageObject', url: fullArticleImage } }),
                },
            };
            
        case 'Person':
            const personBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
            const personImage = data?.avatar || data?.bannerImage || '';
            const fullPersonImage = personImage && !personImage.startsWith('http') 
                ? `${personBaseUrl}${personImage}` 
                : personImage;
            
            return {
                '@context': context,
                '@type': 'Person',
                name: data?.name || '',
                description: seo?.metaDescription || data?.description || '',
                ...(fullPersonImage && { image: fullPersonImage }),
                ...(data?.location && {
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: data.location.city || '',
                        addressCountry: data.location.country || '',
                    }
                }),
                ...(data?.slug && {
                    url: `${personBaseUrl}/artists/${data.slug}`,
                }),
            };
            
        default:
            return null;
    }
};