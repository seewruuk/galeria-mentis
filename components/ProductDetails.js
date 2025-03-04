"use client"

import { useState } from "react";
import { PortableText } from "@portabletext/react";
import { AnimatePresence, motion } from "framer-motion";

function isArrayEmpty(data) {
    return !data || !Array.isArray(data) || data.length === 0;
}

function isPortableTextEmpty(data) {
    return !data || !Array.isArray(data) || data.length === 0;
}

function ArtworkDetails({ productDetails }) {
    if (!productDetails || productDetails.length === 0) {
        return <p>No details available</p>;
    }

    return (
        <div className="grid grid-cols-2 gap-5 gap-x-12 max-md:grid-cols-1">
            {productDetails.map((item, index) => (
                <div
                    key={`${item.productDetailsName}-${index}`}
                    className="flex justify-between py-[8px] border-b border-primary-light items-center"
                >
                    <p className="text-primary">{item.productDetailsName}</p>
                    <p className="text-gray">{item.content}</p>
                </div>
            ))}
        </div>
    );
}

const ptComponents = {
    block: {
        normal: ({ children }) => <p className="py-[6px]">{children}</p>,
        h1: ({ children }) => <h3 className="text-primary py-[12px]">{children}</h3>
    }
};

function NeedToKnow({ data }) {
    if (isPortableTextEmpty(data)) {
        return <p>No content available</p>;
    }

    return (
        <div>
            <PortableText value={data} components={ptComponents} />
        </div>
    );
}

function ShippingReturns({ data }) {
    if (isPortableTextEmpty(data)) {
        return <p>No content available</p>;
    }

    return (
        <div>
            <PortableText value={data} components={ptComponents} />
        </div>
    );
}

function FAQ({ data }) {
    if (!data || data.length === 0) {
        return <p>No FAQ available</p>;
    }

    return (
        <div className="flex flex-col gap-5">
            {data.map((item, index) => (
                <div key={`${item.question}-${index}`}>
                    <h3 className="text-primary py-[12px]">
                        {index + 1}. {item.question}
                    </h3>
                    <p>{item.answer}</p>
                </div>
            ))}
        </div>
    );
}

export default function ProductDetails({ additionalInfo, productDetails }) {
    const [selectedTab, setSelectedTab] = useState(0);

    const tabsConfig = [];

    if (!isArrayEmpty(productDetails)) {
        tabsConfig.push({
            label: "Artwork Details",
            content: <ArtworkDetails productDetails={productDetails} />
        });
    }

    if (!isPortableTextEmpty(additionalInfo?.needToKnow)) {
        tabsConfig.push({
            label: "Need to Know",
            content: <NeedToKnow data={additionalInfo.needToKnow} />
        });
    }

    if (!isPortableTextEmpty(additionalInfo?.shippingAndReturns)) {
        tabsConfig.push({
            label: "Shipping & Returns",
            content: <ShippingReturns data={additionalInfo.shippingAndReturns} />
        });
    }

    if (!isArrayEmpty(additionalInfo?.faq)) {
        tabsConfig.push({
            label: "FAQ",
            content: <FAQ data={additionalInfo.faq} />
        });
    }

    if (tabsConfig.length === 0) {
        return (
            <section className="py-[64px]">
                <p>No content available.</p>
            </section>
        );
    }

    const displayTab = () => tabsConfig[selectedTab].content;

    return (
        <section className="py-[64px] flex flex-col gap-6 leading-[170%]">
            <div className="flex gap-12 border-b border-primary-light py-[24px] overflow-x-scroll max-lg:gap-4 max-lg:border-none">
                {tabsConfig.map((tab, index) => (
                    <div
                        key={tab.label}
                        onClick={() => setSelectedTab(index)}
                        className={`transition-all cursor-pointer ${
                            selectedTab === index
                                ? "text-primary max-lg:bg-primary max-lg:text-white"
                                : "text-gray"
                        } max-lg:min-w-[150px] max-lg:text-[12px] max-lg:bg-black/5 max-lg:text-center max-lg:py-[8px]`}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={tabsConfig[selectedTab].label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-h-[350px]"
                >
                    {displayTab()}
                </motion.div>
            </AnimatePresence>
        </section>
    );
}
