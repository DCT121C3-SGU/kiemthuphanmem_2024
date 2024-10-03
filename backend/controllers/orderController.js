

// Placing order using COD
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: new Date(),
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, {cartData: {}});
        res.status(200).json({ success: true, message: "Đặt hàng thành công" });
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

}

// User Order Data for Frontend
const userOrders = async (req, res) => {

}

// Update Order Status form admin panel
const updateStatus = async (req, res) => {
    
}

export { placeOrder, placeOrderMoMo, placeOrderVnpay, allOrders, userOrders, updateStatus };
