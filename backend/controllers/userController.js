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
        if (!user) {
            return res.json({success:false, message:"Tài khoản không tồn tại" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = createToken(user._id)
            res.json({success : true , token })
        }
        else{
            res.json({success:false, message:"Bạn ơi hình như có gì đó sai sai!"})
        }
    } catch (error) {
        console.log(error);
        console.log("error here");
        res.json({success:false, message:error.message})
    }
}


// Route for user register
const registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body
        // check user already exists or not
        const exists = await userModel.findOne({email})
        if (exists) {
            return res.json({success:false, message:"Tài khoản đã tồn tại" })
        }
        // validate email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"Email không hợp lệ" })
        }
        if (password.length <= 8){
            return res.json({success:false, message:"Mật khẩu phải chứa hơn 8 kí tự" })
        }
        // hashing password
        const salt = await bcrypt.genSalt(10) // 5 -> 15
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name,
            email,
            password:hashedPassword
        })

        const user = await newUser.save()

        //after create user, provide token
        const token = createToken(user._id)

        res.json({success:true, token})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// Route for admin login
const adminLogin = async(req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // sign(payload, jwt_secret_key) create jwt
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({success:true, token})
        }
        else{
            res.json({success:false, message:"Tài khoản hoặc mật khẩu không đúng" })
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
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

export { loginUser, registerUser, adminLogin, bookingRoom }