import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";

export const revalidate = 60;

export default function Page(){
    return(
        <PolicyComponent type={"privacyPolicy"} />
    )
}

export async function generateMetadata() {
    const data = await getPolicyByType('privacyPolicy');

    if (!data) {
        return {
            title: "Privacy Policy - Galeria Mentis",
            description: "Read our Privacy Policy to understand how we collect, use, and protect your personal information.",
        };
    }

    const pageUrl = `${SITE_URL}/links/privacyPolicy`;
    return generateSEO(data, pageUrl);
}
