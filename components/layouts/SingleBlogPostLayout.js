"use client";
import PageTransition from "@/components/PageTransition";
import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Footer from "@/components/Footer";

export default function SingleBlogPostLayout({ data }) {
    const ptComponents = {
        block: {
            normal: ({ children }) => (
                <div className="text-container">
                    <p className={"text-[18px] leading-9"}>{children}</p>
                </div>
            ),
            h1: ({ children }) => (
                <h3 className={"font-semibold text-[24px]"}>{children}</h3>
            ),
        },
        types: {
            image: ({ value }) => (
                <div className="grid place-items-center my-8">
                    value?.asset?._ref ? <Image
                        src={urlFor(value.asset._ref, {
                            width: 1300,
                            height: 1300,
                            quality: 85,
                            format: 'webp',
                            fit: 'max'
                        }).url()}
                        alt={value.alt || "Blog post image"}
                        width={650}
                        height={650}
                        sizes="(max-width: 768px) 100vw, 650px"
                        className="max-w-[650px] h-auto object-contain"
                        loading="lazy"
                    /> : null
                </div>
            ),
        },
    };

    if (!data) {
        return null;
    }

    return (
        <PageTransition>
            <Banner backgroundImage={data.mainImage}
                    hugeText={"Blog"}>
                <h2 className={"text-[32px]"}>{data.title}</h2>
                <p className={"max-w-[650px] text-[16px] mt-[24px] text-balance text-center"}>{data.description}</p>
            </Banner>

            <Layout>
                <section className={"pt-[120px] flex flex-col gap-[56px]"}>
                    <PortableText
                        value={data.body}
                        components={ptComponents}
                    />
                </section>

            </Layout>

            <Footer />
        </PageTransition>
    );
}
