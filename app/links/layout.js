import Layout from "@/components/Layout";
import Footer from "@/components/Footer";

export default function layout({children}) {
    return (
        <>

            <div className={"pt-[250px]"}>
                <Layout>
                    {children}
                </Layout>
            </div>


            <Footer />
        </>

    )
}