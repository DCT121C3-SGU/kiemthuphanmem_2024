import { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import RoomItem from '../components/RoomItem'

const Booking = () => {

  const {roomList} = useContext(ShopContext)

  return (
    <div>
      <div className='flex flex-wrap justify-center md:justify-start gap-8'>
        {roomList.map((item, index) => (
          <RoomItem key={index} id={item._id} name={item.room_name} price={item.room_price} type={item.room_type} />
        ))}
      </div>
    </div>
  )
}

export default Booking