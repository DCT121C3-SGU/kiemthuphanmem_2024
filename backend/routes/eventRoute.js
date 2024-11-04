import express from 'express'
import { addEvent, listEvent } from '../controllers/eventController.js'
import { eventBooking, getAmountEvent, updateAmount } from '../controllers/eventBookingController.js'
import upload from '../middleware/multer.js'
import authUser from '../middleware/auth.js'
import adminAuth from "../middleware/adminAuth.js";
import e from 'express'


const eventRouter = express.Router()

eventRouter.post('/add', upload.none(), addEvent)
eventRouter.get('/list', listEvent)
eventRouter.post('/event-booking', authUser, eventBooking)
eventRouter.post('/get-amount', getAmountEvent)
eventRouter.post('/update-amount', updateAmount)
export default eventRouter
