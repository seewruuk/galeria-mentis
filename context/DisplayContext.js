"use client"
import {createContext, useSyncExternalStore} from "react";

export const DisplayContext = createContext({});

function subscribe(callback) {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
}

const getSnapshot = () => (window.innerWidth <= 1024 ? "mobile" : "desktop");
// Na serwerze nie znamy szerokości ekranu – menu pojawia się po załadowaniu w przeglądarce (jak dotychczas)
const getServerSnapshot = () => null;

export default function DisplayContextProvider({children}) {
    const displayVersion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return (
        <DisplayContext.Provider value={{
            displayVersion,
        }}>
            {children}
        </DisplayContext.Provider>
    );
}
