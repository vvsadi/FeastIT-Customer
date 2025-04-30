import React from 'react'
import {Routes, Route, useLocation} from 'react-router-dom'
import Common_Navbar from './Common_Navbar'
import Landing_Navbar from './Landing_Navbar'

const Navbar_Wrapper = () => {
    const location = useLocation();
    if (location.pathname.startsWith("/landing")){
        return <Landing_Navbar />;
    }
    if (location.pathname === "/" || location.pathname.startsWith("/home") || location.pathname.startsWith("/Veg") || location.pathname.startsWith("/allrestaurants") || location.pathname.startsWith("/restaurant/") || location.pathname.startsWith("/search/") || location.pathname.startsWith("/myorders") || location.pathname.startsWith("/contactus")  || location.pathname.startsWith("/feedbackform")) {
        console.log("Current path:", location.pathname);
        console.log("Rendering:", location.pathname === "/" ? "Common_Navbar" : "Landing_Navbar");
        return <Common_Navbar />;
    }
    if (location.pathname.startsWith("/checkout") || location.pathname.startsWith("/login") || location.pathname.startsWith("/signup") || location.pathname.startsWith("/overview") || location.pathname.startsWith("/accountinfo") || location.pathname.startsWith("/accountsecurity")){
        return <Landing_Navbar />;
    }

    return <Landing_Navbar />;
};
export default Navbar_Wrapper;
