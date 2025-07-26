"use client";
import Gallery from "@/components/Gallery";
import ProductDetails from "@/components/ProductDetails";
import Discover from "@/components/Discover";
import Layout from "@/components/Layout";
import useSanity from "@/hooks/useSanity";
import {getProduct} from "@/sanity/getSanity/getProduct";
import Loading from "@/components/Loading";
import PageTransition from "@/components/PageTransition";
import {getArtistArtworks} from "@/sanity/getSanity/getArtistArtworks";
import {getArtist} from "@/sanity/getSanity/getArtist";
import {useEffect, useState} from "react";
import RecommendedProducts from "@/components/RecommendedProducts";
import Footer from "@/components/Footer";
import {AnimatePresence} from "framer-motion";
import FullScreenImages from "@/components/FullScreenImages";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

export default function ProductLayout({slug}) {
    const router = useRouter();
    const {data: product, loading, error} = useSanity(getProduct, slug);
    const [artworks, setArtworks] = useState([]);
    const [artist, setArtist] = useState(null);
    const [isDataReady, setIsDataReady] = useState(false);

    const [openGallery, setOpenGallery] = useState({
        status: false,
        images: [],
        selectedIndex: 0,
    });


    useEffect(() => {
        if (product) {
            setOpenGallery({
                ...openGallery,
                images: product.images,
            });
        }
    }, [product]);

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
                    setIsDataReady(true);
                } catch (err) {
                    console.error("Error fetching data:", err);
                }
            }
        };

        if (product) {
            fetchData();
        } else {
            toast.error("Product not found");
            router.push("/categories/all");
        }
    }, [product]);

    if (loading || !isDataReady) return <Loading/>;

    return (
        <PageTransition>


            <AnimatePresence>
                {openGallery.status && (
                    <FullScreenImages
                        openGallery={openGallery}
                        images={openGallery.images}
                        selectedIndex={openGallery.selectedIndex}
                        setOpenGallery={setOpenGallery}
                    />
                )}
            </AnimatePresence>

            <Layout>
                <Gallery
                    images={product.images}
                    artist={product.artist}
                    price={product.price}
                    category={product.productCategory}
                    title={product.name}
                    product={product}
                    setOpenGallery={setOpenGallery}
                    openGallery={openGallery}
                />

                <ProductDetails
                    additionalInfo={product.additionalInfo}
                    productDetails={product.details}
                />


                <Discover artworks={artworks.slice(0, 3)} artist={artist}/>


                {/*<RecommendedProducts />*/}

            </Layout>

            <Footer/>
        </PageTransition>
    );
}
