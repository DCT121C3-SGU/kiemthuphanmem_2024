import express from 'express'
import { listRoom, addRoom, bookingRoom } from '../controllers/roomController.js'
import upload from '../middleware/multer.js'
import authUser from '../middleware/auth.js'

const roomRouter = express.Router()

roomRouter.get('/list', listRoom)
roomRouter.post('/add', upload.none(), addRoom)
roomRouter.post('/booking', authUser, bookingRoom)
export default roomRouter
