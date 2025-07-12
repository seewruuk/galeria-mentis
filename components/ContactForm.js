import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import {useCallback, useState} from "react";
import {env} from "@/utils/env";
import toast from "react-hot-toast";
import {validateEmail} from "@/lib/validateEmail";


export default function ContactForm() {


    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })

    const handleSubmit = async () => {
        const isFormValid = Object.values(formState).every(value => value.trim() !== "");
        if (!isFormValid) {
            toast.error("fill_data");
            return;
        }

        if (validateEmail(formState.email) === null) {
            toast.error("wrong emial");
            return;
        }

        const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                service_id: env.emailServiceId,
                template_id: env.emailTemplateId,
                user_id: env.emailUserId,
                template_params: {
                    name: formState.name + " " + formState.email,
                    desc: formState.subject + " " + new Date().toISOString(),
                    message: formState.message,
                    customer_email: formState.email,
                },
                accessToken: env.emailAccessToken,
            }),
        });

        const emailResultText = await emailResponse.text();
        if (emailResultText.trim() !== "OK") {
            toast.error("Message sending failed!");
            return {
                status: 500,
                message: "",
                emailResultText,
            }
        } else {
            toast.success("Your message has been sent!");
            setFormState({
                name: "",
                email: "",
                subject: "",
                message: "",
            })
        }
    }


    return (
        <section
            id={"contact"}
            className={"py-[120px] mx-auto max-w-[650px] px-10"}
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
                        id={"name"}
                        value={formState.name}
                        onChange={(event) => {
                            const {value} = event.target;
                            setFormState({...formState, name: value});
                        }}
                        label={"Name"}
                    />
                    <FormInput
                        id={"email"}
                        value={formState.email}
                        onChange={(event) => {
                            const {name, value} = event.target;
                            setFormState({...formState, email: value});
                        }}
                        label={"Email"}
                    />
                </div>

                <FormInput
                    id={"subject"}
                    label={"Subject"}
                    value={formState.subject}
                    onChange={(event) => {
                        const {value} = event.target;
                        setFormState({...formState, subject: value});
                    }}
                />
                <FormInput
                    id={"message"}
                    value={formState.message}
                    label={"Message"}
                    type={"textarea"}
                    onChange={(event) => {
                        const {value} = event.target;
                        setFormState({...formState, message: value});
                    }}
                />
                <Button
                    type={"button"}
                    className={"mt-4"}
                    onClick={() => handleSubmit()}
                    style={"primary"}
                    title={"Send Message"}
                />
            </div>
        </section>
    )
}