import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";

export const revalidate = 60;

export default function Page(){
    return(
        <PolicyComponent type={"termsConditions"} />
    )
}

export async function generateMetadata() {
    const data = await getPolicyByType('termsConditions');

    if (!data) {
        return {
            title: "Terms & Conditions - Galeria Mentis",
            description: "Read our Terms & Conditions to understand the rules and regulations for using our website and services.",
        };
    }

    const pageUrl = `${SITE_URL}/links/termsConditions`;
    return generateSEO(data, pageUrl);
}