import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount, getDeliveryFee } =
    useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"THANH"} text2={"TOÁN"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Tổng giá trị đơn hàng</p>
          <p>
            {getCartAmount()} {currency}{" "}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p title="Phí phát sinh dựa trên kích thước sản phẩm: 0đ cho size S, 5000đ cho size M, và 10000đ cho size L.">
            Phí phát sinh
          </p>
          <p>
            {getDeliveryFee()} {currency}{" "}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Tổng cộng</b>
          <b>
            {getCartAmount() + getDeliveryFee()} {currency}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
