import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "VNĐ";
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const delivery_fee = 5000;

  const addToCart = async (itemId) => {
    if (!token) {
      toast.error("Đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);

    try {
      await axios.post(
        `${backendURL}/api/cart/add`,
        { itemId },
        { headers: { token } }
      );
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce(
      (total, quantity) => total + quantity,
      0
    );
  };

  const updateQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
        delete cartData[itemId];
    } else {
        cartData[itemId] = quantity;
    }
    setCartItems(cartData);

    try {
        await axios.post(`${backendURL}/api/cart/update`, { itemId, quantity }, { headers: { token } });
        toast.success(quantity === 0 ? "Sản phẩm đã được xóa khỏi giỏ hàng" : "Giỏ hàng đã được cập nhật");
    } catch (error) {
        console.log(error);
        toast.error("Đã xảy ra lỗi khi cập nhật giỏ hàng");
    }
};


  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items);
      if (itemInfo && !isNaN(itemInfo.price)) {
        totalAmount += itemInfo.price * cartItems[items];
      }
    }
    return totalAmount;
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
      const response = await axios.post(
        `${backendURL}/api/cart/get`,
        {},
        { headers: { token } }
      );
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
    getRoomData();
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
    delivery_fee, // Hàm tính tổng phí giao hàng
    backendURL,
    setToken,
    token,
    roomList,
    eventList,
    getRoomData,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
