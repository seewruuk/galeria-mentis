import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO} from "@/lib/generateSEO";

export default function Page(){
    return(
        <PolicyComponent type={"faq"} />
    )
}

export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const data = await getPolicyByType('faq');

    if (!data) {
        return {
            title: "FAQ - Galeria Mentis",
            description: "Find answers to frequently asked questions about our services, policies, and more.",
        };
    }

    const pageUrl = `${baseUrl}/links/faq`;
    return generateSEO(data, pageUrl);
}
