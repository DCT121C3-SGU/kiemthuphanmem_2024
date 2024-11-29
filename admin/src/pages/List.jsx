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
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(backendUrl + '/api/product/edit', {
        id: editingProduct._id,
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
  }, [])

  return (
    <>
      <p className="mb-2">DANH SÁCH SẢN PHẨM</p>
      <div className="flex flex-col gap-2">
        {/* ----- LIST TABLE TITLE ----- */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>
        {/* ----- LIST TABLE ITEMS ----- */}
        {list.map((item, index) => (
          <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm" key={index}>
            <img className="w-12" src={item.images[0].url} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price} {currency}</p>
            <div className="flex justify-around items-center">
              <p onClick={() => editProduct(item)} className="text-right md:text-center cursor-pointer text-lg text-blue-600">Edit</p>
              <p onClick={() => removeProduct(item._id)} className="text-right md:text-center cursor-pointer text-lg text-red-600">X</p>
            </div>
          </div>
        ))}
      </div>

      {/* ----- EDIT FORM ----- */}
      {editingProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-xl mb-4">Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block mb-2">Category</label>
                <input
                  type="text"
                  id="category"
                  value={productData.category}
                  onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block mb-2">Price</label>
                <input
                  type="number"
                  id="price"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  className="border p-2 w-full"
                />
              </div>
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
                <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default List
