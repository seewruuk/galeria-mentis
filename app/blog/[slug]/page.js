import SingleBlogPostLayout from "@/components/layouts/SingleBlogPostLayout";
import {getSingleBlogPost} from "@/sanity/getSanity/getSingleBlogPost";
import {generateSEO} from "@/lib/generateSEO";

export default async function Page({params}){

    const slug = await params.slug;

    return(
        <SingleBlogPostLayout slug={slug}/>
    )
}



export async function generateMetadata({ params }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const slug = await params.slug;
    const data = await getSingleBlogPost(slug);

    if (!data) return {
        title: "Blog post not found",
        description: "Unfortunately, the blog post you are looking for does not exist."
    };

    const pageUrl = `${baseUrl}/blog/${slug}`;
    return generateSEO(data, pageUrl);

}
