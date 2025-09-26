import ProductsLayout from "@/components/layouts/ProductsLayout";
import {getProductCategory} from "@/sanity/getSanity/getProductCategory";

export default function Page({params}) {

    return (
        <ProductsLayout category={"all"}/>
    )
}


export async function generateMetadata() {

    return {
        title: "All Artworks`",
        description: "Explore our collection of artworks from various categories.",
        keywords: "art, artworks, collection, categories, paintings, sculptures",
    };
}
