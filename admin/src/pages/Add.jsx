import { assets } from "../assets/assets";
import { useState,useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({token}) => {

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

  const [name,setName] = useState('')
  const [description,setDescription] = useState('')
  const [category,setCategory] = useState('Coffee')
  const [price,setPrice] = useState('')
  const [size,setSize] = useState([])
  const [bestseller,setBestseller] = useState(false)
  const [isSubmit,setIsSubmit] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isSubmit) return
    setIsSubmit(true)
    try {
      const formData = new FormData()
      image1 && formData.append('image1',image1)
      image2 && formData.append('image2',image2)
      image3 && formData.append('image3',image3)
      image4 && formData.append('image4',image4)
      formData.append('name',name)
      formData.append('description',description)
      formData.append('category',category)
      formData.append('price',price)
      formData.append('sizes',JSON.stringify(size))
      formData.append('bestseller',bestseller)
      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})
      if (response.data.success){
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setCategory('Coffee')
        setPrice('')
        setBestseller(false)
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setIsSubmit(false)
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Tải hình ảnh</p>

        <div className="flex gap-2">
          <label htmlFor="image1">
            <img className="w-20" src={!image1 ? assets.upload_area : URL.createObjectURL(image1) } alt="" />
            <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className="w-20" src={!image2 ? assets.upload_area : URL.createObjectURL(image2) } alt="" />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className="w-20" src={!image3 ? assets.upload_area : URL.createObjectURL(image3) } alt="" />
            <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className="w-20" src={!image4 ? assets.upload_area : URL.createObjectURL(image4) } alt="" />
            <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="w-full ">Tên sản phẩm</p>
        <input
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Nhập tại đây..."
          onChange={(e)=>setName(e.target.value)}
          value={name}
          required
        />
      </div>
      <div className="w-full">
        <p className="w-full ">Chi tiết sản phẩm</p>
        <textarea
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Nhập tại đây..."
          required
          onChange={(e)=>setDescription(e.target.value)}
          value={description}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Phân loại sản phẩm</p>
          <select onChange={(e)=>setCategory(e.target.value)} className="w-full px-3 py-2">
            <option value="Coffee">Coffee</option>
            <option value="Bánh ngọt">Bánh ngọt</option>
            <option value="Trà">Trà</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Giá sản phẩm</p>
          <input
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="Nhập tại đây"
            onChange={(e)=>setPrice(e.target.value)}
            value={price}
          />
        </div>
      </div>

      <div>
        <p>Size sản phẩm</p>
        <div className="flex gap-3">
          <div onClick={()=>setSize(prev => prev.includes('S') ? prev.filter(item => item !== 'S') : [...prev, 'S'])}>
            <p className={`${size.includes('S') ? 'bg-pink-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>S</p>
          </div>
          <div onClick={()=>setSize(prev => prev.includes('M') ? prev.filter(item => item !== 'M') : [...prev, 'M'])}>
            <p className={`${size.includes('M') ? 'bg-pink-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>M</p>
          </div>
          <div onClick={()=>setSize(prev => prev.includes('L') ? prev.filter(item => item !== 'L') : [...prev, 'L'])}>
            <p className={`${size.includes('L') ? 'bg-pink-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>L</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-2 ">
        <input onChange={()=>setBestseller(prev => !prev)} checked={bestseller} className="cursor-pointer" type="checkbox" id="bestseller" />
        <label htmlFor="bestseller">Chuyển thành sản phẩm bán chạy</label>
      </div>
      <button
        className={`w-40 py-3 mt-4 bg-black text-white ${
          isSubmit ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmit}
      >
        {isSubmit ? "Đang thêm..." : "Thêm sản phẩm"}
      </button>
    </form>
  );
};

export default Add;
