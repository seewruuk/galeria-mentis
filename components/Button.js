import Link from "next/link";
import Image from "next/image";

export default function Button({type, style, title, onClick, disabled, scrolled}) {

    const buttonStyle = {
        primary : "block py-[15px] px-[35px] text-white bg-primary hover:bg-[#7B5844] transition-all text-white",
        white : "block py-[15px] px-[35px] border-2 border-black text-black hover:bg-black hover:text-white transition-all",
        black: "block py-[15px] px-[35px] border-2 border-white text-white hover:bg-white hover:text-black transition-all",
    }

    switch (type) {
        case "link":
            return (
                <Link
                    href={`${onClick}`}
                    className={`${buttonStyle[style]}`}
                >
                    {title}

                </Link>
            )
        case "button":
            return (
                <button
                    disabled={disabled}
                    onClick={onClick}
                    className={`${buttonStyle[style]}`}
                >
                    {title}
                </button>
            )

        case "buttonWhite":
            return (
                <button
                    disabled={disabled}
                    onClick={onClick}
                    className={`${buttonStyle[style]}`}
                >
                    {title}
                </button>
            )
    }
}