import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO} from "@/lib/generateSEO";

export default function Page(){
    return(
        <PolicyComponent type={"artistTerms"} />
    )
}

export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const data = await getPolicyByType('artistTerms');

    if (!data) {
        return {
            title: "Artist Terms - Galeria Mentis",
            description: "Read the Artist Terms to understand the rights and responsibilities of artists working with us.",
        };
    }

    const pageUrl = `${baseUrl}/links/artistTerms`;
    return generateSEO(data, pageUrl);
}
