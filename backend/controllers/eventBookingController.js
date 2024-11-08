import eventModel from "../models/eventModel.js";
import userModel from "../models/userModel.js";
import eventBookingModel from "../models/eventBookingModel.js";

const eventBooking = async (req, res) => {
    try {
        const {userId, eventId,amount } = req.body
        const userData = await userModel.findById(userId)
        const eventData = await eventModel.findById(eventId)
        const eventBookingData = {
            userId,
            eventId,
            userData,
            eventData,
            amount,
        }
        const newEventBooking = new eventBookingModel(eventBookingData)
        await newEventBooking.save()
        res.json({success:true, message:"Đặt phòng thành công"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})  
    }
}

const updateAmount = async (req, res) => {
    try {
      const { eventId, amountUser } = req.body;
  
      // Find the current event details
      const event = await eventModel.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
  
      // Check if the amountUser exceeds the available amount
      if (amountUser > event.amount) {
        return res.status(400).json({ success: false, message: "Not enough tickets available" });
      }
  
      // Update the amount by subtracting the amountUser
      event.amount -= amountUser;
      await event.save();
  
      res.status(200).json({ success: true, message: "Cập nhật số lượng vé thành công" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

const getAmountEvent = async(req, res) => {
    const {eventId} = req.body
    try {
        const response = await eventModel.findById(eventId)
        const amountEvent = response.amount
        res.json({success: true, amountEvent})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})  
    }
}

const userEventBooking = async(req,res) => {
    try {
        const { userId } = req.body
        const bookings = await eventBookingModel.find({userId})
        res.status(200).json({ success: true, bookings })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const listEventBooking = async(req,res) => {
    try {
        const bookingEvent =  await eventBookingModel.find({})
        res.json({success:true, bookingEvent})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})  
    }
}

export { eventBooking, getAmountEvent, updateAmount, userEventBooking, listEventBooking }