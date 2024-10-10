import React from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const ListRoom = () => {
    
    const [listRoom, setListRoom] = useState([])

    const fetchListRoom = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/room/list')
            if (response.data.success){
                setListRoom(response.data.rooms)
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchListRoom()
    }, [])

    const checkRoom = () => {
        fetchListRoom()
    }



  return (
    <>
      <p className="mb-2">DANH SÁCH PHÒNG</p>
      <div className="flex flex-col gap-2">
          {/* ----- LIST TABLE TITLE ----- */}
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
            <b>Tên phòng</b>
            <b>Loại</b>
            <b>Giá</b>
            <b>Tình trạng</b>
            <b></b>
          </div>
          {/* ----- LIST TABLE ITEMS ----- */}
          {
            listRoom.map((item, index) => (
              <div className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm" key={index}>
                <p>{item.room_name}</p>
                <p>{item.room_type}</p>
                <p>{item.room_price}</p>
                <p>
                    {item.room_status ? (
                        <>
                            <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></span>
                            Trống
                        </>
                    ) : (
                        <>
                            <span className="w-2 h-2 bg-red-500 rounded-full inline-block mr-2"></span>
                            Có người
                        </>
                    )}
                </p>
                <button onClick={checkRoom} className='bg-blue-500 text-white px-2 py-1 rounded-md md:w-32'>
                    Kiểm tra
                </button>
              </div>
            ))
          }
      </div>  
    </>
  )
}

export default ListRoom