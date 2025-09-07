"use client";

import Link from "next/link";
import Button from "@/components/Button";
import { AnimatePresence, motion } from "framer-motion";
import {useEffect, useState} from "react";

const variants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
};

export default function Hero({ data }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);

    // Automatyczna zmiana slajdu co 10 sekund
    useEffect(() => {
        const timer = setInterval(() => {
            setSelectedIndex((prev) => (prev + 1) % data.length);
        }, 10000);
        return () => clearInterval(timer);
    }, [data.length]);

    if (!data || data.length === 0) return null;

    const handleDotClick = (index) => setSelectedIndex(index);
    const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
    const handleTouchEnd = (e) => {
        if (touchStartX !== null) {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (diff > 100) {
                setSelectedIndex((prev) => (prev + 1) % data.length);
            } else if (diff < -100) {
                setSelectedIndex((prev) => (prev - 1 + data.length) % data.length);
            }
        }
        setTouchStartX(null);
    };

    const currentSlide = data[selectedIndex];

    // --- ANCHOR SCROLL ---
    function scrollToAnchor(anchorHref, { smooth = true, offset = 0 } = {}) {
        if (typeof window === "undefined") return;
        if (!anchorHref) return;

        const id = anchorHref.startsWith('#') ? anchorHref.slice(1) : anchorHref;
        const el = document.getElementById(id);
        if (!el) return;

        const top = el.getBoundingClientRect().top + window.scrollY + (Number(offset) || 0);
        window.scrollTo({
            top,
            behavior: smooth ? "smooth" : "auto",
        });
    }

    // --- RENDER BUTTON ---
    const renderButton = () => {
        const btn = currentSlide?.button;
        if (!btn?.label || !btn?.mode) return null;

        // 1) ROUTE (wewnętrzna ścieżka) — Link jako JEDYNY <a>, Button jako <button>
        if (btn.mode === "route" && btn.routeHref) {
            return (
                <Link href={btn.routeHref} aria-label={btn.ariaLabel || btn.label}>
                    <Button title={btn.label} style="primary" type="button" />
                </Link>
            );
        }

        // 2) ANCHOR (kotwica na stronie) — brak <a>, zwykły <button> z onClick
        if (btn.mode === "anchor" && (btn.anchorHref || btn.anchorId)) {
            const anchorHref = btn.anchorHref || `#${btn.anchorId}`;
            return (
                <Button
                    title={btn.label}
                    style="primary"
                    type="button"
                    aria-label={btn.ariaLabel || btn.label}
                    onClick={() =>
                        scrollToAnchor(anchorHref, {
                            smooth: btn.smoothScroll !== false,
                            offset: Number(btn.scrollOffset || 0),
                        })
                    }
                />
            );
        }

        // 3) EXTERNAL (zewnętrzny URL) — <a> na zewnątrz, Button jako <button>
        if (btn.mode === "external" && btn.url) {
            return (
                <a
                    href={btn.url}
                    {...(btn.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={btn.ariaLabel || btn.label}
                >
                    <Button title={btn.label} style="primary" type="button" />
                </a>
            );
        }

        return null;
    };


    return (
        <div
            className="lg:min-h-[95dvh] h-[100%] min-h-screen w-screen relative isolate overflow-hidden text-white"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="absolute inset-0 bg-black -z-10" />

            {/* Tło */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedIndex}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.5}}
                    className="absolute w-full h-full -z-10"
                    style={{
                        backgroundImage: `url(${currentSlide.backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            </AnimatePresence>

            {/* Maska */}
            <div className="absolute inset-0 bg-black/70 z-0 " />

            {/* Zawartość */}
            <div className="absolute inset-0 z-20 max-lg:relative max-lg:h-screen">
                <div className="max-w-screen-xl px-10 mx-auto h-full flex flex-col ">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedIndex}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            variants={variants}
                            transition={{duration: 0.5}}
                            className="flex-grow flex flex-col justify-end max-lg:pb-[90px] pb-[20px] items-start max-lg:text-center max-lg:items-center mt-[50px]"
                        >
                            <h1 className="font-freightBig text-white max-w-[550px] leading-[120%]">
                                {currentSlide.title}
                            </h1>
                            <p className="mt-[16px] mb-[42px] max-w-[550px] leading-[170%]">
                                {currentSlide.text}
                            </p>

                            {renderButton()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Dolna sekcja: wskaźniki oraz indeks */}
                    <div className="py-[24px] flex items-center justify-between">
                        <div className="flex-1 max-lg:hidden">
                            <span></span>
                        </div>

                        <div className="flex gap-2 items-end justify-center flex-1">
                            {data.map((_, index) => (
                                <button
                                    key={index}
                                    className={`h-1 w-10 transition-all ${
                                        selectedIndex === index ? "bg-white h-2" : "bg-gray-500 opacity-50"
                                    }`}
                                    onClick={() => handleDotClick(index)}
                                />
                            ))}
                        </div>

                        <div className="text-[32px] flex-1 flex justify-end max-lg:hidden">
                            {String(selectedIndex + 1).padStart(2, "0")}/{String(data.length).padStart(2, "0")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
