import ArtistsLayout from "@/components/layouts/ArtistsLayout";
import {getArtist} from "@/sanity/getSanity/getArtist";
import {getArtistsSettings} from "@/sanity/getSanity/getArtistsSettings";

export default function Page(){
    return(
        <ArtistsLayout />
    )
}


export async function generateMetadata({ params }) {

    const data = await getArtistsSettings();

    return {
        title: data.seo && data.seo.metaTitle ? data.seo.metaTitle : "NO TITLE",
        description: data.seo && data.seo.metaDescription ? data.seo.metaDescription : "NO DESCRIPTION",
        keywords: data.seo && data.seo.keywords ? data?.seo?.keywords.map((item) => item).join(", ") : "NO KEYWORDS",
    };
}