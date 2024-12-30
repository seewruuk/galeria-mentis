"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/assets/logo-white.svg";
import {links} from "@/components/Navbar";
import {useRouter} from "next/navigation";
// import { i18n } from "@/components/DesktopMenu";
// import { scrollToSection } from "@/lib/scrollToSection";

export const MobileMenu = () => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const router = useRouter();


    // Warianty animacji
    const hideNavItemsVariant = {
        opened: {
            opacity: 0,
            y: "-100%",
            transition: {
                duration: 0.5,
                ease: "easeInOut",
            },
        },
        closed: {
            opacity: 1,
            y: "0%",
            transition: {
                delay: 1.1,
                duration: 0.5,
                ease: "easeInOut",
            },
        },
    };

    const mobileMenuVariant = {
        opened: {
            y: "0%",
            transition: {
                delay: 0.15,
                duration: 1.1,
                ease: [0.74, 0, 0.19, 1.02],
            },
        },
        closed: {
            y: "-100%",
            transition: {
                delay: 0.15,
                duration: 0.63,
                ease: [0.74, 0, 0.19, 1.02],
            },
        },
    };

    const fadeInVariant = {
        opened: {
            opacity: 1,
            transition: {
                delay: 1.2,
            },
        },
        closed: {
            opacity: 0,
            transition: {
                duration: 0.3,
            },
        },
    };

    const ulVariant = {
        opened: {
            transition: {
                delayChildren: 1,
                staggerChildren: 0.18,
            },
        },
        closed: {
            transition: {
                staggerChildren: 0.06,
                staggerDirection: -1,
            },
        },
    };

    const liVariant = {
        opened: {
            opacity: 1,
            y: "0%",
            transition: {
                duration: 0.65,
                ease: "easeOut",
            },
        },
        closed: {
            opacity: 0,
            y: "100%",
            transition: {
                duration: 0.25,
                ease: "easeInOut",
            },
        },
    };

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


    return (
        <main className="fixed left-0 right-0 z-50">
            {/* Header Section */}
            <motion.nav
                initial="closed"
                animate={mobileNavOpen ? "opened" : "closed"}
                className="h-[80px] flex justify-between items-center px-8 bg-[#101214] text-white"
            >
                <div>
                    <Link href={"/"}>
                        <Image src={Logo} width={150} height={60} alt="Logo" />
                    </Link>
                </div>
                <motion.div
                    variants={hideNavItemsVariant}
                    onClick={() => handleMenuToggle(true)}
                    className="text-[13px] uppercase cursor-pointer"
                >
                    Menu
                </motion.div>
            </motion.nav>

            {/* Mobile Menu */}
            <motion.div
                variants={mobileMenuVariant}
                initial="closed"
                animate={mobileNavOpen ? "opened" : "closed"}
                exit="closed" // Dodano wariant dla chowania menu
                className="fixed inset-0 bg-[#101214] text-white flex flex-col"
            >
                <div className="w-full flex justify-between items-center px-8 h-[80px] bg-[#101214] text-[13px]">
                    <Link href={"/"}>
                        <Image src={Logo} width={150} height={60} alt="Logo" />
                    </Link>
                    <motion.button
                        variants={fadeInVariant}
                        onClick={() => handleMenuToggle(false)}
                        className="uppercase"
                    >
                        Close
                    </motion.button>
                </div>

                <motion.ul
                    variants={ulVariant}
                    initial="closed"
                    animate="opened"
                    exit="closed" // Dodano animację zamykania
                    className="flex flex-col items-center gap-6 mt-10 text-[28px]"
                >
                    {links.map((item, index) => {
                       if(item.links){
                           return(
                               <motion.li
                                      key={index}
                                      variants={liVariant}
                                      whileTap={{scale: 0.95}}
                                      className={"text-center"}
                               >
                                   <Link href={item.link}>
                                                <span
                                                    className={`hover:text-primary transition-all`}>{item.name}</span>
                                   </Link>

                                   <ul>
                                        {item.links.map((subLink, subIndex) => (
                                             <li key={subIndex}>
                                                  <Link
                                                      href={subLink.link}
                                                      onClick={(e) => {
                                                          e.preventDefault();
                                                          router.push(subLink.link);
                                                          handleMenuToggle(false);
                                                      }}

                                                  >
                                                    <span
                                                         className={
                                                              "text-[13px] font-[500] transition-all hover:text-primary text-center"
                                                         }
                                                    >
                                                         {subLink.name}
                                                    </span>
                                                  </Link>
                                             </li>
                                        ))}
                                   </ul>

                               </motion.li>
                           )
                       }
                        return (
                            <motion.li
                                key={index}
                                variants={liVariant}
                                whileTap={{scale: 0.95}}
                            >
                                <Link
                                    href={"#"}
                                    className="uppercase"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.push(item.link);
                                        handleMenuToggle(false);
                                    }}

                                >
                                    {item.name}
                                </Link>
                            </motion.li>
                        )
                    })}
                </motion.ul>

                <motion.div
                    variants={fadeInVariant}
                    className="mt-12 text-center text-[12px]"
                >
                    <h5>+48 123 123 123</h5>
                    <h5>kontakt@ozerecycling.pl</h5>
                </motion.div>
            </motion.div>
        </main>
    );
};
