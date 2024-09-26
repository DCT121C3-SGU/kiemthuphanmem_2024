import { assets } from "../assets/frontend_assets/assets"

function Footer() {
    return (
        <div>
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                <div>
                    <img src={assets.logo} alt="" className="mb-5 w-32" />
                    <p className="w-full md:w-2/3 text-gray-600">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis assumenda, aliquid natus rerum mollitia quas sunt, ullam obcaecati, similique corrupti incidunt. Autem porro ea possimus vel hic delectus laborum eum.
                    </p>
                </div>
                <div>
                    <p className="text-xl font-medium md-5">COMPANY</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div>
                    <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>0364781722</li>
                        <li>miyeuthien@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div>
                <hr />
                <p className="py-5 text-sm text-center">Copyright 2024@ MANG - All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer