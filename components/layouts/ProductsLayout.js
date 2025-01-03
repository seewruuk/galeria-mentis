"use client";

import useSanity from "@/hooks/useSanity";
import {getProductsByCategory} from "@/sanity/getSanity/getProductsByCategory";
import {getProductCategory} from "@/sanity/getSanity/getProductCategory";
import {getProductOptions} from "@/sanity/getSanity/getProductOptions";
import {Suspense, useEffect, useState} from "react";
import Loading from "@/components/Loading";
import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import ProductFilters from "@/components/ProductFilters";
import ProductsList from "@/components/ProductsList";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import Image from "next/image";
import {urlFor} from "@/sanity/lib/image";
import {PortableText} from "@portabletext/react";

function ProductsRootLayout({category}) {
    const {data: products, loading: loadingProducts} = useSanity(getProductsByCategory, category);
    const {data: categoryDetails, loading: loadingCategoryDetails} = useSanity(getProductCategory, category);
    const {data: productOptions, loading: loadingProductOptions} = useSanity(getProductOptions);

    const [mounted, setMounted] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({});
    const [sortOption, setSortOption] = useState("newest");
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState(10000);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const ptComponents = {
        block: {
            normal: ({children}) => (

                <p className={"mt-[12px] uppercase tracking-[1px]"}>{children}</p>

            ),
            h1: ({children}) => (
                <h3 className={"leading-[170%] text-[32px]"}>{children}</h3>
            ),
        },
    };

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

    useEffect(() => {
        if (products) {
            filterAndSortProducts();
        }
    }, [filters, searchQuery, sortOption, priceRange]);

    const filterAndSortProducts = () => {
        if (!products) return;

        let filtered = [...products];

        // Apply search query filter
        if (searchQuery) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply dynamic filters
        for (const filterName in filters) {
            const filterValues = filters[filterName];
            if (filterValues.length > 0) {
                filtered = filtered.filter((product) =>
                    product.options.some(
                        (option) =>
                            option.optionType.name === filterName &&
                            filterValues.includes(option.value)
                    )
                );
            }
        }

        filtered = filtered.filter((product) => product.price <= priceRange);

        if (sortOption === "price-asc") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortOption === "newest") {
            filtered.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));
        } else if (sortOption === "oldest") {
            filtered.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));
        }

        setFilteredProducts(filtered);
    };

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loadingProducts || loadingCategoryDetails || loadingProductOptions || !mounted) {
        return <Loading/>;
    }

    return (
        <PageTransition>
            <Banner
                backgroundImage={categoryDetails?.image}
                hugeText={categoryDetails?.title}
            >
                <PortableText value={categoryDetails?.header} components={ptComponents}/>
            </Banner>

            <Layout>
                <div className="flex gap-5 py-[64px] max-lg:flex-col">
                    {/* Filters */}
                    <ProductFilters
                        productOptions={productOptions}
                        filters={filters}
                        setFilters={setFilters}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                    />

                    {/* Products List */}
                    <div className="w-3/4 max-lg:w-full">
                        {paginatedProducts.length > 0 ? (
                            <>
                                <ProductsList
                                    products={paginatedProducts}
                                    sortOption={sortOption}
                                    setSortOption={setSortOption}
                                />
                                {/* Pagination */}

                                <Pagination
                                    totalItems={filteredProducts.length}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                />

                            </>
                        ) : (
                            <p>No products found.</p>
                        )}


                    </div>
                </div>

            </Layout>


            <Footer/>
        </PageTransition>
    );
}

export default function ProductsLayout({category}) {
    return (
        <Suspense fallback={<Loading/>}>
            <ProductsRootLayout category={category}/>
        </Suspense>
    );
}
