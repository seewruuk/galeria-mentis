"use client"
import useSanity from "@/hooks/useSanity";
import {getBlogPosts} from "@/sanity/getSanity/getBlogPosts";
import {useEffect, useState} from "react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import Layout from "@/components/Layout";

export default function BlogLayout() {

    const [mounted, setMounted] = useState(false)
    const {data: posts, loading, error} = useSanity(getBlogPosts);

    useEffect(() => {
        setMounted(true)
    }, [])


    if (!mounted) return null;

    return (
        <PageTransition>
            <Layout>
                <div className="bg-white py-[250px] max-lg:py-[150px]">
                    <div className="">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-balance text-4xl font-semibold tracking-tight text-black sm:text-5xl">
                                From the blog
                            </h2>
                            <p className="mt-2 text-lg/8 text-gray">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                                labore et dolore magna aliqua.
                            </p>
                        </div>
                        <div
                            className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                            {posts.map((post) => (
                                <article
                                    key={post._id}
                                    className="relative isolate flex flex-col justify-end overflow-hidden  bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80 border-2 border-white hover:border-primary transition-all"
                                >
                                    <img alt={`${post.title} Thumbnail`} src={post.mainImage}
                                         className="absolute inset-0 -z-10 size-full object-cover"/>
                                    <div
                                        className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/40"/>
                                    <div
                                        className="absolute inset-0 -z-10  ring-1 ring-inset ring-gray-900/10"/>

                                    <div
                                        className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300">
                                        <time dateTime={post.datetime} className="mr-8">
                                            {new Date(post._createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </time>
                                    </div>
                                    <h3 className="mt-3 text-lg/6 font-semibold text-white">
                                        <Link
                                            href={`/blog/${post.slug}`}

                                        >
                                            <span className="absolute inset-0"/>
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className={"text-white/70 mt-[16px]"}>{post.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>

        </PageTransition>

    )
}