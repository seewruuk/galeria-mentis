"use client";
import {useContext, useState} from "react";
import {useRouter} from "next/navigation";
import {AuthContext} from "@/context/AuthContext";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

export default function RegisterLayout() {
    const router = useRouter();
    const {isLogged, register} = useContext(AuthContext);
    const [user, setUser] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });


    // if (isLogged) {
    //     router.push("/dashboard");
    // }

    return (
        <PageTransition>

            <div className={"min-h-[73vh] grid place-items-center"}>
                <div
                    className={"bg-white p-[42px] rounded-3xl dark:bg-black-100 flex flex-col justify-center items-center"}>
                    <h1 className={"text-2xl font-bold text-center"}>Create an account</h1>
                    <form onSubmit={(e) => register(e, user)}>
                        <div className={"my-4"}>
                            <label htmlFor="name">Imię</label>
                            <input
                                placeholder={"Imię"}
                                type="text"
                                name={"name"}
                                id={"name"}
                                value={user.name}
                                onChange={(e) => setUser({...user, name: e.target.value})}
                                className={"w-full p-2 border border-gray-300 dark:border-white/20 rounded-lg"}
                            />
                        </div>

                        <div className={"my-4"}>
                            <label htmlFor="lastname">Nazwisko</label>
                            <input
                                placeholder={"Nazwisko"}
                                type="text"
                                name={"lastname"}
                                id={"lastname"}
                                value={user.lastname}
                                onChange={(e) => setUser({...user, lastname: e.target.value})}
                                className={"w-full p-2 border border-gray-300 dark:border-white/20 rounded-lg"}
                            />
                        </div>

                        <div className={"my-4"}>
                            <label htmlFor="email">Email</label>
                            <input
                                placeholder={"Email"}
                                type="email"
                                name={"email"}
                                id={"email"}
                                value={user.email}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                                className={"w-full p-2 border border-gray-300 dark:border-white/20 rounded-lg"}
                            />
                        </div>

                        <div className={"my-4"}>
                            <label htmlFor="password">Hasło</label>
                            <input
                                placeholder={"Hasło"}
                                type="password"
                                name={"password"}
                                id={"password"}
                                value={user.password}
                                onChange={(e) => setUser({...user, password: e.target.value})}
                                className={"w-full p-2 border border-gray-300 dark:border-white/20 rounded-lg"}
                            />
                        </div>

                        <div className={"my-4"}>
                            <label htmlFor="confirmPassword">Potwierdź hasło</label>
                            <input
                                placeholder={"Potwierdź hasło"}
                                type="password"
                                name={"confirmPassword"}
                                id={"confirmPassword"}
                                value={user.confirmPassword}
                                onChange={(e) => setUser({...user, confirmPassword: e.target.value})}
                                className={"w-full p-2 border border-gray-300 dark:border-white/20 rounded-lg"}
                            />
                        </div>

                        <button type={"submit"} className={"w-full bg-blue-500 text-white p-2 rounded-lg"}>
                            Stwórz konto
                        </button>

                    </form>
                </div>
            </div>
            <Footer />
        </PageTransition>
    );
}