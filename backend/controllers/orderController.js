import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import crypto from "crypto";
import axios from "axios";
import { url } from "inspector";
import { raw } from "express";

// Placing order using COD
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    // console.log(req.body);

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: "Không có sản phẩm trong giỏ hàng" });
    }
    if (address.address === "") {
      return res.status(400).json({ success: false, message: "Địa chỉ không được để trống" });
    }
    if (address.firstName === "" || address.lastName === "") {
      return res.status(400).json({ success: false, message: "Họ và Tên không được để trống" });
    }
    if (address.city === "" || address.district === "" || address.ward === "") {
      return res.status(400).json({ success: false, message: "Vui lòng chọn đầy đủ địa chỉ" });
    }
    if (address.phone === "") {
      return res.status(400).json({ success: false, message: "Số điện thoại không được để trống" });
    }
    
    
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      orderId: "COD" + new Date().getTime(),
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.status(200).json({ success: true, message: "Đặt hàng thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Placeing order using momo payment
const placeOrderMoMo = async (req, res) => {
  try {
    const { address, items, amount, userId } = req.body;
    console.log(req.body);

    var accessKey = process.env.MOMO_ACCESS_KEY;
    var secretKey = process.env.MOMO_SECRET_KEY;
    var orderInfo = "pay with MoMo";
    var partnerCode = process.env.MOMO_PARTNER_CODE;
    var redirectUrl = process.env.FRONTEND_URL;
    var ipnUrl = "https://fcdf-2405-4802-9195-d730-c9df-dc44-cf9c-cca6.ngrok-free.app/api/order/callback"; // do mommo không thể chạy trên môi trường localhost nên phải dùng ngrok nhưng ngrok là tài khoản miễn phí nên cần phải nhập thủ công ở đường link này
    var requestType = "payWithMethod";
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = "";
    var orderGroupId = "";
    var autoCapture = true;
    var lang = "vi";

    var rawSignature =
      "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

    //signature
    var signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });
    
    try {
      const response = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("here");
      if (response.data.resultCode === 0) {
        const orderData = {
          userId,
          items,
          address,
          amount,
          paymentMethod: "MoMo",
          payment: false,
          date: Date.now(),
          orderId,
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        
        return res.status(200).json({ success: true, payUrl: response.data.payUrl });
      }
      else {
        return res.status(400).json({ success: false, message: response.data.message });
      }

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const callbackMomo = async (req, res) => {
  try {
    const { orderId, resultCode, signature, amount, extraData, message, orderType, partnerCode, payType, transId} = req.body; // extract parameters from request
    if (resultCode === 0) {
      await orderModel.findOneAndUpdate(
        { orderId }, 
        { payment: true }
      );
    }
    res.status(200).json({ success: true });
    console.log("true");
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const transactionStatus = async (req, res) => {
  const { orderId } = req.body;
  const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&orderId=${orderId}&partnerCode=${process.env.MOMO_PARTNER_CODE}&requestId=${orderId}`;

  const signature = crypto
    .createHmac("sha256", process.env.MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest('hex')

  const requestBody = JSON.stringify({
    partnerCode: process.env.MOMO_PARTNER_CODE,
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: 'vi'
  })

  const option = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  }

  let result = await axios(option);
  return res.status(200).json(result.data);
}



// All orders data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// User Order Data for Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Status form admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderIds } = req.body;
    const order = await orderModel.findOne({ _id: orderIds });
    // console.log("orderIds", orderIds); 

    if (!order) {
      return res.status(404).json({ success: false, message: "Đơn hàng không tồn tại." });
    }
    if (order.status === "Đã giao") {
      return res.status(400).json({ success: false, message: "Đơn hàng đã được giao không thể hủy." });
    }
    order.status = "Đã hủy";
    await order.save();

    for (let i of order.items) {
      // const product = await productModel.findById(i._id);
      await productModel.findByIdAndUpdate(i._id, { $inc: { quantity: i.quantity } });
      console.log("đã cập nhập số lượng sản phẩm");
    }

    res.status(200).json({ success: true, message: "Đơn hàng đã được hủy thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export { placeOrder, placeOrderMoMo, allOrders, userOrders, updateStatus, callbackMomo, transactionStatus, cancelOrder };
