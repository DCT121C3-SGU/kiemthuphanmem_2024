import express from 'express'
import { listProduct, addProduct, removeProduct, singleProduct, editProduct, getAvailableQuantity, updateQuantity, productQuantity } from '../controllers/productController.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router()

productRouter.post('/add',
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 }
    ]), 
    addProduct
); // --upload.fields-- upload multi file 
productRouter.post('/remove', adminAuth , removeProduct)
productRouter.post('/single', singleProduct)
productRouter.get('/list', listProduct)
productRouter.post('/edit', adminAuth, editProduct)
productRouter.post('/quantity', getAvailableQuantity)
productRouter.post('/update-quantity', updateQuantity)
productRouter.get('/check-quantity/:productId', productQuantity)

export default productRouter