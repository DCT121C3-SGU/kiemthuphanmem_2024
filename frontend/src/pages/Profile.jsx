import React, { useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { backendURL, token } = useContext(ShopContext);
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState({});

  const profileUser = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        `${backendURL}/api/user/profile`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setProfile(response.data.userData);
        setEditableProfile(response.data.userData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${backendURL}/api/user/update`,
        { userId: profile._id, ...editableProfile },
        { headers: { token } }
      );
      if (response.data.success) {
        setProfile(response.data.user);
        setIsEditing(false);
        toast.success("Cập nhật thông tin thành công!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile({ ...editableProfile, [name]: value });
  };

  useEffect(() => {
    profileUser();
  }, [token]);

  return (
    <div className="w-96 h-full">
      <div className="w-[100rem] h-[25rem] shadow-lg">
        <h1 className="text-center text-2xl font-medium mt-20">
          Hồ sơ của tôi
        </h1>
        <div className="mt-20">
          <p className="text-xl mt-5 text-center">
            <strong>Tên:</strong> {profile.name}
          </p>
          <div className="text-xl mt-5 text-center">
            <strong>Email:</strong> {profile.email}
          </div>
          <div className="text-xl mt-5 text-center">
            <strong>Số điện thoại:</strong>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={editableProfile.phone || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 ml-2"
              />
            ) : (
              <span className="ml-2">{profile.phone}</span>
            )}
          </div>
          <div className="text-xl mt-5 text-center">
            <strong>Địa chỉ:</strong>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={editableProfile.address || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 ml-2"
              />
            ) : (
              <span className="ml-2">{profile.address}</span>
            )}
          </div>
          <div className="flex justify-center mt-10">
            {isEditing ? (
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Lưu
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Chỉnh sửa
              </button>
            )}
            {isEditing && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditableProfile(profile); // Khôi phục thông tin ban đầu
                }}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Hủy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
