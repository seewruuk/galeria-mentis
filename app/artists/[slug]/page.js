import ArtistLayout from "@/components/layouts/ArtistLayout";
import {getArtist} from "@/sanity/getSanity/getArtist";

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

    return {
        title: data.seo !== null && data.seo.metaTitle ? data.seo.metaTitle : "NO TITLE",
        description:  data.seo !== null && data.seo.metaDescription ? data.seo.metaDescription : "NO DESCRIPTION",
        keywords: data.seo !== null && data.seo.keywords ? data?.seo?.keywords.map((item) => item).join(", ") : "NO KEYWORDS",
    };
}
