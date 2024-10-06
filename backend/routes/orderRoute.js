import express from "express";
import { placeOrder, placeOrderMoMo, allOrders, userOrders, updateStatus } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Payment Feature
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/momo", authUser, placeOrderMoMo);

// Admin routes
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// User routes
orderRouter.post("/user-orders", authUser, userOrders);

export default orderRouter;
