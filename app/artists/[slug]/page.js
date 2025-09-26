import ArtistLayout from "@/components/layouts/ArtistLayout";
import {getArtist} from "@/sanity/getSanity/getArtist";
import {generateSEO} from "@/lib/generateSEO";

export default function Page({params}){
    return(
        <ArtistLayout slug={params.slug} />
    )
}



export async function generateMetadata({ params }) {
    const data = await getArtist(params.slug);

    if (!data) return {
        title: "No artist found",
        description: "Unfortunately, the artist you are looking for does not exist."
    };

    return generateSEO(data);

}
