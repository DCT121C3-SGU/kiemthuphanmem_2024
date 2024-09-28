import { v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';

// function for add product
const addProduct = async(req, res) => {
    try {
        console.log(req.files); // Log the entire req.files object

        const { name, description, price, category, sizes, bestseller } = req.body;

        const image1 =  req.files.image1 && req.files.image1[0];
        const image2 =  req.files.image2 && req.files.image2[0];
        const image3 =  req.files.image3 && req.files.image3[0];
        const image4 =  req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined); // make sure to remove undefined values

        // Upload images to cloudinary
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,{resource_type: 'image'});
                return result.secure_url; 
            })
        );
        
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === 'true' ? true : false,
            image: imagesUrl,
            date: Date.now(),
        }

        console.log(productData)

        const product = new productModel(productData);
        await product.save();

        res.json({success: true, message: "Thêm sản phẩm thành công!"});

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// function for list product
const listProduct = async(req, res) => {

}

// function for remove product
const removeProduct = async(req, res) => {

}

// function for single product
const singleProduct = async(req, res) => {

}

export { listProduct, addProduct, removeProduct, singleProduct }

