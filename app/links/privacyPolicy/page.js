import PolicyComponent from "@/components/PolicyComponent";

export default function Page(){
    return(
        <PolicyComponent type={"privacyPolicy"} />
    )
}

export async function generateMetadata() {

    return {
        title: "Privacy Policy",
        description: "Read our Privacy Policy to understand how we collect, use, and protect your personal information.",
        keywords: ["Privacy Policy", "Data Protection", "Your Company Name", "User Privacy"],
    };
}
