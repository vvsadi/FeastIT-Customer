import React,{useState, useEffect} from 'react';
import Common_Navbar from '../../Components/Navbar/Common_Navbar';
import {useAuth} from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';
import { useWishlist } from '../../Context/WishListContext';
//import {useAddress} from '../../Context/AddressContext';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper';
import home_page_cover_image from '../../assets/Header_Image_New.jpg'
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart, FaArrowCircleLeft, FaArrowCircleRight, FaHeart} from 'react-icons/fa';
import './AllRestaurants.css';
import {Link, useNavigate} from 'react-router-dom';
import lunch_box_bowls_icon from '../../assets/LunchBoxBowls.jpg';
import frozen_delights_icon from '../../assets/FrozenDelights.png';
import burger_delight_icon from '../../assets/BurgerDelight.jpg';
import fresh_pressed_juice_icon from '../../assets/FreshPressedJuices.jpg';
import restaurant_card_logo from '../../assets/StandardFoodIcon.png';
import arabianbites from '../../assets/ArabianBites.png';
import seoulkitchen from '../../assets/SeoulKitchen.png';
import thaistreetbites from '../../assets/ThaiStreetBites.png';
import classicitalianpasta from '../../assets/ClassicItalianPasta.png';
import thepicklepantry from '../../assets/ThePicklePantry.png';
import sweetcrustbakery from '../../assets/SweetCrustBakery.png';

const AllRestaurants = () => {
      const navigate = useNavigate();  
      const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
      const {cartItems,cartItemsCount,addToCart,removeFromCart,clearCart, showCartItems, groupCartByVendor, clearVendorItemsInCart} = useCart();
      const {wishlistItems,addToWishlist,removeFromWishlist,clearWishlist, showWishlistItems} = useWishlist();
      useEffect(() => {
        console.log("Is the user logged in? ", isLoggedIn);
      },[isLoggedIn]);
      {/*const [filters, setFilters] = useState([
        {id: 1, name: 'Lunch Box Bowls', icon: lunch_box_bowls_icon},
        {id: 2, name: 'Frozen Delights', icon: frozen_delights_icon},
        {id: 3, name: 'Burger Delight', icon: burger_delight_icon},
        {id: 4, name: 'Fresh Pressed Juice', icon: fresh_pressed_juice_icon},
        {id: 5, name: 'Indian Spice Kitchen', icon: indian_spice_kitchen_icon},
        {id: 6, name: 'Taco Fiesta', icon: taco_fiesta},
        {id: 7, name: 'The Sweet Crust Bakery', icon: the_sweet_crust_bakery},
        {id: 8, name: 'The Pickle Pantry', icon: the_pickle_pantry},
        {id: 9, name: 'Healthy Slice Pizzeria', icon: healthy_slice_pizzeria}
      ]);  // Store filters from an API call. Replace the JSON code with the API call*/}
      const [restaurants,setRestaurants] = useState([]);
      const [startIndex, setStartIndex] = useState(0);
      const totalFiltersVisible = 4;  // Total Filters visible at a time
      const [favorites, setFavorites] = useState({});

      useEffect(() => {
        fetch(`http://localhost:5000/api/restaurants`)
        .then(response => {
          if (!response.ok){
            throw new Error('Failed to fetch menu items');
          }
          return response.json();
        })
        .then(data => setRestaurants(data))
        .catch(error => console.error('Error: ',error));
      },[]);

      const addToFavorites = (id) => {
        setFavorites(prevFavorites => ({
            ...prevFavorites, [id]: !prevFavorites[id]
        }));
      };
    
      const handleNextFilters = () => {
        if (startIndex + totalFiltersVisible < restaurants.length) {
          setStartIndex(startIndex+1);
        }
      };
    
      const handlePrevFilters = () => {
        if (startIndex > 0) {
          setStartIndex(startIndex-1)
        }
      };
    
      const visibleFilters = restaurants.slice(startIndex,startIndex + totalFiltersVisible);

      const selectLogo = (restaurantName) => {
        if (restaurantName.toLowerCase() === "Burger Delight".toLowerCase()){
          return burger_delight_icon
        }
        if (restaurantName.toLowerCase() === "Lunch Box Bowls".toLowerCase()){
          return lunch_box_bowls_icon
        }
        if (restaurantName.toLowerCase() === "Frozen Delights".toLowerCase()){
          return frozen_delights_icon
        }
        if (restaurantName.toLowerCase() === "Fresh Pressed Juices".toLowerCase()){
          return fresh_pressed_juice_icon
        }
        if (restaurantName.toLowerCase() === "Arabian Bites".toLowerCase()){
          return arabianbites
        }
        if (restaurantName.toLowerCase() === "Thai Street Bites".toLowerCase()){
          return thaistreetbites
        }
        if (restaurantName.toLowerCase() === "The Sweet Crust Bakery".toLowerCase()){
          return sweetcrustbakery
        }
        if (restaurantName.toLowerCase() === "Seoul Kitchen".toLowerCase()){
          return seoulkitchen
        }
        if (restaurantName.toLowerCase() === "Classic Italian Pasta".toLowerCase()){
          return classicitalianpasta
        }
        if (restaurantName.toLowerCase() === "The Pickle Pantry".toLowerCase()){
          return thepicklepantry
        }
        return restaurant_card_logo
      }
      const isVendorInWishlist = (vendorId) => {
        return wishlistItems.some(item => item.vendor_id === vendorId);
      };
      const toggleWishlist = (vendor) => {
        if (loading) return;
        if (!isLoggedIn) {
          navigate('/login');
          return;
        }
        if (isVendorInWishlist(vendor.vendor_id)) {
          removeFromWishlist(vendor.vendor_id);
        } else {
          addToWishlist(vendor);
        }
      };
      
  return (
    <div className="restaurants-near-you-container">
        <div className="restaurants-near-you-title-container">
            <div className="restaurants-near-you-title">All Restaurants</div>
            <div className="see-all-container">
                <Link to="/allrestaurants" className="see-all-restaurants">See all</Link>
                <FaArrowCircleLeft size={24} className="left-arrow-icon" style={{color: "#000000", cursor: "pointer"}} onClick={handlePrevFilters}/>
                <FaArrowCircleRight size={24} className="right-arrow-icon" style={{color: "#000000", cursor: "pointer"}} onClick={handleNextFilters}/>
            </div>
        </div>
        <div className="restaurants-nearby">
            {visibleFilters.map((restaurant) => (
                <div key={restaurant.vendor_id} className="nearby-restaurant">
                    {/*<div className="nearby-restaurant-image" style={{backgroundImage: `url(${restaurant_card_logo})`, backgroundSize: '100% 100%', height: "80px", width: "100%", borderRadius: "20px"}} />*/}
                    <div className="nearby-restaurant-image" style={{backgroundImage: `url(${selectLogo(restaurant.business_name)})`, backgroundSize: '100% 100%', height: "80px", width: "100%", borderRadius: "20px"}} />
                    <div className="nearby-restaurant-title"><Link to={`/restaurant/${restaurant.vendor_id}`} className="nearby-rest">{restaurant.business_name}</Link></div>
                    <div className="restaurant-details">
                        <FaHeart key={restaurant.business_name} className="favourites-icon" onClick={() => toggleWishlist(restaurant)} size={20} color={isVendorInWishlist(restaurant.vendor_id) ? 'red':'gray'} style={{cursor: 'pointer', paddingLeft: '10px'}} />
                    </div>
                </div>
            ))}
        </div>
    </div>
  )}

export default AllRestaurants
