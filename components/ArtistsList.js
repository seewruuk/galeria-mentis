"use client"
import ArtistCard from "@/components/ArtistCard";
import ArtistArtworks from "@/components/ArtistArtworks";

export default function ArtistsList({ artists, artworksLimit = 3 }) {
    return (
        <div className="flex flex-col gap-6 w-full">
            {artists.map((artist) => (
                <div key={artist.slug} className="flex gap-5 max-lg:flex-col max-lg:items-center">
                    <ArtistCard
                        avatar={artist.avatar}
                        artistLink={artist.slug}
                        artistName={artist.name}
                        location={artist.location}
                        description={artist.description}
                    />
                    <div className="lg:flex-grow w-full">
                        <ArtistArtworks artistId={artist._id} limit={artworksLimit} />
                    </div>
                </div>
            ))}

        </div>
    );
}
