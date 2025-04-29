import React from 'react'
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper'
import { useAuth } from '../../Context/AuthContext'
import { useCart } from '../../Context/CartContext'
import { useState, useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import './MyOrders.css';

const MyOrders = () => {
    const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
    const {cartItems,cartItemsCount,addToCart,removeFromCart,clearCart, showCartItems, groupCartByVendor, clearVendorItemsInCart,cartSideScreenOpen,toggleCartSideScreen} = useCart();
    const [myOrders,setMyOrders] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (!loading) {
            console.log("Login state on this page:", isLoggedIn, userName);
        }
    }, [isLoggedIn, loading]);
    useEffect(() => {
        fetch('http://localhost:5000/api/showorders',{
            credentials:'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch my orders');
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched orders: ",data);
            setMyOrders(data);
        })
        .catch(err => {
            console.error(err);
        });
    },[]);

    const deleteOrder = async (order_id) => {
        if (window.confirm(`Are you sure you want to delete this order with order ID ${order_id}?`)){
            try {
                const res = await fetch(`http://localhost:5000/api/deleteorder/${order_id}`,{
                    credentials: 'include',
                    method: 'DELETE'
                });
                const data = await res.json();
                if (res.ok){
                    alert(data.message);
                    setMyOrders(prev => prev.filter(order => order.order_id !== order_id));
                }
                else {
                    alert('Failed to delete the order' + data.error);
                }
            } catch (error) {
                alert("An error occurred: " + error.message);
            }
        }
    };
    
    return (
        <div className="my-orders-page">
            <Navbar_Wrapper />
            <h2 style={{display: 'flex', textAlign: 'center', paddingTop: '20px', color: 'black', justifyContent: 'center'}}>My Orders</h2>
            <div className="my-orders-container">
                    {myOrders.length === 0 ? (<h2 style={{color: 'black'}}> No Orders Found </h2>) : (
                        myOrders.map((order) => (
                        <div key={order.order_id} className="order-card">
                            <h3 className="vendorName" style={{fontFamily: 'cursive', fontWeight:'bold', textAlign:'center'}}>{order.business_name}</h3>
                            <p className="order-id" style={{fontWeight:'bold'}}>Order Number: {order.order_id}</p>
                            <p className="orderTotal" style={{fontWeight:'bold'}}>$ {order.total_amount}</p>
                            <p className="deliveryAddress" style={{fontFamily:'cursive', fontStyle:'italic'}}>Address: {order.delivery_address}</p>
                            <p className="orderStatus">Status: {order.order_status}</p>
                            <div className="ordered-items">    
                                <p className="ordered-items-title" style={{textAlign: 'center', fontWeight:'bold'}}>Ordered Items</p>
                                {order.ordered_items.map((ordered_item) => (
                                    <div key={ordered_item.item_id} className="ordered-item">
                                        <span className="ordered-item-name" style={{fontSize: "small"}}>{ordered_item.item_name}</span>
                                        <span className="ordered-item-quantity" style={{fontSize: "small"}}>Quantity: {ordered_item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="cancel-order-button" onClick={() => deleteOrder(order.order_id)}>Cancel Order</button>
                        </div>
                    )))}
            </div>
        </div>
    )
}

export default MyOrders
