import Image from "next/image";
import {useEffect} from "react";
import {motion} from "framer-motion";
import {AiOutlineFullscreenExit} from "react-icons/ai";

export default function FullScreenImages({images, selectedIndex = 0, setOpenGallery, openGallery}) {


    useEffect(() => {

        const handleEscape = (e) => {
            if(e.key === "Escape"){
                setOpenGallery({
                    ...openGallery,
                    status: false,
                })
            }
        }
        window.addEventListener("keydown", handleEscape)

        return () => {
            window.removeEventListener("keydown", handleEscape);
        }

    }, [openGallery, setOpenGallery])


    return (
        <motion.div
            key={"fullscreenimagecontainer"}
            className="fixed top-0 left-0 bottom-0 right-0 w-screen h-screen z-50 backdrop-blur-md"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >


            <div
                className="w-full h-full border-white relative max-w-screen-2xl mx-auto px-20 flex flex-col py-[32px] gap-8 max-lg:px-4 isolate">

                <div className={"text-white flex justify-end"}>
                    <button
                        className={"bg-white/20 aspect-square grid place-items-center p-3 hover:bg-primary transition-all"}
                        onClick={() => setOpenGallery({
                            ...openGallery,
                            status: false,
                        })}
                        aria-label={"Close gallery"}
                    >
                        <AiOutlineFullscreenExit  size={24}/>
                    </button>
                </div>

                <div className="w-full flex-grow flex items-center justify-center pointer-events-none">
                    <div className="relative w-full max-w-full h-[70vh]">
                        <Image
                            alt={`gallery-${selectedIndex}`}
                            src={images[selectedIndex]}
                            fill
                            className="object-contain mx-auto rounded-2xl"
                        />
                    </div>
                </div>

                <div className="h-[100px] flex items-center justify-center gap-4 overflow-x-auto">
                    {images.map((item, index) => (
                        <div key={index} className="relative w-[130px] h-full flex-shrink-0">
                            <Image
                                alt={`gallery-${index}`}
                                src={item}
                                fill
                                className={`object-cover ${index === selectedIndex ? "opacity-100 border border-white" : "opacity-40 border border-black"} hover:cursor-pointer transition-all hover:opacity-100 hover:scale-[0.98]`}
                                onClick={() => setOpenGallery({
                                    status: true,
                                    images: images,
                                    selectedIndex: index
                                })}
                            />
                        </div>
                    ))}
                </div>

                <div className={"bg-[#000]/90 w-full h-full top-0 left-0 right-0 bottom-0 fixed -z-50"} onClick={
                    () => setOpenGallery({...openGallery, status: false})
                }/>
            </div>
        </motion.div>
    );
}
