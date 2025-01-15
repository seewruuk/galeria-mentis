"use client";

import useSanity from "@/hooks/useSanity";
import {getArtist} from "@/sanity/getSanity/getArtist";
import {useEffect, useState} from "react";
import PageTransition from "@/components/PageTransition";
import Layout from "@/components/Layout";
import Banner from "@/components/Banner";
import Loading from "@/components/Loading";
import {PortableText} from "@portabletext/react";
import ProductCard from "@/components/ProductCard";
import {getArtistArtworks} from "@/sanity/getSanity/getArtistArtworks";
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";
import Image from "next/image";
import {motion} from "framer-motion";


export default function ArtistLayout({slug}) {
    const {data: artist, loading: artistLoading} = useSanity(getArtist, slug);
    const [artworks, setArtworks] = useState([]);
    const [filteredArtworks, setFilteredArtworks] = useState([]);
    const [artworksLoading, setArtworksLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [sortOption, setSortOption] = useState("newest");

    useEffect(() => {
        const fetchData = async () => {
            if (artist?._id) {
                setArtworksLoading(true);
                try {
                    const data = await getArtistArtworks(artist._id, null);
                    setArtworks(data);
                    setFilteredArtworks(data);
                } catch (err) {
                    console.error("Error fetching artworks:", err);
                } finally {
                    setArtworksLoading(false);
                }
            }
        };

        if (artist) {
            fetchData();
        }
    }, [artist]);

    useEffect(() => {
        if (artworks) {
            sortArtworks();
        }
    }, [sortOption, artworks]);

    const sortArtworks = () => {
        let sortedArtworks = [...artworks];
        if (sortOption === "newest") {
            sortedArtworks.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));
        } else if (sortOption === "oldest") {
            sortedArtworks.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));
        } else if (sortOption === "price-low-high") {
            sortedArtworks.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-high-low") {
            sortedArtworks.sort((a, b) => b.price - a.price);
        }
        setFilteredArtworks(sortedArtworks);
    };

    const paginatedArtworks = filteredArtworks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (artistLoading || artworksLoading) return <Loading/>;

    const ptComponents = {
        block: {
            normal: ({children}) => (
                <div>
                    <p>{children}</p>
                </div>
            ),
        },
    };

    return (
        <PageTransition>
            <Banner backgroundImage={artist?.bannerImage} hugeText="Artist">
                <motion.div
                    initial={{scale: 0}}
                    animate={{scale: 1}}
                    transition={{duration: 0.5, ease: [0.48, 0.15, 0.25, 0.96]}}
                    className={"h-[190px] w-[190px] rounded-full aspect-square border-[6px] border-primary mb-[32px] relative overflow-hidden"}>
                    <Image src={artist?.avatar} alt={`${artist?.name} avatar`} layout="fill" objectFit="cover"/>
                </motion.div>
                <h2 className={"text-[42px]"}>{artist?.name}</h2>
                <p className="text-primary text-[21px]">
                    {artist?.location?.city}, {artist?.location?.country}
                </p>
            </Banner>

            <Layout>


                <div className={"flex flex-col gap-[60px] py-[60px] text-[18px]"}>
                    {artist?.bio.map((item, index) => (
                        <div key={item + index} className={"flex gap-4 group max-lg:flex-col"}>
                            <h3 className={"w-1/4 text-primary max-lg:w-[100%]"}>{item.header}</h3>
                            <div
                                className={
                                    "max-lg:w-[100%] w-3/4 leading-[180%] text-gray group-hover:text-black transition-all"
                                }
                            >
                                <PortableText value={item.content} components={ptComponents}/>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className="flex items-center justify-between mb-[42px] max-lg:flex-col max-lg:text-center max-lg:gap-5 pt-[42px]"
                >
                    <div>
                        <h3 className="font-freightBig text-[21px] font-semibold">
                            Discover More {artist?.name} artworks
                        </h3>
                    </div>
                    <div>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="price-low-high">Price Low &gt; High</option>
                            <option value="price-high-low">Price High &gt; Low</option>
                        </select>
                    </div>
                </div>


                <div className="grid grid-cols-1 gap-5 max-lg:mx-auto md:grid-cols-2 lg:grid-cols-4">
                    {paginatedArtworks.map((item, index) => (
                        <ProductCard
                            key={item._id}
                            index={index}
                            title={item.name}
                            artist={item.artist.name}
                            artistsLink={item.artist.slug}
                            price={item.price}
                            category={item.productCategory.title}
                            categoryLink={item.productCategory.slug}
                            slug={item.slug}
                            image={item.images[0]}
                        />
                    ))}
                </div>

                <Pagination
                    totalItems={filteredArtworks.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </Layout>

            <Footer/>
        </PageTransition>
    );
}
