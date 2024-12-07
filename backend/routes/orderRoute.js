import express from "express";
import { placeOrder, placeOrderMoMo, allOrders, userOrders, updateStatus, callbackMomo, transactionStatus, cancelOrder } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Payment Feature
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/momo", authUser, placeOrderMoMo);
orderRouter.post('/callback', callbackMomo);
orderRouter.post('/transaction-status', transactionStatus);
// orderRouter.get('/orders/status/:orderId', checkOrderStatus);

// Admin routes
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// User routes
orderRouter.post("/user-orders", authUser, userOrders);
orderRouter.post("/cancel-order", cancelOrder);

export default orderRouter;
