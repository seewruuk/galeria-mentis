import ProductsLayout from "@/components/layouts/ProductsLayout";
import {getProductCategory} from "@/sanity/getSanity/getProductCategory";
import {generateSEO} from "@/lib/generateSEO";

export default function Page({params}) {

    return (
        <ProductsLayout category={params.slug}/>
    )
}


export async function generateMetadata({ params }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const data = await getProductCategory(params.slug);

    if (!data) return {
        title: "Category not found",
        description: "Category not found",
    };

    const pageUrl = `${baseUrl}/categories/${params.slug}`;
    return generateSEO(data, pageUrl);

}
