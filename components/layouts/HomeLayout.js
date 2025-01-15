"use client"
import Hero from "@/components/Hero";
import useSanity from "@/hooks/useSanity";
import {getHomePage} from "@/sanity/getSanity/getHomePage";
import {useEffect, useState} from "react";
import Loading from "@/components/Loading";
import Layout from "@/components/Layout";
import SectionHeader from "@/components/SectionHeader";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import ArtistCard from "@/components/ArtistCard";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

export default function HomeLayout() {

    const [mounted, setMounted] = useState(false);
    const {data: homePageData, loading} = useSanity(getHomePage);

    useEffect(() => {
        setMounted(true);
    }, []);


    if (loading || !mounted || !homePageData) return <Loading/>

    return (
        <PageTransition>
            {
                homePageData && (
                    <Hero data={homePageData.heroSection}/>
                )
            }

            <Layout>
                {
                    homePageData?.featuredProducts && (
                        <section className={"py-[64px]"}>
                            <SectionHeader
                                title={"Discover the latest works"}
                                buttonText={"Show all"}
                                buttonLink={"/products"}

                            />
                            <div
                                className={"grid grid-cols-1 gap-6 max-w-[300px] mx-auto md:grid-cols-2 md:max-w-[650px] lg:max-w-none lg:grid-cols-4"}>
                                {
                                    homePageData.featuredProducts.map((item, index) => (
                                        <ProductCard
                                            key={index}
                                            image={item.images[0]}
                                            title={item.name}
                                            category={item.productCategory.title}
                                            artist={item.artist.name}
                                            artistsLink={item.artist.slug}
                                            price={item.price}
                                            slug={item.slug}

                                        />
                                    ))
                                }
                            </div>

                        </section>
                    )
                }
            </Layout>


            {
                homePageData?.highlightedArtists && (
                    <Layout>
                        <section className={"py-[64px]"}>
                            <SectionHeader
                                title={"Discover our artists"}
                                buttonText={"Show all"}
                                buttonLink={"/artists"}

                            />

                            <div className={"flex flex-col gap-5"}>

                                {
                                    homePageData.highlightedArtists.map((item, index) => {
                                        return (
                                            <div className={"flex gap-6 max-lg:flex-col"} key={item + index}>
                                                <div className={"w-1/4 max-lg:w-full"}>
                                                    <ArtistCard
                                                        artistLink={item.artist.slug}
                                                        avatar={item.artist.avatar}
                                                        artistName={item.artist.name}
                                                        location={item.artist.location}
                                                    />
                                                </div>
                                                <div className={"flex-grow"}>
                                                    <div
                                                        className={"grid grid-cols-1 gap-6 max-w-[300px] mx-auto md:grid-cols-2 md:max-w-[650px] lg:max-w-none lg:grid-cols-3"}>
                                                        {
                                                            item.works.map((work, index) => {
                                                                return (
                                                                    <ProductCard
                                                                        key={index}
                                                                        image={work.images[0]}
                                                                        title={work.name}
                                                                        category={work.productCategory.title}
                                                                        artist={work.artist.name}
                                                                        price={work.price}
                                                                        slug={work.slug}
                                                                        artistsLink={work.artist.slug}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>


                        </section>
                    </Layout>
                )
            }

            {
                homePageData.benefitsSection && (
                    <section
                        className={"w-screen relative isolate text-white min-h-[300px] max-lg:min-h-[650px]"}
                    >
                        {/* Tło */}
                        <div
                            className={"absolute w-full h-full -z-10"}
                            style={{
                                backgroundImage: `url(${homePageData?.benefitsSection_backgroundImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />

                        {/* Maska */}
                        <div className={"absolute w-full h-full bg-[#000]/90 z-0"}/>

                        {/* Content */}
                        <div
                            className={
                                "absolute top-0 left-0 w-full h-full z-20 bottom-0 right-0"
                            }
                        >
                            <div className={"max-w-screen-xl mx-auto px-10 max-lg:px-4 h-full grid place-items-center"}>


                                <div className={"flex justify-between gap-6 max-lg:flex-col"}>
                                    {
                                        homePageData.benefitsSection.map((item, index) => {
                                            return (
                                                <div key={item + index}
                                                     className={"flex-1 flex items-center flex-col text-center text-[16px] gap-[32px]"}
                                                >
                                                    {/*Icon*/}
                                                    <div>
                                                        <Image src={item.icon} alt={"asd"} width={50} height={50}/>
                                                    </div>

                                                    {/*Content*/}
                                                    <div className={"flex flex-col gap-[15px]"}>
                                                        <h4>{item.title}</h4>
                                                        <p className={"text-gray-dark text-balance"}>{item.text}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>


                        </div>
                    </section>
                )
            }

            <Footer/>


        </PageTransition>
    )
}