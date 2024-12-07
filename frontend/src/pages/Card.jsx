import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Card = () => {
  const { products, currency, cartItems, updateQuantity, backendURL } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [amount, setAmount] = useState("");
  const [maxQuantity, setMaxQuantity] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length > 0) {
      const tempData = Object.entries(cartItems).map(([itemId, quantity]) => ({
        _id: itemId,
        quantity,
      }));
      setCartData(tempData);

      // Lấy maxQuantity từ backend cho mỗi sản phẩm trong giỏ hàng
      tempData.forEach(async (item) => {
        try {
          const response = await axios.post(
            `${backendURL}/api/product/quantity`,
            {
              productId: item._id,
            }
          );
          if (response.data.success) {
            setMaxQuantity((prev) => ({
              ...prev,
              [item._id]: response.data.quantity,
            }));
          }
        } catch (error) {
          console.error("Lỗi khi lấy số lượng sản phẩm:", error);
        }
      });
    }
  }, [cartItems, products, backendURL]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl, mb-3">
        <Title text1={"GIỎ HÀNG"} text2={"CỦA BẠN"} />
      </div>
      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          const max = maxQuantity[item._id] || 2; // Mặc định là 2 nếu không lấy được max

          return (
            <div
              key={index}
              className="py-4 border-t text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData.images[0].url}
                  alt=""
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>
                  <p className="mt-2">
                    {productData.price} {currency}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={(e) => {
                    let value = Number(e.target.value);
                    if (value === "" || value === "0") {
                      return;
                    }
                    if (value > max) {
                      value = max;
                      e.target.value = max;
                    }

                    updateQuantity(item._id, value);
                  }}
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                  type="number"
                  min={1}
                  max={max}
                  defaultValue={item.quantity}
                />
                <span className="text-sm">
                  Hàng còn trong kho: {max}
                </span>
              </div>

              <img
                onClick={() => updateQuantity(item._id, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt=""
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => {
                if (cartData.length === 0) {
                  toast.error("Giỏ hàng trống!");
                } else {
                  navigate("/place-order");
                }
              }}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              TIẾN HÀNH THANH TOÁN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
