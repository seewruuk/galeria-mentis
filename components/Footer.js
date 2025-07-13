"use client"
import Layout from "@/components/Layout";
import {icons} from "@/constans/icons";
import Link from "next/link";
import Image from "next/image";
import {links} from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import {useState} from "react";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import toast from "react-hot-toast";
import {validateEmail} from "@/lib/validateEmail";
import {saveToNewsletter} from "@/lib/saveToNewsletter";


export default function Footer() {

    const [userEmail, setUserEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const style = "bg-[#131313] aspect-square rounded-md w-10 h-10 grid place-items-center transition-all hover:bg-primary";
    const style2 = "w-5 h-5 relative"
    const footerLinkStyle = "text-[#666666] hover:text-white transition-all"


    const footerLinks = [
        {header: "Menu", links: links},
        {
            header: "Company", links: [
                {name: "Terms", link: "/"},
                {name: "Privacy Policy", link: "/"},
            ]
        },
        {
            header: "Menu", links: [
                {name: process.env.NEXT_PUBLIC_COMPANY_PHONE, link: `tel:${process.env.NEXT_PUBLIC_COMPANY_PHONE}`},
                {name: process.env.NEXT_PUBLIC_COMPANY_EMAIL, link: `mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL}`},
            ]
        },
    ]

    const handleNewsletterSubmit = async () => {
        setIsSending(true);
        if (!userEmail.trim()) {
            toast.error("Enter your email address");
            setIsSending(false);
            return;
        }
        if(validateEmail(userEmail) === null) {
            toast.error("Please enter a valid email address.");
            setIsSending(false);
            return;
        }

        const result = await saveToNewsletter(userEmail);
        if (result.status === 200) {
            toast.success(result.message);
            setUserEmail("");
            setIsSending(false);

        } else {
            toast.error(result.message);
            setIsSending(false);
        }
    }

    return (

        <>

            <ContactForm />


            <section className={"bg-black"}>
                <Layout>
                    <section className={"py-[12px]"}>
                        <div
                            className={"py-[90px] flex justify-between max-lg:flex-col max-lg:items-center max-lg:text-center"}>
                            <div className={"flex flex-col gap-[24px] max-lg:items-center max-lg:py-[32px]"}>
                                <div>
                                    <Link href={"/"} className={"opacity-100 hover:opacity-80 transition-all"}>
                                        <div className={"w-[320px] h-[62px] relative"}>
                                            <Image src={icons.logoWhite} layout={"fill"} alt={"Logo"}/>
                                        </div>
                                    </Link>
                                </div>

                                <div className={"text-gray text-[14px] max-w-[320px]"}>
                                    Lorem ipsum dolor sit amet consectetur dolol
                                    drakgonil adipiscing elit aliquam mauris
                                </div>

                                <div className={"flex gap-4"}>

                                    <Link
                                        href={process.env.NEXT_PUBLIC_FACEBOOK_URL.toString()}
                                        className={`${style}`}
                                        referrerPolicy={"no-referrer"}
                                    >
                                        <div className={style2}>
                                            <Image src={icons.facebook} alt={"Facebook Icon"} layout={"fill"}/>
                                        </div>
                                    </Link>

                                    <Link href={process.env.NEXT_PUBLIC_INSTAGRAM_URL.toString()}
                                          className={`${style}`}
                                          referrerPolicy={"no-referrer"}
                                    >
                                        <div className={style2}>
                                            <Image src={icons.instagram} alt={"Instagram icon"} layout={"fill"}/>
                                        </div>
                                    </Link>
                                </div>

                                <div className={"flex gap-2 flex-col"}>
                                    <FormInput
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        value={userEmail}
                                        type={"email"}
                                        placeholder={"Enter your email"}
                                    />
                                    <Button
                                        style={"primary"}
                                        type={"button"}
                                        disabled={isSending}
                                        title={isSending ? "Sending..." : "Subscribe to newsletter"}
                                        onClick={handleNewsletterSubmit}
                                    />
                                </div>
                            </div>

                            <div className={"flex flex-grow gap-[72px] justify-end max-lg:flex-col"}>
                                {
                                    footerLinks.map((item, index) => {
                                        return (
                                            <div key={item + index}>
                                                <p className={"text-white"}>{item.header}</p>
                                                <div className={"mt-[32px] flex flex-col gap-[16px]"}>
                                                    {
                                                        item.links.map((link, index) => {
                                                            return (
                                                                <Link
                                                                    key={link + index}
                                                                    href={link.link}
                                                                    className={footerLinkStyle}
                                                                >
                                                                    {link.name}
                                                                </Link>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                        <div
                            className={"border-t-gray border-t-2 pt-[16px] flex justify-between text-gray text-[14px] max-lg:flex-col max-lg:gap-5 max-lg:text-center"}>
                        <span>
                            Copyright © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_COMPANY_NAME}
                        </span>
                            <span>
                            Website created by <Link className={"text-primary"}
                                                     href={process.env.NEXT_PUBLIC_AUTHOR_SITE}
                                                     target={"_blank"}>{process.env.NEXT_PUBLIC_AUTHOR_NAME}</Link>
                        </span>
                        </div>
                    </section>
                </Layout>
            </section>

        </>

    )
}