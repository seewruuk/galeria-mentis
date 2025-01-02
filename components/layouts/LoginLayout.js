"use client";
import {useContext, useState} from "react";
import {useRouter} from "next/navigation";
import {AuthContext} from "@/context/AuthContext";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

export default function LoginLayout() {
    const router = useRouter();
    const {isLogged, login} = useContext(AuthContext);
    const [user, setUser] = useState({email: "", password: ""});


    return (
        <PageTransition>

            <div className="min-h-[73vh] grid place-items-center">
                <div
                    className="bg-white p-[42px] rounded-3xl dark:bg-black-100 flex flex-col justify-center items-center">
                    <h1 className="text-2xl font-bold text-center">Sign in</h1>
                    <form onSubmit={
                        (e) => login(e, user.email, user.password)
                    }>
                        <div className="my-4">
                            <label htmlFor="email">Email</label>
                            <input
                                placeholder="Email"
                                type="text"
                                name="email"
                                id="email"
                                value={user.email}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                                className="w-full p-2 border border-gray-300 dark:border-white/20 rounded-lg"
                            />
                        </div>
                        <div className="my-4">
                            <label htmlFor="password">Password</label>
                            <input
                                placeholder="Password"
                                type="password"
                                name="password"
                                id="password"
                                value={user.password}
                                onChange={(e) => setUser({...user, password: e.target.value})}
                                className="w-full p-2 border border-gray-300 dark:border-white/20 rounded-lg"
                            />
                        </div>

                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg">
                            Sign in
                        </button>

                    </form>
                </div>
            </div>


            <Footer />
        </PageTransition>

    );
}