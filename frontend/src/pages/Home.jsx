import Hero from "../components/Hero"
import LatestCollection from "../components/LatestCollection"
import Loader from "./Loader"
import { useState, useEffect  } from "react"

function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);
    return(
        <div>
            {loading ? <Loader /> : (
                <>
                    {/* <Hero /> */}
                    <LatestCollection />
                </>
            )}
        </div>
    )
}

export default Home