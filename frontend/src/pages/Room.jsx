import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
  
const Room = () => {
  const { roomId } = useParams();
  const { roomList, currency, backendURL, token, getRoomData } = useContext(ShopContext);
  const navigate = useNavigate()
  const daysOfWeek = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  const [roomData, setRoomData] = useState();
  const [roomSlot, setRoomSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchRoomData = async () => {
    const roomInfo = roomList.find((room) => room._id === roomId);
    setRoomData(roomInfo);
  };

  const getAvailableSlots = async () => {
    setRoomSlot([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0); // set end time to 9pm

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 7 ? currentDate.getHours() + 1 : 7
        ); // start time 7am
        currentDate.setMinutes(0);
      } else {
        currentDate.setHours(7);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()
        const slotDate = `${day}/${month}/${year}`
        const slotTime = formattedTime
        const isSlotAvailable = roomData.room_booked[slotDate] && roomData.room_booked[slotDate].includes(slotTime) ? false : true
        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }
        currentDate.setHours(currentDate.getHours() + 2); // change to increment by 1 hour
      }
      setRoomSlot((prev) => [...prev, timeSlots]);
    }
  };

  const bookingRoom = async () => {
    if (!token) {
      toast.warning("Vui lòng đăng nhập trước khi đặt phòng")
      return navigate('/login')
    }
    try {
      const date = roomSlot[slotIndex][0].dateTime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      const slotDate = `${day}/${month}/${year}`
      const { data } = await axios.post(backendURL + '/api/room/booking', {
        roomId, slotDate, slotTime
      }, {headers: {token}})
      if (data.success) {
        toast.success(data.message)
        getRoomData()
        navigate('/orders')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchRoomData();
  }, [roomId, roomList]);

  useEffect(() => {
    if (roomData) {
      getAvailableSlots();
    }
  }, [roomData]);
  useEffect(() => {
    console.log(roomSlot);
  }, [roomSlot]);

  return roomData ? (
    <div>
      {/* ----- Room info ----- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-slate-200 w-full sm:max-w-72 rounded-lg p-5"
            src={assets.room_icon}
            alt=""
          />
        </div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[0px] sm:mt-0">
          {/* ----- Room info ----- */}
          <p className="text-2xl font-medium text-gray-900">
            {roomData.room_name}
          </p>
          <div className="flex items-center gap-2 text-base mt-1 text-gray-500">
            <p>Loại: {roomData.room_type}</p>
          </div>
          {/* ----- Room description ----- */}
          <div>
            <p className="text-sm font-medium text-gray-900 mt-3">Giới thiệu</p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">
              Phòng Lớn của chúng tôi là không gian lý tưởng để tổ chức các sự
              kiện quan trọng như hội nghị, hội thảo, hoặc tiệc tùng với sức
              chứa rộng rãi, thiết kế hiện đại và tiện nghi cao cấp. Với ánh
              sáng tự nhiên, không gian thoáng đãng, và trang thiết bị âm thanh
              chất lượng, phòng đáp ứng nhu cầu của các sự kiện có quy mô lớn.
              Đây là nơi bạn có thể tạo nên những khoảnh khắc đáng nhớ bên bạn
              bè, đồng nghiệp, hay đối tác.
            </p>
          </div>
          <p className="text-gray-500 font-medium mt-4">
            Giá:{" "}
            <span className="text-gray-600">
              {roomData.room_price} {currency}/giờ
            </span>
          </p>
        </div>
      </div>
      {/* ----- Booking slots ----- */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Chọn ngày</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {roomSlot.length &&
            roomSlot.map((item, index) => (
              <div
                className={`text-center py-2 min-w-28 cursor-pointer ${
                  slotIndex === index
                    ? "bg-blue-500 text-white"
                    : "border border-gray-400"
                }`}
                key={index}
                onClick={() => setSlotIndex(index)}
              >
                <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            ))}
        </div>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {roomSlot.length &&
            roomSlot[slotIndex].map((item, index) => (
              <p
                className={`text-sm font-light flex-shrink-0 px-5 py-2 cursor-pointer ${
                  item.time === slotTime
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 border border-gray-400"
                }`}
                key={index}
                onClick={() => setSlotTime(item.time)}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>
        <button onClick={bookingRoom} className="bg-blue-500 text-white px-5 py-2 rounded-lg mt-4">Đặt phòng</button>
      </div>
    </div>
  ) : (
    <div>
      <h1>Loading...</h1>
    </div>
  );
};

export default Room;
