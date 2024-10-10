import express from 'express'
import { listRoom, addRoom } from '../controllers/roomController.js'
import upload from '../middleware/multer.js'

const roomRouter = express.Router()

roomRouter.get('/list', listRoom)
roomRouter.post('/add', upload.none(), addRoom)

export default roomRouter
