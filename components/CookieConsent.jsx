"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CookiePreferencesPanel from "@/components/CookiePreferencesPanel";

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [consent, setConsent] = useState({
        essential: true,
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const saved = Cookies.get("cookieConsent");
        if (!saved) {
            setVisible(true);
        } else {
            setConsent(JSON.parse(saved));
        }
    }, []);

    const handleAcceptAll = () => {
        const newConsent = {
            essential: true,
            analytics: true,
            marketing: true,
        };
        saveConsent(newConsent);
    };

    const handleRejectNonEssential = () => {
        const newConsent = {
            essential: true,
            analytics: false,
            marketing: false,
        };
        saveConsent(newConsent);
    };

    const handleSavePreferences = (prefs) => {
        saveConsent(prefs);
    };

    const saveConsent = (prefs) => {
        setConsent(prefs);
        Cookies.set("cookieConsent", JSON.stringify(prefs), { expires: 180 }); // 6 months
        setVisible(false);
        setShowPreferences(false);
        applyConsent(prefs);
    };

    // 🔒 Load only allowed scripts (analytics / marketing)
    const applyConsent = (prefs) => {
        if (prefs.analytics) {
            loadAnalytics();
        }
        if (prefs.marketing) {
            loadMarketing();
        }
    };

    const loadAnalytics = () => {
        if (!window.gaLoaded) {
            const script = document.createElement("script");
            script.src = "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID";
            script.async = true;
            document.head.appendChild(script);
            window.dataLayer = window.dataLayer || [];
            function gtag() {
                window.dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", "GA_MEASUREMENT_ID");
            window.gaLoaded = true;
        }
    };

    const loadMarketing = () => {
        if (!window.fbqLoaded) {
            !(function (f, b, e, v, n, t, s) {
                if (f.fbq) return;
                n = f.fbq = function () {
                    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = "2.0";
                n.queue = [];
                t = b.createElement(e);
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s);
            })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
            window.fbq("init", "FACEBOOK_PIXEL_ID");
            window.fbq("track", "PageView");
            window.fbqLoaded = true;
        }
    };

    if (!visible) return null;

    return (
        <>
            {showPreferences && (
                <CookiePreferencesPanel
                    consent={consent}
                    onSave={handleSavePreferences}
                    onCancel={() => setShowPreferences(false)}
                />
            )}

            <div className="fixed bottom-0 left-0 w-full bg-black text-white p-5 z-50 shadow-xl">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-center sm:text-left">
                        We use cookies to enhance your experience, analyze site usage, and
                        support marketing efforts.{" "}
                        <a
                            href="/links/cookiesConsent"
                            className="underline hover:text-gray-300"
                        >
                            Learn more
                        </a>
                        .
                    </p>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                            onClick={handleRejectNonEssential}
                            className="bg-[#000]/20 hover:bg-[#000]/40 px-4 py-2 rounded text-sm"
                        >
                            Reject Non-Essential
                        </button>
                        <button
                            onClick={() => setShowPreferences(true)}
                            className="bg-[#000]/20 hover:bg-[#000]/40 px-4 py-2 rounded text-sm"
                        >
                            Manage Preferences
                        </button>
                        <button
                            onClick={handleAcceptAll}
                            className="bg-primary px-4 py-2 rounded text-sm font-semibold"
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
