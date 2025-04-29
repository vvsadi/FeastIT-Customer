import React,{useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Common_Navbar from '../../Components/Navbar/Common_Navbar';
import {useAuth} from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext.jsx';
//import {useAddress} from '../../Context/AddressContext';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper';
import home_page_cover_image from '../../assets/Header_Image_New.jpg'
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart, FaArrowCircleLeft, FaArrowCircleRight} from 'react-icons/fa';
import './Home.css';
import veg_icon from '../../assets/Veg.png';
import non_veg_icon from '../../assets/Non Veg.png';
import healthy_icon from '../../assets/Healthy.png';
import sugar_free_icon from '../../assets/Sugar Free.png';
import gluten_free_icon from '../../assets/Gluten Free.png';
import FoodFilters from './FoodFilters.jsx';
import RegularFilters from './RegularFilters.jsx';
import RestaurantsNearYou from './RestaurantsNearYou.jsx';
import AllRestaurants from './AllRestaurants.jsx';
import { useWishlist } from '../../Context/WishListContext.jsx';

// Fetch Filters from an API
const Home = () => {
  const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
      useEffect(() => {
          if (!loading) {
              console.log("Login state on this page:", isLoggedIn, userName);
          }
      }, [isLoggedIn, loading]);
  const navigate = useNavigate();
  const {cartItems,cartItemsCount,addToCart,removeFromCart,clearCart, showCartItems, groupCartByVendor, clearVendorItemsInCart} = useCart();
  const [searchTerm,setSearchTerm] = useState('')
  //const {address,setAddress} = useAddress();
  const {wishlistItems,addToWishlist,removeFromWishlist,clearWishlist, showWishlistItems} = useWishlist();
  const handleSearchClick = () => {
    if (searchTerm.trim()){
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`)
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`)
    }
  };

  return (
    <div className="home-page">
        <Navbar_Wrapper />
        <div className="item-search-bar">
            <span className="item-search-bar-container">
              <span className="item-search-wrapper">
                <input type="text" placeholder="Whatcha lookin' for?" className="item-search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown}></input>
                <FaSearch size={24} className="search-location" style={{color: "#000000", paddingRight: "10px", paddingLeft: "5px"}} onClick={handleSearchClick} />
              </span>
            </span>
        </div>
        <div className="home-page-cover">
          <div className="home-page-image" style={{
                                                      backgroundImage: `url(${home_page_cover_image})`, 
                                                      width: "75.3vw",
                                                      backgroundSize: "cover",
                                                      backgroundPosition: "center",
                                                      display: 'flex',
                                                      flexDirection: 'column',
                                                      height: "300px",
                                                      paddingLeft: "300px",
                                                      paddingTop: "131px",
                                                      zIndex: -1
                                                  }}>
          </div>
        </div>
        <FoodFilters />
        {/*<RegularFilters />*/}
        {/*<RestaurantsNearYou />*/}
        <AllRestaurants /> 
        Home
    </div>
  );
};
export default Home
