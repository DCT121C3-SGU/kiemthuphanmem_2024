import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouters from './routes/userRoute.js'
import productRouter from "./routes/productRoute.js";

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

app.get("/", (req, res) => {
    res.send("API WORKING");
});

app.listen(port, () => {
    console.log("server start on port: " + port);
});
