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
import StructuredData from "@/components/StructuredData";

export default function ProductLayout({slug}) {
    const router = useRouter();
    const {data: product, loading, error} = useSanity(getProduct, slug);
    const [artworks, setArtworks] = useState([]);
    const [artist, setArtist] = useState(null);
    const [isAdditionalDataLoading, setIsAdditionalDataLoading] = useState(false);
    const [hasRedirected, setHasRedirected] = useState(false);

    const [openGallery, setOpenGallery] = useState({
        status: false,
        images: [],
        selectedIndex: 0,
    });

    // Przekierowanie w przypadku błędu lub braku produktu (tylko raz po zakończeniu loading)
    useEffect(() => {
        if (loading) return; // Czekamy aż loading się skończy
        if (hasRedirected) return; // Zapobiegamy wielokrotnym przekierowaniom

        // Jeśli błąd - przekieruj
        if (error) {
            setHasRedirected(true);
            toast.error("Error loading product");
            router.push("/categories/all");
            return;
        }

        // Sprawdzamy czy product jest faktycznie załadowany (null/undefined/pusta tablica/invalid)
        // Product może być null, undefined, pustą tablicą, lub obiektem bez wymaganych pól
        const isProductInvalid = !product || Array.isArray(product) || !product._id || !product.name;
        
        // Jeśli produkt nie został znaleziony - przekieruj
        if (isProductInvalid) {
            setHasRedirected(true);
            toast.error("Product not found");
            router.push("/categories/all");
            return;
        }

        // Jeśli produkt istnieje ale nie ma artysty - NIE przekierowujemy (może być produkt bez artysty)
        // Po prostu nie ładujemy dodatkowych danych (Discover)
    }, [loading, error, product, router, hasRedirected]);

    // Ustawiamy obrazy dla galerii gdy product jest załadowany
    useEffect(() => {
        if (product?.images && product.images.length > 0 && !Array.isArray(product)) {
            setOpenGallery(prev => ({
                ...prev,
                images: product.images,
            }));
        }
    }, [product]);

    // Ładujemy dodatkowe dane (artworks, artist) w tle - nie blokują renderowania
    useEffect(() => {
        // Sprawdzamy czy product jest faktycznie załadowany i poprawny
        if (loading || !product || Array.isArray(product) || !product._id || !product.name) {
            return; // Czekamy na dane
        }

        // Jeśli produkt nie ma artysty, nie ładujemy dodatkowych danych
        if (!product.artist || !product.artist.id) {
            return;
        }

        // Ładujemy dodatkowe dane tylko jeśli mamy poprawne dane produktu
        const fetchData = async () => {
            if (product.artist?.id && product.artist.slug) {
                setIsAdditionalDataLoading(true);
                try {
                    const [artworksData, artistData] = await Promise.all([
                        getArtistArtworks(product.artist.id, product._id),
                        getArtist(product.artist.slug),
                    ]);
                    setArtworks(artworksData || []);
                    setArtist(artistData);
                } catch (err) {
                    console.error("Error fetching additional data:", err);
                } finally {
                    setIsAdditionalDataLoading(false);
                }
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product, loading]);

    // Pokazujemy Loading tylko gdy główne dane produktu się ładują
    if (loading) {
        return <Loading/>;
    }

    // Jeśli błąd lub product nie został znaleziony (null/undefined/pusta tablica) - czekamy na przekierowanie
    if (error || hasRedirected) {
        return <Loading/>;
    }

    // Sprawdzamy czy product jest faktycznie załadowany i poprawny
    const isProductInvalid = !product || Array.isArray(product) || !product._id || !product.name;
    if (isProductInvalid) {
        return <Loading/>;
    }

    // Jeśli produkt nie ma artysty - nadal renderujemy stronę, ale bez sekcji Discover
    // (produkt może istnieć bez artysty, więc nie przekierowujemy)

    return (
        <PageTransition>
            {product && <StructuredData data={product} type="Product" />}

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
                {product.artist && product.artist.id && !isAdditionalDataLoading && artworks.length > 0 && artist && (
                    <Discover artworks={artworks.slice(0, 3)} artist={artist}/>
                )}

                {/*<RecommendedProducts />*/}

            </Layout>

            <Footer/>
        </PageTransition>
    );
}