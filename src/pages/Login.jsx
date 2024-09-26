import { useState } from "react"

const Login = () => {

    const [currentState, setCurrentSate] = useState('Đăng ký')
    const onSubmitHandler = async(event) => {
        event.preventDefault(); // ngăn chặn load trang khi bấm nút đăng nhập
    }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w- [90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-3xl">{currentState}</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        {currentState === 'Đăng nhập' ? '' : <input type="text" className="w-full px-3 py-2 border border-gray-800" placeholder="Họ và tên" required />}
        <input type="email" className="w-full px-3 py-2 border border-gray-800" placeholder="Email" required />
        <input type="password" className="w-full px-3 py-2 border border-gray-800" placeholder="Mật khẩu" required />
        <div className="w-full flex justify-between text-sm mt-[-8px]">
            <p className="cursor-pointer">Quên mật khẩu - <br /> có thể remove vì chưa biết làm</p>
            {
                currentState === "Đăng nhập" ? <p onClick={() => setCurrentSate("Đăng ký")} className="cursor-pointer">Tạo tài khoản</p> : <p onClick={() => setCurrentSate("Đăng nhập")} className="cursor-pointer">Đã có tài khoản</p>
            }
        </div>
        <button className="bg-black text-white font-light px-8 py-2 mt-4">{currentState === "Đăng nhập" ? "Đăng nhập" : "Đăng ký"}</button>
    </form>
  )
}

export default Login