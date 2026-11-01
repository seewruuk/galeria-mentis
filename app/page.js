import HomeLayout from "@/components/layouts/HomeLayout";
import {getHomePage} from "@/sanity/getSanity/getHomePage";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";

export const revalidate = 60;

export default async function Page() {
    const homePageData = await getHomePage();

    return (
        <HomeLayout homePageData={homePageData}/>
    );
}


export async function generateMetadata() {
    const data = await getHomePage();

    if (!data) return {
        title: "Galeria Mentis - Contemporary Art",
        description: "Discover exceptional contemporary art at Galeria Mentis",
    }

    return generateSEO(data, SITE_URL);
}
