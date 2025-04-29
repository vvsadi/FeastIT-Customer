import React from 'react';
import {createContext, useContext, useState, useEffect} from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cartItems,setCartItems] = useState([]);
    const [cartItemsCount,setCartItemsCount] = useState(null);
    const [isGuest, setIsGuest] = useState(true); //assume guest until login
    const {isLoggedIn, userName, userId, login, logout,loading} = useAuth();
        useEffect(() => {
          if (!loading) {
            console.log("Login state on this page:", isLoggedIn, userName);
          }
        }, [isLoggedIn, loading]);

    // Get Storage Key based on user or guest

    const getCartKey = () => {
        return isLoggedIn && userId ? `cartUser${userId}` : 'guestCart';
    }

    // Guest token
    const getGuestToken = () => {
        let token = localStorage.getItem("guestToken");
        let timestamp = localStorage.getItem("guestTokenCreated");
        const fiveMins = 1*5*60*1000;
        if (!token || !timestamp || Date.now() - Number(timestamp) > fiveMins) { 
            token = crypto.randomUUID();
            localStorage.setItem("guestToken",token);
            localStorage.setItem("guestTokenCreated",Date.now());
            localStorage.removeItem("guestCart")
        }
        return token;
    }

    // Load cart from localStorage on app load or when the auth state changes
    useEffect(() => {
        const key = getCartKey();
        const savedCart = localStorage.getItem(key);
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        } else {
            setCartItems([]); // reset cart if none exists for this user/guest
        }
    },[isLoggedIn,userId]);

    // Save cart to localStorage when cart items change
    useEffect(() => {
        const key = getCartKey();
        localStorage.setItem(key, JSON.stringify(cartItems));
    },[cartItems,isLoggedIn,userId]);

    useEffect(() => {
        setCartItemsCount(cartItems.length);
    },[cartItems])

    // Add item to cart
    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const index = prevItems.findIndex(i => i.item_id === item.item_id);
            let updatedCart;
            if (index !== -1){
                // Item exists, update quantity
                updatedCart = [...prevItems];
                updatedCart[index].quantity += 1;
             } else {
                // New item, set quantity = 1
                updatedCart = [...prevItems,{...item, quantity:1}];
             }
            const payload = isLoggedIn ? {...item, quantity:1} : {...item, quantity: 1, guest_token: getGuestToken()};
            // Send to backend API
            fetch('http://localhost:5000/api/cart',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            return updatedCart;
        });
    };

    // Remove items from cart
    const removeFromCart = (itemId) => {
        setCartItems((prevItems) => {
            const index = prevItems.findIndex(item => item.item_id === itemId);
            if (index === -1){
                return prevItems
            }
            const updatedCart = [...prevItems];
            if (updatedCart[index].quantity > 1){
                updatedCart[index].quantity -= 1;
            }
            else {
                updatedCart.splice(index,1); // Remove item completely
                toast.info("Item removed from cart");
            }
            const query = !isLoggedIn ? `?guest_token=${getGuestToken()}`:'';
            // Remove Item from cart API
            fetch(`http://localhost:5000/api/cart/${itemId}${query}`,{
                method: 'DELETE',
                headers: {'Content-Type':'application/JSON'},
                credentials: 'include',
            }).catch(err => console.error('API delete error: ',err));
            return updatedCart;
        });
    };

    // Clear cart
    const clearCart = () => {
        const key = getCartKey();
        localStorage.removeItem(key);
        setCartItems([]);
        const query = !isLoggedIn ? `?guest_token=${getGuestToken()}`:'';
        fetch(`http://localhost:5000/api/cart/clear${query}`,{
            method:'DELETE',
            headers:{'Content-Type':'application/json'},
            credentials:'include',
        });
    };

    const showCartItems = () => {
        const key = getCartKey();
        const savedCart = localStorage.getItem(key);
        return savedCart ? JSON.parse(savedCart) : [];
    }

    const groupCartByVendor = () => {
        const grouped = {};
        cartItems.forEach(item => {
          if (!grouped[item.vendor_id]) {
            grouped[item.vendor_id] = {
              business_name: item.business_name,  
              items: []
            };
          }
          grouped[item.vendor_id].items.push(item);
        });
        return grouped;
      };
    
      const clearVendorItemsInCart = (vendorIdToClear) => {
        setCartItems(prevItems => {
            const updatedCart = prevItems.filter(item => item.vendor_id.toString() !== vendorIdToClear.toString());
            setCartItemsCount(updatedCart.length);
            const key = getCartKey();
            localStorage.setItem(key,JSON.stringify(updatedCart));
            return updatedCart;
        });
      }

      const [cartSideScreenOpen, setCartSideScreenOpen] = useState(false);
      const toggleCartSideScreen = () => {
        setCartSideScreenOpen(prev => !prev);
      }

    return (
        <CartContext.Provider value={{cartItems,cartItemsCount,addToCart,removeFromCart,clearCart, showCartItems, groupCartByVendor, clearVendorItemsInCart,cartSideScreenOpen,toggleCartSideScreen}}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
