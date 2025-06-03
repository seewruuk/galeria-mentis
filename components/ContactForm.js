import FormInput from "@/components/FormInput";
import Button from "@/components/Button";

export default function ContactForm() {
    return (
        <section
            id={"contact"}
            className={"py-[120px] mx-auto max-w-[650px]"}
        >
            <div className={"flex justify-between gap-3 py-6 max-lg:flex-col"}>
                <p className={"flex-1 font-freightBig text-black max-w-[550px] leading-[120%] text-[32px] font-semibold"}>Contact
                    us</p>
                <p className={"flex-1 text-[15px] leading-[170%] text-gray"}>
                    If you have any questions or inquiries, please fill out the form below and we will get back to you
                    as
                    soon as possible.
                </p>
            </div>


            <div className={"flex flex-col gap-4"}>

                <div className={"flex gap-4 max-lg:flex-col"}>
                    <FormInput
                        label={"Name"}
                    />
                    <FormInput
                        label={"Email"}
                    />
                </div>

                <FormInput
                    label={"Subject"}
                />
                <FormInput
                    label={"Message"}
                    type={"textarea"}
                />

                <Button
                    type={"button"}
                    className={"mt-4"}
                    onClick={() => alert("Form submitted!")}
                    style={"primary"}
                    title={"Send Message"}
                />

            </div>


        </section>
    )
}