import React from 'react';
import {createContext, useContext, useState, useEffect} from 'react';
import { useAuth } from './AuthContext';
import { CartProvider } from './CartContext';

const wishlistContext = createContext();

export const WishlistProvider = ({children}) => {
    const [wishlistItems,setWishlistItems] = useState([]);
    const [wishlistItemsCount,setWishlistItemsCount] = useState(null);
    const [isGuest, setIsGuest] = useState(true); //assume guest until login
    const {isLoggedIn, userName, userId, login, logout,loading} = useAuth();
    useEffect(() => {
        if (!loading) {
            console.log("Login state on this page:", isLoggedIn, userName);
        }
    }, [isLoggedIn, loading]);

    // Get Storage Key based on user or guest

    const getWishlistKey = () => {
        return isLoggedIn && userId ? `wishlistUser${userId}` : null;
    }

    // Load cart from localStorage on app load or when the auth state changes
    useEffect(() => {
        const key = getWishlistKey();
        const savedWishlist = localStorage.getItem(key);
        if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist));
        } else {
            setWishlistItems([]); // reset cart if none exists for this user/guest
        }
    },[isLoggedIn,userId]);

    // Save cart to localStorage when cart items change
    useEffect(() => {
        const key = getWishlistKey();
        localStorage.setItem(key, JSON.stringify(wishlistItems));
    },[wishlistItems,isLoggedIn,userId]);

    useEffect(() => {
        setWishlistItemsCount(wishlistItems.length);
    },[wishlistItems])

    // Add item to wishlist
    const addToWishlist = (vendor) => {
        setWishlistItems((prevItems) => {
            const exists = prevItems.find(v => v.vendor_id === vendor.vendor_id);
            if (exists) return prevItems;
            return [...prevItems,vendor];
        });
        // Send to backend API
        fetch('http://localhost:5000/api/wishlist',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(vendor),
        });
    };

    // Remove items from cart
    const removeFromWishlist = (vendorId) => {
        setWishlistItems((prevItems) => prevItems.filter(vendor => vendor.vendor_id !== vendorId));
        // Remove vendor from wishlist API
        fetch(`http://localhost:5000/api/wishlist/${vendorId}`,{
            method: 'DELETE',
            headers: {'Content-Type':'application/JSON'},
            credentials: 'include',
        }).catch(err => console.error('API delete error: ',err));
    };

    // Clear cart
    const clearWishlist = () => {
        const key = getWishlistKey();
        localStorage.removeItem(key);
        setWishlistItems([]);
        fetch('http://localhost:5000/api/wishlist/clear',{
            method:'DELETE',
            headers:{'Content-Type':'application/json'},
            credentials:'include',
        });
    }

    const showWishlistItems = () => {
        const key = getWishlistKey();
        const savedCart = localStorage.getItem(key);
        return savedCart ? JSON.parse(savedCart) : [];
    }

    useEffect(() => {
        const fetchAndMergeWishlist = async () => {
            if (!isLoggedIn || loading) return;
    
            const key = getWishlistKey();
            const savedWishlist = JSON.parse(localStorage.getItem(key) || '[]');
    
            try {
                const res = await fetch('http://localhost:5000/api/wishlist/user', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (res.ok) {
                    const backendWishlist = await res.json();
                    const mergedWishlist = [...backendWishlist];
    
                    for (const localVendor of savedWishlist) {
                        const exists = mergedWishlist.find(vendor => vendor.vendor_id === localVendor.vendor_id);
                        if (!exists) {
                            mergedWishlist.push(localVendor);
                        }
                    }
                    localStorage.setItem(key, JSON.stringify(mergedWishlist));
                    setWishlistItems(mergedWishlist);
                } else {
                    // if backend failed, just show local wishlist
                    setWishlistItems(savedWishlist);
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                setWishlistItems(savedWishlist);
            }
        };
    
        fetchAndMergeWishlist();
    }, [isLoggedIn, userId, loading]);

    return (
        <wishlistContext.Provider value={{wishlistItems,addToWishlist,removeFromWishlist,clearWishlist, showWishlistItems}}>
            {children}
        </wishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(wishlistContext);
