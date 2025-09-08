import PolicyComponent from "@/components/PolicyComponent";

export default function Page(){
    return(
        <PolicyComponent type={"faq"} />
    )
}

export async function generateMetadata() {

    return {
        title: "FAQ",
        description: "Find answers to frequently asked questions about our services, policies, and more.",
        keywords: ["FAQ", "Frequently Asked Questions", "Support"],
    };
}
