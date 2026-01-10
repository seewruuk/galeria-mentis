import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Custom404() {
    return (
        <>
            <Layout>
                <div className="text-center min-h-[80dvh] grid place-items-center">
                    <div className="flex flex-col gap-4 items-center">
                        <h1 className="text-4xl font-bold">
                            Sorry, this page does not exist
                        </h1>
                        <p className="mt-4">
                            Unfortunately, the page you are looking for does not exist.
                        </p>
                        <Link href={"/"}>
                            <p className={"text-black hover:text-primary transition-all mt-[12px]"}>
                                Return to the homepage
                            </p>
                        </Link>
                    </div>
                </div>
            </Layout>

            <Footer showContactForm={false}/>

        </>
    )
}





export async function generateMetadata() {
    return {
        title: "Page Not Found | Galeria Mentis",
        description: "The page you are looking for does not exist.",
        robots: {
            index: false,
            follow: true,
        },
    };
}
