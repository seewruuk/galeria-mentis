import ProductsLayout from "@/components/layouts/ProductsLayout";
import {generateSEO} from "@/lib/generateSEO";

export default function Page({params}) {

    return (
        <ProductsLayout category={"all"}/>
    )
}


export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const pageUrl = `${baseUrl}/categories`;

    return generateSEO({
        title: "All Artworks",
        description: "Explore our collection of artworks from various categories.",
        seo: {
            metaTitle: "All Artworks - Galeria Mentis",
            metaDescription: "Explore our collection of artworks from various categories.",
            keywords: ["art", "artworks", "collection", "categories", "paintings", "sculptures"],
        }
    }, pageUrl);
}
