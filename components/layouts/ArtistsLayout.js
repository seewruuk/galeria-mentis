"use client";
import {Suspense, useEffect, useState} from "react";
import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import useSanity from "@/hooks/useSanity";
import {getArtists} from "@/sanity/getSanity/getArtists";
import {getArtisticStyles} from "@/sanity/getSanity/getArtisticStyles";
import {getPaintingStyles} from "@/sanity/getSanity/getPaintingStyles";
import Pagination from "@/components/Pagination";
import ArtistFilters from "@/components/ArtistFilters";
import ArtistsList from "@/components/ArtistsList";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import {getArtistsSettings} from "@/sanity/getSanity/getArtistsSettings";
import {PortableText} from "@portabletext/react";
import {PortableComponents} from "@/lib/PortableComponents";
import {AnimatePresence, motion} from "framer-motion";

function ArtistsRootLayout() {
    const {data: artists, loading: loadingArtists} = useSanity(getArtists);
    const {data: artisticStyles, loading: loadingArtisticStyles} = useSanity(getArtisticStyles);
    const {data: paintingStyles, loading: loadingPaintingStyles} = useSanity(getPaintingStyles);
    const {data: artistsPageSettings, loading: loadingArtistsPageSettings} = useSanity(getArtistsSettings)

    const [mounted, setMounted] = useState(false);
    const [filteredArtists, setFilteredArtists] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedArtisticStyles, setSelectedArtisticStyles] = useState([]);
    const [selectedPaintingStyles, setSelectedPaintingStyles] = useState([]);

    const itemsPerLoad = 12;
    const [visibleCount, setVisibleCount] = useState(itemsPerLoad);
    const [isLoadingMore, setIsLoadingMore] = useState(false);


    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setVisibleCount(itemsPerLoad);
    }, [filteredArtists]);


    useEffect(() => {
        if (isLoadingMore) {
            setIsLoadingMore(false);
        }
    }, [isLoadingMore, visibleCount]);

    useEffect(() => {
        if (artists) {
            filterArtists();
        }
    }, [artists, searchQuery, selectedArtisticStyles, selectedPaintingStyles]);

    const filterArtists = () => {
        let filtered = artists;

        if (searchQuery) {
            filtered = filtered.filter((artist) =>
                artist.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedArtisticStyles.length > 0) {
            filtered = filtered.filter((artist) =>
                artist?.artisticStyle?.some((style) => selectedArtisticStyles.includes(style.title))
            );
        }

        if (selectedPaintingStyles.length > 0) {
            filtered = filtered.filter((artist) =>
                artist?.paintingStyle?.some((style) => selectedPaintingStyles.includes(style.title))
            );
        }

        setFilteredArtists(filtered);
    };


    if (loadingArtists || loadingArtisticStyles || loadingPaintingStyles || !mounted) return <Loading/>;

    return (
        <PageTransition>
            {/*<Banner*/}
            {/*    backgroundImage={*/}
            {/*        artistsPageSettings.image*/}
            {/*    }*/}
            {/*    hugeText={"Artists"}*/}
            {/*    showBdImage={false}*/}
            {/*>*/}
            {/*    <PortableText value={artistsPageSettings?.header} components={PortableComponents}/>*/}
            {/*</Banner>*/}

            <Layout>
                <div className="flex gap-5 py-[64px] max-lg:flex-col pt-[150px]">
                    <ArtistFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        artisticStyles={artisticStyles}
                        selectedArtisticStyles={selectedArtisticStyles}
                        setSelectedArtisticStyles={setSelectedArtisticStyles}
                        paintingStyles={paintingStyles}
                        selectedPaintingStyles={selectedPaintingStyles}
                        setSelectedPaintingStyles={setSelectedPaintingStyles}
                    />

                    <AnimatePresence>

                        <motion.div
                            key="artists-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={" w-full"}

                        >
                            <ArtistsList artists={filteredArtists.slice(0,visibleCount)} artworksLimit={2}/>

                            <div className="flex justify-center mt-8">
                                {isLoadingMore ? (
                                    <Loading type="small" />
                                ) : (
                                    visibleCount < filteredArtists.length && (
                                        <button
                                            onClick={() => {
                                                setIsLoadingMore(true);
                                                setVisibleCount((prev) =>
                                                    Math.min(prev + itemsPerLoad, filteredArtists.length)
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

                    </AnimatePresence>

                </div>


            </Layout>

            <Footer/>
        </PageTransition>
    );
}

export default function ArtistsLayout() {
    return (
        <Suspense fallback={<Loading type={"full"}/>}>
            <ArtistsRootLayout/>
        </Suspense>
    );
}
