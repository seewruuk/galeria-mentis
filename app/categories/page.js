import ProductsLayout from "@/components/layouts/ProductsLayout";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";
import {getCatalogData} from "@/lib/server/catalog";

export const revalidate = 60;

export default async function Page() {
    const data = await getCatalogData("all");

    return (
        <ProductsLayout category={"all"} {...data}/>
    )
}


export async function generateMetadata() {
    // Ta sama treść co /categories/all – wskazujemy jeden adres kanoniczny
    return generateSEO({
        title: "All Artworks",
        description: "Explore our collection of artworks from various categories.",
        seo: {
            metaTitle: "All Artworks - Galeria Mentis",
            metaDescription: "Explore our collection of artworks from various categories.",
            keywords: ["art", "artworks", "collection", "categories", "paintings", "sculptures"],
        }
    }, `${SITE_URL}/categories/all`);
}
