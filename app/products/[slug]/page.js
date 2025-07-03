import ProductLayout from "@/components/layouts/ProductLayout";
import {getProduct} from "@/sanity/getSanity/getProduct";

export default function Page({params}) {
    return (
        <ProductLayout slug={params.slug}/>
    )
}



export async function generateMetadata({ params }) {
    const data = await getProduct(params.slug);

    if (!data) return {
        title: "Product not found",
        description: "Product not found",
    };

    return {
        title: data.seo !== null && data.seo.metaTitle ? data.seo.metaTitle : "NO TITLE",
        description:  data.seo !== null && data.seo.metaDescription ? data.seo.metaDescription : "NO DESCRIPTION",
        keywords: data.seo !== null && data.seo.keywords ? data?.seo?.keywords.map((item) => item).join(", ") : "NO KEYWORDS",
    };
}
