import "./globals.css";
import {Merriweather} from "next/font/google";
import CartContextProvider from "@/context/CartContext";
import DisplayContextProvider from "@/context/DisplayContext";
import Navbar from "@/components/Navbar";
import {Toaster} from "react-hot-toast";
import AuthContextProvider from "@/context/AuthContext";
import WishlistContextProvider from "@/context/WishlistContext";
import Footer from "@/components/Footer";


// Import czcionki Merriweather z Google Fonts
const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-merriweather",
});

export const metadata = {
    title: {
        template: `%s | Galeria Mentis`
    },
}

export default function RootLayout({children}) {
    return (
        <html lang="en">
        {/* Import FreightBig z Adobe Fonts */}
        <head>
            <link
                rel="stylesheet"
                href="https://use.typekit.net/icu4qan.css"
            />
        </head>

        <body className={`${merriweather.variable} antialiased font-serif relative overflow-x-hidden`}>

        <DisplayContextProvider>
            <CartContextProvider>
                <WishlistContextProvider>
                    <AuthContextProvider>

                        <Navbar/>
                        <Toaster/>

                        {children}

                    </AuthContextProvider>
                </WishlistContextProvider>
            </CartContextProvider>
        </DisplayContextProvider>

        </body>
        </html>
    );
}
