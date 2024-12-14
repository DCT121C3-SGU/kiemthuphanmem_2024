import { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [currentState, setCurrentSate] = useState("Đăng nhập");
  const { token, setToken, backendURL } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Kiểm tra định dạng số điện thoại Việt Nam
  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault(); // ngăn chặn load trang khi bấm nút đăng nhập
    try {
      if (currentState === "Đăng ký") {
        if (!isValidPhoneNumber(phone)) {
          toast.error("Số điện thoại không hợp lệ");
          return;
        }

        const response = await axios.post(backendURL + "/api/user/register", {
          name,
          email,
          password,
          phone,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendURL + "/api/user/login", {
          email,
          password,
        });
        console.log(response);
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
          setEmail("");
          setPassword("");
        }
      }
    } catch (error) {
        setEmail("");
        setPassword("");
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Đăng nhập" ? (
        ""
      ) : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Họ và tên"
          required
        />
      )}
      {currentState === "Đăng nhập" ? (
        ""
      ) : (
        <input
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          type="phone"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Số điện thoại"
          required
        />
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Mật khẩu"
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        {currentState === "Đăng nhập" ? (
          <p
            onClick={() => setCurrentSate("Đăng ký")}
            className="cursor-pointer"
          >
            Tạo tài khoản
          </p>
        ) : (
          <p
            onClick={() => setCurrentSate("Đăng nhập")}
            className="cursor-pointer"
          >
            Đã có tài khoản
          </p>
        )}
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === "Đăng nhập" ? "Đăng nhập" : "Đăng ký"}
      </button>
    </form>
  );
};

export default Login;
