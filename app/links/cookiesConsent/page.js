import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";

export const revalidate = 60;

export default function Page(){
    return(
        <PolicyComponent type={"cookiesConsent"} />
    )
}

export async function generateMetadata() {
    const data = await getPolicyByType('cookiesConsent');

    if (!data) {
        return {
            title: "Cookies Consent - Galeria Mentis",
            description: "Understand our Cookies Consent policy and how we manage your preferences regarding cookies on our website.",
        };
    }

    const pageUrl = `${SITE_URL}/links/cookiesConsent`;
    return generateSEO(data, pageUrl);
}
