import React, {useState,useEffect} from 'react';
import Navbar_Wrapper from '../Navbar/Navbar_Wrapper';
import {useAuth} from '../../Context/AuthContext';
import './ItemSearch.css';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart, FaArrowCircleLeft, FaArrowCircleRight, FaHeart, FaPlusCircle, FaMinusCircle} from 'react-icons/fa'
import { useCart } from '../../Context/CartContext';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ItemSearch = () => {
    const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
        useEffect(() => {
          if (!loading) {
            console.log("Login state on this page:", isLoggedIn, userName);
          }
        }, [isLoggedIn, loading]);
    const {query} = useParams();
    const [searchResults,setSearchResults] = useState([]);
    const [vendorName, setVendorName] = useState('');
    const {cartItems,cartItemsCount,addToCart,removeFromCart,clearCart, showCartItems, groupCartByVendor, clearVendorItemsInCart,cartSideScreenOpen,toggleCartSideScreen} = useCart();
    //const [menuItems,setMenuItems] = useState([]);
     //useEffect(() => {
            //alert(`User is logged in - isLoggedIn? : ${isLoggedIn}`)
        //},[])

    useEffect(() => {
        fetch(`http://localhost:5000/api/menu/search?q=${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch menu items');
            }
            return response.json();
        })
        .then(data => {
            setSearchResults(data);
        })
        .catch(error => console.error('Error: ',error));
    },[query]);


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

  return (
    <div className="menu-items-container">
        <Navbar_Wrapper /><br></br>
        <h2 style={{textAlign: 'center', paddingTop: '70px'}}>Search Results for: "{query}"</h2>
        {/*<h2 className="vendor-name" style={{paddingTop:'70px', paddingLeft:'10px', textAlign:'center'}}>{vendorName}</h2>*/}
        <div className="menu-items">
            {searchResults.map((item) => (
                <div key={item.item_id} className="menu-item-card">
                    <div className="item" style={{fontWeight:'550', display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '-25px', fontFamily: 'cursive'}}>{item.item_name}</div>
                    <div style={{fontStyle:'italic', fontSize:'small', marginLeft: '-20px', marginTop: '-30px'}}>{item.description}</div>
                    <div className="price-and-add-to-cart">
                        <div className="item-price" style={{marginLeft: '-25px', marginTop: '-20px'}}>${item.price}</div>
                        <div className="add-item-to-cart-plus-icon" style={{marginTop: '-20px'}}>
                            <FaPlusCircle key={`plus-${item.item_id}`} className="plus-icon" onClick={() => item.availability && addItemToCart(item)} size={24} style={{cursor: item.availability ? 'pointer':'not-allowed',paddingRight:'10px', color: item.availability ? '#28a745':'grey', opacity: item.availability ? 1:0.5}}/>
                            <FaMinusCircle key={`minus-${item.item_id}`} className="plus-icon" onClick={() => item.availability && removeItemFromCart(item.item_id)} size={24} style={{cursor: item.availability ? 'pointer':'not-allowed',paddingRight:'10px',color: item.availability ? '#dc3545':'grey',opacity:item.availability ? 1:0.5}}/>
                        </div>
                    </div>
                    <div style={{fontStyle:'italic', fontSize:'small', marginLeft: '-20px', marginTop: '-30px'}}>From: {item.business_name}</div>
                    <div style={{fontStyle:'italic', fontSize:'small', paddingRight: '10px', marginTop: '-30px'}}>Category: {item.category}</div>
                    <div style={{fontStyle:'italic', fontSize:'small', marginLeft: '-20px', marginTop: '-30px'}}>Address: {item.vendor_address}</div>
                </div>
            ))}
        </div>
        Menu Items
    </div>
  )
}

export default ItemSearch
