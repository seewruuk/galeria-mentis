import ArtistsLayout from "@/components/layouts/ArtistsLayout";
import {getArtistsSettings} from "@/sanity/getSanity/getArtistsSettings";
import {generateSEO} from "@/lib/generateSEO";

export default function Page(){
    return(
        <ArtistsLayout />
    )
}

export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const data = await getArtistsSettings();

    if (!data) return {
        title: "Artists - Galeria Mentis",
        description: "Meet our artists and discover their exceptional artworks at Galeria Mentis",
    };

    const pageUrl = `${baseUrl}/artists`;
    return generateSEO(data, pageUrl);
}