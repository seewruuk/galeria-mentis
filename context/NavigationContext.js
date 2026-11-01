"use client";
import {createContext} from "react";

export const NavigationContext = createContext({links: [], artistsLinks: [], blogLinks: []});

export default function NavigationContextProvider({value, children}) {
    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}
