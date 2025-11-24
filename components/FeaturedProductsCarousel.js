"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
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
    const Prev = PrevIcon || ChevronLeft;
    const Next = NextIcon || ChevronRight;

    // Po zamontowaniu ustawiamy elementy nawigacji
    useEffect(() => {
        setNavigationReady({ prevEl: prevRef.current, nextEl: nextRef.current });
    }, []);

    return (
        <div className="relative">
            <button
                ref={prevRef}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 ${prevButtonClassName}`}
            >
                <Prev />
            </button>

            <Swiper
                modules={[Navigation, A11y]}
                loop={true}
                spaceBetween={24}
                speed={500}
                breakpoints={{
                    0: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
                navigation={navigationReady}
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
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <button
                ref={nextRef}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 ${nextButtonClassName}`}
            >
                <Next />
            </button>
        </div>
    );
}