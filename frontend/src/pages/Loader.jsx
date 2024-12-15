// components/Loader.jsx
import { assets } from "../assets/frontend_assets/assets";
function Loader() {
    return (
        <div className="flex items-center justify-center h-screen ">
            <img src={assets.loader_icon} alt="" />
        </div>
    );
}

export default Loader;
