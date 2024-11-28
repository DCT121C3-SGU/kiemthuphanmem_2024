import eventModel from "../models/eventModel.js";
import userModel from "../models/userModel.js";

const addEvent = async (req, res) => {
    try {
        const {nameEvent, description, amount} = req.body
        const eventData = {
            nameEvent,
            description,
            amount,
        }
        const event = new eventModel(eventData)
        await event.save()
        res.json({success: true, message: "Thêm event thành công"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const listEvent = async (req, res) => {
    try {
        const events = await eventModel.find({})
        res.json({success: true, events})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const removeEvent = async(req, res) => {
    try {
        await eventModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: "Xóa event thành công!"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export { addEvent, listEvent, removeEvent }