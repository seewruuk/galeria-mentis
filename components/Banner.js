import Layout from "@/components/Layout";

export default function Banner({ backgroundImage, hugeText, customStyle, children }) {
    return (
        <div className="min-h-[600px] w-screen relative isolate overflow-hidden text-white max-lg:text-center">
            {/* Tło */}
            <div
                className="absolute w-full h-full -z-10"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            {/* Maska */}
            <div className="absolute w-full h-full bg-[#000]/70 z-0" />

            {/* Content */}
            <div className="absolute top-0 left-0 w-full h-full z-20 bottom-0 right-0">
                <Layout>
                    <div className={"h-full flex justify-end flex-col items-center pb-[64px]"}>
                        {children}
                    </div>
                    {/* Tekst z ograniczoną szerokością */}
                    <span className="font-freightBig block absolute -bottom-[120px] right-0 text-[256px] text-ellipsis opacity-10">
                        {hugeText}
                    </span>
                </Layout>
            </div>
        </div>
    );
}
