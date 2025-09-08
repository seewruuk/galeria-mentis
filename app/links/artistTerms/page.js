import PolicyComponent from "@/components/PolicyComponent";

export default function Page(){
    return(
        <PolicyComponent type={"artistTerms"} />
    )
}

export async function generateMetadata() {

    return {
        title: "Artist Terms",
        description: "Read the Artist Terms to understand the rights and responsibilities of artists working with us.",
        keywords:  ["Artist Terms", "Terms of Service", "Artist Agreement"],
    };
}
