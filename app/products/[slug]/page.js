import ProductLayout from "@/components/layouts/ProductLayout";

export default function Page({params}) {
    return (
        <ProductLayout slug={params.slug}/>
    )
}



