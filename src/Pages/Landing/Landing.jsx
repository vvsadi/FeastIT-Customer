import React from 'react';
import {useState,useEffect} from 'react';
import Landing_Navbar from '../../Components/Navbar/Landing_Navbar';
import {useAuth} from '../../Context/AuthContext';
import {Link} from 'react-router-dom';
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart} from 'react-icons/fa';
import {useLocation, useNavigate} from 'react-router-dom';
import landing_page_image from '../../assets/Landing_Page_Background.jpg';
import './Landing.css';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper';
import restaurant_image from '../../assets/Restaurant.jpg'
//import {useAddress} from '../../Context/AddressContext';

const Landing = () => {
    const [addressInput, setAddressInput] = useState('');
    const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
            useEffect(() => {
                if (!loading) {
                    console.log("Login state on this page:", isLoggedIn, userName);
                }
            }, [isLoggedIn, loading]);
    //const {setAddress} = useAddress();
    const navigate = useNavigate();
    const directToHome = () => {
        console.log("Landing: Calling updateAddress with:", addressInput)
        setAddress(addressInput);
        console.log("Address updated to: ",addressInput)
        navigate('/');
    }
    const handleKeyDown = (event) => {
        if (event.key === "Enter"){
            event.preventDefault();
            setAddressAddress(addressInput);
            directToHome();
        }
    }
    const handleChange = (event) => {
        setAddressInput(event.target.value);
    }
    return (
        <div className="landing-page">
            <Navbar_Wrapper />
            <div className="landing-page-cover" style={{ 
                                                            backgroundImage: `url(${landing_page_image})`, 
                                                            width: "100vw",
                                                            backgroundSize: "cover",
                                                            backgroundPosition: "center",
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            height: "533px"
                                                            }}>
                <h1 className="tag-line">Hunger Struck? Drop your Grid!</h1>
                <div className="delivery-search-bar">
                    <span className="search-bar-container">
                        <span className="search-wrapper">
                            <FaMapMarkerAlt size={24} className="search-location" style={{color: "#E87500", paddingRight: "10px", paddingLeft: "5px"}} />
                            <input type="text" placeholder="Enter your Delivery Location" className="search-bar" value={addressInput} onChange={handleChange} onKeyDown={handleKeyDown}></input>
                        </span>
                        <span className="delivery-search-button">
                            <button className="search-button" onClick={directToHome}>Search</button>
                        </span>
                    </span>
                </div>
            </div>
            <div className="partner-with-us-container">
                <div className="partner-with-us">
                    <h2 className="partner-with-us-title">Partner With Us</h2>
                </div>
                <div className="register-your-restaurant-container">
                    <div className="register-your-restaurant-image" style={{
                                                                                backgroundImage: `url(${restaurant_image})`, 
                                                                                width: "613px",
                                                                                backgroundSize: "cover",
                                                                                backgroundPosition: "center",
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                                height: "222.96px",
                                                                                borderRadius: "20px"
                                                                            }}>
                    </div>
                    <div className="register-your-restaurant">
                        <a href="/" className="register-your-restaurant-title">
                            Register your Restaurant
                        </a>
                    </div>  
                </div>
            </div>
        </div>
    )
}

export default Landing;
