import React,{useState, useEffect} from 'react';
import Common_Navbar from '../../Components/Navbar/Common_Navbar';
import {useAuth} from '../../Context/AuthContext';
//import {useAddress} from '../../Context/AddressContext';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper';
import home_page_cover_image from '../../assets/Header_Image_New.jpg'
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart, FaArrowCircleLeft, FaArrowCircleRight, FaHeart} from 'react-icons/fa';
import './Wishlist.css';
import {Link, useNavigate} from 'react-router-dom';
import lunch_box_bowls_icon from '../../assets/LunchBoxBowls.jpg';
import frozen_delights_icon from '../../assets/FrozenDelights.png';
import burger_delight_icon from '../../assets/BurgerDelight.jpg';
import fresh_pressed_juice_icon from '../../assets/FreshPressedJuices.jpg';
import indian_spice_kitchen_icon from '../../assets/IndianSpiceKitchen.jpg';
import taco_fiesta from '../../assets/TacoFiesta.jpg';
import the_sweet_crust_bakery from '../../assets/TheSweetCrustBakery.jpg';
import the_pickle_pantry from '../../assets/ThePicklePantry.jpg';
import healthy_slice_pizzeria from '../../assets/HealthySlicePizzeria.jpg';
import restaurant_card_logo from '../../assets/StandardFoodIcon.png';
import { useWishlist } from '../../Context/WishListContext';

const Wishlist = () => {
  const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
          useEffect(() => {
              if (!loading) {
                  console.log("Login state on this page:", isLoggedIn, userName);
              }
          }, [isLoggedIn, loading]);
      const navigate = useNavigate();  
      const [startIndex, setStartIndex] = useState(0);
      const [restaurants,setRestaurants] = useState([]);
      const totalFiltersVisible = 4;  // Total Filters visible at a time
      const {wishlistItems,addToWishlist,removeFromWishlist,clearWishlist, showWishlistItems} = useWishlist();
      useEffect(() => {
                  if(!loading){
                    alert(`User is logged in - isLoggedIn?: ${isLoggedIn}`)
                  }
                },[loading,isLoggedIn])
    const [wishlistVendors,setWishlistVendors] = useState(wishlistItems)
    
    return (
    <div className="wishlist-container">
      <Navbar_Wrapper />
        <div className="wishlist-vendors">
            {wishlistItems.length > 0 ? (
                wishlistItems.map((restaurant) => (
                                  <div key={restaurant.vendor_id} className="nearby-restaurant">
                                      <div className="nearby-restaurant-image" style={{backgroundImage: `url(${selectLogo(restaurant.business_name)})`, backgroundSize: '100% 100%', height: "80px", width: "100%", borderRadius: "20px"}} />
                                      <div className="nearby-restaurant-title"><div className="nearby-rest" onClick={() => checkMenuItems(restaurant.vendor_id)} style={{cursor:'pointer', fontWeight:'500'}}>{restaurant.business_name}</div></div>
                                      <div className="restaurant-details">
                                          <FaHeart key={restaurant.vendor_id} className="favourites-icon" onClick={() => toggleWishlist(restaurant)} size={20} color={isVendorInWishlist(restaurant.vendor_id) ? 'red':'gray'} style={{cursor: 'pointer', paddingLeft: '10px'}} />
                                      </div>
                                  </div>
                              ))
                ): (
                    <p style={{ textAlign: 'center', marginTop: '50px' }}>Your wishlist is empty.</p>
                )}
        </div>
      Wishlist
    </div>
  )
}

export default Wishlist
