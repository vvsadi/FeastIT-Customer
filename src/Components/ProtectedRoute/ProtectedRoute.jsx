import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../../Context/AuthContext';
import { useState,useEffect } from 'react';

const ProtectedRoute = ({children}) => {
    const {isLoggedIn, userName, userId, login, logout,loading} = useAuth();
        useEffect(() => {
            if (!loading) {
                console.log("Login state on this page:", isLoggedIn, userName);
            }
        }, [isLoggedIn, loading]);
    return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
