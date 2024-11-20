"use client"
import {createContext, useState} from "react";

export const WishlistContext = createContext({});


export default function WishlistContextProvider({children}) {

    const [items, setItems] = useState([])

    const [itemsQty, setItemsQty] = useState(
        items.reduce((total, item) => total + item.qty, 0)
    );


    return (
        <WishlistContext.Provider value={{
            items,
            setItems,
            itemsQty,
        }}>
            {children}
        </WishlistContext.Provider>
    );
}