import React, {useState,useEffect} from 'react';
import Navbar_Wrapper from '../Navbar/Navbar_Wrapper';
import {useAuth} from '../../Context/AuthContext';
import './MenuItems.css';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart, FaArrowCircleLeft, FaArrowCircleRight, FaHeart, FaPlusCircle, FaMinusCircle} from 'react-icons/fa'
import { useCart } from '../../Context/CartContext';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

const MenuItems = () => {

    const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
        useEffect(() => {
          if (!loading) {
            console.log("Login state on this page:", isLoggedIn, userName);
          }
        }, [isLoggedIn, loading]);
    const {restaurantID} = useParams();
    const [vendorName, setVendorName] = useState('');
    const [vendorAddress, setVendorAddress] = useState('');
    const {cartItems,cartItemsCount,addToCart,removeFromCart,clearCart, showCartItems, groupCartByVendor, clearVendorItemsInCart,cartSideScreenOpen,toggleCartSideScreen} = useCart();
    //const [menuItems,setMenuItems] = useState([]);
     //useEffect(() => {
            //alert(`User is logged in - isLoggedIn? : ${isLoggedIn}`)
        //},[])
    
        const [menuItems,setMenuItems] = useState([])

    useEffect(() => {
        fetch(`http://localhost:5000/api/menu/${restaurantID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch menu items');
            }
            return response.json();
        })
        .then(data => {
            setVendorName(data[0].business_name);
            setVendorAddress(data[0].vendor_address);
            setMenuItems(data);
        })
        .catch(error => console.error('Error: ',error));
    },[restaurantID]);


    const addItemToCart = (item) => {
        if (item.availability){
            addToCart(item);
            if(!cartSideScreenOpen){
                toggleCartSideScreen();
            }
        }
        else {
            toast.error("Item unavailable at the moment")
        }
    };

    const removeItemFromCart = (itemId) => {
        removeFromCart(itemId);
    };

    const [backgroundImagePath,setBackGroundImagePath] = useState('');
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
    <div className="menu-items-container" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.83), rgba(0,0,0,0.83)), url(${selectLogo(vendorName)}`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', backgroundPosition: 'top'
    }}>
        <Navbar_Wrapper /><br></br>
        <h1 className="vendor-name" style={{paddingTop:'70px', paddingLeft:'10px', textAlign:'center', color:'white',fontFamily:'cursive'}}>{vendorName}</h1>
        <h2 className="vendor-address" style={{paddingTop: '10px', paddingBottom: '20px', paddingLeft:'10px', textAlign:'center', fontFamily:'cursive', fontStyle:'italic', color:'white'}}>{vendorAddress}</h2>
        <div className="menu-items">
            {menuItems.map((item) => (
                <div key={item.item_id} className="menu-item-card">
                    <div className="item" style={{fontWeight:'550', display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '-25px', fontFamily: 'cursive'}}>{item.item_name}</div>
                    <div className="price-and-add-to-cart">
                        <div className="item-price" style={{marginLeft: '-25px', marginTop: '-20px', fontWeight: 'bold'}}>${item.price}</div>
                        <div className="add-item-to-cart-plus-icon" style={{marginTop: '-20px'}}>
                            <FaPlusCircle key={`plus-${item.item_id}`} className="plus-icon" onClick={() => item.availability && addItemToCart(item)} size={24} style={{cursor: item.availability ? 'pointer':'not-allowed',paddingRight:'10px', color: item.availability ? '#28a745':'grey', opacity: item.availability ? 1:0.5}}/>
                            <FaMinusCircle key={`minus-${item.item_id}`} className="plus-icon" onClick={() => item.availability && removeItemFromCart(item.item_id)} size={24} style={{cursor: item.availability ? 'pointer':'not-allowed',paddingRight:'10px',color: item.availability ? '#dc3545':'grey',opacity:item.availability ? 1:0.5}}/>
                        </div>
                    </div>
                    <div style={{fontStyle:'italic', fontSize:'small', marginLeft: '-20px', marginTop: '-30px'}}>From: {item.business_name}</div>
                    <div style={{fontStyle:'italic', fontSize:'small', paddingRight: '10px', marginTop: '-30px'}}>Category: {item.category}</div>
                    <div style={{fontStyle:'italic', fontSize:'small', marginLeft: '-20px', marginTop: '-30px'}}>{item.description}</div>
                </div>
            ))}
        </div>  
    </div>
  )
}

export default MenuItems
