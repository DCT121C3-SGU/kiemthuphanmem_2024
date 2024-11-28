import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: "Đã đặt hàng" },
    paymentMethod: { type: String, required: true},
    payment: { type: Boolean, required: true, default: false },
    orderId: { type: String, required: true },
    date: { type: Date, required: true },
})

const orderModel = mongoose.model.order || mongoose.model("order", orderSchema);

export default orderModel;
