"use client";

import useSanity from "@/hooks/useSanity";
import { getProductsByCategory } from "@/sanity/getSanity/getProductsByCategory";
import { getProductCategory } from "@/sanity/getSanity/getProductCategory";
import { getProductOptions } from "@/sanity/getSanity/getProductOptions";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import ProductFilters from "@/components/ProductFilters";
import ProductsList from "@/components/ProductsList";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { PortableText } from "@portabletext/react";
import {AnimatePresence, motion} from "framer-motion";

export default function ProductsLayout({ category }) {
    return (
        <Suspense fallback={<Loading type={"full"}/>}>
            <ProductsRootLayout category={category} />
        </Suspense>
    );
}

function ProductsRootLayout({ category }) {
    const { data: products, loading: loadingProducts } = useSanity(
        getProductsByCategory,
        category
    );
    const { data: categoryDetails, loading: loadingCategoryDetails } = useSanity(
        getProductCategory,
        category
    );
    const { data: productOptions, loading: loadingProductOptions } = useSanity(
        getProductOptions
    );

    const [mounted, setMounted] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({});
    const [sortOption, setSortOption] = useState("newest");
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState(10000);

    // liczba elementów ładowanych za każdym razem
    const itemsPerLoad = 12;
    const [visibleCount, setVisibleCount] = useState(itemsPerLoad);
    const [isLoadingMore, setIsLoadingMore] = useState(false);


    const ptComponents = {
        block: {
            normal: ({ children }) => (
                <p className="">{children}</p>
            ),
            h1: ({ children }) => (
                <h1 className="leading-[170%] text-[32px]">{children}</h1>
            ),
        },
    };

    // ustawiamy mounted i inicjalizujemy filtry
    useEffect(() => {
        setMounted(true);

        if (products && productOptions) {
            setFilteredProducts(products);
            const initialFilters = productOptions.reduce((acc, option) => {
                acc[option.name] = [];
                return acc;
            }, {});
            setFilters(initialFilters);
        }
    }, [products, productOptions]);

    // filtruj i sortuj przy zmianie kryteriów
    useEffect(() => {
        if (products) filterAndSortProducts();
    }, [filters, searchQuery, sortOption, priceRange]);

    // reset widocznych elementów przy nowych filtrowaniach
    useEffect(() => {
        setVisibleCount(itemsPerLoad);
    }, [filteredProducts]);

    // po aktualizacji visibleCount wyłącz loader
    useEffect(() => {
        if (isLoadingMore) {
            setIsLoadingMore(false);
        }
    }, [visibleCount]);

    const filterAndSortProducts = () => {
        let filtered = [...products];

        if (searchQuery) {
            filtered = filtered.filter((prod) =>
                prod.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        Object.entries(filters).forEach(([filterName, values]) => {
            if (values.length) {
                filtered = filtered.filter((prod) =>
                    prod.details?.some(
                        (detail) => detail.productDetailsName === filterName && values.includes(detail.content)
                    )
                );
            }
        });
        filtered = filtered.filter((prod) => prod.price <= priceRange);

        if (sortOption === "price-asc") filtered.sort((a, b) => a.price - b.price);
        if (sortOption === "price-desc") filtered.sort((a, b) => b.price - a.price);
        if (sortOption === "newest") filtered.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));
        if (sortOption === "oldest") filtered.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));

        setFilteredProducts(filtered);
    };

    if (
        loadingProducts ||
        loadingCategoryDetails ||
        loadingProductOptions ||
        !mounted
    ) {
        return <Loading type="full" />;
    }

    return (
        <PageTransition>
            <Banner
                backgroundImage={categoryDetails?.image}
                hugeText={categoryDetails?.title}
            >
                <PortableText value={categoryDetails?.header} components={ptComponents} />
            </Banner>

            <Layout>
                <div className="flex gap-5 py-[64px] max-lg:flex-col">
                    <ProductFilters
                        productOptions={productOptions}
                        filters={filters}
                        setFilters={setFilters}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                    />

                    <div className="w-3/4 max-lg:w-full">
                        <AnimatePresence>

                        {filteredProducts.length > 0 ? (
                            <motion.div
                                key="products-list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}

                            >
                                <ProductsList
                                    products={filteredProducts.slice(0, visibleCount)}
                                    sortOption={sortOption}
                                    setSortOption={setSortOption}
                                    isLoadingMore={isLoadingMore}
                                />

                                <div className="flex justify-center mt-8">
                                    {isLoadingMore ? (
                                        <Loading type="small" />
                                    ) : (
                                        visibleCount < filteredProducts.length && (
                                            <button
                                                onClick={() => {
                                                    setIsLoadingMore(true);
                                                    setVisibleCount((prev) =>
                                                        Math.min(prev + itemsPerLoad, filteredProducts.length)
                                                    );
                                                }}
                                                className="px-6 py-2 border rounded-md bg-primary text-white hover:bg-primary-dark"
                                            >
                                                Load More
                                            </button>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-[400px] text-center"
                            >
                                <h2 className="text-xl font-semibold mb-4">No products found</h2>
                                <p className="text-gray-500">Try adjusting your filters or search criteria.</p>

                            </motion.div>
                        )}
                        </AnimatePresence>

                    </div>
                </div>
            </Layout>

            <Footer />
        </PageTransition>
    );
}
