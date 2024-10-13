import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = 'VNĐ';
    const delivery_fee = 30000;
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [token, setToken] = useState('')
    const [roomList, setRoomList] = useState([])

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

        if (token) {
            try {
                await axios.post(backendURL + '/api/cart/add', {itemId, size}, {headers: {token}})
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

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
        if (token) {
            try {
                await axios.post(backendURL + '/api/cart/update', {itemId, size, quantity}, {headers: {token}})
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
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

    const getProducts = async () => {
        try {
            const response = await axios.get(backendURL + '/api/product/list')
            if(response.data.success){
                setProducts(response.data.products)
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getRoomList = async () => {
        try { // Added try-catch block
            const response = await axios.get(backendURL + '/api/room/list')
            if (response.data.success) {
                setRoomList(response.data.rooms)
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) { 
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendURL + '/api/cart/get', {}, {headers: {token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }

    const getRoomData = async () => {
        try {
            const {data} = await axios.get(backendURL + '/api/room/list')
            if (data.success) {
                setRoomList(data.rooms)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProducts()
        getRoomList()
        getRoomData()
    },[])

    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            getUserCart(localStorage.getItem("token"))
        }
    },[])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems,addToCart,
        getCartCount, updateQuantity, setCartItems,
        getCartAmount, backendURL,
        setToken, token,
        roomList, getRoomData
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;