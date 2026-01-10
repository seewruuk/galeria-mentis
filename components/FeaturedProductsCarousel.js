"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function FeaturedProductsCarousel({
                                                     products,
                                                     prevButtonClassName = "p-2 bg-white rounded-full shadow focus:outline-none",
                                                     nextButtonClassName = "p-2 bg-white rounded-full shadow focus:outline-none",
                                                     PrevIcon,
                                                     NextIcon,
                                                 }) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [navigationReady, setNavigationReady] = useState({ prevEl: null, nextEl: null });
    const [isClient, setIsClient] = useState(false);
    const [Swiper, setSwiper] = useState(null);
    const [SwiperSlide, setSwiperSlide] = useState(null);
    const [modules, setModules] = useState(null);
    const Prev = PrevIcon || ChevronLeft;
    const Next = NextIcon || ChevronRight;

    // Ładujemy Swiper tylko po stronie klienta
    useEffect(() => {
        setIsClient(true);
        
        // Dynamicznie ładujemy Swiper i jego moduły
        Promise.all([
            import("swiper/react"),
            import("swiper/modules"),
            import("swiper/css"),
            import("swiper/css/navigation"),
        ]).then(([swiperMod, modulesMod]) => {
            setSwiper(() => swiperMod.Swiper);
            setSwiperSlide(() => swiperMod.SwiperSlide);
            setModules([modulesMod.Navigation, modulesMod.A11y]);
            
            // Ustawiamy nawigację po załadowaniu modułów
            setTimeout(() => {
                setNavigationReady({ prevEl: prevRef.current, nextEl: nextRef.current });
            }, 0);
        });
    }, []);

    // Fallback dla SSR - renderujemy zwykłą grid
    if (!isClient || !Swiper || !SwiperSlide || !modules) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product, idx) => (
                    <ProductCard
                        key={product._id || `product-${product.slug}-${idx}`}
                        image={product.thumbnail ?? product.images[0]}
                        title={product.name}
                        category={product.productCategory.title}
                        categoryLink={product.productCategory.slug}
                        artist={product.artist.name}
                        artistsLink={product.artist.slug}
                        price={product.price}
                        slug={product.slug}
                        index={idx}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                ref={prevRef}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 ${prevButtonClassName}`}
                aria-label="Previous slide"
            >
                <Prev />
            </button>

            <Swiper
                modules={modules}
                loop={products.length > 4}
                spaceBetween={24}
                speed={500}
                breakpoints={{
                    0: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
                navigation={navigationReady.prevEl && navigationReady.nextEl ? navigationReady : false}
            >
                {products.map((product, index) => (
                    <SwiperSlide key={product._id || `product-${product.slug}-${index}`}>
                        <ProductCard
                            image={product.thumbnail ?? product.images[0]}
                            title={product.name}
                            category={product.productCategory.title}
                            categoryLink={product.productCategory.slug}
                            artist={product.artist.name}
                            artistsLink={product.artist.slug}
                            price={product.price}
                            slug={product.slug}
                            index={index}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <button
                ref={nextRef}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 ${nextButtonClassName}`}
                aria-label="Next slide"
            >
                <Next />
            </button>
        </div>
    );
}