// components/ProductsList.jsx
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

const listVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.3 } },
    exit:    { opacity: 0, y: -20, transition: { ease: "easeIn", duration: 0.2 } },
};

export default function ProductsList({ products, sortOption, setSortOption }) {
    return (
        <div className="w-full">
            {/* Sorting Dropdown */}
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

            {/* Animated Products Grid */}
            <motion.div
                className="grid grid-cols-3 gap-5 max-lg:grid-cols-1"
                variants={listVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {products.map((product, idx) => (
                        <motion.div
                            key={product.slug.current}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
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
