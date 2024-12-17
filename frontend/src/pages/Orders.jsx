import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/frontend_assets/assets";

const Orders = () => {
  const { backendURL, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [orderIds, setOrderIds] = useState([]);
  const [booking, setBooking] = useState([]);
  const [eventBooking, setEventBooking] = useState([]);
  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendURL + "/api/order/user-orders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrderData(response.data.orders);
        let orderIds = [];
        response.data.orders.forEach((order) => {
          orderIds.push(order._id);
        });

        // setOrderData(allOrdersItem.reverse());
        setOrderIds(orderIds);
      }
    } catch (error) {}
  };

  const getUserBooking = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendURL + "/api/room/user-booking",
        {},
        { headers: { token } }
      );
      console.log("response", response);
      if (response.data.success) {
        setBooking(response.data.bookings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserEventBooking = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendURL + "/api/event/user-event-booking",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setEventBooking(response.data.bookings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkButtonSubmit = () => {
    toast.success("Đã cập nhập trạng thái đơn hàng");
  };

  const cancelOrder = async (id) => {
    console.log(id);
    try {
      const response = await axios.post(
        backendURL + "/api/order/cancel-order",
        { orderIds: id }
      );
      if (response.data.success) {
        toast.success("Đơn hàng đã được hủy thành công.");
        loadOrderData();
      } else {
        toast.error("Hủy đơn hàng không thành công.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi hủy đơn hàng.");
      // console.log(error);
    }
  };

  useEffect(() => {
    loadOrderData();
    if (token) {
      getUserBooking();
      getUserEventBooking();
    }
  }, [token]);

  return (
    <div className="border-t pt-16">
      <span className="text-sm text-center">
        <i>
          Với các đơn hàng thanh toán Momo, nếu đơn hàng các bạn thanh toán
          không thành công, chúng tôi sẽ gọi cho bạn để xác nhận và tiến hành
          phương thức thanh toán khác cho bạn. Nếu bạn không nhắc máy, chúng tôi
          sẽ <strong>hủy</strong> đơn hàng của bạn
        </i>
      </span>
      <div className="text-2xl mt-8">
        <Title text1={"ĐƠN HÀNG"} text2={"CỦA TÔI"} />
      </div>
      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={assets.order_icon} alt="" />
              <div>
                <p className="mt-1">
                  Mã đơn hàng:{" "}
                  <span className="text-gray-400">
                    {item.orderId ? item.orderId : "Chưa có mã đơn hàng"}
                  </span>
                </p>
                <p className="mt-1">
                  Ngày đặt hàng:{" "}
                  <span className="text-gray-400">
                    {new Date(item.date).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <p className="mt-1">
                  Tổng giá trị đơn hàng:{" "}
                  <span className="text-gray-400">
                    {item.amount} {currency}
                  </span>
                </p>
                {item.items.map((product, index) => (
                  <div key={index}>
                    <p className="mt-1">
                      {product.name} x {product.quantity}{" "}
                      <a
                        href={`/product/${product._id}`}
                        className="text-blue-500"
                      >
                        Click here
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p
                  className={`min-w-2 h-2 rounded-full ${
                    item.status === "Đã giao"
                      ? "bg-green-500"
                      : item.status === "Đã hủy"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  } bg-green-500`}
                ></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    loadOrderData();
                    checkButtonSubmit();
                  }}
                  className="border px-4 py-2 text-sm font-medium rounded-sm"
                >
                  Kiểm tra trạng thái
                </button>
                <button
                  className={`border px-4 py-2 text-sm font-medium rounded-sm ${
                    item.status === "Đã giao" || item.status === "Đã hủy"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-500 text-white"
                  }`}
                  onClick={() => cancelOrder(item._id)}
                  disabled={item.status === "Đã giao" || item.status === "Đã hủy"}
                >
                  HỦY ĐƠN HÀNG
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-2xl mt-10">
        <Title text1={"ĐẶT"} text2={"PHÒNG"} />
      </div>

      <div>
        {booking.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <div>
                <p className="sm:text-base font-medium">
                  {item.roomData.room_name}
                </p>
                <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                  <p>
                    {item.roomData.room_price} {currency}
                  </p>
                  <p>Loại phòng: {item.roomData.room_type}</p>
                </div>
                <p className="mt-1">
                  Ngày đặt phòng:{" "}
                  <span className="text-gray-400">
                    {" "}
                    {new Date(item.date).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <p className="mt-1">
                  Giờ đặt phòng:{" "}
                  <span className="text-gray-400">{item.slotTime}</span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p
                  className={`min-w-2 h-2 rounded-full ${
                    !item.cancelled && item.isCompleted
                      ? "bg-green-500"
                      : item.cancelled
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  } bg-green-500`}
                ></p>
                <p className="text-sm md:text-base">
                  {!item.cancelled && item.isCompleted
                    ? "Phòng đã được đặt"
                    : item.cancelled
                    ? "Phòng đã hủy"
                    : "Phòng đang chờ xác nhận"}
                </p>
              </div>
              <button
                onClick={() => {
                  getUserBooking();
                  checkButtonSubmit();
                }}
                className="border px-4 py-2 text-sm font-medium rounded-sm"
              >
                Kiểm tra trạng thái đơn hàng
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-2xl mt-10">
        <Title text1={"ĐẶT VÉ"} text2={"SỰ KIỆN"} />
      </div>

      {eventBooking.map((item, index) => (
        <div
          key={index}
          className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex items-start gap-6 text-sm">
            <div>
              <p className="sm:text-base font-medium">
                {item.eventData.nameEvent}
              </p>
              <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                <p>{item.eventData.description}</p>
              </div>
              <p className="mt-1">
                Số lượng:{" "}
                <span className="text-gray-400">{item.amount} vé</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
