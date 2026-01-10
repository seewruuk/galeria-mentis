import "./globals.css";
import {Merriweather} from "next/font/google";
import Script from "next/script";
import CartContextProvider from "@/context/CartContext";
import DisplayContextProvider from "@/context/DisplayContext";
import Navbar from "@/components/Navbar";
import {Toaster} from "react-hot-toast";
import AuthContextProvider from "@/context/AuthContext";
import WishlistContextProvider from "@/context/WishlistContext";
import Footer from "@/components/Footer";
import ProtectedView from "@/components/ProtectedView";
import CookieConsent from "@/components/CookieConsent";


const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-merriweather",
});

export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://galeria-mentis.vercel.app'),
    title: {
        template: `%s | Galeria Mentis`,
        default: 'Galeria Mentis - Contemporary Art',
    },
    description: 'Galeria Mentis - discover exceptional contemporary art. Original paintings, sculptures and artworks from recognized artists.',
    keywords: ['contemporary art', 'art gallery', 'paintings', 'sculptures', 'artists', 'online gallery'],
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: 'Galeria Mentis',
    },
}

export default function RootLayout({children}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <link
                rel="stylesheet"
                href="https://use.typekit.net/icu4qan.css"
            />
        </head>

        <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-3WST4J96ND"
            strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-3WST4J96ND');
            `}
        </Script>

        <body className={`${merriweather.variable} antialiased font-serif relative overflow-x-hidden`} suppressHydrationWarning>

        <DisplayContextProvider>
            <CartContextProvider>
                <WishlistContextProvider>
                    <AuthContextProvider>
                        <CookieConsent />
                        {/* <Navbar/> */}
                        <Toaster/>

                        <ProtectedView>{children}</ProtectedView>

                    </AuthContextProvider>
                </WishlistContextProvider>
            </CartContextProvider>
        </DisplayContextProvider>

        </body>
        </html>
    );
}
