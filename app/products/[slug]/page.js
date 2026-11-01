import {notFound} from "next/navigation";
import ProductLayout from "@/components/layouts/ProductLayout";
import StructuredData from "@/components/StructuredData";
import {getProduct} from "@/sanity/getSanity/getProduct";
import {getArtist} from "@/sanity/getSanity/getArtist";
import {getArtistArtworks} from "@/sanity/getSanity/getArtistArtworks";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";

export const revalidate = 60;

export default async function Page({params}) {
    const {slug} = await params;
    const product = await getProduct(slug);

    if (!product || !product._id || !product.name) notFound();

    let artist = null;
    let artworks = [];
    if (product.artist?.id && product.artist.slug) {
        [artist, artworks] = await Promise.all([
            getArtist(product.artist.slug).catch(() => null),
            getArtistArtworks(product.artist.id, product._id).catch(() => []),
        ]);
    }

    return (
        <>
            <StructuredData data={product} type="Product"/>
            <ProductLayout product={product} artist={artist} artworks={(artworks || []).slice(0, 3)}/>
        </>
    )
}

export async function generateMetadata({params}) {
    const {slug} = await params;
    const data = await getProduct(slug);

    if (!data) return {
        title: "Product not found",
        description: "Product not found",
        robots: {index: false},
    };

    return generateSEO(data, `${SITE_URL}/products/${slug}`);
}
