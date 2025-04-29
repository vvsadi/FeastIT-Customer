import React,{useState, useEffect} from 'react';
import Common_Navbar from '../../Components/Navbar/Common_Navbar';
import {useAuth} from '../../Context/AuthContext';
//import {useAddress} from '../../Context/AddressContext';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper';
import home_page_cover_image from '../../assets/Header_Image_New.jpg'
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart, FaArrowCircleLeft, FaArrowCircleRight, FaHeart} from 'react-icons/fa';
import './SeeAllRestaurants.css';
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
import arabianbites from '../../assets/ArabianBites.png';
import seoulkitchen from '../../assets/SeoulKitchen.png';
import thaistreetbites from '../../assets/ThaiStreetBites.png';
import classicitalianpasta from '../../assets/ClassicItalianPasta.png';
import thepicklepantry from '../../assets/ThePicklePantry.png';
import sweetcrustbakery from '../../assets/SweetCrustBakery.png';
import { useWishlist } from '../../Context/WishListContext';


const SeeAllRestaurants = () => {
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

          useEffect(() => {
            if(!loading){
              alert(`User is logged in - isLoggedIn?: ${isLoggedIn}`)
            }
          },[loading,isLoggedIn])

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

          const isVendorInWishlist = (vendorId) => {
            for (let i = 0; i<wishlistItems.length; i++){
              if (wishlistItems[i].vendor_id === vendorId){
                return true;
              }
            }
            return false;
          }

          const toggleWishlist = (vendor) => {
            if (loading) return; // ✅ Prevent premature login check
            if (!isLoggedIn){
              navigate('/login');
              return;
            }
            if (isVendorInWishlist(vendor.vendor_id)) {
              removeFromWishlist(vendor.vendor_id);
            } else {
              addToWishlist(vendor);
            }
          };
        
          /*const handleNextFilters = () => {
            if (startIndex + totalFiltersVisible < filters.length) {
              setStartIndex(startIndex+1);
            }
          };
        
          const handlePrevFilters = () => {
            if (startIndex > 0) {
              setStartIndex(startIndex-1)
            }
          };
        
          const visibleFilters = filters.slice(startIndex,startIndex + totalFiltersVisible);*/
          const checkMenuItems = (restaurantID) =>{
            navigate(`/restaurant/${restaurantID}`)
          }
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

  return (
    <div className="see-all-restaurants-container">
        <Navbar_Wrapper />
      <div className="restaurants">
                  {restaurants.map((restaurant) => (
                      <div key={restaurant.vendor_id} className="nearby-restaurant">
                          <div className="nearby-restaurant-image" style={{backgroundImage: `url(${selectLogo(restaurant.business_name)})`, backgroundSize: '100% 100%', height: "80px", width: "100%", borderRadius: "20px"}} />
                          <div className="nearby-restaurant-title"><div className="nearby-rest" onClick={() => checkMenuItems(restaurant.vendor_id)} style={{cursor:'pointer', fontWeight:'500'}}>{restaurant.business_name}</div></div>
                          <div className="restaurant-details">
                              <FaHeart key={restaurant.vendor_id} className="favourites-icon" onClick={() => toggleWishlist(restaurant)} size={20} color={isVendorInWishlist(restaurant.vendor_id) ? 'red':'gray'} style={{cursor: 'pointer', paddingLeft: '10px'}} />
                          </div>
                      </div>
                  ))}
              </div>
    </div>
  )
}

export default SeeAllRestaurants
