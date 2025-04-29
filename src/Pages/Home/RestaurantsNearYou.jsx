import React,{useState, useEffect} from 'react';
import Common_Navbar from '../../Components/Navbar/Common_Navbar';
import {useAuth} from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';
//import {useAddress} from '../../Context/AddressContext';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper';
import home_page_cover_image from '../../assets/Header_Image_New.jpg'
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart, FaArrowCircleLeft, FaArrowCircleRight, FaHeart} from 'react-icons/fa';
import './RestaurantsNearYou.css';
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

const RestaurantsNearYou = () => {
  const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
  const {cartItems,cartItemsCount,addToCart,removeFromCart,clearCart, showCartItems, groupCartByVendor, clearVendorItemsInCart} = useCart();
          useEffect(() => {
              if (!loading) {
                  console.log("Login state on this page:", isLoggedIn, userName);
              }
          }, [isLoggedIn, loading]);    
  const navigate = useNavigate();  
      {/*const [filters, setFilters] = useState([
        {id: 1, name: 'Lunch Box Bowls', icon: lunch_box_bowls_icon},
        {id: 2, name: 'Frozen Delights', icon: frozen_delights_icon},
        {id: 3, name: 'Burger Delight', icon: burger_delight_icon},
        {id: 4, name: 'Fresh Pressed Juice', icon: fresh_pressed_juice_icon},
        {id: 5, name: 'Indian Spice Kitchen', icon: indian_spice_kitchen_icon}
      ]);  // Store filters from an API call. Replace the JSON code with the API call*/}
      const [restaurants,setRestaurants] = useState([]);  
      const [startIndex, setStartIndex] = useState(0);
      const totalFiltersVisible = 4;  // Total Filters visible at a time
      const [favorites, setFavorites] = useState({});

      const addToFavorites = (id) => {
        setFavorites(prevFavorites => ({
            ...prevFavorites, [id]: !prevFavorites[id]
        }));
      };
    
      const handleNextFilters = () => {
        if (startIndex + totalFiltersVisible < filters.length) {
          setStartIndex(startIndex+1);
        }
      };
    
      const handlePrevFilters = () => {
        if (startIndex > 0) {
          setStartIndex(startIndex-1)
        }
      };
    
      const visibleFilters = filters.slice(startIndex,startIndex + totalFiltersVisible);
  return (
    <div className="restaurants-near-you-container">
        <div className="restaurants-near-you-title-container">
            <div className="restaurants-near-you-title">Restaurants near you</div>
            <div className="see-all-container">
                <a href="/allrestaurants" className="see-all-restaurants">See all</a>
                <FaArrowCircleLeft size={24} className="left-arrow-icon" style={{color: "#000000", cursor: "pointer"}} onClick={handlePrevFilters}/>
                <FaArrowCircleRight size={24} className="right-arrow-icon" style={{color: "#000000", cursor: "pointer"}} onClick={handleNextFilters}/>
            </div>
        </div>
        <div className="restaurants-nearby">
            {visibleFilters.map((filter) => (
                <div key={filter.id} className="nearby-restaurant">
                    <div className="nearby-restaurant-image" style={{backgroundImage: `url(${restaurant_card_logo})`, backgroundSize: '100% 100%', height: "80px", width: "100%", borderRadius: "20px"}} />
                    <div className="nearby-restaurant-title"><Link to={`/restaurant/${filter.id}`} className="nearby-rest">{filter.name}</Link></div>
                    <div className="restaurant-details">
                        <FaHeart key={filter.name} className="favourites-icon" onClick={() => addToFavorites(filter.id)} size={20} color={favorites[filter.id] ? 'red':'gray'} style={{cursor: 'pointer', paddingLeft: '10px'}} />
                    </div>
                </div>
            ))}
        </div>
    </div>
  )}

export default RestaurantsNearYou
