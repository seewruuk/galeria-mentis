"use client"
import {createContext, useEffect, useState} from "react";
import Cookies from "js-cookie";


export const CartContext = createContext({});


export default function CartContextProvider({children}) {

    const [cartItems, setCartItems] = useState(
        Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : []
    );
    const [totalQty, setTotalQty] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        setTotalQty(cartItems.reduce((acc, item) => acc + item.qty, 0));
        setTotalPrice(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0));
        Cookies.set("cart", JSON.stringify(cartItems));
    }, [cartItems])

    const addToCart = (item) => {
        const exist = cartItems.find(x => x._id === item._id);

        if (exist) {
            setCartItems(
                cartItems.map(x =>
                    x._id === item._id
                        ? {...exist, qty: exist.qty + 1}
                        : x
                )
            );
            // toast.success("Pomyślnie zwiększono ilość produktu w koszyku.");
        } else {
            setCartItems([
                ...cartItems,
                {
                    _id: item._id,
                    name: item.name,
                    slug: item.slug,
                    price: item.price, // Cena oryginalna
                    discount: null, // Zniżki nie stosujemy na początku
                    discountValue: null, // Wartość zniżki
                    category: "test",
                    image: item.images[0],
                    qty: 1,
                }
            ]);
            // toast.success("Produkt dodany do koszyka.");
        }
    };

    const increaseQty = (id) => {
        const newCartItems = cartItems.map((item) => {
            if (item._id === id) {
                return { ...item, qty: item.qty + 1 };
            }
            return item;
        });

        setCartItems(newCartItems);
        // toast.success("Zwiększono ilość produktu w koszyku.");
    };


    const decreaseQty = (id) => {
            const newCartItems = cartItems.map((item) => {
                if (item._id === id && item.qty > 1) {
                    return { ...item, qty: item.qty - 1 };
                }
                return item;
            });
            setCartItems(newCartItems);
    };



    const removeItem = (id) => {
        const newCartItems = cartItems.filter((item) => item._id !== id);
        setCartItems(newCartItems);
    };




    return (
        <CartContext.Provider value={{
            cartItems,
            setCartItems,
            totalQty,
            setTotalQty,
            totalPrice,

            addToCart,
            increaseQty,
            decreaseQty,
            removeItem
        }}>
            {children}
        </CartContext.Provider>
    );
}