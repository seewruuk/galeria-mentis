import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import {useState} from "react";
import toast from "react-hot-toast";
import {validateEmail} from "@/lib/validateEmail";

export default function ContactForm() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async () => {
        setIsSending(true);

        const isFormValid = Object.values(formData).every(value => value.trim() !== "");
        if (!isFormValid) {
            toast.error("Please fill in all fields.");
            setIsSending(false);
            return;
        }
        if(validateEmail(formData.email) === null) {
            toast.error("Please enter a valid email address.");
            setIsSending(false);
            return;
        }

        const emailAccessToken =  "qzXhywFh-Yx4-k-KkmM8N";
        const emailServiceId = "service_3vl3ici";
        const emailTemplateId = "template_772xy2q";
        const emailUserId = "3EHJcCUf8rYArVWb0"

        const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                service_id: emailServiceId,
                template_id: emailTemplateId,
                user_id: emailUserId,
                template_params: {
                    name: formData.name,
                    desc: formData.subject + " " + new Date().toISOString(),
                    message: formData.message,
                    customer_email: formData.email,
                },
                accessToken: emailAccessToken,
                // accessToken: "",
            }),
        });

        const emailResultText = await emailResponse.text();
        if (emailResultText.trim() !== "OK") {
            toast.error("There was an error sending the message. Please try again later.");
            console.log(emailResultText);
            setIsSending(false);
            return ;
        }
        toast.success("Email sent successfully.");
        setFormData({
            name: "",
            email: "",
            subject: "",
            message: ""
        });
        setIsSending(false);
    }


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
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <FormInput
                        label={"Email"}
                        type={"email"}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                <FormInput
                    label={"Subject"}
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    name={"subject"}
                    type={"text"}
                />
                <FormInput
                    label={"Message"}
                    type={"textarea"}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    name={"message"}

                />

                <Button
                    type={"button"}
                    className={"mt-4"}
                    onClick={() => handleSendMessage()}
                    style={"primary"}
                    title={"Send Message"}
                    isLoading={isSending}
                />


            </div>


        </section>
    )
}