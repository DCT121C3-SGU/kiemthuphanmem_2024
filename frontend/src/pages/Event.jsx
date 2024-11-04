import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import EventItem from '../components/EventItem'

const Event = () => {
    
    const {eventList} = useContext(ShopContext)
    
  return (
    <div>
      <div className='flex flex-wrap justify-center md:justify-start gap-8'>
        {eventList.map((item, index) => (
          <EventItem key={index} id={item._id} name={item.nameEvent} amount={item.amount} des={item.description} />
        ))}
      </div>
    </div>
  )
}

export default Event