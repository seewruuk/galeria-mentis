import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { env } from "@/utils/env";
import toast from "react-hot-toast";

const schema = z.object({
    name: z.string().min(1, "Podaj imię"),
    email: z.string().email("Nieprawidłowy e-mail"),
    subject: z.string().min(1, "Podaj temat"),
    message: z.string().min(1, "Wiadomość nie może być pusta"),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const resp = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    service_id: env.emailServiceId,
                    template_id: env.emailTemplateId,
                    user_id: env.emailUserId,
                    template_params: {
                        name: data.name,
                        email: data.email,
                        subject: data.subject,
                        message: data.message,
                    },
                    accessToken: env.emailAccessToken,
                }),
            });
            if (!resp.ok) throw new Error(`Status ${resp.status}`);
            toast.success("Wiadomość wysłana pomyślnie!");
            reset();
        } catch (err) {
            console.error(err);
            toast.error("Wystąpił błąd podczas wysyłania.");
        }
    };

    return (
        <section id="contact" className="py-[120px] mx-auto max-w-[650px] px-10">
            <div className="flex justify-between gap-3 py-6 max-lg:flex-col">
                <p className="flex-1 font-freightBig text-black max-w-[550px] leading-[120%] text-[32px] font-semibold">
                    Contact us
                </p>
                <p className="flex-1 text-[15px] leading-[170%] text-gray">
                    Jeśli masz pytania, wypełnij formularz poniżej.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex gap-4 max-lg:flex-col">
                    <FormInput
                        label="Name"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <FormInput
                        label="Email"
                        error={errors.email?.message}
                        {...register("email")}
                    />
                </div>
                <FormInput
                    label="Subject"
                    error={errors.subject?.message}
                    {...register("subject")}
                />
                <FormInput
                    label="Message"
                    type="textarea"
                    error={errors.message?.message}
                    {...register("message")}
                />
                <Button
                    type="submit"
                    className="mt-4"
                    style="primary"
                    title={isSubmitting ? "Wysyłanie..." : "Send Message"}
                    disabled={isSubmitting}
                />
            </form>
        </section>
    );
}
