import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = 'VNĐ';
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState('');
    const [roomList, setRoomList] = useState([]);
    const [eventList, setEventList] = useState([]);

    // Phí giao hàng theo kích thước
    const deliveryFeeBySize = {
        S: 0,
        M: 5000,
        L: 10000,
    };

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Đừng quên chọn size nhé!");
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(`${backendURL}/api/cart/add`, { itemId, size }, { headers: { token } });
                toast.success("Đã thêm vào giỏ hàng");
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalCount += cartItems[items][item];
                }
            }
        }
        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        if (token) {
            try {
                await axios.post(`${backendURL}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find((product) => product._id === items);
            if (!itemInfo || isNaN(itemInfo.price)) {
                continue;
            }
            for (const size in cartItems[items]) {
                const quantity = cartItems[items][size];
                if (quantity > 0) {
                    totalAmount += itemInfo.price * quantity + deliveryFeeBySize[size] * quantity;
                }
            }
        }
        return totalAmount;
    };

    const getDeliveryFee = () => {
        let totalDeliveryFee = 0;
        for (const items in cartItems) {
            for (const size in cartItems[items]) {
                const quantity = cartItems[items][size];
                const sizeFee = deliveryFeeBySize[size] || 0;
                totalDeliveryFee += sizeFee * quantity;
            }
        }
        return totalDeliveryFee;
    };

    const getProducts = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getRoomList = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/room/list`);
            if (response.data.success) {
                setRoomList(response.data.rooms);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getEventList = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/event/list`);
            if (response.data.success) {
                setEventList(response.data.events);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(`${backendURL}/api/cart/get`, {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getProducts();
        getRoomList();
        getEventList();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            getUserCart(localStorage.getItem("token"));
        }
    }, []);

    const value = {
        products,
        currency,
        deliveryFeeBySize,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        setCartItems,
        getCartAmount,
        getDeliveryFee, // Hàm tính tổng phí giao hàng
        backendURL,
        setToken,
        token,
        roomList,
        eventList,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
