import { Link } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";

const EventItem = ({ id, name, amount, des }) => {
  return (
    <div className="block border-2 border-gray-300 rounded-lg p-3 w-full">
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out w-full h-[40rem]"
          src={assets.banner_event}
          alt=""
        />
      </div>
      <p className="pt-3 pb-1 text-[30px]">{name}</p>
      <p className="pt-3 pb-1 text-xl">Số lượng: {amount}/ người</p>
      <p className="text-xl">Mô tả: {des}</p>
      <Link className="text-gray-700 cursor-pointer" to={`/event/${id}`}>
        <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Đặt vé
        </button>
      </Link>
    </div>
  );
};

export default EventItem;
