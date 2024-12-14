import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const ListRoom = ({token}) => {
    const [listRoom, setListRoom] = useState([]);
    const [editingRoom, setEditingRoom] = useState(null);
    const [editForm, setEditForm] = useState({
        room_name: '',
        room_type: '',
        room_price: '',
    });

    const fetchListRoom = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/room/list');
            if (response.data.success) {
                setListRoom(response.data.rooms);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchListRoom();
    }, []);

    const handleEditClick = (room) => {
        setEditingRoom(room._id); 
        setEditForm({
            room_name: room.room_name,
            room_type: room.room_type,
            room_price: room.room_price,
        });
    };

    const handleUpdateRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(backendUrl + '/api/room/update-room', {
                id: editingRoom,
                ...editForm,
            },{headers:{token}});
            if (response.data.success) {
                toast.success(response.data.message);
                setEditingRoom(null); // Đóng form chỉnh sửa
                fetchListRoom(); // Refresh danh sách phòng
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        <>
            <p className="mb-2">DANH SÁCH PHÒNG</p>
            <div className="flex flex-col gap-2">
                {/* ----- LIST TABLE TITLE ----- */}
                <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
                    <b>Tên phòng</b>
                    <b>Loại</b>
                    <b>Giá</b>
                    <b>Hành động</b>
                </div>
                {/* ----- LIST TABLE ITEMS ----- */}
                {listRoom.map((item, index) => (
                    <div
                        className="grid grid-cols-[1fr_1fr_1fr_1fr] md:grid-cols-[1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
                        key={index}
                    >
                        <p>{item.room_name}</p>
                        <p>{item.room_type}</p>
                        <p>{item.room_price}</p>
                        <button
                            className="text-blue-500 text-left"
                            onClick={() => handleEditClick(item)}
                        >
                            Chỉnh sửa
                        </button>
                    </div>
                ))}
            </div>

            {/* ----- EDIT FORM ----- */}
            {editingRoom && (
                <form
                    onSubmit={handleUpdateRoom}
                    className="flex flex-col gap-3 mt-4 p-4 border rounded bg-gray-50"
                >
                    <p>Chỉnh sửa thông tin phòng</p>
                    <div>
                        <label>Tên phòng</label>
                        <input
                            className="w-full px-3 py-2 border rounded"
                            type="text"
                            value={editForm.room_name}
                            onChange={(e) =>
                                setEditForm({ ...editForm, room_name: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div>
                        <label>Loại phòng</label>
                        <input
                            className="w-full px-3 py-2 border rounded"
                            type="text"
                            value={editForm.room_type}
                            onChange={(e) =>
                                setEditForm({ ...editForm, room_type: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div>
                        <label>Giá phòng</label>
                        <input
                            className="w-full px-3 py-2 border rounded"
                            type="number"
                            value={editForm.room_price}
                            onChange={(e) =>
                                setEditForm({ ...editForm, room_price: e.target.value })
                            }
                            required
                        />
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded">
                        Lưu thay đổi
                    </button>
                </form>
            )}
        </>
    );
};

export default ListRoom;
