"use client";

import {Suspense, useEffect, useMemo, useState, useRef} from "react";
import Loading from "@/components/Loading";
import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import ProductFilters from "@/components/ProductFilters";
import ProductsList from "@/components/ProductsList";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import {PortableText} from "@portabletext/react";
import {AnimatePresence, motion} from "framer-motion";

const ITEMS_PER_LOAD = 50;
const INITIAL_PRICE_RANGE = 2500;

// --- normalizacja ceny
const normalizePrice = (p) => {
    if (typeof p === "number") return p;
    if (typeof p === "string") {
        const cleaned = p.replace(/[^0-9.,]/g, "").replace(/,/g, ".");
        const n = parseFloat(cleaned);
        return Number.isFinite(n) ? n : 0;
    }
    return 0;
};

// filtr + sort (bez pokazywania; samo wyliczenie listy)
function buildFiltered({products, searchQuery, categoryFilters, filters, priceRange, sortOption, baseOrder}) {
    if (!products) return [];
    let temp = [...products];

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        temp = temp.filter((prod) => prod.name?.toLowerCase().includes(q));
    }

    const activeCats = Object.entries(categoryFilters)
        .filter(([_, v]) => v)
        .map(([key]) => key);
    if (activeCats.length > 0 && !categoryFilters.all) {
        temp = temp.filter((prod) => activeCats.includes(prod.productCategory?.slug?.current));
    }

    Object.entries(filters).forEach(([filterName, values]) => {
        if (values.length) {
            temp = temp.filter((prod) =>
                prod.details?.some((d) => d.productDetailsName === filterName && values.includes(d.content))
            );
        }
    });

    if (priceRange > 0) {
        temp = temp.filter((prod) => normalizePrice(prod.price) <= priceRange);
    }

    if (sortOption === "all") {
        temp.sort((a, b) => {
            const ai = baseOrder.get(a._id) ?? Number.MAX_SAFE_INTEGER;
            const bi = baseOrder.get(b._id) ?? Number.MAX_SAFE_INTEGER;
            return ai - bi;
        });
    }
    if (sortOption === "price-asc") temp.sort((a, b) => normalizePrice(a.price) - normalizePrice(b.price));
    if (sortOption === "price-desc") temp.sort((a, b) => normalizePrice(b.price) - normalizePrice(a.price));
    if (sortOption === "newest") temp.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));
    if (sortOption === "oldest") temp.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));

    return temp;
}

export default function ProductsLayout(props) {
    return (
        <Suspense fallback={<Loading type={"full"}/>}>
            <ProductsRootLayout {...props}/>
        </Suspense>
    );
}

/**
 * products przychodzą z serwera już w losowej kolejności (losowanie po stronie serwera,
 * żeby HTML z serwera i przeglądarki był identyczny), a pierwsza partia jest widoczna od razu.
 */
function ProductsRootLayout({category, products = [], productOptions = [], productCategories = []}) {
    const [filters, setFilters] = useState(() => (productOptions || []).reduce((acc, option) => {
        acc[option.name] = [];
        return acc;
    }, {}));
    const [categoryFilters, setCategoryFilters] = useState(() => (productCategories || []).reduce((acc, cat) => {
        acc[cat.slug] = false;
        return acc;
    }, {}));
    const [sortOption, setSortOption] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState(INITIAL_PRICE_RANGE);

    const itemsPerLoad = ITEMS_PER_LOAD;

    // stabilna kolejność na czas wizyty (kolejność z serwera)
    const baseOrder = useMemo(() => new Map((products || []).map((p, idx) => [p._id, idx])), [products]);

    const [filteredProducts, setFilteredProducts] = useState(() => buildFiltered({
        products, searchQuery: "", categoryFilters: {}, filters: {}, priceRange: INITIAL_PRICE_RANGE, sortOption: "all", baseOrder: new Map((products || []).map((p, idx) => [p._id, idx])),
    }));
    const [visibleCount, setVisibleCount] = useState(() => Math.min(ITEMS_PER_LOAD, filteredProducts.length));
    const [isPreparingBatch, setIsPreparingBatch] = useState(false); // steruje skeletonami podczas preloadu
    const [isLoadingMore, setIsLoadingMore] = useState(false);       // status przy przycisku „Load More”

    // PRELOAD obrazów partii i dopiero potem odsłoń
    const getImageUrl = (p) =>
        p?.thumbnail ?? (Array.isArray(p?.images) ? p.images[0] : undefined);

    const preloadBatch = (list, start, end) => {
        const urls = list.slice(start, end)
            .map(getImageUrl)
            .filter(Boolean);

        if (urls.length === 0) {
            return Promise.resolve(); // nic do preloadu
        }

        return Promise.all(
            urls.map((src) => new Promise((res) => {
                const img = new window.Image();
                img.onload = img.onerror = () => res();
                img.src = src;
            }))
        );
    };

    const prepareNextBatch = (list = filteredProducts, currentVisible = visibleCount) => {
        const start = currentVisible;
        const end = Math.min(start + itemsPerLoad, list.length);
        if (start >= end) return;

        setIsPreparingBatch(true);
        preloadBatch(list, start, end).then(() => {
            setVisibleCount(end);       // odsłoń całą partię NARAZ
            setIsPreparingBatch(false);
            setIsLoadingMore(false);
        });
    };

    // Gdy użytkownik zmieni filtr/sortowanie — przebuduj listę i przygotuj (preloaduj) 1. partię.
    // Pierwsze renderowanie pomijamy: lista startowa jest już policzona i widoczna z serwera.
    const isFirstRun = useRef(true);
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        const next = buildFiltered({products, searchQuery, categoryFilters, filters, priceRange, sortOption, baseOrder});
        setFilteredProducts(next);
        setVisibleCount(0);            // schowaj dotychczasowe (będziemy odsłaniać partiami)
        if (next.length > 0) {
            prepareNextBatch(next, 0); // preload pierwszej partii po zmianie filtrów/sortowania
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products, searchQuery, filters, priceRange, sortOption, categoryFilters]);

    // klik „Load More” → preload następnej partii, a dopiero potem odsłoń
    const handleLoadMore = () => {
        if (isPreparingBatch) return;
        setIsLoadingMore(true);
        prepareNextBatch();
    };

    return (
        <PageTransition>
            <Layout>
                <div className="flex gap-5 py-[64px] max-lg:flex-col pt-[150px]">
                    <ProductFilters
                        productOptions={productOptions}
                        filters={filters}
                        setFilters={setFilters}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        productCategories={productCategories}
                        filterAndSortProducts={() => {}} // nie wywołujemy już ręcznie; trzymamy w useEffect
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
                                    <ProductsList
                                        allProducts={filteredProducts}
                                        visibleCount={visibleCount}
                                        itemsPerLoad={itemsPerLoad}
                                        sortOption={sortOption}
                                        setSortOption={setSortOption}
                                        loading={isPreparingBatch}
                                    />

                                    <div className="flex justify-center mt-8">
                                        {isPreparingBatch ? (
                                            <Loading type="small"/>
                                        ) : (
                                            visibleCount < filteredProducts.length && (
                                                <button
                                                    onClick={handleLoadMore}
                                                    className="px-6 py-2 border rounded-md bg-primary text-white hover:bg-primary-dark"
                                                    disabled={isPreparingBatch}
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
