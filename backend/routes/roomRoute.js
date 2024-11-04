import express from 'express'
import { listRoom, addRoom, bookingRoom, listBooking, userBooking, bookingCancel } from '../controllers/roomController.js'
import upload from '../middleware/multer.js'
import authUser from '../middleware/auth.js'
import adminAuth from "../middleware/adminAuth.js";


const roomRouter = express.Router()

roomRouter.get('/list', listRoom)
roomRouter.post('/add', upload.none(), addRoom)
roomRouter.post('/booking', authUser, bookingRoom)
roomRouter.post('/user-booking', authUser, userBooking)
//Admin
roomRouter.post('/list-booking', adminAuth, listBooking)
roomRouter.post('/cancel-booking', adminAuth, bookingCancel)
export default roomRouter
