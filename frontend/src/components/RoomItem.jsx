import { useContext } from "react"
import { ShopContext } from "../context/ShopContext" 
import { Link } from "react-router-dom"
import { assets } from "../assets/frontend_assets/assets"

const RoomItem = ({id, name, price, type}) => {
    const {currency} = useContext(ShopContext);
    return (
        <Link className="text-gray-700 cursor-pointer" to={`/room/${id}`}>
            <div className="block border-2 border-gray-300 rounded-lg p-3 w-64">
                <div className="overflow-hidden">
                    <img className="hover:scale-110 transition ease-in-out w-64" src={assets.room_icon} alt="" />
                </div>
                <p className="pt-3 pb-1 text-sm">{name}</p>
                <p className="pt-3 pb-1 text-sm">{type}</p>
                <p className="text-sm font-medium">{price} {currency}</p>
            </div>
        </Link>
    )
}

export default RoomItem
