import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const EventDetail = () => {
  const { eventId } = useParams();
  const { backendURL, token } = useContext(ShopContext);
  const [amount, setAmount] = useState(0);
  const [availableAmount, setAvailableAmount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableAmount = async () => {
      try {
        const { data } = await axios.post(backendURL + "/api/event/get-amount", { eventId });
        setAvailableAmount(data.amountEvent);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching available amount");
      }
    };

    fetchAvailableAmount();
  }, [eventId, backendURL]);

  useEffect(() => {
    if (availableAmount !== null && amount > availableAmount) {
      toast.warning(`Số lượng vé bạn đặt vượt quá số lượng vé còn lại (${availableAmount} vé còn lại).`);
      setAmount(0);  // Reset to 0 if over limit
    }
  }, [amount, availableAmount]);

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setAmount(value >= 0 ? value : 0);  // Prevent negative values
  };

  const eventBooking = async () => {
    if (!token) {
      toast.warning("Vui lòng đăng nhập trước khi đặt phòng");
      return navigate("/login");
    }
  
    if (amount === 0) {
      toast.warning("Vui lòng nhập số lượng vé hợp lệ.");
      return;
    }
  
    try {
      const bookingResponse = await axios.post(
        backendURL + "/api/event/event-booking",
        { eventId, amount },
        { headers: { token } }
      );
  
      if (bookingResponse.data.success) {
        toast.success("Đặt vé thành công!");
  
        // Update amount after successful booking
        const updateResponse = await axios.post(
          backendURL + "/api/event/update-amount",
          { eventId, amountUser: amount },
          { headers: { token } }
        );
  
        if (updateResponse.data.success) {
          navigate("/orders"); // Redirect to /orders after successful booking and update
        } else {
          toast.error("Error updating ticket amount.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  

  return (
    <div>
      <form
        className="w-full h-full border rounded-lg p-8 text-center"
      >
        <h2 className="font-medium text-2xl mb-10">Đăng ký tham gia sự kiện</h2>
        <p className="mb-10">
          <i>
            Thông tin tham gia sự kiện sẽ được lấy thông tin từ tài khoản hiện
            tại của khách hàng.
          </i>
        </p>
        <label>Số lượng đặt vé</label>
        <br />
        <input
          onChange={handleAmountChange}
          value={amount}
          className="border outline-none p-2 text-center"
          type="number"
        />
        <br />
        <button
          type="button"
          onClick={eventBooking}
          className="mt-10 bg-sky-500 p-2 rounded-sm"
        >
          Đặt vé sự kiện
        </button>
      </form>
    </div>
  );
};

export default EventDetail;
