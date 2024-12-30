"use client";
import { createContext, useState, useEffect } from "react";
import { getUserByEmail} from "@/sanity/getSanity/getUserByEmail";
import toast from "react-hot-toast";
import createHashPassword from "@/lib/createHashPassword";
import { useRouter } from "next/navigation";
import generateOrderNumber from "@/lib/generateOrderNumber";

export const AuthContext = createContext({});

export default function AuthContextProvider({ children }) {
    const initialUserState = {
        _id: "",
        name: "",
        lastname: "",
        email: "",
        sessionToken: "",
        role: ""
    };
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isLogged, setIsLogged] = useState(false);
    const [userData, setUserData] = useState(initialUserState);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedIsLogged = JSON.parse(localStorage.getItem("isLogged"));
            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (storedIsLogged) {
                setIsLogged(storedIsLogged);
            }
            if (storedUser) {
                setUserData(storedUser);
            }
        }
        setIsLoading(false);
    }, []);


    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("isLogged", JSON.stringify(isLogged));
            localStorage.setItem("user", JSON.stringify(userData));
        }
    }, [isLogged, userData]);

    const verifyPassword = (password, hash) => createHashPassword(password) === hash;

    const login = async (e, email, password) => {
        e.preventDefault();

        try {
            const findUser = await getUserByEmail(email);

            if (!findUser) {
                toast.error("User not found");
                return;
            }

            console.log("findUser", findUser)

            const passwordToVerify = findUser.userInfo.hashPassword;

            if (verifyPassword(password, passwordToVerify)) {
                const user = {
                    _id: findUser._id,
                    name: findUser.userInfo.name,
                    lastname: findUser.userInfo.lastname,
                    email: findUser.userInfo.email,
                    sessionToken: findUser.sessionToken,
                    role: findUser.role
                };

                setIsLogged(true);
                setUserData(user);
                router.push("/dashboard");
            } else {
                toast.error("Niepoprawne dane logowania");
            }
        } catch (error) {
            toast.error("Wystąpił błąd podczas logowania");
            console.error(error);
        }
    };

    const logout = () => {
        setIsLogged(false);
        setUserData(initialUserState);
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
            localStorage.removeItem("isLogged");
        }
        router.refresh();
    };

    const register = async (e, user) => {
        toast.loading("Tworzenie konta...");
        e.preventDefault();

        if (user.password !== user.confirmPassword) {
            toast.error("Hasła nie są takie same");
            return;
        }

        const item = {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            hashPassword: createHashPassword(user.password),
            sessionToken: generateOrderNumber(user.name, user.email)
        };

        try {
            const response = await fetch("/api/createUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ item })
            });

            const data = await response.json();
            if (data.status === "ok") {
                await login(e, user.email, user.password);
                toast.success("Konto zostało utworzone");
                router.push("/dashboard");
            } else {
                toast.error("Wystąpił błąd podczas tworzenia konta");
            }
        } catch (error) {
            toast.error("Wystąpił błąd podczas tworzenia konta");
            console.error(error);
        }
    };

    const values = {
        isLogged,
        setIsLogged,
        userData,
        setUserData,
        logout,
        login,
        register,
        isLoading
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
}
