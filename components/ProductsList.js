import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

// Animacje i warianty framer-motion
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
                                         products,
                                         sortOption,
                                         setSortOption,
                                         loading = false,
                                         itemsPerLoad = 12,
                                     }) {
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

            {/* Siatka produktów lub skeleton loader */}
            <motion.div
                className="grid grid-cols-3 gap-5 max-lg:grid-cols-1"
                variants={listVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {loading
                        ? Array(itemsPerLoad)
                            .fill(0)
                            .map((_, idx) => (
                                <motion.div
                                    key={`skeleton-${idx}`}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    layout
                                >
                                    <div className="rounded-2xl p-4 animate-pulse">
                                        {/* Obraz */}
                                        <div className="bg-gray-200 h-[420px] rounded mb-4" />
                                        {/* Tytuł */}
                                        <div className="h-4 bg-gray-200 rounded mb-2" />
                                        {/* Podtytuł */}
                                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
                                        {/* Cena */}
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    </div>
                                </motion.div>
                            ))
                        : products.map((product, idx) => (
                            <motion.div
                                key={product.slug.current}
                                variants={itemVariants}
                                // initial="hidden"
                                // animate="visible"
                                // exit="exit"
                                // layout
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
                                    index={idx}
                                />
                            </motion.div>
                        ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}