import ProductCard from "@/components/ProductCard";

// Prace artysty przychodzą razem z danymi artysty z serwera (wcześniej osobne zapytanie z przeglądarki dla każdego artysty)
export default function ArtistArtworks({ artistId, artworks = [], limit = 3 }) {
    const visible = (artworks || []).slice(0, limit);

    return (
        <div className={`grid grid-cols-2 gap-6 max-w-[300px] mx-auto md:grid-cols-2 md:max-w-[650px] lg:max-w-none lg:grid-cols-${limit} `}>
            {visible.map((artwork, index) => (
                <ProductCard
                    key={`${artistId}-${artwork._id}-${index}`}
                    image={artwork.thumbnail ? artwork.thumbnail : artwork.images?.[0]}
                    title={artwork.name}
                    artist={artwork.artist?.name}
                    artistsLink={artwork.artist?.slug}
                    price={artwork.price}
                    slug={artwork.slug}
                    category={artwork.productCategory?.title}
                    categoryLink={artwork.productCategory?.slug}
                />
            ))}
        </div>
    );
}
