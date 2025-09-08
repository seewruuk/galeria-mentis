import PolicyComponent from "@/components/PolicyComponent";

export default function Page(){
    return(
        <PolicyComponent type={"termsConditions"} />
    )
}

export async function generateMetadata() {
    return {
        title: "Terms & Conditions",
        description: "Read our Terms & Conditions to understand the rules and regulations for using our website and services.",
        keywords: ["Terms & Conditions", "Terms of Service", "User Agreement"],
    }
}