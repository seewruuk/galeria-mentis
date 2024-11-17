"use client"
import {createContext, useState} from "react";

export const CartContext = createContext({});


export default function CartContextProvider({children}) {

    const [cartItems, setCartItems] = useState([])
    const [totalQty, setTotalQty] = useState(
        cartItems.reduce((total, item) => total + item.qty, 0)
    );


    return (
        <CartContext.Provider value={{
            cartItems,
            setCartItems,
            totalQty,
            setTotalQty,
        }}>
            {children}
        </CartContext.Provider>
    );
}