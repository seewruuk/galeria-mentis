import {notFound} from "next/navigation";
import ProductsLayout from "@/components/layouts/ProductsLayout";
import {getProductCategory} from "@/sanity/getSanity/getProductCategory";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";
import {getCatalogData} from "@/lib/server/catalog";

export const revalidate = 60;

export default async function Page({params}) {
    const {slug} = await params;

    if (slug !== "all") {
        const category = await getProductCategory(slug);
        if (!category) notFound();
    }

    const data = await getCatalogData(slug);

    return (
        <ProductsLayout category={slug} {...data}/>
    )
}


export async function generateMetadata({params}) {
    const {slug} = await params;
    const data = await getProductCategory(slug);

    if (!data) {
        if (slug === "all") {
            return generateSEO({
                title: "All Artworks",
                seo: {metaTitle: "All Artworks - Galeria Mentis", metaDescription: "Explore our collection of artworks from various categories."},
            }, `${SITE_URL}/categories/all`);
        }
        return {
            title: "Category not found",
            description: "Category not found",
            robots: {index: false},
        };
    }

    return generateSEO(data, `${SITE_URL}/categories/${slug}`);
}
