import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const Booking = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchAllBooking = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.post(
        backendUrl + "/api/room/list-booking",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setList(response.data.bookingRoom);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const cancelBooking = async (e, _id) => {
    const status = e.target.value;
    const cancel = status === "Đã hủy";
    const complete = status === "Đã xác nhận";

    try {
      const response = await axios.post(
        backendUrl + "/api/room/cancel-booking",
        { bookingId: _id, cancel, complete },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllBooking(); // Refresh bookings after update
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllBooking();
  }, [token]);

  return (
    <>
      <p className="mb-2">DANH SÁCH ĐẶT PHÒNG</p>
      <div className="flex flex-col gap-2">
        {/* ----- LIST TABLE TITLE ----- */}
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Thông tin khách hàng</b>
          <b>Loại phòng</b>
          <b>Ngày đặt</b>
          <b className="text-center">Xác nhận</b>
          <b className="text-center">Hủy đặt phòng</b>
        </div>
        {/* ----- LIST TABLE ITEMS ----- */}
        {list.map((item, index) => (
          <div
            className={`grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm ${
              item.cancelled
                ? "bg-red-500" // Red background if cancelled
                : item.isCompleted
                ? "bg-green-500" // Green background if completed
                : "bg-yellow-500" // Yellow background for pending
            }`}
            key={index}
          >
            <p>
              {item.userData.name} - {item.userData.phone}
            </p>
            <p>
              {item.roomData.room_name} - {item.roomData.room_price} {currency}
            </p>
            <p>
              {item.slotDate} - {item.slotTime}
            </p>
            <p className="text-right md:text-center cursor-pointer text-lg">
              Xác nhận
            </p>
            <select
              value={
                item.cancelled
                  ? "Đã hủy"
                  : item.isCompleted
                  ? "Đã xác nhận"
                  : "Chờ xác nhận"
              }
              onChange={(e) => cancelBooking(e, item._id)}
              className="p-2 font-medium"
            >
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        ))}
      </div>
    </>
  );
};

export default Booking;
