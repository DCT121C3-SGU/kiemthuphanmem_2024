import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AddEvent = ({token}) => {

    const [eventName, setEventName] = useState('')
    const [eventDes, setEventDes] = useState('')
    const [eventAmount, setEventAmount] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('nameEvent', eventName)
            formData.append('description', eventDes)
            formData.append('amount', eventAmount)
            const response = await axios.post(backendUrl + "/api/event/add", formData, { headers: { token } })
            if (response.data.success) {
                setEventName('')
                setEventDes('')
                setEventAmount('')
                toast.success(response.data.message)
            } else {
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
          <p className="w-full ">Tên sự kiện</p>
          <input
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Nhập tại đây..."
            onChange={(e)=>setEventName(e.target.value)}
            value={eventName}
            required
          />
        </div>
        <div className="w-full">
          <p className="w-full ">Chi tiết sự kiện</p>
          <input
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Nhập tại đây..."
            required
            onChange={(e)=>setEventDes(e.target.value)}
            value={eventDes}
          />
        </div>
        <div className="w-full">
          <p className="w-full ">Số lượng</p>
          <input
            className="w-full max-w-[500px] px-3 py-2"
            type="number"
            placeholder="Nhập tại đây..."
            required
            onChange={(e)=>setEventAmount(e.target.value)}
            value={eventAmount}
          />
        </div>
        <button className={`w-40 py-3 mt-4 bg-black text-white`}>
          Thêm sự kiện
        </button>
      </form>
  );
};

export default AddEvent;
