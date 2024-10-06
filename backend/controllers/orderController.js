import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

// Placing order using COD
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, {cartData: {}});
        res.status(200).json({ success: true, message: "Đặt hàng thành công"});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Placeing order using momo payment
const placeOrderMoMo = async (req, res) => {

}

// Placeing order using vnpay payment
const placeOrderVnpay = async (req, res) => {

}

// All orders data for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message });
    }
}

// User Order Data for Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({userId});
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update Order Status form admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status} = req.body
        await orderModel.findByIdAndUpdate(orderId, {status});
        res.status(200).json({ success: true, message: "Cập nhật trạng thái đơn hàng thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export { placeOrder, placeOrderMoMo, placeOrderVnpay, allOrders, userOrders, updateStatus };
