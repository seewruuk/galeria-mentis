import PolicyComponent from "@/components/PolicyComponent";

export default function Page(){
    return(
        <PolicyComponent type={"cookiesConsent"} />
    )
}

export async function generateMetadata() {

    return {
        title: "Cookies Consent",
        description:   "Understand our Cookies Consent policy and how we manage your preferences regarding cookies on our website.",
        keywords:    ["Cookies Consent", "Privacy"],
    };
}
