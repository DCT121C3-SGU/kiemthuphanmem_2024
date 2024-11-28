import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const EventBooking = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchAllEvent = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.post(
        backendUrl + "/api/event/list-event-booking",
        {},
        { headers: { token } }
      );
      console.log(response);
      if (response.data.success) {
        setList(response.data.bookingEvent);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const removeEvent = async(id) => {
    try {
      const response = await axios.post(backendUrl + '/api/event/remove', {id}, {headers: {token}})
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchAllEvent()
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }


  useEffect(() => {
    fetchAllEvent();
    console.log(list);
  }, [token]);

  return (
    <>
      <p className="mb-2">DANH SÁCH EVENT</p>
      <div className="flex flex-col gap-2">
        {/* ----- LIST TABLE TITLE ----- */}
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Thông tin khách hàng</b>
          <b>Tên sự kiện</b>
          <b>Số lượng</b>
        </div>
        {/* ----- LIST TABLE ITEMS ----- */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[2fr_1.5fr_1.5fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <p>
              {item.userData.name} - {item.userData.phone}
            </p>
            <p>
              {item.eventData.nameEvent}
            </p>
            <p>
              {item.amount} vé
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default EventBooking;
