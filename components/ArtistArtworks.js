"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { getArtistArtworks } from "@/sanity/getSanity/getArtistArtworks";

export default function ArtistArtworks({ artistId, limit = 3, excludeProdId = "" }) {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchArtworks() {
            const fetchedArtworks = await getArtistArtworks(artistId, excludeProdId);
            // Pobieramy tylko określoną liczbę prac (limit)
            setArtworks(fetchedArtworks.slice(0, limit));
            setLoading(false);
        }
        fetchArtworks();
    }, [artistId, limit, excludeProdId]);

    if (loading) return <div>Loading artworks...</div>;

    return (
        <div className={`grid grid-cols-1 gap-6 max-w-[300px] mx-auto md:grid-cols-2 md:max-w-[650px] lg:max-w-none lg:grid-cols-${limit} `}>
            {artworks.map((artwork) => (
                <ProductCard
                    key={artwork._id}
                    image={artwork.thumbnail ? artwork.thumbnail : artwork.images[0]}
                    title={artwork.name}
                    artist={artwork.artist.name}
                    artistsLink={artwork.artist.slug}
                    price={artwork.price}
                    slug={artwork.slug}
                    category={artwork.productCategory.title}
                    categoryLink={artwork.productCategory.slug}
                />
            ))}
        </div>
    );
}
