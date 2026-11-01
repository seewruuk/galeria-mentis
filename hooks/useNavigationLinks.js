"use client";
import {useContext} from "react";
import {NavigationContext} from "@/context/NavigationContext";

// Dane nawigacji przychodzą z serwera (app/layout.js) – bez dodatkowych zapytań w przeglądarce.
export function useNavigationLinks() {
    const {links, artistsLinks, blogLinks} = useContext(NavigationContext);
    return {links, artistsLinks, blogLinks, loading: false};
}
