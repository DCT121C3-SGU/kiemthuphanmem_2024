import { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(products.slice(products.length - 10, products.length).reverse());
    }, [products]);

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3x1'>
                <Title text1={'SẢN PHẨM'} text2={'MỚI NHẤT'}/>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Cập nhật mỗi ngày, hàng ngàn sản phẩm mới với giá tốt nhất
                </p>
            </div>

            {/* Render product */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {latestProducts.map((item, index) => (
                    <ProductItem 
                        key={item._id} 
                        id={item._id} 
                        image={item.images} 
                        name={item.name} 
                        price={item.price} 
                    />
                ))}
            </div>
        </div>
    )
}

export default LatestCollection