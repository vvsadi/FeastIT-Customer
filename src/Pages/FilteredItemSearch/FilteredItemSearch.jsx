import React, {useState,useEffect} from 'react';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper'
import {useAuth} from '../../Context/AuthContext';
import './FilteredItemSearch.css';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart, FaArrowCircleLeft, FaArrowCircleRight, FaHeart, FaPlusCircle, FaMinusCircle} from 'react-icons/fa'
import { useCart } from '../../Context/CartContext';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import veg_icon from '../../assets/Veg.png';
import non_veg_icon from '../../assets/Non Veg.png';
import healthy_icon from '../../assets/Healthy.png';
import sugar_free_icon from '../../assets/Sugar Free.png';
import gluten_free_icon from '../../assets/Gluten Free.png';

const FilteredItemSearch = () => {
    const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
        useEffect(() => {
            if (!loading) {
                console.log("Login state on this page:", isLoggedIn, userName);
            }
        }, [isLoggedIn, loading]);
    const {categoryName} = useParams();
    const {cartItems,cartItemsCount,addToCart,removeFromCart,clearCart, showCartItems, groupCartByVendor, clearVendorItemsInCart,cartSideScreenOpen,toggleCartSideScreen} = useCart();
    const [menuItems,setMenuItems] = useState([])
    useEffect(() => {
        fetch(`http://localhost:5000/api/menu/${categoryName}`)
        .then(response => {
            if(!response.ok) {
                throw new Error("Failed to fetch filtered items");
            }
            return response.json();
        })
        .then(data => {
            setMenuItems(data);
        })
        .catch(error => console.error("Error: ",error));
    },[categoryName])

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
    const selectLogo = (category_name) => {
                if (category_name.toLowerCase() === "Veg".toLowerCase()){
                  return veg_icon
                }
                if (category_name.toLowerCase() === "Non Veg".toLowerCase()){
                  return non_veg_icon
                }
                if (category_name.toLowerCase() === "Gluten Free".toLowerCase()){
                  return gluten_free_icon
                }
                if (category_name.toLowerCase() === "Sugar Free".toLowerCase()){
                  return sugar_free_icon
                }
                if (category_name.toLowerCase() === "Healthy".toLowerCase()){
                  return healthy_icon
                }
                return restaurant_card_logo
              }
  return (
    <div className="filtered-item-search" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.83), rgba(0,0,0,0.83)), url(${selectLogo(categoryName)}`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', backgroundPosition: 'center'
    }}>
        <Navbar_Wrapper />
        <h1 style={{textAlign: 'center', paddingTop: '70px', color: 'white', fontFamily:'cursive'}}>{categoryName}</h1>
                {/*<h2 className="vendor-name" style={{paddingTop:'70px', paddingLeft:'10px', textAlign:'center'}}>{vendorName}</h2>*/}
                <div className="menu-items">
                    {menuItems.length === 0 ? (<h2 style={{color: 'white'}}>No items found</h2>) : (menuItems.map((item) => (
                        <div key={item.item_id} className="menu-item-card">
                            <div className="item" style={{fontWeight:'550', display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '-25px', fontFamily: 'cursive'}}>{item.item_name}</div>
                            <div className="price-and-add-to-cart">
                                <div className="item-price" style={{marginLeft: '-25px', marginTop: '-20px', fontWeight:'bold'}}>${item.price}</div>
                                <div className="add-item-to-cart-plus-icon" style={{marginTop: '-20px'}}>
                                    <FaPlusCircle key={`plus-${item.item_id}`} className="plus-icon" onClick={() => item.availability && addItemToCart(item)} size={24} style={{cursor: item.availability ? 'pointer':'not-allowed',paddingRight:'10px', color: item.availability ? '#28a745':'grey', opacity: item.availability ? 1:0.5}}/>
                                    <FaMinusCircle key={`minus-${item.item_id}`} className="plus-icon" onClick={() => item.availability && removeItemFromCart(item.item_id)} size={24} style={{cursor: item.availability ? 'pointer':'not-allowed',paddingRight:'10px',color: item.availability ? '#dc3545':'grey',opacity:item.availability ? 1:0.5}}/>
                                </div>
                            </div>
                            <div style={{fontStyle:'italic', fontSize:'small', marginLeft: '-20px', marginTop: '-30px'}}>From: {item.business_name}</div>
                            <div style={{fontStyle:'italic', fontSize:'small', paddingRight: '10px', marginTop: '-30px'}}>Category: {item.category}</div>
                            <div style={{fontStyle:'italic', fontSize:'small', marginLeft: '-20px', marginTop: '-30px'}}>{item.description}</div>
                        </div>
                    )))}
                </div>
    </div>
  )
}

export default FilteredItemSearch
