import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";

export const revalidate = 60;

export default function Page(){
    return(
        <PolicyComponent type={"artistTerms"} />
    )
}

export async function generateMetadata() {
    const data = await getPolicyByType('artistTerms');

    if (!data) {
        return {
            title: "Artist Terms - Galeria Mentis",
            description: "Read the Artist Terms to understand the rights and responsibilities of artists working with us.",
        };
    }

    const pageUrl = `${SITE_URL}/links/artistTerms`;
    return generateSEO(data, pageUrl);
}
