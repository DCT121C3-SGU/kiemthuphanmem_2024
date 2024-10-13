import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    room_name: { type: String, required: true },
    room_type: { type: String, required: true },
    room_price: { type: Number, required: true },
    room_date: { type: Number, required: true},
    room_status: { type: Boolean, default: true },
    room_booked: { type: Object, default: {}, required: true}
},{minimize: false});

const roomModel = mongoose.model.room || mongoose.model("room", roomSchema)

export default roomModel
