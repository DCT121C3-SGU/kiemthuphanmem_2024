import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    nameEvent: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
})

const eventModel = mongoose.model.event || mongoose.model("event", eventSchema)
export default eventModel
