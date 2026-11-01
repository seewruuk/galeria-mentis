import {notFound} from "next/navigation";
import SingleBlogPostLayout from "@/components/layouts/SingleBlogPostLayout";
import StructuredData from "@/components/StructuredData";
import {getSingleBlogPost} from "@/sanity/getSanity/getSingleBlogPost";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";

export const revalidate = 60;

export default async function Page({params}) {
    const {slug} = await params;
    const data = await getSingleBlogPost(slug);

    if (!data) notFound();

    return (
        <>
            <StructuredData data={data} type="Article"/>
            <SingleBlogPostLayout data={data}/>
        </>
    )
}

export async function generateMetadata({params}) {
    const {slug} = await params;
    const data = await getSingleBlogPost(slug);

    if (!data) return {
        title: "Blog post not found",
        description: "Unfortunately, the blog post you are looking for does not exist.",
        robots: {index: false},
    };

    return generateSEO(data, `${SITE_URL}/blog/${slug}`);
}
