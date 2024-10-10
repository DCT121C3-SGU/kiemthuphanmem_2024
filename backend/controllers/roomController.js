import roomModel from "../models/roomModel.js";

const addRoom = async (req, res) => {
    try {
        const { room_name, room_type, room_price, room_status, room_date } = req.body;
        const roomData = {
            room_name,
            room_type,
            room_price,
            room_status: room_status === 'true' ? true : false,
            room_date,
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

export { listRoom, addRoom }
