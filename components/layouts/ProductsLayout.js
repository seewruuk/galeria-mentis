// /app/products/[category]/layout.jsx  (lub analogicznie ProductsLayout.jsx)
"use client";

import useSanity from "@/hooks/useSanity";
import {getProductsByCategory} from "@/sanity/getSanity/getProductsByCategory";
import {getProductCategory} from "@/sanity/getSanity/getProductCategory";
import {getProductOptions} from "@/sanity/getSanity/getProductOptions";
import {Suspense, useEffect, useState} from "react";
import Loading from "@/components/Loading";
import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import ProductFilters from "@/components/ProductFilters";
import ProductsList from "@/components/ProductsList";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import {PortableText} from "@portabletext/react";
import {AnimatePresence, motion} from "framer-motion";
import {getProductCategories} from "@/sanity/getSanity/getProductCategories";
import {useRouter} from "next/navigation";

export default function ProductsLayout({category}) {
    return (
        <Suspense fallback={<Loading type={"full"}/>}>
            <ProductsRootLayout category={category}/>
        </Suspense>
    );
}

function ProductsRootLayout({category}) {
    const router = useRouter();
    const {data: products, loading: loadingProducts} = useSanity(
        getProductsByCategory,
        category
    );
    const {data: categoryDetails, loading: loadingCategoryDetails} = useSanity(
        getProductCategory,
        category
    );
    const {data: productOptions, loading: loadingProductOptions} = useSanity(
        getProductOptions
    );

    const {data: productCategories, loading: loadingProductCategories} = useSanity(
        getProductCategories
    );

    useEffect(() => {
        // console.log("productCategories", productCategories)
        const findCategory = productCategories.find((item) => item.slug === category.toLowerCase());

        if(!findCategory) {
            router.push("/categories/all");
        }

    }, [productCategories]);


    const [mounted, setMounted] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({});
    const [categoryFilters, setCategoryFilters] = useState({});
    const [sortOption, setSortOption] = useState("newest");
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState(1500);

    // liczba elementów w pierwszej partii
    const itemsPerLoad = 12;
    // ile łącznie ma być widoczne (pierwsze 12 + kolejne wciśnięte “Load More”)
    const [visibleCount, setVisibleCount] = useState(itemsPerLoad);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const ptComponents = {
        block: {
            normal: ({children}) => <p className="">{children}</p>,
            h1: ({children}) => (
                <h1 className="leading-[170%] text-[32px]">{children}</h1>
            ),
        },
    };

    // Ustawiamy mounted i inicjalizujemy filtry
    useEffect(() => {
        setMounted(true);

        if (products && productOptions) {
            setFilteredProducts(products);
            const initialFilters = productOptions.reduce((acc, option) => {
                acc[option.name] = [];
                return acc;
            }, {});
            setFilters({
                // "productCategories": [],
                ...initialFilters
            });
        }
        if (productCategories) {
            const initialCategoryFilters = productCategories.reduce((acc, category) => {
                acc[category.slug] = false;
                return acc;
            }, {});
            setCategoryFilters(initialCategoryFilters);
        }
    }, [products, productOptions, productCategories]);

    // Filtruj i sortuj przy zmianie kryteriów
    useEffect(() => {
        if (products) filterAndSortProducts();
    }, [searchQuery,
        filters,
        priceRange,
        sortOption,
        categoryFilters,]);

    // Reset “widocznych” elementów przy nowych filtrowaniach
    useEffect(() => {
        setVisibleCount(itemsPerLoad);
    }, [filteredProducts]);

    // Po aktualizacji visibleCount wyłączamy loader
    useEffect(() => {
        if (isLoadingMore) {
            setIsLoadingMore(false);
        }
    }, [visibleCount]);

    const filterAndSortProducts = () => {
        if (!products) return;

        let temp = [...products];

        // 1) Search by name
        if (searchQuery) {
            temp = temp.filter((prod) =>
                prod.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 2) Filter by productCategory checkboxes
        const activeCats = Object.entries(categoryFilters)
            .filter(([_, v]) => v)
            .map(([key]) => key);
        if (activeCats.length > 0 && !categoryFilters.all) {
            temp = temp.filter((prod) =>
                activeCats.includes(prod.productCategory?.slug?.current)
            );
        }

        // 3) Other detail-based filters
        Object.entries(filters).forEach(([filterName, values]) => {
            if (values.length) {
                temp = temp.filter((prod) =>
                    prod.details?.some(
                        (d) =>
                            d.productDetailsName === filterName &&
                            values.includes(d.content)
                    )
                );
            }
        });

        // 4) Price range
        if (priceRange > 0) {
            temp = temp.filter((prod) => {
                const price = prod.price || 0; // Używamy 0, jeśli cena nie jest dostępna
                return price <= priceRange;
            });
        }

        // 5) Sorting
        if (sortOption === "price-asc") temp.sort((a, b) => a.price - b.price);
        if (sortOption === "price-desc") temp.sort((a, b) => b.price - a.price);
        if (sortOption === "newest")
            temp.sort(
                (a, b) => new Date(b._createdAt) - new Date(a._createdAt)
            );
        if (sortOption === "oldest")
            temp.sort(
                (a, b) => new Date(a._createdAt) - new Date(b._createdAt)
            );

        setFilteredProducts(temp);
    };


    if (
        loadingProducts ||
        loadingCategoryDetails ||
        loadingProductOptions ||
        loadingProductCategories ||
        !mounted
    ) {
        return <Loading type="full"/>;
    }

    console.log("Filtered Products:", filteredProducts);


    return (
        <PageTransition>
            <Banner
                backgroundImage={categoryDetails?.image}
                hugeText={categoryDetails?.title}
                showBdImage={false}
            >
                <PortableText
                    value={categoryDetails?.header}
                    components={ptComponents}
                />
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
                        productCategories={productCategories}
                        filterAndSortProducts={filterAndSortProducts}
                        categoryFilters={categoryFilters}
                        setCategoryFilters={setCategoryFilters}
                        category={category}
                    />

                    <div className="w-3/4 max-lg:w-full">
                        <AnimatePresence>
                            {filteredProducts.length > 0 ? (
                                <motion.div
                                    key="products-list"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                >
                                    {/*
                    Teraz przekazujemy całą tablicę filteredProducts
                    oraz visibleCount i itemsPerLoad
                  */}
                                    <ProductsList
                                        allProducts={filteredProducts}
                                        visibleCount={visibleCount}
                                        itemsPerLoad={itemsPerLoad}
                                        sortOption={sortOption}
                                        setSortOption={setSortOption}
                                        loading={isLoadingMore}
                                    />

                                    <div className="flex justify-center mt-8">
                                        {isLoadingMore ? (
                                            <Loading type="small"/>
                                        ) : (
                                            visibleCount < filteredProducts.length && (
                                                <button
                                                    onClick={() => {
                                                        setIsLoadingMore(true);
                                                        setVisibleCount((prev) =>
                                                            Math.min(
                                                                prev + itemsPerLoad,
                                                                filteredProducts.length
                                                            )
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
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                    className="flex flex-col items-center justify-center h-[400px] text-center"
                                >
                                    <h2 className="text-xl font-semibold mb-4">
                                        No products found
                                    </h2>
                                    <p className="text-gray-500">
                                        Try adjusting your filters or search criteria.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Layout>

            <Footer/>
        </PageTransition>
    );
}
