import {notFound} from "next/navigation";
import ArtistLayout from "@/components/layouts/ArtistLayout";
import StructuredData from "@/components/StructuredData";
import {getArtist} from "@/sanity/getSanity/getArtist";
import {getArtistArtworks} from "@/sanity/getSanity/getArtistArtworks";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";

export const revalidate = 60;

export default async function Page({params}) {
    const {slug} = await params;
    const artist = await getArtist(slug);

    if (!artist?._id) notFound();

    const artworks = await getArtistArtworks(artist._id, null).catch(() => []);
    const sorted = [...(artworks || [])].sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));

    return (
        <>
            <StructuredData data={artist} type="Person"/>
            <ArtistLayout artist={artist} artworks={sorted}/>
        </>
    )
}

export async function generateMetadata({params}) {
    const {slug} = await params;
    const data = await getArtist(slug);

    if (!data) return {
        title: "No artist found",
        description: "Unfortunately, the artist you are looking for does not exist.",
        robots: {index: false},
    };

    return generateSEO(data, `${SITE_URL}/artists/${slug}`);
}
