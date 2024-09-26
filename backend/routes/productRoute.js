import express from 'express'
import { listProduct, addProduct, removeProduct, singleProduct } from '../controllers/productController.js'
import upload from '../middleware/multer.js'

const productRouter = express.Router()

productRouter.post('/add', upload.fields([{name:'image1',macCount:1},{name:'image2',macCount:1},{name:'image3',macCount:1},{name:'image4',macCount:1}]),addProduct)
productRouter.post('/remove', removeProduct)
productRouter.post('/single', singleProduct)
productRouter.get('/list', listProduct)

export default productRouter