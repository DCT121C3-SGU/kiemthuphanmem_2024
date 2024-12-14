import axios from "axios"
import { useState, useEffect } from "react"
import { backendUrl, currency } from "../App"
import { toast } from "react-toastify"

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [editingProduct, setEditingProduct] = useState(null) // State để lưu thông tin sản phẩm đang chỉnh sửa
  const [productData, setProductData] = useState({ name: "", category: "", price: "" }) // Dữ liệu form chỉnh sửa

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const editProduct = (product) => {
    setEditingProduct(product)
    setProductData({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      quantity: product.quantity
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!productData.name || !productData.category || !productData.price || !productData.quantity || !productData.description) {
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm!");
      return;
    }
    try {
      const response = await axios.post(backendUrl + '/api/product/edit', {
        productId: editingProduct._id,
        ...productData,
      }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
        setEditingProduct(null) // Đóng form chỉnh sửa sau khi lưu
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
    console.log(productData);
  }, [])

  return (
    <>
      <p className="mb-2">DANH SÁCH SẢN PHẨM</p>
      <div className="flex flex-col gap-2">
        {/* ----- LIST TABLE TITLE ----- */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Hình ảnh</b>
          <b>Tên sản phẩm</b>
          <b>Phân loại</b>
          <b>Giá</b>
          <p>Số lượng</p>
          <b className="text-center">Hành động</b>
        </div>
        {/* ----- LIST TABLE ITEMS ----- */}
        {list.map((item, index) => (
          <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm" key={index}>
            <img className="w-12" src={item.images[0].url} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price} {currency}</p>
            <p>{item.quantity}</p>
            <div className="flex justify-around items-center">
              <p onClick={() => editProduct(item)} className="text-right md:text-center cursor-pointer text-lg text-blue-600">Chỉnh sửa</p>
              <p onClick={() => removeProduct(item._id)} className="text-right md:text-center cursor-pointer text-lg text-red-600">X</p>
            </div>
          </div>
        ))}
      </div>

      {/* ----- EDIT FORM ----- */}
      {editingProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-xl mb-4">Sửa sản phẩm</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">Tên sản phẩm</label>
                <input
                  type="text"
                  id="name"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">Chi tiết sản phẩm</label>
                <textarea
                  id="name"
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <p className="mb-2">Phân loại sản phẩm</p>
                <select onChange={(e)=>setProductData({ ...productData, category: e.target.value })} value={productData.category} className="w-full px-3 py-2">
                  <option value="Coffee">Coffee</option>
                  <option value="Bánh ngọt">Bánh ngọt</option>
                  <option value="Trà">Trà</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block mb-2">Giá</label>
                <input
                  type="number"
                  id="price"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block mb-2">Số lượng</label>
                <input
                  type="number"
                  id="quantity"
                  value={productData.quantity}
                  onChange={(e) => setProductData({ ...productData, quantity: e.target.value })}
                  className="border p-2 w-full"
                />
              </div>
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Lưu</button>
                <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default List
