import React from 'react'
import './FeedbackForm.css'
import Common_Navbar from '../../Components/Navbar/Common_Navbar'
import {Link, useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {useState, useEffect} from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper';

const FeedbackForm = () => {
    const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
    useEffect(() => {
        if (!loading) {
            console.log("Login state on this page:", isLoggedIn, userName);
        }
    }, [isLoggedIn, loading]);
    const {cartItems,cartItemsCount,addToCart,removeFromCart,clearCart, showCartItems, groupCartByVendor, clearVendorItemsInCart,cartSideScreenOpen,toggleCartSideScreen} = useCart();
    const [businessName, setBusinessName] = useState('');
    const [comments, setComments] = useState('');
    const [rating, setRating] = useState(1);
    const [message, setMessage] = useState('');

    const payload = {
        business_name: businessName,
        comments: comments,
        rating: rating
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/feedbackform',{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        setMessage(data.message);
        setBusinessName('');
        setComments('');
        setRating(1);
    }
    return (
        <div className="feedback-review">
            <Navbar_Wrapper />
            <div className="feedback-form-container">
                <form className="FeedbackForm" onSubmit={handleSubmit}>
                    <input className="BusinessName" type="text" 
                    placeholder='BusinessName' 
                    value={businessName} 
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    />
                    <textarea className="CustomerComments" placeholder="Your Comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                    />
                    <input className="Ratings" type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                    />
                    <button className="form-submit-button" type="submit" style={{borderRadius:'50px', color:'white'}}>Submit Feedback</button>
                    {message && <p className="message-info">{message}</p>}
                </form>
            </div>
        </div>
    )
}

export default FeedbackForm
