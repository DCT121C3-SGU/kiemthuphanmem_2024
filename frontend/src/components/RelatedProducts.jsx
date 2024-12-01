import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import Title from "../components/Title"
import ProductItem from "./ProductItem"

const RelatedProducts = ({category}) => {

  const { products } = useContext(ShopContext)
  const [related, setRelated] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice()
      productsCopy = productsCopy.filter((item) => category === item.category)
      setRelated(productsCopy.slice(1,6));
    }
  },[products])

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={'CÓ THỂ BẠN'} text2={'QUAN TÂM'} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item,index) => (
          <ProductItem key={index} id={item._id} image={item.images} name={item.name} price={item.price} />
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts