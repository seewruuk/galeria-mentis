"use client";
import { Suspense, useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import useSanity from "@/hooks/useSanity";
import { getArtists } from "@/sanity/getSanity/getArtists";
import { getArtisticStyles } from "@/sanity/getSanity/getArtisticStyles";
import { getPaintingStyles } from "@/sanity/getSanity/getPaintingStyles";
import Pagination from "@/components/Pagination";
import ArtistFilters from "@/components/ArtistFilters";
import ArtistsList from "@/components/ArtistsList";

function ArtistsRootLayout() {
    const { data: artists, loading: loadingArtists } = useSanity(getArtists);
    const { data: artisticStyles, loading: loadingArtisticStyles } = useSanity(getArtisticStyles);
    const { data: paintingStyles, loading: loadingPaintingStyles } = useSanity(getPaintingStyles);

    const [mounted, setMounted] = useState(false);
    const [filteredArtists, setFilteredArtists] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedArtisticStyles, setSelectedArtisticStyles] = useState([]);
    const [selectedPaintingStyles, setSelectedPaintingStyles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        setMounted(true);
    }, []);

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
                artist.artisticStyle.some((style) => selectedArtisticStyles.includes(style.title))
            );
        }

        if (selectedPaintingStyles.length > 0) {
            filtered = filtered.filter((artist) =>
                artist.paintingStyle.some((style) => selectedPaintingStyles.includes(style.title))
            );
        }

        setFilteredArtists(filtered);
        setCurrentPage(1);
    };

    const paginatedArtists = filteredArtists.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loadingArtists || loadingArtisticStyles || loadingPaintingStyles || !mounted) return <Loading />;

    return (
        <>
            <Banner
                backgroundImage={
                    "https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                }
                hugeText={"Artists"}
            >
                <span>Every artist was first an amateur.</span>
                <span>Edgar Degas</span>
            </Banner>

            <Layout>
                <div className="flex gap-5 py-[64px] max-lg:flex-col">
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

                    <ArtistsList artists={paginatedArtists} />

                </div>

                <Pagination
                    totalItems={filteredArtists.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </Layout>
        </>
    );
}

export default function ArtistsLayout() {
    return (
        <Suspense fallback={<Loading />}>
            <ArtistsRootLayout />
        </Suspense>
    );
}
