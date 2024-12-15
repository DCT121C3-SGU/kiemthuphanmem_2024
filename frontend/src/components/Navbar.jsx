import { useContext, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

function NavBar() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, token, setToken, setCartItems } = useContext(ShopContext);
  const logout = () => {
    navigate('/login')
    localStorage.removeItem("token")
    setToken('')
    setCartItems({})
  }

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="w-36" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>TRANG CHỦ</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
        <NavLink to="/menu" className="flex flex-col items-center gap-1">
          <p>THỰC ĐƠN</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
        <NavLink to="/booking" className="flex flex-col items-center gap-1">
          <p>ĐẶT PHÒNG</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
        <NavLink to="/event" className="flex flex-col items-center gap-1">
          <p>SỰ KIỆN</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
        {/* <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>LIÊN HỆ</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink> */}
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          alt=""
          className="w-5 cursor-pointer"
        />
        <div className="group relative">
            <img
              src={assets.profile_icon}
              className="w-5 cursor-pointer"
              alt=""
              onClick={() => token ? null : navigate('/login')}
            />
            {/* ----- dropdown menu ----- */}
            {
              token && <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 px-3 py-5 bg-slate-100 text-gray-500 rounded">
              <p onClick={() => navigate('/profile')} className="cursor-pointer hover:text-black">Hồ sơ của tôi</p>
              <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-black">Đơn hàng</p>
              <p onClick={logout} className="cursor-pointer hover:text-black">Đăng xuất</p>
                </div>
              </div>
            }
        </div>
        <Link to="/card" className="relative">
          <img
            src={assets.cart_icon}
            alt=""
            className="w-5 min-w-5 cursor-pointer"
          />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt=""
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* Sidebar menu for small screen */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} alt="" className="h-4 rotate-180" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            TRANG CHỦ
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/menu"
          >
            THỰC ĐƠN
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/booking"
          >
            ĐẶT CHỔ
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            VỀ CHÚNG TÔI
          </NavLink>
          {/* <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            LIÊN HỆ
          </NavLink> */}
        </div>
      </div>
    </div>
  );
}
export default NavBar;
