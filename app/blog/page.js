import BlogLayout from "@/components/layouts/BlogLayout";
import {getBlogSettings} from "@/sanity/getSanity/getBlogSettings";
import {generateSEO} from "@/lib/generateSEO";

export default function Page(){
    return(
        <BlogLayout />
    )
}


export async function generateMetadata() {

    const data = await getBlogSettings();

    return generateSEO(data);

}

