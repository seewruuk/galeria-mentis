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
        title: "Nie znaleziono produktu",
        description: "Niestety, produkt którego szukasz, nie istnieje.",
    };

    return {
        title: data?.seo?.metaTitle,
        description: data?.seo?.metaDescription,
        keywords: data?.seo?.keywords && data?.seo?.keywords.map((item) => item).join(", "),
    };
}
