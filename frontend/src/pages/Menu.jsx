import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import { assets } from "../assets/frontend_assets/assets"
import Title from "../components/Title"
import ProductItem from "../components/ProductItem"

const Menu = () => {

    const { products, search, showSearch } = useContext(ShopContext)
    const [showFilter, setShowFilter] = useState(false)
    const [filterProducts, setFilterProducts] = useState([])
    const [category, setCategory] = useState([])
    const [sortType, setSortType] = useState('relavent')

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev=>prev.filter(item => item !== e.target.value))
        }
        else{
            setCategory(prev => [...prev, e.target.value])
        }
    }

    const applyFilter = () => {
        let productsCopy = products.slice()
        if (showSearch && search) {
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        }
        if (category.length > 0) {
            productsCopy = productsCopy.filter(item => category.includes(item.category))
        }
        setFilterProducts(productsCopy)
    }

    const sortProduct = () => {
        let fpCopy = filterProducts.slice()
        switch (sortType) {
            case 'low-high':
                setFilterProducts(fpCopy.sort((a,b) => (a.price - b.price)))
                break;
            case 'high-low':
                setFilterProducts(fpCopy.sort((a,b) => (b.price - a.price)))
                break;
            default:
                applyFilter()
                break;
        }
    }

    useEffect(() => {
        applyFilter()
    },[category,search,showSearch,products])

    useEffect(() => {
        sortProduct()
    },[sortType])

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter options */}
      <div className="min-w-60">
        <p onClick={() => setShowFilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2">LỌC
            <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        {/* Category filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' :'hidden'} sm:block`}>
            <p className="mb-3 text-sm font-medium">ĐỒ UỐNG - NEED CHANGE!!!</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                <p className="flex gap-2">
                    <input className="w-3" type="checkbox" value={'Men'} onChange={toggleCategory} /> Men
                </p>
                <p className="flex gap-2">
                    <input className="w-3" type="checkbox" value={'Women'} onChange={toggleCategory} /> Women
                </p>
                <p className="flex gap-2">
                    <input className="w-3" type="checkbox" value={'Kids'} onChange={toggleCategory} /> Kids
                </p>
            </div>
        </div>
      </div>
        {/* Right Side */}
        <div className="flex-1">
            <div className="flex justify-between text-base sm:text-2xl mb-4">
                <Title text1={'TẤT CẢ'} text2={'SẢN PHẨM'} />
                {/* product sort */}
                <select onChange={(e) => setSortType(e.target.value)} className="border-2 border-gray-300 text-sm px-2">
                    <option value="relavent">Liên quan nhất</option>
                    <option value="low-high">Giá từ thấp đến cao</option>
                    <option value="high-low">Giá từ cao đến thấp</option>
                </select>
            </div>
            {/* MAP PRODUCT */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-col-4 gap-y-6">
                {
                    filterProducts.map((item, index) => (
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                }
            </div>
        </div>

    </div>
  )
}

export default Menu
