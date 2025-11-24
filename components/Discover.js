import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import ArtistsList from "@/components/ArtistsList";
import ArtistCard from "@/components/ArtistCard";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";

export default function Discover({artworks, artist}) {
    return (
        <>
            <SectionHeader
                title={`Discover more from ${
                    artist.name
                }`}
                buttonText={"Check profile"}
                buttonLink={`/artists/${artist.slug}`}
            />


            <div className="flex gap-6 max-lg:w-full max-lg:flex-col">
                <div className={"w-1/4 max-lg:w-full"}>
                    <ArtistCard
                        avatar={artist.avatar}
                        artistLink={artist.slug}
                        artistName={artist.name}
                        location={artist.location}
                        description={artist.description}
                    />
                </div>

                {
                    artworks.length > 0 && (
                        <div
                            className="col-span-2 grid grid-cols-1 gap-5 lg:grid-cols-3 w-3/4 max-lg:w-full max-lg:max-w-[350px] max-lg:mx-auto">
                            {artworks.map((artwork, index) => (
                                <ProductCard
                                    key={artwork._id || `artwork-${artwork.slug}-${index}`}
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
                    )
                }

                {
                    artworks.length === 0 && (
                        <div className={"flex-grow flex flex-col gap-4 items-center justify-center text-center max-lg:min-h-[300px]"}>
                            <p className={"text-[12px] animate-pulse"}>
                                There is no more artworks from this artist.
                            </p>
                        </div>
                    )
                }

            </div>


        </>
    )
}