// logic create user or login
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import roomModel from '../models/roomModel.js'

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

//Route for user login
const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({email})
        if (!email) {
            return res.status(400).json({ success: false, message: "Email không được bỏ trống" });
        }
        
        if (!password) {
            return res.status(400).json({ success: false, message: "Mật khẩu không được bỏ trống" });
        }
        if (!user) {
            return res.status(404).json({success:false, message:"Tài khoản không tồn tại" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = createToken(user._id)
            res.status(200).json({success : true , message: "Đăng nhập thành công", token });
        }
        else{
            res.status(401).json({success:false, message:"Tài khoản hoặc mật khẩu không đúng"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:error.message})
    }
}

// Route for user register
const registerUser = async(req, res) => {
    try {
        const { name, email, password, phone } = req.body
        // check user already exists or not
        const exists = await userModel.findOne({email})
        if (exists) {
            return res.status(400).json({success:false, message:"Tài khoản đã tồn tại" })
        }
        // validate email format and strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({success:false, message:"Email không hợp lệ" })
        }
        if (password.length <= 8){
            return res.status(400).json({success:false, message:"Mật khẩu phải chứa hơn 8 kí tự" })
        }
        // hashing password
        const salt = await bcrypt.genSalt(10) // 5 -> 15
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name,
            email,
            phone,
            password:hashedPassword
        })

        const user = await newUser.save()

        //after create user, provide token
        const token = createToken(user._id)

        res.status(201).json({success:true, message: "Đăng ký thành công",  token})

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:error.message})
    }
}

// Route for admin login
const adminLogin = async(req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // sign(payload, jwt_secret_key) create jwt
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.status(200).json({success:true, token})
        }
        else{
            res.status(401).json({success:false, message:"Tài khoản hoặc mật khẩu không đúng" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:error.message})
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

const profileUser = async(req, res) => {
    try {
        const {userId} = req.body
        const userData = await userModel.findById(userId)
        res.json({success:true, userData})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

const updateUser = async (req, res) => {
    try {
        const { userId, phone, address } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "Người dùng không tồn tại" });
        }
        if (phone) {
            if (!validator.isMobilePhone(phone, "vi-VN")) {
                return res.json({ success: false, message: "Số điện thoại không hợp lệ" });
            }
            user.phone = phone;
        }
        if (address) {
            user.address = address;
        }
        await user.save();
        res.json({ success: true, message: "Cập nhật thông tin thành công", user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export {loginUser, registerUser, adminLogin, bookingRoom, profileUser, updateUser }