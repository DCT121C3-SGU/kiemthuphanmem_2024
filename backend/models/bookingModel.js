import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    roomId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    roomData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
})

const bookingModel = mongoose.model.booking || mongoose.model("booking", bookingSchema)
export default bookingModel
