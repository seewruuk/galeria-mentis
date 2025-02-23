"use client"


import {useState} from "react";
import Layout from "@/components/Layout";
import {PortableText} from "@portabletext/react";
import {AnimatePresence, motion} from "framer-motion";


const initial = {
    opacity: 0,
}

const animate = {
    opacity: 1,
}
const exit = {
    opacity: 0,

}


const ArtworkDetails = ({productDetails}) => {
    return (
        <motion.div className={"grid grid-cols-2 gap-5 gap-x-12 max-md:grid-cols-1"}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    key={"Artwork Details"}
        >
            {
                productDetails ? productDetails.map((item, index) => {
                    return (
                        <div
                            key={item + index}
                            className={"flex justify-between py-[8px] border-b border-primary-light items-center"}
                        >
                            <p className={"text-primary"}>
                                {item.productDetailsName}
                            </p>
                            <p className={"text-gray"}>
                                {item.content}
                            </p>
                        </div>
                    )
                }) : <p>No details available</p>
            }

        </motion.div>
    )
}

const NeedToKnow = ({data}) => {

    const ptComponents = {
        block: {
            normal: ({children}) => (

                <p className={""}>{children}</p>

            ),
            h1: ({children}) => (
                <h3 className={"text-primary py-[12px]"}>{children}</h3>
            ),
        },
    };

    return (
        <motion.div className={""}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    key={"Need to Know"}
        >
            <PortableText value={data} components={ptComponents}/>
        </motion.div>
    )
}

const ShippingReturns = ({data}) => {


    const ptComponents = {
        block: {
            normal: ({children}) => (

                <p className={"py-[12px]"}>{children}</p>

            ),
            h1: ({children}) => (
                <h3 className={"text-primary py-[12px]"}>{children}</h3>
            ),
        },
    };

    return (
        <motion.div className={""}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    key={"Shipping & Returns"}
        >
            <PortableText value={data} components={ptComponents}/>
        </motion.div>
    )
}

const FAQ = ({data}) => {


    if (data.length === 0) return (
        <motion.div>
            <p>No FAQ available</p>
        </motion.div>
    )


    return (
        <motion.div className={"flex flex-col gap-5"}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    key={"FAQ"}
        >
            {
                data.map((item, index) => {
                    return (
                        <div
                            key={item + index}
                            className={""}
                        >
                            <h3 className={"text-primary py-[12px]"}>{index + 1}. {item.question}</h3>
                            <p className={""}>{item.answer}</p>

                        </div>
                    )
                })
            }
        </motion.div>
    )
}


export default function ProductDetails({additionalInfo, productDetails}) {
    const [selectedTab, setSelectedTab] = useState(0)
    const displayTab = () => {
        switch (selectedTab) {
            case 0 :
                return <ArtworkDetails productDetails={productDetails}/>
            case 1 :
                return <NeedToKnow data={additionalInfo.needToKnow}/>
            case 2 :
                return <ShippingReturns data={additionalInfo.shippingAndReturns}/>
            case 3 :
                return <FAQ data={additionalInfo.faq}/>
            default:
                return <ArtworkDetails/>
        }
    }

    const tabs = ["Artwork Details", "Need to Know", "Shipping & Returns", "FAQ"]

    return (
        <section className={"py-[64px] flex flex-col gap-6 leading-[170%]"}>
            <div
                className={"flex gap-12 border-b border-primary-light py-[24px] overflow-x-scroll max-lg:gap-4 max-lg:border-none"}>
                {
                    tabs.map((tab, index) => (
                        <div
                            key={tab + index}
                            onClick={() => setSelectedTab(index)}
                            className={`transition-all cursor-pointer ${selectedTab === index ? 'text-primary max-lg:bg-primary max-lg:text-white' : 'text-gray'} max-lg:min-w-[150px] max-lg:text-[12px] max-lg:bg-black/5 max-lg:text-center max-lg:py-[8px]`}
                        >
                            {tab}
                        </div>
                    ))
                }
            </div>

            <AnimatePresence>
                <div className={"min-h-[350px]"}>
                    {
                        displayTab()
                    }
                </div>

            </AnimatePresence>

            {/*<div>*/}
            {/*        <pre>*/}
            {/*            {JSON.stringify(additionalInfo.shippingAndReturns, null, 2)}*/}
            {/*        </pre>*/}
            {/*</div>*/}
        </section>
    )
}