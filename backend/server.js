import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouters from './routes/userRoute.js'
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import roomRouter from "./routes/roomRoute.js";
import eventRouter from "./routes/eventRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB()
connectCloudinary()

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/user', userRouters)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/room', roomRouter)
app.use('/api/event', eventRouter)

app.get("/", (req, res) => {
    res.send("API WORKING");
});

const server = app.listen(port, () => {
    console.log("server start on port: " + port);
});

export {app, server};