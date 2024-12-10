import { v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, bestseller, quantity } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        if (images.length === 0) {
            return res.json({ success: false, message: "Không có hình ảnh nào để tải lên!" });
        }

        // Upload images to cloudinary
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return { url: result.secure_url, public_id: result.public_id }; // Chắc chắn trả về url và public_id
            })
        );

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            bestseller: bestseller === 'true' ? true : false,
            images: imagesUrl, // Lưu mảng chứa url và public_id của ảnh
            date: Date.now(),
            quantity: Number(quantity)
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Thêm sản phẩm thành công!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



// function for list product
const listProduct = async(req, res) => {
    try {
        const products = await productModel.find({})
        res.json({success:true, products})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// function for remove product
const removeProduct = async (req, res) => {
    try {
        // Tìm sản phẩm theo ID
        const product = await productModel.findById(req.body.id);

        if (!product) {
            return res.json({ success: false, message: "Không tìm thấy sản phẩm!" });
        }

        // Lấy danh sách public_id từ product.images
        const imagePublicIds = product.images.map(image => image.public_id);

        // Xóa từng ảnh trên Cloudinary
        await Promise.all(
            imagePublicIds.map(async (public_id) => {
                await cloudinary.uploader.destroy(public_id); // Xóa ảnh
            })
        );

        // Xóa sản phẩm khỏi cơ sở dữ liệu
        await productModel.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: "Xóa sản phẩm và ảnh thành công!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// function for single product
const singleProduct = async(req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success: true, product})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})      
    }
}

// function for edit product
const editProduct = async (req, res) => {
    try {
        const { productId, name, description, price, category, sizes, bestseller, quantity } = req.body;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.json({ success: false, message: "Không tìm thấy sản phẩm!" });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price ? Number(price) : product.price;
        product.category = category || product.category;
        product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
        product.bestseller = bestseller === 'true' ? true : false;
        product.quantity = quantity ? Number(quantity) : product.quantity;

        await product.save();

        res.json({ success: true, message: "Cập nhật sản phẩm thành công!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getAvailableQuantity = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);

        if (!product) {
            return res.json({ success: false, message: "Không tìm thấy sản phẩm!" });
        }

        res.json({ success: true, quantity: product.quantity });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm!" });
        }

        product.quantity -= quantity;
        await product.save();

        return res.status(200).json({ success: true, message: "Cập nhật số lượng sản phẩm thành công!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
}

const productQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm!" });
        }

        if (product.quantity <= 0){
            return res.status(400).json({ success: false, message: "Sản phẩm đã hết hàng!" });
        }

        return res.status(200).json({ success: true, quantity: product.quantity });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
}


export { listProduct, addProduct, removeProduct, singleProduct, editProduct, getAvailableQuantity, updateQuantity, productQuantity }


