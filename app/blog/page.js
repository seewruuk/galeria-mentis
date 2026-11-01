import BlogLayout from "@/components/layouts/BlogLayout";
import {getBlogSettings} from "@/sanity/getSanity/getBlogSettings";
import {getBlogPosts} from "@/sanity/getSanity/getBlogPosts";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";

export const revalidate = 60;

export default async function Page() {
    const posts = await getBlogPosts();

    return (
        <BlogLayout posts={posts || []}/>
    )
}


export async function generateMetadata() {
    const data = await getBlogSettings();

    if (!data) return {
        title: "Blog - Galeria Mentis",
        description: "Discover the latest articles about contemporary art at Galeria Mentis",
    };

    return generateSEO(data, `${SITE_URL}/blog`);
}
