import React from 'react';
import {createContext, useContext, useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
//import { useAddress } from './AddressContext';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState(''); // Store the user name
    const [userId, setUserId] = useState(null);
    //const {address,setAddress} = useAddress();
    const [loading, setIsLoading] = useState(true);
    const [address, setAddress] = useState('');
        //useEffect(() => {
            //const savedAddress = localStorage.getItem("deliveryAddress");
            //if (savedAddress) {
                //setAddressState(savedAddress);
            //}
        //},[]);
    
        //const setAddress = (newAddress) => {
            //setAddressState(newAddress);
            //localStorage.setItem("deliveryAddress", newAddress);
        //};
    const navigate = useNavigate();
    // Check authentication status when the app loads
    useEffect(() => {
        const checkLoginStatus = async () => {
            try{
                const res = await fetch('http://localhost:5000/api/protected',{
                    method: 'GET',
                    credentials: 'include',
                });
                if (res.ok){
                    const data = await res.json();
                    if (data.logged_in_as){
                        const {user_id, user_name,user_address} = data.logged_in_as;
                        setIsLoggedIn(true);
                        setUserId(user_id);
                        setUserName(user_name);
                        setAddress(user_address);
                        Cookies.set('userId',user_id);
                        Cookies.set('userName',user_name);
                        //Load address from backend
                        localStorage.setItem('deliveryAddress',user_address);
                        //const savedAddress = localStorage.getItem('deliveryAddress')
                        //if(!savedAddress && user_address){
                            //localStorage.setItem('deliveryAddress',user_address);
                            //setAddress(user_address);
                        //} else if (savedAddress){
                            //setAddress(savedAddress);
                        //}
                    } //else {
                        //setIsLoggedIn(false);
                        //setUserId(null);
                        //setUserName('');
                        //Cookies.remove('userId');
                        //Cookies.remove('userName');
                    //}
                } else {
                    setIsLoggedIn(false);
                    setUserId(null);
                    setUserName('');
                    setAddress('');
                    toast.info('Session expired. Please login again.', {
                        position: "top-center",
                        autoClose: 2500,
                    });
                    navigate('/login');
                }
            } catch (err) {
                console.error("Error checking login status: ",err);
            } finally {
                setIsLoading(false);
            }
        };
        checkLoginStatus();
    },[]);

    const login = async (email,password) => {
        const res = await fetch('http://localhost:5000/api/login',{
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({username:email,password})
        });
        if(res.ok){
            const data = await res.json();
            setIsLoggedIn(true);
            setUserName(data.user_name);
            setUserId(data.user_id);
            setAddress(data.user_address || '');
            Cookies.set('userName',data.user_name);
            Cookies.set('userId',data.user_id);
            // Set address only if one doesnt already exist
            localStorage.setItem('deliveryAddress',data.user_address);
            const savedAddress = localStorage.getItem('deliveryAddress');
            //if (!savedAddress && data.user_address){
                //localStorage.setItem('deliveryAddress',data.user_address);
                //setAddress(data.user_address);
            //} else if (savedAddress){
                //setAddress(savedAddress);
            //}
            // Merge guestCart after user logs in and if it exists
            const cartKey = `cartUser${data.user_id}`
            let localCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
            const guestCart = localStorage.getItem('guestCart');
            const guestToken = localStorage.getItem('guestToken');
            if (guestCart && guestToken){
                const cartItems = JSON.parse(guestCart);
                for (const item of cartItems){
                    await fetch('http://localhost:5000/api/cart',{
                        method: 'POST',
                        headers: {'Content-Type':'application/json'},
                        credentials: 'include',
                        body: JSON.stringify(item),
                    });
                }
                // Clear guestCart and token
                localStorage.removeItem('guestCart');
                localStorage.removeItem('guestToken');
                localStorage.removeItem('guestTokenCreated');
            }
            const cartRes = await fetch('http://localhost:5000/api/cart/user', {
                method: 'GET',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'}
            });
            if (cartRes.ok){
                const backendCart = await cartRes.json();
                const mergedCart = [...backendCart];
                for (const localItem of localCart){
                    const index = mergedCart.findIndex(item => item.item_id === localItem.item_id);
                    if (index !== -1){
                        // Item exists in backend → add quantities
                        mergedCart[index].quantity += localItem.quantity;
                    }
                    else {
                        // New item → add to mergedCart
                        mergedCart.push(localItem);
                    }
                }
                localStorage.setItem(cartKey, JSON.stringify(mergedCart));
            }
            toast.success('🛒 Your cart items have been restored after login!', {
                position: "top-center",
                autoClose: 2000,
            });
              // 🛠 Force reload the page after login
            setTimeout(() => {
                window.location.reload();
            }, 1500); // wait 1 second for toast to show nicely
        } else {
            throw new Error("Login failed");
        }
    };
    const logout = async () => {
        await fetch('http://localhost:5000/api/logout',{
            method: 'POST',
            credentials: 'include'
        });
        setIsLoggedIn(false);
        setUserName('');
        setUserId(null);
        Cookies.remove('userName');
        Cookies.remove('userId');
        localStorage.removeItem('deliveryAddress');
        setAddress('');
        navigate('/login');
    };
    return (
        <AuthContext.Provider value={{isLoggedIn, userName, userId, address, setAddress, login, logout,loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);