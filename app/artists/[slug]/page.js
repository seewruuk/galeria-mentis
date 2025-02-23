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
        title: data.seo?.metaTitle ? data.seo.metaTitle : "NO SEO TITLE",
        description: data.seo?.metaDescription ? data.seo.metaDescription : "NO SEO DESCRIPTION",
        keywords: data?.seo?.keywords ? data.seo.keywords.map((item) => item).join(", ") : "NO SEO KEYWORDS",
    };
}
