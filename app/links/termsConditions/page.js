import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO} from "@/lib/generateSEO";

export default function Page(){
    return(
        <PolicyComponent type={"termsConditions"} />
    )
}

export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const data = await getPolicyByType('termsConditions');

    if (!data) {
        return {
            title: "Terms & Conditions - Galeria Mentis",
            description: "Read our Terms & Conditions to understand the rules and regulations for using our website and services.",
        };
    }

    const pageUrl = `${baseUrl}/links/termsConditions`;
    return generateSEO(data, pageUrl);
}