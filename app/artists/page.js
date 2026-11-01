import ArtistsLayout from "@/components/layouts/ArtistsLayout";
import {getArtistsSettings} from "@/sanity/getSanity/getArtistsSettings";
import {getArtists} from "@/sanity/getSanity/getArtists";
import {getArtisticStyles} from "@/sanity/getSanity/getArtisticStyles";
import {getPaintingStyles} from "@/sanity/getSanity/getPaintingStyles";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";

export const revalidate = 60;

export default async function Page() {
    const [artists, artisticStyles, paintingStyles] = await Promise.all([
        getArtists(),
        getArtisticStyles(),
        getPaintingStyles(),
    ]);

    return (
        <ArtistsLayout
            artists={artists || []}
            artisticStyles={artisticStyles || []}
            paintingStyles={paintingStyles || []}
        />
    )
}

export async function generateMetadata() {
    const data = await getArtistsSettings();

    if (!data) return {
        title: "Artists - Galeria Mentis",
        description: "Meet our artists and discover their exceptional artworks at Galeria Mentis",
    };

    return generateSEO(data, `${SITE_URL}/artists`);
}
