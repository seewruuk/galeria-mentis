"use client"
import Gallery from "@/components/Gallery";
import ProductDetails from "@/components/ProductDetails";
import Discover from "@/components/Discover";
import RecommendedProducts from "@/components/RecommendedProducts";
import Layout from "@/components/Layout";
import useSanity from "@/hooks/useSanity";
import {getProduct} from "@/sanity/getSanity/getProduct";
import Loading from "@/components/Loading";

export default function ProductLayout({slug}) {

    const {data: product, loading, error} = useSanity(getProduct, slug);

    if(loading) return <Loading />

    return (
        <Layout>

            <Gallery
                images={product.images.slice(1)}
                artist={product.artist}
                price={product.price}
                category={product.productCategory}
                title={product.name}
                product={product}
            />



            {/*<ProductDetails/>*/}

            {/*<Discover/>*/}

            {/*<RecommendedProducts/>*/}


            {/*<div>*/}
            {/*    <pre>*/}
            {/*        {JSON.stringify(product, null, 2)}*/}
            {/*    </pre>*/}
            {/*</div>*/}

        </Layout>

    )
}