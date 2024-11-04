import { Link } from "react-router-dom"
import { assets } from "../assets/frontend_assets/assets"

const EventItem = ({id, name, amount, des}) => {
    return (
        <Link className="text-gray-700 cursor-pointer" to={`/event/${id}`}>
            <div className="block border-2 border-gray-300 rounded-lg p-3 w-64">
                <div className="overflow-hidden">
                    <img className="hover:scale-110 transition ease-in-out w-64" src={assets.room_icon} alt="" />
                </div>
                <p className="pt-3 pb-1 text-sm">{name}</p>
                <p className="pt-3 pb-1 text-sm">Số lượng: {amount}/ người</p>
                <p className="text-sm font-medium">Mô tả: {des}</p>
            </div>
        </Link>
    )
}

export default EventItem
