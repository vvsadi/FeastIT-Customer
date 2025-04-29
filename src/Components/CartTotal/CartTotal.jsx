import React from 'react'
import { useAuth } from '../../Context/AuthContext'
import { useCart } from '../../Context/CartContext'
import { useWishlist } from '../../Context/WishListContext'
import {Link, useNavigate} from 'react-router-dom';
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart} from 'react-icons/fa';
import {useLocation} from 'react-router-dom';

const CartTotal = () => {
  const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
  useEffect(() => {
    if (!loading) {
      console.log("Login state on this page:", isLoggedIn, userName);
    }
  }, [isLoggedIn, loading]);
  return (
    <div>
      
    </div>
  )
}

export default CartTotal
