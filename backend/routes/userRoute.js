import express from "express";
import { loginUser, registerUser, adminLogin, profileUser, updateUser } from "../controllers/userController.js";
import authUser from '../middleware/auth.js'


const userRouter = express.Router();  // create get and post method

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/profile', authUser, profileUser)
userRouter.put("/update", updateUser);
export default userRouter
