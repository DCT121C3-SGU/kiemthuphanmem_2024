import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import crypto from 'crypto';
import axios from 'axios';


// Placing order using COD
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, {cartData: {}});
        res.status(200).json({ success: true, message: "Đặt hàng thành công"});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Placeing order using momo payment
const placeOrderMoMo = async (req, res) => {
    try {
        const { address, items, amount, userId } = req.body; // Added userId to the destructured body
        
        // MoMo API configuration
        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;
        const returnUrl = process.env.FRONTEND_URL + '/payment/momo/callback';
        const notifyUrl = process.env.BACKEND_URL + '/api/payment/momo/ipn';
        const requestType = "captureWallet"
        const orderId = Date.now().toString();
        const requestId = orderId;
        const extraData = "";

        // Create signature
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=Thanh toan don hang&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        // Prepare payload for MoMo API
        const payload = {
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: "Thanh toan don hang",
            redirectUrl: returnUrl,
            ipnUrl: notifyUrl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
            lang: "vi"
        };

        // Send request to MoMo API
        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', payload);

        if (response.data.resultCode === 0) {
            // Update order in MongoDB after successful payment
            const orderData = {
                userId,
                items,
                address,
                amount,
                paymentMethod: "MoMo",
                payment: true, // Set payment to true
                date: Date.now(),
                transactionId: response.data.orderId // Assuming orderId is returned from MoMo
            };
            const newOrder = new orderModel(orderData);
            await newOrder.save(); // Save the new order to MongoDB
            await userModel.findByIdAndUpdate(userId, {cartData: {}});
            
            res.json({ success: true, payUrl: response.data.payUrl });
        } else {
            res.json({ success: false, message: response.data.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log("loi o day");
    }
}

// All orders data for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message });
    }
}

// User Order Data for Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({userId});
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update Order Status form admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status} = req.body
        await orderModel.findByIdAndUpdate(orderId, {status});
        res.status(200).json({ success: true, message: "Cập nhật trạng thái đơn hàng thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export { placeOrder, placeOrderMoMo, allOrders, userOrders, updateStatus };
