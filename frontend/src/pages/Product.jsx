import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendURL } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState("");
  

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.images[0]);
        return null;
      }
    });


  };

  const checkQuantity = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/api/product/check-quantity/${productId}`
      );
      if (response.data.success) {
        setQuantity(response.data.quantity);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
    }
  };
  

  useEffect(() => {
    fetchProductData();
    checkQuantity();
  }, [productId, products]);

  return productData ? (
    <div className="border-t--2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* -------------------- Product Image -------------------- */}
        <div className="flex-1 flex flex-col-reverse gap--3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.images.map((item, index) => {
              return (
                <img
                  onClick={() => setImage(item)}
                  src={item.url}
                  key={index}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                  alt=""
                />
              );
            })}
          </div>
          <div className="w-full sm:w-[80%] xl:ml-[20px] lg:ml-[20px]">
            <img className="w-full h-auto" src={image.url} alt="" />
          </div>
        </div>

        {/* -------------------- PRODUCT INFO -------------------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <p className="mt-5 text-3xl font-bold">
            {productData.price} {currency}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5 mb-10">
            <i>{productData.description}</i>
          </p>

          {/* Hiển thị nút hoặc thông báo "Hết hàng" */}
          {quantity ? (
            <button
              onClick={() => addToCart(productData._id)}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          ) : (
            <p className="text-red-500 font-medium">Hết hàng</p>
          )}

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% nguyên liệu nguyên chất</p>
            <p>Đảm bảo chất lượng, trải nghiệm cho khách hàng</p>
            <p>Chill and Relax</p>
          </div>
        </div>
      </div>

      {/* -------------------- DISPLAY RELATED PRODUCTS -------------------- */}

      <RelatedProducts category={productData.category} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
