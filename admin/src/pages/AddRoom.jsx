import { useState,useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AddRoom = ({token}) => {

    const date = new Date();
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getFullYear()}`;

    const [room_name, setRoomName] = useState('')
    const [room_type, setRoomType] = useState('')
    const [room_price, setRoomPrice] = useState('')
    const [room_status, setRoomStatus] = useState(true)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('room_name',room_name)
            formData.append('room_type',room_type)
            formData.append('room_price',room_price)
            formData.append('room_status',room_status)
            formData.append('room_date',formattedDate)
            const response = await axios.post(backendUrl + "/api/room/add",formData,{headers:{token}})
            if (response.data.success){
                setRoomName('')
                setRoomType('')
                setRoomPrice('')
                toast.success(response.data.message)
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

  return (
      <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
        <div className="w-full">
          <p className="w-full ">Tên phòng</p>
          <input
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Nhập tại đây..."
            onChange={(e)=>setRoomName(e.target.value)}
            value={room_name}
            required
          />
        </div>
        <div className="w-full">
          <p className="w-full ">Loại phòng</p>
          <input
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Nhập tại đây..."
            required
            onChange={(e)=>setRoomType(e.target.value)}
            value={room_type}
          />
        </div>
        <div className="w-full">
          <p className="w-full ">Giá phòng</p>
          <input
            className="w-full max-w-[500px] px-3 py-2"
            type="number"
            placeholder="Nhập tại đây..."
            required
            onChange={(e)=>setRoomPrice(e.target.value)}
            value={room_price}
          />
        </div>
        <button className={`w-40 py-3 mt-4 bg-black text-white`}>
          Thêm phòng
        </button>
      </form>
  );
};

export default AddRoom;
