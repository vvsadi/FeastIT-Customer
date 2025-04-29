import React from 'react';
import {createContext, useContext, useState, useEffect} from 'react';
import { useAuth } from './AuthContext';

const AddressContext = createContext();

export const AddressProvider = ({children}) => {

    const [address, setAddressState] = useState('');
    useEffect(() => {
        const savedAddress = localStorage.getItem("deliveryAddress");
        if (savedAddress) {
            setAddressState(savedAddress);
        }
    },[]);

    const setAddress = (newAddress) => {
        setAddressState(newAddress);
        localStorage.setItem("deliveryAddress", newAddress);
    };
    //const updateAddress = (newAddress) => {
        //console.log("Updating address: ",newAddress);
        //setAddress(newAddress);
    //}

    return (
        <AddressContext.Provider value={{address,setAddress}}>
            {children}
        </AddressContext.Provider>
    );
};

export const useAddress = () => useContext(AddressContext);
