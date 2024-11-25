"use client"


import {useState} from "react";
import Layout from "@/components/Layout";

const ArtworkDetails = ({productDetails}) => {
    return (
        <div className={"grid grid-cols-2 gap-5 gap-x-12 max-md:grid-cols-1"}>
            {
                productDetails.map((item, index) => {
                    return (
                        <div
                            key={item + index}
                            className={"flex justify-between py-[8px] border-b border-primary-light items-center"}
                        >
                            <p className={"text-primary"}>
                                {item.productDetails.name}
                            </p>
                            <p className={"text-gray"}>
                                {item.content}
                            </p>
                        </div>
                    )
                })
            }

        </div>
    )
}

const NeedToKnow = () => {
    return (
        <div>
            <>NeedToKnow</>
        </div>
    )
}

const ShippingReturns = () => {
    return (
        <div>
            <>ShippingReturns</>
        </div>
    )
}

const FAQ = () => {
    return (
        <div>
            <>FAQ</>
        </div>
    )
}


export default function ProductDetails({additionalInfo, productDetails}) {
    const [selectedTab, setSelectedTab] = useState(0)
    const displayTab = () => {
        switch (selectedTab) {
            case 0 :
                return <ArtworkDetails productDetails={productDetails}/>
            case 1 :
                return <NeedToKnow/>
            case 2 :
                return <ShippingReturns/>
            case 3 :
                return <FAQ/>
            default:
                return <ArtworkDetails/>
        }
    }

    const tabs = ["Artwork Details", "Need to Know", "Shipping & Returns", "FAQ"]

    return (
        <section className={"py-[64px] flex flex-col gap-6"}>
            <div className={"flex gap-12 border-b border-primary-light py-[24px] overflow-x-scroll max-lg:gap-4 max-lg:border-none"}>
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

            <div>
                {
                    displayTab()
                }
            </div>

            {/*<div>*/}
            {/*        <pre>*/}
            {/*            {JSON.stringify(productDetails, null, 2)}*/}
            {/*        </pre>*/}
            {/*</div>*/}
        </section>
    )
}