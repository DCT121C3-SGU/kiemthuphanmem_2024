import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [
        {
            url: { type: String, required: true },      
            public_id: { type: String, required: true }
        }
    ],
    category: { type: String, required: true },
    bestseller: { type: Boolean},
    quantity: { type: Number, required: true},
    date: { type: Number, required: true},
});

const productModel = mongoose.model.product || mongoose.model("product", productSchema)

export default productModel
