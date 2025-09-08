import PolicyComponent from "@/components/PolicyComponent";

export default function Page(){
    return(
        <PolicyComponent type={"cookies"} />
    )
}


export async function generateMetadata() {

    return {
        title: "Cookies Policy",
        description:  "Learn about our Cookies Policy to understand how we use cookies to enhance your experience on our website.",
        keywords:   ["Cookies Policy", "Privacy"],
    };
}
