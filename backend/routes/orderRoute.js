import express from "express";
import { placeOrder, placeOrderMoMo, placeOrderVnpay, allOrders, userOrders, updateStatus } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Payment Feature
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/momo", authUser, placeOrderMoMo);
orderRouter.post("/vnpay", authUser, placeOrderVnpay);

// Admin routes
orderRouter.get("/list", adminAuth, allOrders);
orderRouter.post("/update-status", adminAuth, updateStatus);

// User routes
orderRouter.get("/user-orders", authUser, userOrders);

export default orderRouter;
