"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const accepted = Cookies.get("cookiesAccepted");
        if (!accepted) {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        Cookies.set("cookiesAccepted", "true", { expires: 7 });
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-black text-white p-4 z-50 shadow-lg">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-sm text-center sm:text-left">
                    We use cookies to improve your browsing experience and analyze site
                    traffic. By clicking “Accept”, you consent to the use of cookies in
                    accordance with our Cookie Policy.
                </p>
                <button
                    onClick={handleAccept}
                    className="bg-primary hover:bg-[#000] px-5 py-2 rounded text-sm font-semibold transition-all"
                >
                    Accept
                </button>
            </div>
        </div>
    );
}
