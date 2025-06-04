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
import ArtistArtworks from "@/components/ArtistArtworks";
import ArtistsList from "@/components/ArtistsList";
import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import ContactForm from "@/components/ContactForm";

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
                                buttonLink={"/categories/all"}

                            />
                            <FeaturedProductsCarousel
                                products={homePageData.featuredProducts}
                                // opcjonalnie:
                                // prevButtonClassName="your-custom-classes"
                                // nextButtonClassName="your-custom-classes"
                                // PrevIcon={YourPrevIconComponent}
                                // NextIcon={YourNextIconComponent}
                            />

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


                                <ArtistsList artists={homePageData.highlightedArtists} artworksLimit={3}/>



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