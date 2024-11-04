import mongoose from "mongoose";

const eventBookingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    eventId: { type: String, required: true },
    userData: { type: Object, required: true },
    eventData: { type: Object, required: true },
    amount: { type: Number, required: true },
})

const eventBookingModel = mongoose.model.eventBooking || mongoose.model("eventBooking", eventBookingSchema)
export default eventBookingModel
