import BlogLayout from "@/components/layouts/BlogLayout";

export default function Page(){
    return(
        <BlogLayout />
    )
}


export async function generateMetadata({ params }) {


    return {
        title: "Blog",
        description: "Blog",
    };
}