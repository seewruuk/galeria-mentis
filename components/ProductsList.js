// /components/ProductsList.jsx
"use client";

import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

// Animacje i warianty Framer Motion
const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { ease: "easeIn", duration: 0.2 } },
};

export default function ProductsList({
                                         allProducts,   // cała lista przefiltrowanych produktów
                                         visibleCount,  // ile łącznie ma być widoczne (np. 12, 24, 36…)
                                         itemsPerLoad,  // ile produktów “na raz” (tu 12)
                                         sortOption,
                                         setSortOption,
                                         loading = false,
                                     }) {
    // Obliczamy, ile batchów ma się pojawić:
    // np. visibleCount=36, itemsPerLoad=12 → numBatches=3
    const numBatches = Math.ceil(visibleCount / itemsPerLoad);

    // Funkcja pomocnicza: zwraca slice od start do end, ale nigdy poza visibleCount
    const getBatchSlice = (batchIndex) => {
        const start = batchIndex * itemsPerLoad;
        const end = Math.min(start + itemsPerLoad, visibleCount);
        return allProducts.slice(start, end);
    };

    return (
        <div className="w-full">
            {/* Dropdown sortowania */}
            <div className="flex justify-between items-center mb-6">
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1"
                >
                    <option value="price-asc">Lowest to Highest Price</option>
                    <option value="price-desc">Highest to Lowest Price</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>

            {/* Iterujemy batch po batchu */}
            {[...Array(numBatches)].map((_, batchIdx) => {
                // Dla każdej grupy wycinamy produkty:
                // batch 0 → 0..11, batch 1 → 12..23, batch 2 → 24..35 itd.
                const batchItems = getBatchSlice(batchIdx);

                // Jeżeli żaden element w tym batche’u nie istnieje (np. ładowanie),
                // to dalej przechodzimy do skeleton loadera w pierwszym batchu.
                const isFirstBatch = batchIdx === 0;
                const shouldShowSkeleton =
                    loading && isFirstBatch && batchItems.length === 0;

                return (
                    <motion.div
                        key={`batch-${batchIdx}`}
                        className={`columns-1 md:columns-2 lg:columns-3 gap-5 ${
                            batchIdx > 0 ? "mt-6" : ""
                        }`}
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {shouldShowSkeleton
                                ? // Skeleton loader tylko w pierwszym batchu, gdy batchItems jeszcze puste
                                Array(itemsPerLoad)
                                    .fill(0)
                                    .map((_, idx) => (
                                        <motion.div
                                            key={`skeleton-${idx}`}
                                            className="break-inside-avoid mb-5"
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <div className="rounded-2xl p-4 animate-pulse">
                                                <div className="bg-gray-200 h-[250px] rounded mb-4" />
                                                <div className="h-4 bg-gray-200 rounded mb-2" />
                                                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
                                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                            </div>
                                        </motion.div>
                                    ))
                                : // Właściwe kafelki w tym batche’u
                                batchItems.map((product, idx) => {
                                    // Unikalny key: slug + numer batchu, żeby React nie mieszał
                                    // kafelków między różnymi kontenerami
                                    const key =
                                        batchIdx === 0
                                            ? product.slug.current
                                            : `${product.slug.current}-batch-${batchIdx}`;

                                    // Aby zachować unikalne custom w animacji, np. custom = batchIdx*itemsPerLoad + idx
                                    const animationIndex = batchIdx * itemsPerLoad + idx;

                                    return (
                                        <motion.div
                                            key={key}
                                            className="break-inside-avoid mb-5"
                                            variants={itemVariants}
                                            custom={animationIndex}
                                        >
                                            <ProductCard
                                                image={product.thumbnail ?? product.images[0]}
                                                title={product.name}
                                                price={product.price}
                                                artist={product.artistName}
                                                artistsLink={product.artistSlug}
                                                category={product.productCategory.title}
                                                categoryLink={
                                                    product.productCategory.slug.current
                                                }
                                                slug={product.slug.current}
                                                index={animationIndex}
                                            />
                                        </motion.div>
                                    );
                                })}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}
