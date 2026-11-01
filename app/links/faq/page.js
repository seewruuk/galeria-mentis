import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";

export const revalidate = 60;

export default function Page(){
    return(
        <PolicyComponent type={"faq"} />
    )
}

export async function generateMetadata() {
    const data = await getPolicyByType('faq');

    if (!data) {
        return {
            title: "FAQ - Galeria Mentis",
            description: "Find answers to frequently asked questions about our services, policies, and more.",
        };
    }

    const pageUrl = `${SITE_URL}/links/faq`;
    return generateSEO(data, pageUrl);
}
