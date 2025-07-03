import ProductsLayout from "@/components/layouts/ProductsLayout";
import {getProductCategory} from "@/sanity/getSanity/getProductCategory";

export default function Page({params}) {

    return (
        <ProductsLayout category={params.slug}/>
    )
}


export async function generateMetadata({ params }) {
    const data = await getProductCategory(params.slug);



    return {
        title: data.seo !== null && data.seo.metaTitle ? data.seo.metaTitle : "NO TITLE",
        description:  data.seo !== null && data.seo.metaDescription ? data.seo.metaDescription : "NO DESCRIPTION",
        keywords: data.seo !== null && data.seo.keywords ? data?.seo?.keywords.map((item) => item).join(", ") : "NO KEYWORDS",
    };
}
