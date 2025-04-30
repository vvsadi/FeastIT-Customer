import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart} from 'react-icons/fa';
import {useLocation} from 'react-router-dom';
import logo from '../../assets/DCP_Logo.png';
import {useState, useEffect} from 'react';
import './Common_Navbar.css';
import {useAuth} from '../../Context/AuthContext';
//import {useAddress} from '../../Context/AddressContext';
import { useCart } from '../../Context/CartContext';

const Common_Navbar = () => {
    const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
    useEffect(() => {
        if (!loading) {
            console.log("Login state on this page:", isLoggedIn, userName);
        }
    }, [isLoggedIn, loading]);
    //const {address, setAddress} = useAddress();
    const [addressInput, setAddressInput] = useState(address);
    const {cartItems,cartItemsCount,addToCart,removeFromCart,clearCart, showCartItems, groupCartByVendor, clearVendorItemsInCart,cartSideScreenOpen,toggleCartSideScreen} = useCart();
    const navigate = useNavigate();
    const handleChange = (event) => {
        console.log("Calling setAddressInput in handleChange in Common_Navbar")
        console.log("address value = ",address)
        setAddressInput(event.target.value);
    }
    const handleKeyDown = (event) => {
        if (event.key === "Enter"){
            event.preventDefault();
            console.log("Calling updateAddress in handleKeyDown in Common_Navbar")
            setAddress(addressInput);
            console.log("Address = ",address)
        }
    }
    //const [cartSideScreenOpen,setCartSideScreenOpen] = useState(false);
    //const toggleCartSideScreen = () => {
        //setCartSideScreenOpen(!cartSideScreenOpen);
    //}
    const location = useLocation(); // Get current location
    const [menuSideScreenOpen, setMenuSideScreenOpen]  = useState(false);
    const toggleMenuSideScreen = () => {
        setMenuSideScreenOpen(!menuSideScreenOpen);
    };
    const [addressDropDown, setAddressDropDown] = useState(false);
    const toggleAddressDropDown = () => {
        setAddressDropDown(!addressDropDown);
    }
    const handleManageProfileClick = () => {
        if (isLoggedIn === true) {
            navigate('/overview');
        } else {
            navigate('/login');
        }
    }

    const handleCheckoutLoginState = (vendorID) => {
        if (isLoggedIn){
            navigate(`/checkout?vendor=${vendorID}`)
        }
        else{
            navigate('/login')
        }
    }

    return (
        <div className="navigation-container">
            <nav className="navbar">
                {/*Common Nav bar components across all pages*/}
                <span className="logo-brand">
                    <span className="menu-icon">
                        <FaBars size={24} className="menu" onClick={toggleMenuSideScreen} /> {/*Using the imported menu icon*/}
                        {menuSideScreenOpen && (
                            <div className={`menuSideScreenContent ${menuSideScreenOpen ? 'show' : ''}`}>
                                <FaTimes className="close-menu-sideScreen-icon" onClick={toggleMenuSideScreen} />
                                <span className="login-signup-or-logout-sidescreen">
                                    {!isLoggedIn ? (
                                        <span className="login-signup-buttons-sidescreen">
                                        <button className="login-button-sidescreen">
                                            <a href="/login" className="login" style={{ color: "white" }}>Login</a>
                                            {/*<Link to="/login" className="login" style={{ color: "white" }}>Login</Link>*/}
                                        </button><br></br>
                                        <button className="signup-button-sidescreen">
                                            <a href="/signup" className="signup" style={{ color: "#E87500" }}>Signup</a>
                                            {/*<Link to="/signup" className="signup" style={{ color: "#E87500" }}>Sign Up</Link>*/}
                                        </button>
                                    </span>
                                    ) : (
                                        <button className="logout-button" onClick={logout} style={{backgroundColor: '#124734', paddingLeft: '50px'}}>
                                            <a href="/login" className="logout" style={{color: "white", backgroundColor: '#124734'}}>Logout</a>
                                        </button>
                                    )}                                      
                                </span>
                                <Link to="/signup" className="register-restaurant">Add your Restaurant</Link> {/*Change "/register" to vendor signup API once you receive it from Group 2*/}
                                <a onClick={handleManageProfileClick} className="manage-profile">Manage Profile</a>
                                <a href='/wishlist' className="wishlist">My Wishlist</a>
                                <Link to='/myorders' className="my-orders" onClick={toggleMenuSideScreen}>My Orders</Link>
                                <Link to='/contactus' className="contact-us" onClick={toggleMenuSideScreen}>Contact Us</Link>
                            </div>
                        )}
                    </span>
                    <span className="logo">
                        <Link to="/home" className="logo-home">
                            <img src={logo} className="logo-image"></img>
                            <span className="logo-text">Feast-IT</span>
                        </Link>
                    </span>
                </span>
                <div className="search-bar-container">
                    <div className="search-wrapper">
                        <FaMapMarkerAlt size={24} className="search-location" style={{ color: "#E87500", paddingRight: "10px", paddingLeft: "5px" }} />
                        <input type="text" placeholder="Enter your delivery address" className="search-bar" value={addressInput} onChange={handleChange} onKeyDown={handleKeyDown}></input>
                        <FaAngleDown size={24} className="dropdown-icon" style={{ color: "#E87500", paddingRight: "10px", paddingLeft: "5px", cursor: 'pointer', marginLeft: 'auto' }} onClick={toggleAddressDropDown} />
                        {addressDropDown && (
                            <div className={`addressDropDownContent ${addressDropDown ? 'show' : ''}`}>
                                <Link to='/addresses' className="manage-addresses" style={{ color: "#E87500", backgroundColor: "white" }}>Manage Addresses</Link>
                            </div>
                        )}
                    </div>
                </div>
                <div className="login-signup-cart">
                    <div className="login-and-signup">
                        {!isLoggedIn && (
                            <div className="login-signup-buttons">
                                <button className="login-button" onClick={login}>
                                    <Link to="/login" className="login" style={{ color: "white" }}>Login</Link>
                                </button>
                                <button className="signup-button">
                                    <Link to="/signup" className="signup" style={{ color: "#E87500" }}>Sign Up</Link>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="cart">
                        <div className="cart-icon-wrapper">
                            <FaShoppingCart size={24} color="white" className="shopping-cart-icon" onClick={toggleCartSideScreen} />
                            <span className="cart-badge">{cartItemsCount}</span>
                        </div>
                        {cartSideScreenOpen && (
                            <div className={`cartSideScreenContent ${cartSideScreenOpen ? 'show' : ''}`}>
                                <div className="close-cart-wrapper">
                                    <FaTimes className="close-cart-sideScreen-icon" size={24} onClick={toggleCartSideScreen} />
                                </div>
                                <h2 className="cart-title" style={{fontFamily:'cursive', textAlign: 'center'}}>My Cart</h2>
                                <div className="my-cart-items">
                                    {/*{cartItems.map((cartItem) => (
                                        <div key={cartItem.item_id} className="cart-item">
                                            <div className="cart-item-description-card">
                                                <div className="vendor-name" style={{fontSize:"medium", fontWeight:"bold", textAlign:'center',fontFamily:'cursive', fontStyle:'italic'}}>{cartItem.business_name}</div>
                                                <div className="itemName" style={{fontSize:"small"}}>{cartItem.item_name}</div>
                                                <div className="price-and-quantity">
                                                    <div className="itemPrice" style={{fontSize: "small",fontWeight:"bold"}}>$ {(cartItem.price * cartItem.quantity).toFixed(2)}</div>
                                                    <div className="itemQuantity"style={{fontSize:"small"}}>Quantity: {cartItem.quantity}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}*/}
                                    {Object.entries(groupCartByVendor()).map(([vendorId,group]) => (
                                        <div key={vendorId} className="vendor-specific-items">
                                            <h6 className="from" style={{color:"#E87500", fontSize:"medium", fontWeight:"bold", textAlign:'center',fontFamily:'cursive', fontStyle:'italic'}}>From {group.business_name}:</h6>
                                            {group.items.map((item) => (
                                                <div key={item.item_id} className="cart-item">
                                                    <div className="cart-item-description-card">
                                                        {/*<div className="vendor-name" style={{fontSize:"medium", fontWeight:"bold", textAlign:'center',fontFamily:'cursive', fontStyle:'italic'}}>{item.business_name}</div>*/}
                                                        <div className="itemName" style={{fontSize:"smaller", textAlign: 'center', fontFamily: 'cursive'}}>{item.item_name}</div>
                                                        <div className="price-and-quantity">
                                                            <div className="itemPrice" style={{fontSize: "smaller",fontWeight:"bold"}}>$ {(item.price * item.quantity).toFixed(2)}</div>
                                                            <div className="itemQuantity"style={{fontSize:"smaller"}}>Quantity: {item.quantity}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button className="proceed-to-checkout" onClick={() => handleCheckoutLoginState(vendorId)}>Proceed to Checkout</button>
                                        </div>
                                    ))}
                                </div>
                                <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
                                {/*<button className="proceed-to-checkout" onClick={handleCheckoutLoginState}>Proceed to Checkout</button>*/}
                            </div>
                        )}
                        {/*<span className="cart-badge">{getTotalItems()}</span>*/}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Common_Navbar;
