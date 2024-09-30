import { assets } from "../assets/assets"

const Add = () => {
  return (
    <form className="flex flex-col w-full items-start gap-3">
        <div>
          <p className="mb-2">Tải hình ảnh</p>

          <div className="flex gap-2">
            <label htmlFor="image1">
              <img className="w-20" src={assets.upload_area} alt="" />
              <input type="file" id="image1" hidden/>
            </label>
            <label htmlFor="image2">
              <img className="w-20" src={assets.upload_area} alt="" />
              <input type="file" id="image2" hidden/>
            </label>
            <label htmlFor="image3">
              <img className="w-20" src={assets.upload_area} alt="" />
              <input type="file" id="image3" hidden/>
            </label>
            <label htmlFor="image4">
              <img className="w-20" src={assets.upload_area} alt="" />
              <input type="file" id="image4" hidden/>
            </label>
          </div>
        </div>

        <div>
          <p className="w-full ">Tên sản phẩm</p>
          <input className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Nhập tại đây..." required/>
        </div>
        <div>
          <p className="w-full ">Chi tiết sản phẩm</p>
          <textarea className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Nhập tại đây..." required/>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div>
            <p className="mb-2">Phân loại sản phẩm</p>
            <select className="w-full px-3 py-2">
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <p className="mb-2">Giá sản phẩm</p>
            <input className="w-full px-3 py-2 sm:w-[120px]" type="number" placeholder="Nhập tại đây" />
          </div>
        </div>

        <div>
          <p>Size sản phẩm</p>
          <div>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">S</p>
          </div>
          <div>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">M</p>
          </div>
          <div>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">L</p>
          </div>
        </div>
    </form>
  )
}

export default Add