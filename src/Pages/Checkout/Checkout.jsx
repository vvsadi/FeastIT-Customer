import React from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {useAuth} from '../../Context/AuthContext';
import Common_Navbar from '../../Components/Navbar/Common_Navbar';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper';
//import {useAddress} from '../../Context/AddressContext';
import { useCart } from '../../Context/CartContext';
import './Checkout.css';
import { toast } from 'react-toastify';

const Checkout = () => {
  
  /*useEffect(() => {
    if (!isLoggedIn){
      navigate("/login");
    }
  }, [isLoggedIn]);*/
  const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
    useEffect(() => {
      if (!loading) {
        console.log("Login state on this page:", isLoggedIn, userName);
      }
    }, [isLoggedIn, loading]);
  //const {address,setAddress} = useAddress();
  const [addressInput, setAddressInput] = useState(address);
  const [accountName,setAccountName] = useState(userName);
  const {cartItems,cartItemsCount,addToCart,removeFromCart,clearCart, showCartItems,groupCartByVendor,clearVendorItemsInCart} = useCart();
  const [tax,setTax] = useState(0.0625);
  const [deliveryFee,setDeliveryFee] = useState(10.00);
  const [subtotal,setTotalWithoutTax] = useState(0);
  const [total,setTotalWithTax] = useState(0);
  const [totalWithTaxWithoutDeliveryFee, setTotalWithTaxWithoutDeliveryFee] = useState(0);
  const [vendor_id, setVendorID] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const vendorId = new URLSearchParams(location.search).get('vendor');
  const filteredCartItems = cartItems.filter(item => item.vendor_id.toString() === vendorId);
  const [businessName,setBusinessName] = useState('')
  const [orderStatus, setOrderStatus] = useState('pending')

  useEffect(() => {
    fetch(`http://localhost:5000/api/businessname/${vendorId}`)
    .then(response => {
      if (!response.ok){
        throw new Error('Failed to fetch business name');
      }
      return response.json();
    })
    .then(data => {
      if (data && data.business_name){
        setBusinessName(data.business_name);
      } else {
        setBusinessName('Unknown Business');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setBusinessName('Unknown Business');
    });
  },[vendorId]);
  
  const getTotalWithoutTaxes = () => {
    let total_without_taxes = 0;
    for (let i = 0; i<filteredCartItems.length; i++){
      const item = filteredCartItems[i];
      total_without_taxes += item['price']*item['quantity'];
    }
    setTotalWithoutTax(total_without_taxes);
  }

  useEffect(() => {
    getTotalWithoutTaxes();
  }, [filteredCartItems]);

  useEffect(() => {
    const total_with_tax_without_delivery_fee = subtotal + (tax * subtotal);
    setTotalWithTaxWithoutDeliveryFee(total_with_tax_without_delivery_fee);
    const total_with_tax = subtotal + deliveryFee + (tax * subtotal);
    setTotalWithTax(total_with_tax.toFixed(2));
  }, [subtotal]);

  /*useEffect(() => {
    if(!isLoggedIn){
      navigate('/login');
    }
  },[isLoggedIn]);*/

  /*useEffect(() => {
      // Check if the user is logged in
      if(isLoggedIn){
        if(!accountName){
          setAccountName(userName)
          alert(`Checkout as: ${accountName}`)
        }
      }
    }, [isLoggedIn,userName])*/
    const handleOrderSubmit = async () => {
      if (filteredCartItems.length === 0) {
        /*alert("⚠ Cannot place an order with an empty cart.");*/
        toast.error("Cannot place an order with an empty cart.",{
          position: 'top-center',
          autoClose: 2500,
        })
        return;
      }
      const payload = {
        vendor_id: vendorId,
        cart_items: filteredCartItems,
        total_amount: total,
        delivery_address: address
      }
      /*alert("Payload:\n" + JSON.stringify(payload, null, 2));*/
      try {
        const res = await fetch('http://localhost:5000/api/orders',{
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(payload),
          credentials: 'include'
        });
        if (res.ok) {
          /*alert(`Order successfully placed for vendor ${businessName}`);*/
          toast.success(`Order successfully placed for ${businessName}!!`,{
            position: 'top-center',
            autoClose: 2500,
          })
          const cartKey = `cartUser${userId}`;
          localStorage.removeItem(cartKey);
          clearVendorItemsInCart(vendorId);
          navigate('/home');
          // Can include orderConfirmation page
        } else {
          alert('Order failed!!');
        }
      } catch (err) {
        console.error(err);
        alert('Error placing order');
      }
    };
  return (
    <div className="checkout-page">
      <Navbar_Wrapper />
      <div className="checkout-container">
        <div className="checkout-content">
          <div className="checkout-left">
            <div className="section">
              <h3>Name</h3>
              <p className="name">{userName}</p>
            </div>
            <div className="section">
              <h3>Delivery Options</h3>
              <p className="Address">{address}</p>
            </div>

            <div className="section">
              <h3>Delivery Details</h3>
              <div className="delivery-options">
                <button className="delivery-btn selected">Priority (12-18 mins)</button>
                <button className="delivery-btn">Standard (10-25 mins)</button>
              </div>
            </div>

            <div className="section">
              <h3>Payment</h3>
              <button className="add-payment">+ Add Payment Method</button>
            </div>
            {/* ✅ Updated Button to Send Order Data to Backend */}
            <button className="continue-btn" onClick={handleOrderSubmit}>Continue to payment</button>
          </div>

          <div className="checkout-right">
            <div className="cart-summary">
              <h3>Cart Summary ({filteredCartItems.length} item{filteredCartItems.length !== 1 ? "s" : ""})</h3>
              {filteredCartItems.map((cartItem) => (
                                        <div key={cartItem.item_id} className="cart-item">
                                            <div className="cart-item-description-card">
                                                <div className="vendor-name">{cartItem.business_name}</div>
                                                <div className="itemName">{cartItem.item_name}</div>
                                                <div className="price-and-quantity">
                                                    <div className="itemPrice">$ {(cartItem.price * cartItem.quantity).toFixed(2)}</div>
                                                    <div className="itemQuantity">Quantity: {cartItem.quantity}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
            </div>
            <div className="promotion">
              <h3>Promotion</h3>
              <p>Add a Promo Code <span className="add-icon">+</span></p>
            </div>

            <div className="order-total">
              <h3>Order Total</h3>
              <div className="summary-item">
                <span className="side-heading">Subtotal:     </span>
                <span>$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="side-heading">Delivery Fee:     </span>
                <span>$ {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="side-heading">Tax:     </span>
                <span>$ {tax.toFixed(2)}</span>
              </div>
              <div className="summary-item total">
                <span className="side-heading-total">Total:     </span>
                <span>$ {total}</span>
              </div>
            </div>
            <div className="order-status"></div>
          </div>
        </div>
      </div>
      Checkout
    </div>
  )
}

export default Checkout
