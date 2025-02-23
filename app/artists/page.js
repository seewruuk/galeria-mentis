import ArtistsLayout from "@/components/layouts/ArtistsLayout";
import {getArtist} from "@/sanity/getSanity/getArtist";

export default function Page(){
    return(
        <ArtistsLayout />
    )
}


export async function generateMetadata({ params }) {


    return {
        title: "Artists",
        description: "Artists",
    };
}