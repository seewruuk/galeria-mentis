import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO} from "@/lib/generateSEO";

export default function Page(){
    return(
        <PolicyComponent type={"cookiesConsent"} />
    )
}

export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const data = await getPolicyByType('cookiesConsent');

    if (!data) {
        return {
            title: "Cookies Consent - Galeria Mentis",
            description: "Understand our Cookies Consent policy and how we manage your preferences regarding cookies on our website.",
        };
    }

    const pageUrl = `${baseUrl}/links/cookiesConsent`;
    return generateSEO(data, pageUrl);
}
