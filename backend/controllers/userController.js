// logic create user or login
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

//Route for user login
const loginUser = async(req, res) => {

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

}

export { loginUser, registerUser, adminLogin }