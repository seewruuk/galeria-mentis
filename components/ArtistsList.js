import ProductCard from "@/components/ProductCard";
import ArtistCard from "@/components/ArtistCard";

export default function ArtistsList({ artists }) {
    return (
        <div className="w-3/4 flex flex-col gap-6 max-lg:w-full">
            {artists.map((artist) => (
                <div key={artist.slug} className="grid grid-cols-3 gap-5 items-start max-lg:grid-cols-1">
                    <ArtistCard
                        avatar={artist.avatar}
                        artistLink={artist.slug}
                        artistName={artist.name}
                        location={artist.location}
                        description={artist.description}
                    />
                    <div className="col-span-2 grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {artist.artworks.map((artwork, index) => (
                            <ProductCard
                                key={index}
                                image={artwork.images[0]}
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
                </div>
            ))}
        </div>
    );
}
