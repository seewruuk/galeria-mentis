"use client"
import {useSearchParams} from 'next/navigation'
import PageTransition from "@/components/PageTransition";
import Link from "next/link";

export default function SuccessCancelLayout({header, subtitle}) {

    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')

    return (
        <PageTransition>

            <div className="flex flex-col items-center justify-center h-screen text-center">
                <div className="flex flex-col items-center justify-center">

                    <h2 className="text-balance text-4xl font-semibold tracking-tight text-black sm:text-5xl leading-[150%]">
                        {header}
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-gray  text-center">
                        {subtitle}
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/"
                            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
                        >
                            Continue shopping
                        </Link>
                    </div>

                    {
                        orderId && (
                            <div
                                className={"text-[12px] text-balance max-w-[400px] text-center mt-[24px] text-gray leading-6"}>
                                For more information, please contact with us and provide the following order number: <br/>
                                <span className="text-black underline font-semibold text-[16px]">{orderId}</span>
                            </div>
                        )
                    }
                </div>
            </div>
        </PageTransition>

    );
}