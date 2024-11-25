"use client";
import Gallery from "@/components/Gallery";
import ProductDetails from "@/components/ProductDetails";
import Discover from "@/components/Discover";
import Layout from "@/components/Layout";
import useSanity from "@/hooks/useSanity";
import { getProduct } from "@/sanity/getSanity/getProduct";
import Loading from "@/components/Loading";
import PageTransition from "@/components/PageTransition";
import { getArtistArtworks } from "@/sanity/getSanity/getArtistArtworks";
import { getArtist } from "@/sanity/getSanity/getArtist";
import { useEffect, useState } from "react";
import RecommendedProducts from "@/components/RecommendedProducts";

export default function ProductLayout({ slug }) {
    const { data: product, loading, error } = useSanity(getProduct, slug);
    const [artworks, setArtworks] = useState([]);
    const [artist, setArtist] = useState(null);
    const [isDataReady, setIsDataReady] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (product?.artist?.id && product.artist.slug) {
                try {
                    const [artworksData, artistData] = await Promise.all([
                        getArtistArtworks(product.artist.id, product._id),
                        getArtist(product.artist.slug),
                    ]);
                    setArtworks(artworksData);
                    setArtist(artistData);
                    setIsDataReady(true); // Ustaw dane jako gotowe
                } catch (err) {
                    console.error("Error fetching data:", err);
                }
            }
        };

        if (product) {
            fetchData();
        }
    }, [product]);

    // Renderowanie stanu ładowania
    if (loading || !isDataReady) return <Loading />;

    // Renderowanie głównego layoutu
    return (
        <PageTransition>
            <Layout>
                <Gallery
                    images={product.images.slice(1)}
                    artist={product.artist}
                    price={product.price}
                    category={product.productCategory}
                    title={product.name}
                    product={product}
                />

                <ProductDetails
                    additionalInfo={product.additionalInfo}
                    productDetails={product.details}
                />

                <Discover artworks={artworks.slice(0,3)} artist={artist} />

                {/*<RecommendedProducts />*/}

                <pre>
                    {JSON.stringify(product._id, null, 2)}
                </pre>
            </Layout>
        </PageTransition>
    );
}
