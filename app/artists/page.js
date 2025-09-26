import ArtistsLayout from "@/components/layouts/ArtistsLayout";
import {getArtist} from "@/sanity/getSanity/getArtist";
import {getArtistsSettings} from "@/sanity/getSanity/getArtistsSettings";
import {generateSEO} from "@/lib/generateSEO";

export default function Page(){
    return(
        <ArtistsLayout />
    )
}

export async function generateMetadata({ params }) {

    const data = await getArtistsSettings();

    return generateSEO(data);
}