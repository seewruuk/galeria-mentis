import ProductCard from "@/components/ProductCard";

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

            {/* Products Grid */}
            <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
                {products.map((product) => (
                    <ProductCard
                        key={product.slug.current}
                        image={product.images[0]}
                        title={product.name}
                        price={product.price}
                        artist={product.artistName}
                        artistsLink={product.artistSlug}
                        category={product.productCategory.title}
                        slug={product.slug.current}
                    />
                ))}
            </div>
        </div>
    );
}
