import HomeLayout from "@/components/layouts/HomeLayout";
import {getHomePage} from "@/sanity/getSanity/getHomePage";
import {generateSEO} from "@/lib/generateSEO";

export default function Page() {

    return (
        <HomeLayout/>
    );
}


export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const data = await getHomePage();

    if (!data) return {
        title: "Galeria Mentis - Contemporary Art",
        description: "Discover exceptional contemporary art at Galeria Mentis",
    }

    return generateSEO(data, baseUrl);
}