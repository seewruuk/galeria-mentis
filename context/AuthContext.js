"use client";
import {createContext, useCallback, useEffect, useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

export const AuthContext = createContext({});

const initialUserState = {
    _id: "",
    name: "",
    lastname: "",
    email: "",
    role: "",
};

// Sesja jest w ciasteczku httpOnly ustawianym przez serwer – przeglądarka nie przechowuje już danych logowania.
function toUserData(user) {
    if (!user) return initialUserState;
    return {
        _id: user._id || "",
        name: user.name || "",
        lastname: user.lastname || "",
        email: user.email || "",
        role: user.isAdmin ? "admin" : "user",
    };
}

async function postJson(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body || {}),
    });
    const data = await response.json().catch(() => ({}));
    return {ok: response.ok, data};
}

export default function AuthContextProvider({children}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isLogged, setIsLogged] = useState(false);
    const [userData, setUserData] = useState(initialUserState);

    const applyUser = useCallback((user) => {
        setIsLogged(!!user);
        setUserData(toUserData(user));
    }, []);

    useEffect(() => {
        // sprzątanie po starej wersji (dane logowania w localStorage)
        try {
            localStorage.removeItem("user");
            localStorage.removeItem("isLogged");
        } catch {
        }

        let cancelled = false;
        fetch("/api/auth/session", {cache: "no-store"})
            .then((res) => res.json())
            .then((data) => {
                if (!cancelled) applyUser(data?.user || null);
            })
            .catch(() => {
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [applyUser]);

    const login = async (e, email, password) => {
        e?.preventDefault?.();

        try {
            const {ok, data} = await postJson("/api/auth/login", {email, password});
            if (!ok || data.status !== "ok") {
                toast.error(data.message || "Niepoprawne dane logowania");
                return false;
            }
            applyUser(data.user);
            router.push("/dashboard");
            router.refresh();
            return true;
        } catch (error) {
            toast.error("Wystąpił błąd podczas logowania");
            console.error(error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await postJson("/api/auth/logout");
        } catch {
        }
        applyUser(null);
        router.refresh();
    };

    const register = async (e, user) => {
        e?.preventDefault?.();

        if (user.password !== user.confirmPassword) {
            toast.error("Hasła nie są takie same");
            return;
        }

        const toastId = toast.loading("Tworzenie konta...");
        try {
            const {ok, data} = await postJson("/api/auth/register", {
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
            });
            toast.dismiss(toastId);

            if (ok && data.status === "ok") {
                applyUser(data.user);
                toast.success("Konto zostało utworzone");
                router.push("/dashboard");
                router.refresh();
            } else {
                toast.error(data.message || "Wystąpił błąd podczas tworzenia konta");
            }
        } catch (error) {
            toast.dismiss(toastId);
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
        isLoading,
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
}
