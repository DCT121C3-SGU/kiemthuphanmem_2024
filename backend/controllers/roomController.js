import roomModel from "../models/roomModel.js";
import userModel from "../models/userModel.js";
import bookingModel from "../models/bookingModel.js";

const addRoom = async (req, res) => {
    try {
        const { room_name, room_type, room_price, room_status, room_date } = req.body;


        const roomData = {
            room_name,
            room_type,
            room_price,
            room_date,
            room_status,
        }

        const room = new roomModel(roomData);
        await room.save();

        res.json({success: true, message: "Thêm phòng thành công"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const listRoom = async (req, res) => {
    try {
        const rooms = await roomModel.find({})
        res.json({success: true, rooms});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

const bookingRoom = async(req, res) => {
    try {
        const {userId, roomId, slotDate, slotTime} = req.body
        const roomData = await roomModel.findById(roomId)
        if (!roomData.room_status) {
            return res.json({success:false, message:"Phòng không tồn tại"})
        }
        let room_booked = roomData.room_booked
        if(room_booked[slotDate]){
            if(room_booked[slotDate].includes(slotTime)) {
                return res.json({success:false, message:"Phòng đã được đặt vào thời gian này"})
            } else {
                room_booked[slotDate].push(slotTime)
            }
        } else {
            room_booked[slotDate] = []
            room_booked[slotDate].push(slotTime)
        }
        const userData = await userModel.findById(userId)
        delete roomData.room_booked
        const bookingData = {
            userId,
            roomId,
            userData,
            roomData,
            amount:roomData.room_price,
            slotTime,
            slotDate,
            date: Date.now()
        }
        const newBooking = new bookingModel(bookingData)
        await newBooking.save()

        // save new slot data to room
        await roomModel.findByIdAndUpdate(roomId, {room_booked})
        res.json({success:true, message:"Đặt phòng thành công"})
   } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

const listBooking = async(req,res) => {
    try {
        const bookingRoom =  await bookingModel.find({})
        res.json({success:true, bookingRoom})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})  
    }
}

const userBooking = async(req,res) => {
    try {
        const { userId } = req.body
        const bookings = await bookingModel.find({userId})
        res.status(200).json({ success: true, bookings })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const bookingCancel = async (req, res) => {
    try {
        const { bookingId, cancel, complete } = req.body;
        await bookingModel.findByIdAndUpdate(bookingId, {
            cancelled: cancel,
            isCompleted: complete
        });
        res.status(200).json({ success: true, message: "Cập nhật trạng thái đơn hàng thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




export { listRoom, addRoom, bookingRoom, listBooking, userBooking, bookingCancel }
