import { useParams } from "react-router-dom"


const Product = () => {

    const { productId } = useParams()
    console.log(productId);

    return (
        <div>
            
        </div>
    )
}

export default Product