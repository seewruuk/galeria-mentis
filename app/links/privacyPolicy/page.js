import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO} from "@/lib/generateSEO";

export default function Page(){
    return(
        <PolicyComponent type={"privacyPolicy"} />
    )
}

export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const data = await getPolicyByType('privacyPolicy');

    if (!data) {
        return {
            title: "Privacy Policy - Galeria Mentis",
            description: "Read our Privacy Policy to understand how we collect, use, and protect your personal information.",
        };
    }

    const pageUrl = `${baseUrl}/links/privacyPolicy`;
    return generateSEO(data, pageUrl);
}
