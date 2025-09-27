// /components/ProductsList.jsx
"use client";

import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

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
                                         allProducts,
                                         visibleCount,
                                         itemsPerLoad,
                                         sortOption,
                                         setSortOption,
                                         loading = false,
                                     }) {
    const maxVisible = Math.min(visibleCount, allProducts.length);
    const numBatches = Math.ceil(maxVisible / itemsPerLoad);

    const getBatchSlice = (batchIndex) => {
        const start = batchIndex * itemsPerLoad;
        const end = Math.min(start + itemsPerLoad, maxVisible);
        return allProducts.slice(start, end);
    };

    // Skeletony dla pierwszej partii podczas preloadu (ładny, spójny reveal)
    const firstBatchSkeletonCount = itemsPerLoad;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1"
                >
                    <option value="all">All products</option>
                    <option value="price-asc">Lowest to Highest Price</option>
                    <option value="price-desc">Highest to Lowest Price</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>

            {/* Pierwsze ładowanie (preload 1. partii): zamiast pustki pokaż skeletony */}
            {maxVisible === 0 && loading ? (
                <motion.div
                    className="columns-1 md:columns-2 lg:columns-3 gap-5"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {[...Array(firstBatchSkeletonCount)].map((_, idx) => (
                        <motion.div
                            key={`skeleton-init-${idx}`}
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
                    ))}
                </motion.div>
            ) : (
                [...Array(numBatches)].map((_, batchIdx) => {
                    const batchItems = getBatchSlice(batchIdx);

                    return (
                        <motion.div
                            key={`batch-${batchIdx}`}
                            className={`columns-1 md:columns-2 lg:columns-3 gap-5 ${batchIdx > 0 ? "mt-6" : ""}`}
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <AnimatePresence>
                                {batchItems.map((product, idx) => {
                                    const key =
                                        batchIdx === 0
                                            ? product.slug.current
                                            : `${product.slug.current}-batch-${batchIdx}`;
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
                                                categoryLink={product.productCategory.slug.current}
                                                slug={product.slug.current}
                                                index={animationIndex}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    );
                })
            )}
        </div>
    );
}
