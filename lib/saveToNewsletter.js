import {toast} from "react-hot-toast";

export async function saveToNewsletter (email) {

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return { status: 400, message: "Invalid email format" };
    }

    try {
        const tokenResponse = await fetch("/api/getToken", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({}),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.status !== "ok") {
            toast.error("Error fetching token, contact support");
            return;
        }

        const dataToSend = {
            email: email,
            token: tokenData.data.access_token,
        };

        const newsletterResponse = await fetch("/api/newsletter", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({dataToSend}),
        });

        const newsletterData = await newsletterResponse.json();

        if (newsletterData.status === "success") {
            return { status: 200, message: "Succesfully saved to newsletter" };
        }else{
            return { status: 400, message: "There was an error saving to newsletter" };
        }

    } catch (error) {
        console.error("Wystąpił błąd:", error);
        return { status: 400, message: "There was an error saving to newsletter" };
    }
}