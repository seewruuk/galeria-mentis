"use client";
import {useContext, useEffect, useState} from "react";
import {usePathname} from "next/navigation"; // Hook do ścieżki
import {DisplayContext} from "@/context/DisplayContext";
import Layout from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import {CartContext} from "@/context/CartContext";

const links = [
    {name: "Home", link: '/'},
    {
        name: "Art works",
        link: "/artworks",
        links: [
            {name: "Paints", link: '/artwork?type=paints'},
            {name: "Paintings", link: '/artwork?type=paintings'},
            {name: "Sculptures", link: '/artwork?type=sculptures'},
            {name: "Drawings", link: '/artwork?type=drawings'},
            {name: "Photography", link: '/artwork?type=photography'},
        ],
    },
    {name: "Artists", link: '/artists'},
    {name: "Blog", link: '/blog'},
    {name: "Contact", link: '/contact'},
];

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const {displayVersion} = useContext(DisplayContext);
    const {totalQty} = useContext(CartContext);
    const pathname = usePathname();


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    switch (displayVersion) {
        case "desktop":
            return <DesktopMenu pathname={pathname} totalQty={totalQty}/>;
        case "mobile":
            return <MobileMenu/>;
        default:
            return null;
    }
}

const DesktopMenu = ({ pathname, totalQty }) => {
    const blackNavbarPages = ["/", '/artists']; // Podstrony z białym
    const isBlackTheme = blackNavbarPages.includes(pathname);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "https://galeria-mentis.vercel.app";

    const logoSrc = isBlackTheme
        ? `${baseUrl}/assets/logo-white.svg`
        : `${baseUrl}/assets/logo-black.svg`;

    const navbarStyle = isBlackTheme ? "text-white" : "text-black";

    const [activeMenu, setActiveMenu] = useState(null); // Trzymanie aktywnego menu
    const [timeoutId, setTimeoutId] = useState(null); // Trzymanie ID timeoutu
    const [scrolled, setScrolled] = useState(false); // Stan określający, czy przewinięto stronę

    // Funkcja obsługująca zmianę stanu na podstawie scrolla
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Czyszczenie nasłuchiwacza podczas odmontowywania komponentu
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleMouseEnter = (index) => {
        if (timeoutId) clearTimeout(timeoutId); // Anulowanie timeoutu
        setActiveMenu(index);
    };

    const handleMouseLeave = () => {
        const id = setTimeout(() => {
            setActiveMenu(null); // Ukrywanie menu z opóźnieniem
        }, 200); // 200ms opóźnienia
        setTimeoutId(id);
    };

    return (
        <div
            className={`fixed w-screen z-50 transition-colors duration-300 ${
                scrolled ? "bg-black/90 backdrop-blur-md" : "bg-transparent"
            }`}
        >
            <Layout>
                <div
                    className={`navbar ${
                        scrolled ? "text-white" : navbarStyle
                    } py-[32px] flex justify-between items-center text-[15px]`}
                >
                    <div>
                        <Link href={"/"}>
                            <Image
                                src={
                                scrolled ? `${process.env.NEXT_PUBLIC_BASE_URL}/assets/logo-white.svg` : logoSrc
                                }
                                alt={"Galeria Mentis Logo"}
                                width={220}
                                height={50}
                            />
                        </Link>
                    </div>
                    <div className={"flex items-center gap-[24px]"}>
                        <ul className={`flex gap-8 ${scrolled ? "text-white" : navbarStyle}`}>
                            {links.map((link, index) => {
                                if (link.links) {
                                    return (
                                        <li
                                            key={index}
                                            className="relative cursor-pointer"
                                            onMouseEnter={() => handleMouseEnter(index)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <Link href={link.link}>
                                                <span className={`hover:text-primary transition-all ${scrolled ? "text-white" : navbarStyle}`}>{link.name}</span>
                                            </Link>

                                            <ul
                                                className={`absolute top-10 left-0 bg-white p-6 w-72 shadow-lg transition-all flex flex-col gap-2 ${
                                                    activeMenu === index ? "block" : "hidden"
                                                }`}
                                            >
                                                {link.links.map((subLink, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link href={subLink.link}>
                                                            <span
                                                                className={
                                                                    "text-[16px] font-[500] text-black transition-all hover:text-primary"
                                                                }
                                                            >
                                                                {subLink.name}
                                                            </span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    );
                                }
                                return (
                                    <li key={index}>
                                        <Link href={link.link}>
                                            <span
                                                className={
                                                    `font-[500] transition-all hover:text-primary ${
                                                        scrolled ? "text-white" : navbarStyle
                                                    }`
                                                }
                                            >
                                                {link.name}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        <Button
                            type={"link"}
                            title={"Whishlist"}
                            onClick={"/whishlist"}
                            style={
                            scrolled ? "black" : isBlackTheme ? "black" : "white"
                            }
                        />

                        <Button
                            type={"link"}
                            title={`Your cart (${totalQty})`}
                            onClick={"/cart"}
                            style={"primary"}
                        />
                    </div>
                </div>
            </Layout>
        </div>
    );
};


const MobileMenu = () => {
    return <div>Mobile Menu</div>;
};
