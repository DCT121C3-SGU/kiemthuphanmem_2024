import { createContext, useEffect, useState } from "react";
import { products } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})

    const addToCart = async (itemId, size) => { //add product have _id product and sizes
        // not choose size for product
        if (!size) {
            toast.error("Đừng quên chọn size nhé!")
            return
        }
        
        let cartData = structuredClone(cartItems)
        
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            // add product not same size
            else{
                cartData[itemId][size] = 1
            }
        }
        else{
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        setCartItems(cartData)
    }

    useEffect(() => {
        console.log(cartItems);
    },[cartItems])

    const getCartCount = () => {
        let totalCount = 0
        for (const items in cartItems){ //items is _id product
            for (const item in cartItems[items]){ //item is size of product
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item]
                    }
                } catch (error) {
                }
            }
        }
        return totalCount
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId][size] = quantity
        setCartItems(cartData)
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems){
            let itemInfo = products.find((product) => product._id === items)
            for (const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item]
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalAmount
    }

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems,addToCart,
        getCartCount, updateQuantity,
        getCartAmount,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;