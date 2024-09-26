import { useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import Title from "./Title"


const CartTotal = () => {

    const {currency, delivery_fee, getCartAmount } = useContext(ShopContext)

  return (
    <div className="w-full">
        <div className="text-2xl">
            <Title text1={"THANH"} text2={"TOÁN"} />
        </div>
        <div className="flex flex-col gap-2 mt-2 text-sm">
            <div className="flex justify-between">
                <p>Tổng giá trị đơn hàng</p>
                <p>{currency} {getCartAmount()}.00</p>
            </div>
            <hr />
            <div className="flex justify-between">
                <p>Phí vận chuyển</p>
                <p>{currency} {delivery_fee}</p>
            </div>
            <hr />
            <div className="flex justify-between">
                <b>Tổng cộng</b>
                <b>{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</b>
            </div>
        </div>
    </div>
  )
}

export default CartTotal