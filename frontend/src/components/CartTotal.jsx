import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, getCartAmount, delivery_fee } =
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
          <p>
            Phí phát sinh
          </p>
          <p>
            {delivery_fee} {currency}{" "}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Tổng cộng</b>
          <b>
            {getCartAmount() + delivery_fee} {currency}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
