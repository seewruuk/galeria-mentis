"use client"
import React, {useState} from "react";
import {motion} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/assets/logo-white.svg";
import {links} from "@/components/Navbar";
import {useRouter} from "next/navigation";
import ArrowDown from "@/public/assets/arrow-down.svg"

export const MobileMenu = () => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({});
    const router = useRouter();

    const toggleBodyScroll = (isOpen) => {
        if (isOpen) {
            document.documentElement.classList.add("mobile-nav-open");
        } else {
            document.documentElement.classList.remove("mobile-nav-open");
        }
    };

    const handleMenuToggle = (isOpen) => {
        setMobileNavOpen(isOpen);
        toggleBodyScroll(isOpen);
    };

    const toggleExpand = (idx) => {
        setExpandedMenus(prev => ({...prev, [idx]: !prev[idx]}));
    };

    // --- Animacje Framera ---
    const hideNavItemsVariant = {
        opened: {opacity: 0, y: "-100%", transition: {duration: 0.5, ease: "easeInOut"}},
        closed: {opacity: 1, y: "0%", transition: {delay: 1.1, duration: 0.5, ease: "easeInOut"}},
    };
    const mobileMenuVariant = {
        opened: {y: "0%", transition: {delay: 0.15, duration: 1.1, ease: [0.74, 0, 0.19, 1.02]}},
        closed: {y: "-100%", transition: {delay: 0.15, duration: 0.63, ease: [0.74, 0, 0.19, 1.02]}},
    };
    const fadeInVariant = {
        opened: {opacity: 1, transition: {delay: 1.2}}, closed: {opacity: 0, transition: {duration: 0.3}},
    };
    const ulVariant = {
        opened: {transition: {delayChildren: 0.1, staggerChildren: 0.1}},
        closed: {transition: {staggerChildren: 0.06, staggerDirection: -1}},
    };
    const liVariant = {
        opened: {opacity: 1, y: "0%", transition: {duration: 0.65, ease: "easeOut"}},
        closed: {opacity: 0, y: "100%", transition: {duration: 0.25, ease: "easeInOut"}},
    };
    // --------------------------

    return (<main className="fixed inset-x-0 top-0 z-50">
            {/* HEADER */}
            <motion.nav
                initial="closed"
                animate={mobileNavOpen ? "opened" : "closed"}
                className="h-[80px] flex justify-between items-center px-8 bg-[#101214] text-white"
            >
                <Link href="/">
                    <Image src={Logo} width={150} height={60} alt="Logo"/>
                </Link>
                <motion.button
                    variants={hideNavItemsVariant}
                    onClick={() => handleMenuToggle(true)}
                    className="uppercase text-[13px]"
                >
                    Menu
                </motion.button>
            </motion.nav>

            {/* MOBILE MENU */}
            <motion.div
                variants={mobileMenuVariant}
                initial="closed"
                animate={mobileNavOpen ? "opened" : "closed"}
                exit="closed"
                className="fixed inset-0 bg-[#101214] text-white flex flex-col overflow-y-auto"
            >
                {/* Logo + Close */}
                <div className="flex-shrink-0 w-full flex justify-between items-center px-8 h-[80px] bg-[#101214]">
                    <Link href="/">
                        <Image src={Logo} width={150} height={60} alt="Logo"/>
                    </Link>
                    <motion.button
                        variants={fadeInVariant}
                        onClick={() => handleMenuToggle(false)}
                        className="uppercase text-[13px]"
                    >
                        Close
                    </motion.button>
                </div>

                {/* Główne linki */}
                <motion.ul
                    variants={ulVariant}
                    initial="closed"
                    animate="opened"
                    exit="closed"
                    className="flex-1 overflow-y-auto flex flex-col items-center gap-6 mt-10 px-4"
                >
                    {links.map((item, idx) => (<motion.li
                            key={idx}
                            variants={liVariant}
                            className="w-full text-center"
                            whileTap={{scale: 0.95}}
                        >
                            {item.links ? (<>
                                    {/* Kategoria z submenu */}
                                    <button
                                        onClick={() => toggleExpand(idx)}
                                        className="w-full flex justify-center items-center gap-4 text-[28px]"
                                    >
                                        {item.name}
                                        <div
                                            className={`inline-block relative transition-transform aspect-square h-[14px] ${expandedMenus[idx] ? "rotate-180" : ""}`}
                                        >
                                            <Image src={ArrowDown} alt="Arrow Down" fill className="object-contain"/>

                                        </div>
                                    </button>

                                    {/* Submenu */}
                                    {expandedMenus[idx] && (<motion.ul
                                            variants={ulVariant}
                                            initial="closed"
                                            animate="opened"
                                            exit="closed"
                                            className="mt-4 flex flex-col items-center gap-4"
                                        >
                                            {item.links.map((sub, sidx) => (<motion.li
                                                    key={sidx}
                                                    variants={liVariant}
                                                    className="text-[20px]"
                                                    whileTap={{scale: 0.95}}
                                                >
                                                    <Link href={sub.link} onClick={() => handleMenuToggle(false)}>
                            <span className="hover:text-primary transition-all">
                              {sub.name}
                            </span>
                                                    </Link>
                                                </motion.li>))}
                                        </motion.ul>)}
                                </>) : (// Prosty link
                                <Link href={item.link} onClick={() => handleMenuToggle(false)}>
                  <span className="text-[28px] hover:text-primary transition-all">
                    {item.name}
                  </span>
                                </Link>)}
                        </motion.li>))}
                </motion.ul>

                {/* Stopka */}
                {/*<div className="flex-shrink-0 mt-12 text-center text-[12px] pb-8">*/}
                {/*    <h5>+48 123 123 123</h5>*/}
                {/*    <h5>contact@ozerecycling.pl</h5>*/}
                {/*</div>*/}
            </motion.div>
        </main>);
};
