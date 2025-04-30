import React from 'react'
import './ContactUs.css'
import Common_Navbar from '../../Components/Navbar/Common_Navbar'
import {Link, useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {useState, useEffect} from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper';

const ContactUs = () => {
    const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
    useEffect(() => {
        if (!loading) {
            console.log("Login state on this page:", isLoggedIn, userName);
        }
    }, [isLoggedIn, loading]);
    const {cartItems,cartItemsCount,addToCart,removeFromCart,clearCart, showCartItems, groupCartByVendor, clearVendorItemsInCart,cartSideScreenOpen,toggleCartSideScreen} = useCart();
    const navigate = useNavigate();

    return (
        <div className="contact-us-container">
            <Navbar_Wrapper />
            <div className="title"><h1 className="contact-us-title" style={{textAlign: 'center', fontFamily:'cursive', width: '100%'}}>Contact Us</h1></div>
            <div className="contact-us-details" style={{margin: '50px', alignContent:'center'}}>
                <div className="contact-us-details">
                    <h4 className="contact-us-description" style={{fontFamily:'cursive', textAlign:'center'}}>Thank you for doing business with us. We value your experience with us. Please reach us at:</h4>
                    <h5 className="contact-us-phone" style={{fontFamily:'cursive', textAlign:'center'}}>Phone number: +1 (999) 8888-777</h5>
                    <h5 className="contact-us-email" style={{fontFamily:'cursive', textAlign:'center'}}>Email ID: contactus@feastit.com</h5>
                    <h5 className="contact-us-address" style={{fontFamily:'cursive', textAlign:'center'}}>Visit us at our headquarters: 5000 Food Delivery Drive, Richardson, Texas 75080</h5>
                    <Link to='/feedbackform' className="leave-review" style={{fontFamily: 'cursive', fontWeight:'bold', fontStyle:'italic', fontSize:'large', textAlign:'center', color: '#E87500', paddingLeft: '450px', width:'fit-content'}}>Give us your feedback here</Link>
                </div>
            </div>
        </div>
    )
}

export default ContactUs
