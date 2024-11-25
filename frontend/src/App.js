import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Product from "./pages/Product";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import Card from "./pages/Card";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import Room from "./pages/Room";
import Event from "./pages/Event";
import EventDetail from "./pages/EventDetail";
import Profile from "./pages/Profile";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Router>
        <NavBar />
        <SearchBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/event/:eventId" element={<EventDetail />} />
          <Route path="/card" element={<Card />} />
          <Route path="/event" element={<Event />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
