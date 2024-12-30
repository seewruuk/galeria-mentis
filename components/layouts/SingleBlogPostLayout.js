"use client";
import PageTransition from "@/components/PageTransition";
import useSanity from "@/hooks/useSanity";
import { getSingleBlogPost } from "@/sanity/getSanity/getSingleBlogPost";
import { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export default function SingleBlogPostLayout({ slug }) {
    const { data, error } = useSanity(getSingleBlogPost, slug);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const ptComponents = {
        block: {
            normal: ({ children }) => (
                <div className="text-container">
                    <p className={"text-[18px] leading-9"}>{children}</p>
                </div>
            ),
            h1: ({ children }) => (
                <h3 className={"font-semibold text-[21px] py-[25px]"}>{children}</h3>
            ),
        },
        types: {
            image: ({ value }) => (
                <div className="">
                    <Image
                        src={urlFor(value.asset._ref).url()}
                        alt="Sanity image"
                        width={500}
                        height={500}
                        className="h-[600px] object-cover"
                    />
                </div>
            ),
        },
    };

    if (!mounted) {
        return null;
    }

    return (
        <PageTransition>
            <Banner backgroundImage={data.mainImage}
                    hugeText={"Blog"}>
                <h2 className={"text-[42px]"}>{data.title}</h2>
                <p className={"max-w-[650px] text-[21px] mt-[24px]"}>{data.description}</p>
            </Banner>

            <Layout>
                <section className={"pt-[120px] flex flex-col gap-[64px] items-center"}>
                    <PortableText
                        value={data.body}
                        components={ptComponents}
                    />
                </section>

                <pre>{JSON.stringify(data.body, null, 2)}</pre>
            </Layout>


        </PageTransition>
    );
}
