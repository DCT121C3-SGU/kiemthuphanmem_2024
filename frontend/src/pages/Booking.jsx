import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const Booking = () => {
  const {backendURL} = useContext(ShopContext)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState('');

  const handleDateChange = (date) => {
    const currentDate = new Date();
    
    if (date < currentDate) {
      setErrorMessage('Ngày giờ đặt phòng phải sau thời điểm hiện tại!');
    } else {
      setSelectedDate(date);
      setErrorMessage('');
    }
  };
  const onSubmitHandler = async(event) => {
    event.preventDefault();
    toast.success('Đặt phòng thành công');
    const response = await axios.get(backendURL + "/api/room/list")
    console.log(response)
  }

  return (
    <div className="flex flex-col md:justify-center sm:flex-row bg-white shadow-xl rounded-xl p-5 md:p-8 md:my-4 text-gray-700 md:w-[60%] m-auto">
      <form action="" className='w-full'>
        <h2 className="text-2xl text-center font-bold pb-5">ĐẶT BÀN</h2>
        <div className="flex flex-col gap-2 mb-8">
          <span>Họ và tên</span>
          <input type="text" className="p-2 rounded-md border border-gray-300" />
        </div>
        <div className="flex flex-col gap-2 mb-8">
          <span>Số điện thoại</span>
          <input type="phone" className="p-2 rounded-md border border-gray-300" />
        </div>
        <div className="flex flex-col gap-2 mb-8">
          <span>Chọn phòng</span>
          <select name="" id="" className="p-2 rounded-md border border-gray-300">
            <option value="1">Phòng 1</option>
            <option value="2">Phòng 2</option>
            <option value="3">Phòng 3</option>
          </select>
          <span className="flex items-center gap-2">
            <span className="rounded-full bg-green-500 w-2 h-2"></span>
            <span>Còn phòng</span>
          </span>
        </div>

        {/* Chọn ngày giờ */}
        <div className="flex flex-col gap-2 mb-8">
          <span>Chọn ngày giờ</span>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="Pp"
            minDate={new Date()}
            className="p-2 rounded-md border border-gray-300"
          />
          {errorMessage && (
            <span className="text-red-500 text-sm">{errorMessage}</span>
          )}
        </div>
        <button type="submit" onClick={onSubmitHandler} className="bg-blue-500 text-white p-2 rounded-md">ĐẶT PHÒNG</button>
      </form>
    </div>
  );
};

export default Booking;
