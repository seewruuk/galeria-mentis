"use client";
import Gallery from "@/components/Gallery";
import ProductDetails from "@/components/ProductDetails";
import Discover from "@/components/Discover";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import {useState} from "react";
import RecommendedProducts from "@/components/RecommendedProducts";
import Footer from "@/components/Footer";
import {AnimatePresence} from "framer-motion";
import FullScreenImages from "@/components/FullScreenImages";

export default function ProductLayout({product, artworks = [], artist = null}) {
    const [openGallery, setOpenGallery] = useState({
        status: false,
        images: product?.images || [],
        selectedIndex: 0,
    });

    // Strona produktu bez artysty nadal się renderuje – wtedy bez sekcji Discover

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
                    images={product.images || []}
                    artist={product.artist || {name: "Unknown", slug: ""}}
                    price={product.price}
                    category={product.productCategory || {title: "", slug: ""}}
                    title={product.name}
                    product={product}
                    setOpenGallery={setOpenGallery}
                    openGallery={openGallery}
                />

                <ProductDetails
                    additionalInfo={product.additionalInfo}
                    productDetails={product.details}
                />

                {/* Pokazujemy Discover tylko gdy dane są załadowane i mamy artystę */}
                {product.artist && product.artist.id && artworks.length > 0 && artist && (
                    <Discover artworks={artworks.slice(0, 3)} artist={artist}/>
                )}

                {/*<RecommendedProducts />*/}

            </Layout>

            <Footer/>
        </PageTransition>
    );
}