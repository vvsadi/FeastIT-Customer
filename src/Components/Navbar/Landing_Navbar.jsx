import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart} from 'react-icons/fa';
import {useLocation} from 'react-router-dom';
import logo from '../../assets/DCP_Logo.png';
import {useState,useEffect} from 'react';
import './Landing_Navbar.css';
import {useAuth} from '../../Context/AuthContext';
//import {useAddress} from '../../Context/AddressContext'
const Landing_Navbar = () => {
    //const {address, setAddress} = useAddress();
    const [cartSideScreenOpen,setCartSideScreenOpen] = useState(false);
    const toggleCartSideScreen = () => {
        setCartSideScreenOpen(!cartSideScreenOpen);
    }
    const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
        useEffect(() => {
            if (!loading) {
                console.log("Login state on this page:", isLoggedIn, userName);
            }
        }, [isLoggedIn, loading]);
    const location = useLocation(); // Get current location
    const [menuSideScreenOpen, setMenuSideScreenOpen]  = useState(false);
    const toggleMenuSideScreen = () => {
        setMenuSideScreenOpen(!menuSideScreenOpen);
    };
    const [addressDropDown, setAddressDropDown] = useState(false);
    const toggleAddressDropDown = () => {
        setAddressDropDown(!addressDropDown);
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
                                        <button className="login-button-sidescreen" onClick={login}>
                                            <Link to="/login" className="login" style={{ color: "white" }}>Login</Link>
                                        </button><br></br>
                                        <button className="signup-button-sidescreen">
                                            <Link to="/signup" className="signup" style={{ color: "#E87500" }}>Sign Up</Link>
                                        </button>
                                    </span>
                                    ) : (
                                        <button className="logout-button" onClick={logout} style={{backgroundColor: '#124734', paddingLeft: '50px'}}>
                                            <Link to="/login" className="logout" style={{color: "white", backgroundColor:'#124734'}}>Logout</Link>
                                        </button>
                                    )}                                      
                                </span>
                                <a href="/signup" className="register-restaurant">Add your Restaurant</a> {/*Change "/register" to vendor signup API once you receive it from Group 2*/}
                                <a href="/overview/*" className="manage-profile">Manage Profile</a>
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
    
                {/*Different nav bar based on routes*/}
                <span className="login-and-signup">
                    {!isLoggedIn && (
                        <span className="login-signup-buttons">
                            <button className="login-button" onClick={login}>
                                <Link to="/login" className="login" style={{color: "white"}}>Login</Link>
                            </button>
                            <button className="signup-button">
                                <Link to="/signup" className="signup" style={{color: "#E87500"}}>Sign Up</Link>
                            </button>
                        </span>
                    )}
                </span>
            </nav>
        </div>
    );
};

export default Landing_Navbar
