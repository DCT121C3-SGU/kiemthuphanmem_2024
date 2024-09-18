import { assets } from '../assets/frontend_assets/assets'
import { NavLink } from 'react-router-dom'

function Navbar() {
    return(
        <div className='flex items-center justify-between py-5 font-medium'>
            <img src={assets.logo} alt="logo" className='w-36' />

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to='/' className="flex flex-col items-center gap-1">
                    <p>TRANG CHỦ</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'></hr>
                </NavLink>
                <NavLink to='/menu' className="flex flex-col items-center gap-1">
                    <p>THỰC ĐƠN</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'></hr>
                </NavLink>
                <NavLink to='/booking' className="flex flex-col items-center gap-1">
                    <p>ĐẶT CHỔ</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'></hr>
                </NavLink>
                <NavLink to='/about' className="flex flex-col items-center gap-1">
                    <p>VỀ CHÚNG TÔI</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'></hr>
                </NavLink>
                <NavLink to='/contact' className="flex flex-col items-center gap-1">
                    <p>LIÊN HỆ</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'></hr>
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                <img src={assets.search_icon} alt=""  className='w-5 cursor-pointer'/>
                <div className='group relative'>
                    <img src={assets.profile_icon} className='w-5 cursor-pointer' alt="" />
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                        <div className='flex flex-col gap-2 w-36 px-3 py-5 bg-slate-100 text-gray-500 rounded'>
                            <p className='cursor-pointer hover:text-black'>Hồ sơ của tôi</p>
                            <p className='cursor-pointer hover:text-black'>Đơn hàng</p>
                            <p className='cursor-pointer hover:text-black'>Đăng xuất</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Navbar