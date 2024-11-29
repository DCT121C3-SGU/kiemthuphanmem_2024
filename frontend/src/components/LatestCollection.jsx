import { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);

    useEffect(() => {
        // Initially set latest products (first 10 or all if less than 10)
        setLatestProducts(products.slice(0, 10));
    }, [products]);

    // Pagination calculations
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = latestProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Calculate total pages
    const totalPages = Math.ceil(latestProducts.length / productsPerPage);

    // Page change handlers
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    // Handle products per page change
    const handleProductsPerPageChange = (e) => {
        const newProductsPerPage = parseInt(e.target.value);
        setProductsPerPage(newProductsPerPage);
        setCurrentPage(1); // Reset to first page
    };

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3x1'>
                <Title text1={'SẢN PHẨM'} text2={'MỚI NHẤT'}/>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Cập nhật mỗi ngày, hàng ngàn sản phẩm mới với giá tốt nhất
                </p>
            </div>

            {/* Products Per Page Dropdown */}
            <div className='flex justify-end mb-4 px-4'>
                <select 
                    value={productsPerPage}
                    onChange={handleProductsPerPageChange} 
                    className="border-2 border-gray-300 text-sm px-2 py-1"
                >
                    <option value={10}>10 sản phẩm</option>
                    <option value={15}>15 sản phẩm</option>
                    <option value={20}>20 sản phẩm</option>
                    <option value={25}>25 sản phẩm</option>
                </select>
            </div>

            {/* Render product */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {currentProducts.map((item, index) => (
                    <ProductItem 
                        key={item._id} 
                        id={item._id} 
                        image={item.image} 
                        name={item.name} 
                        price={item.price} 
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Trước
                </button>
                <span className="text-sm">
                    Trang {currentPage} / {totalPages}
                </span>
                <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Sau
                </button>
            </div>
        </div>
    )
}

export default LatestCollection