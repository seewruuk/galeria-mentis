import ProductsLayout from "@/components/layouts/ProductsLayout";
import {getProductCategory} from "@/sanity/getSanity/getProductCategory";

export default function Page({params}) {

    return (
        <ProductsLayout category={params.slug}/>
    )
}


export async function generateMetadata({ params }) {
    const data = await getProductCategory(params.slug);

    if (!data) return {
        title: "404 not found",
        description: "404 not found",
    };

    return {
        title: data.seo.metaTitle,
        description: data.seo.metaDescription,
        keywords: data.seo.keywords && data.seo.keywords.map((item) => item).join(", "),
    };
}
