import ProductLayout from "@/components/layouts/ProductLayout";
import {getProduct} from "@/sanity/getSanity/getProduct";
import {generateSEO} from "@/lib/generateSEO";

export default function Page({params}) {
    return (
        <ProductLayout slug={params.slug}/>
    )
}



export async function generateMetadata({ params }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const data = await getProduct(params.slug);

    if (!data) return {
        title: "Product not found",
        description: "Product not found",
    };

    const pageUrl = `${baseUrl}/products/${params.slug}`;
    return generateSEO(data, pageUrl);
}
