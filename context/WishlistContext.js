"use client"
import {createContext, useEffect, useState} from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export const WishlistContext = createContext({});


export default function WishlistContextProvider({children}) {

    const [items, setItems] = useState(
        Cookies.get("wishlist") ? JSON.parse(Cookies.get("wishlist")) : []
    )

    let itemsQty = items.length;


    useEffect(() => {
        Cookies.set("wishlist", JSON.stringify(items));
    }, [items]);


    const removeItem = (id) => {
        const newItems = items.filter((item) => item._id !== id);
        setItems(newItems);
    };

    const addItem = (item) => {
        const exist = items.find(x => x._id === item._id);

        console.log("exist", exist)

        if (exist) {
            toast.error("Product already in wishlist.");
        } else {
            setItems([
                ...items,
                {
                    _id: item._id,
                    name: item.name,
                    slug: item.slug,
                    price: item.price, // Cena oryginalna
                    discount: null, // Zniżki nie stosujemy na początku
                    discountValue: null, // Wartość zniżki
                    category: item.productCategory,
                    image: item.images[0],
                    qty: 1,
                }
            ]);
            toast.success("Product added to wishlist.");
        }
    };





    return (
        <WishlistContext.Provider value={{
            items,
            setItems,
            itemsQty,
            removeItem,
            addItem,
        }}>
            {children}
        </WishlistContext.Provider>
    );
}