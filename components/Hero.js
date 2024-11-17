"use client";
import {useEffect, useState} from "react";
import Button from "@/components/Button";
import {AnimatePresence, motion} from "framer-motion";

export default function Hero({data}) {
    const [mounted, setMounted] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    const [pages, setPages] = useState(data ? data.length : 0);


    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setSelectedIndex((prevIndex) => (prevIndex + 1) % pages);
    //     }, 10000);
    //     return () => clearInterval(timer);
    // }, [selectedIndex, pages]);


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !data) return null;

    const handleDotClick = (index) => {
        setSelectedIndex(index);
    };

    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (touchStartX !== null) {
            const touchEndX = e.changedTouches[0].clientX;
            const touchDifference = touchStartX - touchEndX;

            if (touchDifference > 100) {
                setSelectedIndex((prevIndex) => (prevIndex + 1) % pages);
            } else if (touchDifference < -100) {
                setSelectedIndex((prevIndex) => (prevIndex - 1 + pages) % pages);
            }
        }
        setTouchStartX(null);
    };


    const variants = {
        enter: {opacity: 0, x: 100},
        center: {opacity: 1, x: 0},
        exit: {opacity: 0, x: -100},
    };

    const {
        backgroundImage
    } = data[selectedIndex];

    return (
        <>
            <div
                className={"min-h-[95dvh] w-screen relative isolate overflow-hidden text-white"}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Tło */}
                <AnimatePresence>
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        key={selectedIndex}
                        className={"absolute w-full h-full -z-10"}
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                </AnimatePresence>
                {/* Maska */}
                <div className={"absolute w-full h-full bg-[#000]/70 z-0"}/>

                {/* Content */}
                <div
                    className={
                        "absolute top-0 left-0 w-full h-full z-20 bottom-0 right-0"
                    }
                >
                    <div className={"max-w-screen-xl px-10 mx-auto h-full flex flex-col "}>
                        <motion.div
                            key={selectedIndex}
                            className={"flex-grow flex flex-col justify-center items-start max-lg:text-center max-lg:items-center mt-[50px]"}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            variants={variants}
                            transition={{duration: 0.5}}
                        >
                            <h1
                                className={"font-freightBig text-white max-w-[550px] leading-[120%]"}
                            >
                                {data[selectedIndex]?.title}
                            </h1>
                            <p className={"mt-[16px] mb-[42px] max-w-[550px] leading-[170%]"}>
                                {data[selectedIndex]?.text}
                            </p>

                            {data[selectedIndex]?.button && (
                                <Button
                                    title={data[selectedIndex].button.label}
                                    onClick={data[selectedIndex]?.button.link}
                                    style={"primary"}
                                    type={"link"}
                                />
                            )}
                        </motion.div>

                        {/* Dolna sekcja (autor, wskaźniki, indeks) */}
                        <div className={"py-[24px] flex items-center justify-between "}>
                            {/* Artysta */}
                            <div className={"flex-1 max-lg:hidden"}>
                                {/*<span className="font-bold">{data[selectedIndex]?.artist || "John Doe"}</span>*/}
                                {/*{" | "}*/}
                                {/*<span>{data[selectedIndex]?.subtitle || "Out of touch"}</span>*/}
                                <span>Lorem ipsum</span>
                            </div>

                            {/* Wskaźniki */}
                            <div className="flex gap-2 items-end justify-center transition-all flex-1">
                                {data.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`h-1 w-10 transition-all ${
                                            selectedIndex === index
                                                ? "bg-white h-2"
                                                : "bg-gray-500 opacity-50"
                                        }`}
                                        onClick={() => handleDotClick(index)}
                                    />
                                ))}
                            </div>

                            {/* Indeks */}
                            <div className={"text-[32px] flex-1 flex justify-end max-lg:hidden"}>
                                {String(selectedIndex + 1).padStart(2, "0")}/
                                {String(data.length).padStart(2, "0")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
